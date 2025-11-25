import { query, retrieveObjectMetadata } from '../../services/ApiService';

export interface VaultObject {
    name: string;
    label: string;
    prefix: string;
}

export interface ObjectFieldMetadata {
    label: string;
    type: string;
    name: string;
    formula: string;
    relationship_outbound_name: string;
    lookup_relationship_name: string;
    rollup: boolean;
    component: string;
    object: {
        name: string;
    };
}

/**
 * Parse and validate the record input. Handles three different record input scenarios:
 *      1) Custom format ("user__sys:123456")
 *      2) Vault record URL ("https://{vault_dns}/ui/#v/V5J/V5J000000006001")
 *      3) Exact record ID provided ("V5J000000006001")
 */
export const parseAndValidateInput = ({
    initialRecordId,
    initialObjectName,
    userInput,
    vaultObjectsMetadata,
}: {
    initialRecordId?: string;
    initialObjectName?: string;
    userInput: string;
    vaultObjectsMetadata: VaultObject[];
}) => {
    if (initialRecordId && initialObjectName) {
        return { recordId: initialRecordId, objectName: initialObjectName, inputError: null };
    }

    const recordInputString: string = initialRecordId || userInput.replace(/\s+/g, ''); // Remove any spaces from the user input

    /**
     * Scenario 1: Custom format (e.g. "user__sys:123456")
     */
    const customFormatMatch = recordInputString.match(/^[a-zA-Z0-9]+__[a-z]+:[A-Z0-9]+/);
    if (customFormatMatch) {
        const recordInputValues = recordInputString.split(':');
        if (recordInputValues.length > 1) {
            const determinedObjectName = recordInputValues[0] === 'users' ? 'user__sys' : recordInputValues[0];
            const determinedRecordId = recordInputValues[1];

            return {
                recordId: determinedRecordId,
                objectName: determinedObjectName === 'users' ? 'user__sys' : determinedObjectName,
                inputError: null,
            };
        }
    }

    /**
     * Scenario 2: Full Record URL (e.g. https://{vault_dns}/ui/#v/V5J/V5J000000006001)
     * Capture all 15-digit alphanumeric strings that follow a "/" then determine if they're valid object records
     */
    const potentialIdsInUrl = [...recordInputString.matchAll(/\/[A-Z0-9]{15}/g)];
    if (potentialIdsInUrl) {
        // There can be multiple potential record matches in a Vault URL (e.g. a tab ID and a record ID)
        // Loop through each match and only proceed if the ID starts with a valid object prefix in this Vault
        for (const match of potentialIdsInUrl) {
            const determinedRecordId = match[0]?.replace('/', '');
            const determinedObjectPrefix = determinedRecordId.slice(0, 3);
            const vaultObject = vaultObjectsMetadata.find((obj: VaultObject) => obj.prefix === determinedObjectPrefix);

            if (vaultObject?.name) {
                return {
                    recordId: determinedRecordId,
                    objectName: vaultObject.name,
                    inputError: null,
                };
            }
        }
    }

    /**
     * Scenario 3: Input is a valid record ID
     */
    if (recordInputString.length === 15) {
        const determinedObjectPrefix = recordInputString.slice(0, 3);
        const vaultObject = vaultObjectsMetadata.find((obj: VaultObject) => obj.prefix === determinedObjectPrefix);

        if (vaultObject?.name) {
            return {
                recordId: recordInputString,
                objectName: vaultObject.name,
                inputError: null,
            };
        }
    }

    return {
        recordId: null,
        objectName: null,
        inputError: `Could not determine a valid record or object from the input: ${recordInputString}`,
    };
};

/**
 * Fetches the field metadata for a provided Vault object.
 * @param objectName - API name of the object
 */
export const fetchObjectFields = async (objectName: string | null) => {
    if (!objectName) {
        return { fields: null, error: 'Object name is null' };
    }
    let errorDetails = 'Failed to retrieve object metadata';

    const retrieveObjectMetadataResponse = await retrieveObjectMetadata(objectName);

    if ('response' in retrieveObjectMetadataResponse) {
        const response = retrieveObjectMetadataResponse.response;
        if (response.responseStatus === 'SUCCESS') {
            return { fields: response?.object?.fields, error: '' };
        }
        if (response?.errors?.length > 0) {
            errorDetails = `${response.errors[0].type} : ${response.errors[0].message}`;
        }
    }

    return { fields: null, error: errorDetails };
};

/**
 * Builds three different arrays of object field names:
 *      1) Array of all primary field names on the object (with RichText/LongText wrapper)
 *      2) Array of the name__v fields for any outgoing object relationships
 *      3) Array of the fields that reference the `users` object
 * @param objectFields - array of object fields and their metadata
 */
export const buildFieldNames = (objectFields: ObjectFieldMetadata[]) => {
    // Build an array of all primary field names on the object
    const objectFieldNames: string[] = objectFields?.map((field: ObjectFieldMetadata) => {
        if (field.type === 'RichText') {
            return `RICHTEXT(${field.name})`;
        } else if (field.type === 'LongText') {
            return `LONGTEXT(${field.name})`;
        }
        return field.name;
    });

    // Build an array of the name__v fields for any outgoing object relationships. This is so we can display the name
    // of related records.
    const relatedObjectNames: string[] = objectFields?.flatMap((field: ObjectFieldMetadata) => {
        if (!field?.relationship_outbound_name) {
            return [];
        }

        return [`${field.relationship_outbound_name}.name__v`];
    });

    // Build an array of the fields that reference the `users` object (e.g. created_by__v, etc.). This is so we can
    // separately query for the names of those user objects since they don't have an outbound relationship
    const usersObjectFieldNames: string[] = objectFields
        ?.filter((field: ObjectFieldMetadata) => field?.object?.name === 'users')
        ?.map((field: ObjectFieldMetadata) => field?.name);

    return { objectFieldNames, relatedObjectNames, usersObjectFieldNames };
};

/**
 * Constructs and executes a VQL query for the object & record ID provided. Returns the query response or an error.
 * @param recordId - object record id
 * @param objectName - object api name (query target)
 * @param queryFields - array of fields to query for
 */
export const executeRecordQuery = async ({
    recordId,
    objectName,
    queryFields,
}: {
    recordId: string;
    objectName: string;
    queryFields: string[];
}) => {
    const queryString = `SELECT ${queryFields.join(', ')} FROM ${objectName} WHERE id = '${recordId}'`;
    const { queryResponse } = await query(queryString);

    if (!queryResponse?.queryDescribe) {
        const errorDetail =
            queryResponse?.responseStatus === 'FAILURE' && queryResponse?.errors?.length > 0
                ? `${queryResponse.errors[0].type} : ${queryResponse.errors[0].message}`
                : 'Failed to execute query';
        return { queryResponse: null, queryError: errorDetail };
    }

    if (queryResponse?.data?.length < 1) {
        return { queryResponse: null, queryError: 'Record not found' };
    }

    return { queryResponse, queryError: null };
};

/**
 * Fetches the name__v field for any user object references. Extracts the IDs of those users from the original query data,
 * then queries for those records' name__v field and returns the unique ID/name pairs in a Map.
 * @param usersObjectFieldNames - array of field names that are users/user__sys references
 * @param queryData - original record query data
 */
export const fetchUserNamesForRecord = async (usersObjectFieldNames: string[], queryData: any[]) => {
    if (usersObjectFieldNames.length === 0 || !queryData || queryData.length === 0) {
        return new Map();
    }

    // Gather the IDs for each user/user__sys reference in the original record's query result
    const usersObjectReferenceValues: string[] = [];
    queryData?.forEach((dataRow: any) => {
        usersObjectFieldNames.forEach((fieldName: string) => {
            usersObjectReferenceValues.push(String(dataRow[fieldName]));
        });
    });

    // Construct and execute a query to retrieve the name__v field for those user__sys records
    const queryContainsClause = usersObjectReferenceValues.map((value) => `'${value}'`).join(', ');
    const queryString: string = `SELECT id, name__v FROM user__sys WHERE id CONTAINS(${queryContainsClause})`;

    const { queryResponse } = await query(queryString);

    // For any results, store the ID/name pair in a Map
    const usersObjectNamesMap = new Map<string, string>();
    if (queryResponse.responseStatus !== 'FAILURE' && queryResponse?.data?.length > 0) {
        queryResponse?.data?.map((row: any) => {
            if (usersObjectReferenceValues.includes(row?.id)) {
                usersObjectNamesMap.set(row?.id, row?.name__v);
            }
        });
    }

    return usersObjectNamesMap;
};

/**
 * Transform raw query results and metadata into a structured array of VaultRecordField rows to store in state. Merges
 * info from the record data, query describe metadata, and object field metadata to form one object with all the
 * information needed to display a field in the Data Navigator UI.
 */
export const buildRecordDataRows = ({
    queryDescribeFields,
    queryDataRow,
    objectFields,
    usersObjectNamesMap,
}: {
    queryDescribeFields: any[];
    queryDataRow: any;
    objectFields: ObjectFieldMetadata[];
    usersObjectNamesMap: Map<string, string>;
}) => {
    return queryDescribeFields?.flatMap((field: any) => {
        // We query for related object names at the same time, but we don't want to show those in their own row
        if (field?.name?.includes('.')) {
            return [];
        }

        const fieldValue = queryDataRow[field.name];

        const objectFieldMetadata = objectFields?.find(
            (currField: ObjectFieldMetadata) => currField.name === field.name,
        );

        const formula = objectFieldMetadata?.formula;
        const lookupRelationshipName = objectFieldMetadata?.lookup_relationship_name;
        const objectReferenceApiName = objectFieldMetadata?.object?.name;
        const objectReferenceRelationshipName = objectFieldMetadata?.relationship_outbound_name;
        const isRollup = objectFieldMetadata?.rollup;

        let objectReferenceRecordName = queryDataRow[`${objectReferenceRelationshipName}.name__v`];

        if (objectReferenceApiName === 'users') {
            if (usersObjectNamesMap.has(String(fieldValue))) {
                objectReferenceRecordName = usersObjectNamesMap.get(String(fieldValue));
            }
        }

        const componentType = objectFieldMetadata?.component;

        return [
            {
                name: field.name,
                label: field.label || objectFieldMetadata?.label, // Query functions (e.g. LONGTEXT/RICHTEXT won't have labels in QueryDescribe)
                type: field.type,
                value: fieldValue,
                required: field.required,
                maxLength: field.max_length,
                picklist: field.picklist,
                formula,
                lookupRelationshipName,
                objectReferenceApiName,
                objectReferenceRecordName,
                isRollup,
                componentType,
            },
        ];
    });
};
