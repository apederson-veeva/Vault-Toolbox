import { useEffect, useMemo, useState, useCallback } from 'react';
import VqlQueryMetadata from '../../components/vql-editor/query-builder/VqlQueryMetadata';
import {
    retrieveAllDocumentFields,
    retrieveComponentRecordXmlJson,
    retrieveDocumentSignatureMetadata,
    retrieveObjectCollection,
    retrieveObjectMetadata,
    retrievePicklistValues,
    retrieveUserMetadata,
} from '../../services/ApiService';
import { convertArrayToSelectOptions } from '../../services/SharedServices';

export default function useQueryBuilder({ setCode, previousQueryResults, setPreviousQueryResults }) {
    const [selectedQueryCategory, setSelectedQueryCategory] = useState();
    const [queryTargetOptions, setQueryTargetOptions] = useState([]);
    const [queryTargetsError, setQueryTargetsError] = useState('');
    const [loadingQueryTargets, setLoadingQueryTargets] = useState(false);
    const [selectedQueryTarget, setSelectedQueryTarget] = useState();
    const [selectedFields, setSelectedFields] = useState();
    const [selectedFilters, setSelectedFilters] = useState([]);
    const [fieldOptions, setFieldOptions] = useState();
    const [fieldOptionsError, setFieldOptionsError] = useState('');
    const [loadingFieldMetadata, setLoadingFieldMetadata] = useState(false);
    const [logicalOperator, setLogicalOperator] = useState('AND');
    const [picklistValueOptions, setPicklistValueOptions] = useState([]);
    const [objectLifecycleStateOptions, setObjectLifecycleStateOptions] = useState([]);

    // Memoized to avoid expensive recalculations since VqlQueryMetadata won't change during runtime
    const vqlQueryMetadata = useMemo(() => VqlQueryMetadata(), []);
    const { queryCategories, queryTargets, supportedQueryFilterOperators, booleanValues, attachmentsQueryTarget } =
        vqlQueryMetadata;

    /**
     * Retrieves all Vault objects via the query endpoint and loads them into state
     */
    const fetchVaultObjects = async () => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const objectResponse = await retrieveObjectCollection();
        if (objectResponse?.responseStatus === 'FAILURE') {
            let error = '';
            if (objectResponse?.errors?.length > 0) {
                error = `${objectResponse.errors[0].type} : ${objectResponse.errors[0].message}`;
            }
            setQueryTargetsError(error);
            setLoadingQueryTargets(false);
            return;
        }

        const vaultObjectArray = [];
        objectResponse?.objects?.forEach((object) => {
            vaultObjectArray.push({
                label: `${object?.label} (${object?.name})`,
                value: object?.name,
            });
        });

        setQueryTargetOptions(vaultObjectArray.sort((a, b) => a?.label.localeCompare(b?.label)));

        setLoadingQueryTargets(false);
    };

    /**
     * Retrieves object metadata for the selected object. Creates selectable field/relationship options and loads them
     * into state.
     */
    const fetchObjectMetadata = useCallback(async () => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');
        setPreviousQueryResults((prevState) => ({
            ...prevState,
            isMatch: false, // Reset whenever the target object changes
        }));

        const { response } = await retrieveObjectMetadata(selectedQueryTarget?.value);

        if (response?.responseStatus === 'SUCCESS') {
            const lifecycle = response?.object?.available_lifecycles?.toString();
            const objectFields = response?.object?.fields?.map((field) => {
                return {
                    value: field.name,
                    label: `${field.label} (${field.name})`,
                    fieldType: field.type,
                    picklist: field?.picklist,
                    formula: field?.formula, // Captured so we can exclude formula fields from the WHERE clause
                    isLookupField: isLookupField(field),
                    isSearchable: field?.searchable,
                    isObjectLifecycleStateField: isObjectLifecycleStateField(field),
                    lifecycle: isObjectLifecycleStateField(field) ? lifecycle : null,
                };
            });

            const objectRelationships = response?.object?.relationships;
            const allowsAttachments = response?.object?.allow_attachments;

            let relationshipFieldOptions = [];
            if (objectRelationships) {
                // If object has a relationship to previous results, store that relationship so we can suggest a filter
                // on the previous results
                checkRelationshipToPreviousResults(objectRelationships);

                const outboundRelationshipOptions = createRelationshipOptions(
                    objectRelationships,
                    'reference_outbound',
                    false,
                );
                const parentRelationshipOptions = createRelationshipOptions(objectRelationships, 'parent', false);
                const inboundRelationshipOptions = createRelationshipOptions(
                    objectRelationships,
                    'reference_inbound',
                    true,
                );
                const childRelationshipOptions = createRelationshipOptions(objectRelationships, 'child', true);
                const objectAttachmentOptions = allowsAttachments
                    ? createQueryFieldOptions(
                          attachmentsQueryTarget.queryTarget,
                          attachmentsQueryTarget.objectAttachmentFields,
                          true,
                          'Attachments',
                      )
                    : [];

                relationshipFieldOptions = [
                    {
                        label: 'Outbound Relationships',
                        options: outboundRelationshipOptions,
                    },
                    {
                        label: 'Inbound Relationships',
                        options: inboundRelationshipOptions,
                    },
                    {
                        label: 'Child Relationships',
                        options: childRelationshipOptions,
                    },
                    {
                        label: 'Parent Relationships',
                        options: parentRelationshipOptions,
                    },
                    {
                        label: 'Attachments',
                        options: objectAttachmentOptions,
                    },
                ];
            }

            const allFieldOptions = [
                {
                    label: 'Fields',
                    options: objectFields,
                },
                ...relationshipFieldOptions,
            ];

            setFieldOptions(allFieldOptions);
        } else if (response?.responseStatus === 'FAILURE') {
            let error = '';
            if (response?.errors?.length > 0) {
                error = `${response.errors[0].type} : ${response.errors[0].message}`;
            }
            setFieldOptionsError(error);
        }

        setLoadingFieldMetadata(false);
    }, [selectedQueryTarget, attachmentsQueryTarget, setPreviousQueryResults, checkRelationshipToPreviousResults]);

    const checkRelationshipToPreviousResults = useCallback(
        (objectRelationships) => {
            objectRelationships.forEach((relationship) => {
                if (
                    relationship?.relationship_type === 'parent' ||
                    relationship?.relationship_type === 'reference_outbound'
                ) {
                    if (relationship?.object?.name === previousQueryResults?.queryTarget) {
                        setPreviousQueryResults((prevState) => ({
                            ...prevState,
                            relationship: relationship?.field,
                            isMatch: true,
                        }));
                    }
                }
            });
        },
        [previousQueryResults, setPreviousQueryResults],
    );

    /**
     * Retrieves the Vault document query target options and loads them into state
     */
    const loadDocumentQueryTargetOptions = useCallback(() => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const documentQueryTargets = queryTargets.Documents.map((queryTarget) => {
            return {
                label: `${queryTarget?.label} (${queryTarget?.name})`,
                value: queryTarget?.name,
            };
        });

        setQueryTargetOptions(documentQueryTargets.sort((a, b) => a?.label.localeCompare(b?.label)));

        setLoadingQueryTargets(false);
    }, [queryTargets]);

    const loadDocumentQueryTargetMetadata = useCallback(async () => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const response = await retrieveAllDocumentFields();

        if (response?.responseStatus === 'SUCCESS') {
            const documentFields = response?.properties?.reduce((fieldsArray, currentField) => {
                if (currentField?.queryable) {
                    fieldsArray.push({
                        value: currentField.name,
                        label: currentField.label ? `${currentField.label} (${currentField.name})` : currentField.name,
                        fieldType: currentField.type,
                        ...(currentField.type === 'Picklist' && { picklistEntries: currentField?.entryLabels }),
                    });
                }
                return fieldsArray;
            }, []);

            documentFields.sort((a, b) => a?.label.localeCompare(b?.label));

            const documentRelationships = response?.properties?.reduce((relationshipsArray, currentField) => {
                if (
                    currentField?.queryable &&
                    currentField?.type === 'ObjectReference' &&
                    currentField?.relationshipType === 'reference' &&
                    currentField.relationshipName
                ) {
                    relationshipsArray.push({
                        relationship_name: currentField.relationshipName,
                        relationship_label: currentField.label || currentField.name,
                        field: currentField?.objectType,
                        relationship_type: currentField?.relationshipType,
                        object: { name: currentField?.objectType },
                    });
                }
                return relationshipsArray;
            }, []);
            const referenceRelationshipOptions = createRelationshipOptions(documentRelationships, 'reference', true);

            const documentAttachmentOptions =
                createQueryFieldOptions(
                    attachmentsQueryTarget.queryTarget,
                    attachmentsQueryTarget.documentAttachmentFields,
                    true,
                    'Attachments',
                ) || [];

            const documentRoleOptions =
                createQueryFieldOptions(
                    queryTargets.Documents[0].metadata.subqueries.documentRolesQueryTarget.subQueryTarget,
                    queryTargets.Documents[0].metadata.subqueries.documentRolesQueryTarget.fields,
                    true,
                    'Document Roles',
                ) || [];

            const documentRenditionsOptions =
                createQueryFieldOptions(
                    queryTargets.Documents[0].metadata.subqueries.renditionsQueryTarget.subQueryTarget,
                    queryTargets.Documents[0].metadata.subqueries.renditionsQueryTarget.fields,
                    true,
                    'Document Renditions',
                ) || [];

            const documentSignatureOptions = (await loadDocumentSignatureFieldOptions()) || [];

            const relationshipFieldOptions = [
                {
                    label: 'Reference Relationships',
                    options: referenceRelationshipOptions,
                },
                {
                    label: 'Document Roles',
                    options: documentRoleOptions,
                },
                {
                    label: 'Document Signatures',
                    options: documentSignatureOptions,
                },
                {
                    label: 'Document Renditions',
                    options: documentRenditionsOptions,
                },
                {
                    label: 'Attachments',
                    options: documentAttachmentOptions,
                },
            ];

            const allFieldOptions = [
                {
                    label: 'Fields',
                    options: documentFields,
                },
                ...relationshipFieldOptions,
            ];

            setFieldOptions(allFieldOptions);
        } else if (response?.responseStatus === 'FAILURE') {
            let error = '';
            if (response?.errors?.length > 0) {
                error = `${response.errors[0].type} : ${response.errors[0].message}`;
            }
            setFieldOptionsError(error);
        }

        setLoadingFieldMetadata(false);
    }, [attachmentsQueryTarget, queryTargets, loadDocumentSignatureFieldOptions]);

    const loadDocumentRoleQueryTargetOptions = useCallback(() => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const docRoleQueryTargets = queryTargets['Document Roles'].map((queryTarget) => {
            return {
                label: `${queryTarget?.label} (${queryTarget?.name})`,
                value: queryTarget?.name,
            };
        });

        setQueryTargetOptions(docRoleQueryTargets);

        setLoadingQueryTargets(false);
    }, [queryTargets]);

    const loadDocumentRoleQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const documentRoleQueryTargetMetadata = queryTargets['Document Roles'][0].metadata;

        const documentRoleFields = documentRoleQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        documentRoleFields.sort((a, b) => a?.label.localeCompare(b?.label));

        const outboundRelationshipOptions = createRelationshipOptions(
            documentRoleQueryTargetMetadata.relationships,
            'reference_outbound',
            false,
        );

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: documentRoleFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadDocumentRelationshipsQueryTargetOptions = useCallback(() => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const docRelationshipQueryTargets = queryTargets['Document Relationships'].map((queryTarget) => {
            return {
                label: `${queryTarget?.label} (${queryTarget?.name})`,
                value: queryTarget?.name,
            };
        });

        setQueryTargetOptions(docRelationshipQueryTargets);

        setLoadingQueryTargets(false);
    }, [queryTargets]);

    const loadDocumentRelationshipsQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const documentRelationshipsQueryTargetMetadata = queryTargets['Document Relationships'][0].metadata;

        const documentRelationshipFields = documentRelationshipsQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        documentRelationshipFields.sort((a, b) => a?.label.localeCompare(b?.label));

        const outboundRelationshipOptions = createRelationshipOptions(
            documentRelationshipsQueryTargetMetadata.relationships,
            'reference_outbound',
            false,
        );

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: documentRelationshipFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadBinderQueryTargetOptions = useCallback(() => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const docRelationshipQueryTargets = queryTargets.Binders.map((queryTarget) => {
            return {
                label: `${queryTarget?.label} (${queryTarget?.name})`,
                value: queryTarget?.name,
            };
        });

        setQueryTargetOptions(docRelationshipQueryTargets);

        setLoadingQueryTargets(false);
    }, [queryTargets]);

    const loadBinderQueryTargetMetadata = useCallback(async () => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        // Binder fields are the same as document fields
        const response = await retrieveAllDocumentFields();

        if (response?.responseStatus === 'SUCCESS') {
            const documentFields = response?.properties?.reduce((fieldsArray, currentField) => {
                if (currentField?.queryable) {
                    fieldsArray.push({
                        value: currentField.name,
                        label: currentField.label ? `${currentField.label} (${currentField.name})` : currentField.name,
                        fieldType: currentField.type,
                    });
                }
                return fieldsArray;
            }, []);

            documentFields.sort((a, b) => a?.label.localeCompare(b?.label));

            const documentRelationships = response?.properties?.reduce((relationshipsArray, currentField) => {
                if (
                    currentField?.queryable &&
                    currentField?.type === 'ObjectReference' &&
                    currentField?.relationshipType === 'reference' &&
                    currentField.relationshipName
                ) {
                    relationshipsArray.push({
                        relationship_name: currentField.relationshipName,
                        relationship_label: currentField.label || currentField.name,
                        field: currentField?.objectType,
                        relationship_type: currentField?.relationshipType,
                        object: { name: currentField?.objectType },
                    });
                }
                return relationshipsArray;
            }, []);
            const referenceRelationshipOptions = createRelationshipOptions(documentRelationships, 'reference', true);

            const binderNodeOptions = createQueryFieldOptions(
                'binder_nodes__sysr',
                queryTargets.Binders[1].metadata.fields,
                true,
                'Binder Nodes',
            );

            const relationshipFieldOptions = [
                {
                    label: 'Reference Relationships',
                    options: referenceRelationshipOptions,
                },
                {
                    label: 'Binder Nodes',
                    options: binderNodeOptions,
                },
            ];

            const allFieldOptions = [
                {
                    label: 'Fields',
                    options: documentFields,
                },
                ...relationshipFieldOptions,
            ];

            setFieldOptions(allFieldOptions);
        } else if (response?.responseStatus === 'FAILURE') {
            let error = '';
            if (response?.errors?.length > 0) {
                error = `${response.errors[0].type} : ${response.errors[0].message}`;
            }
            setFieldOptionsError(error);
        }

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadBinderNodesQueryTargetMetadata = useCallback(async () => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const binderNodesQueryTargetMetadata = queryTargets.Binders[1].metadata;

        const binderNodeFields = createQueryFieldOptions(
            binderNodesQueryTargetMetadata.queryTarget,
            binderNodesQueryTargetMetadata.fields,
            false,
            binderNodesQueryTargetMetadata.label,
        );

        binderNodeFields.sort((a, b) => a?.label.localeCompare(b?.label));

        const outboundRelationshipOptions = createRelationshipOptions(
            binderNodesQueryTargetMetadata.relationships,
            'reference_outbound',
            false,
        );

        let parentRelationshipOptions = [];
        binderNodesQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship.relationship_type === 'parent') {
                if (relationship.relationship_name === 'binder__sysr') {
                    parentRelationshipOptions.push(...createRelationshipOptions([relationship], 'parent', true));
                } else {
                    parentRelationshipOptions.push(
                        ...createRelationshipOptionsFromFields(
                            relationship,
                            binderNodesQueryTargetMetadata.fields,
                            true,
                        ),
                    );
                }
            }
        });

        let childRelationshipOptions = [];
        binderNodesQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship.relationship_type === 'child') {
                childRelationshipOptions.push(
                    ...createRelationshipOptionsFromFields(relationship, binderNodesQueryTargetMetadata.fields, true),
                );
            }
        });

        const relationshipFieldOptions = [
            { label: 'Outbound Relationships', options: outboundRelationshipOptions },
            { label: 'Parent Relationships', options: parentRelationshipOptions },
            { label: 'Child Relationships', options: childRelationshipOptions },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: binderNodeFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadDocumentSignatureFieldOptions = useCallback(async () => {
        const response = await retrieveDocumentSignatureMetadata();

        if (response?.responseStatus === 'SUCCESS') {
            const documentSignatureFields = response?.properties?.fields?.reduce((fieldsArray, currentField) => {
                fieldsArray.push({
                    field: currentField.name,
                    label: currentField.label ? `${currentField.label} (${currentField.name})` : null,
                    fieldType: currentField.type,
                });
                return fieldsArray;
            }, []);

            documentSignatureFields.sort((a, b) => a?.field.localeCompare(b?.field));

            const docSignaturesQueryTarget =
                queryTargets.Documents[0].metadata.subqueries.documentSignaturesQueryTarget;
            return createQueryFieldOptions(
                docSignaturesQueryTarget.subQueryTarget,
                documentSignatureFields,
                true,
                docSignaturesQueryTarget.label,
            );
        }
    }, [queryTargets]);

    const loadUsersQueryTargetOptions = useCallback(() => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const usersQueryTargets = queryTargets['Users'].map((queryTarget) => {
            return {
                label: `${queryTarget?.label} (${queryTarget?.name})`,
                value: queryTarget?.name,
            };
        });

        setQueryTargetOptions(usersQueryTargets);
        setLoadingQueryTargets(false);
    }, [queryTargets]);

    const loadUsersQueryTargetMetadata = useCallback(async () => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const { response } = await retrieveUserMetadata();

        if (response?.responseStatus === 'SUCCESS') {
            const userFields = response?.properties?.reduce((fieldsArray, currentField) => {
                if (currentField?.queryable) {
                    fieldsArray.push({
                        value: currentField.name,
                        label: currentField.label ? `${currentField.label} (${currentField.name})` : currentField.name,
                        fieldType: currentField.type,
                        values: currentField.values, // certain user fields have selectable values included (e.g. user_timezone__v)
                    });
                }
                return fieldsArray;
            }, []);

            userFields.sort((a, b) => a?.label.localeCompare(b?.label));

            const allFieldOptions = [
                {
                    label: 'Fields',
                    options: userFields,
                },
            ];

            setFieldOptions(allFieldOptions);
        } else if (response?.responseStatus === 'FAILURE') {
            let error = '';
            if (response?.errors?.length > 0) {
                error = `${response.errors[0].type} : ${response.errors[0].message}`;
            }
            setFieldOptionsError(error);
        }

        setLoadingFieldMetadata(false);
    }, []);

    const loadRenditionsQueryTargetOptions = useCallback(() => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const renditionsQueryTargets = queryTargets.Renditions.map((queryTarget) => {
            return {
                label: `${queryTarget?.label} (${queryTarget?.name})`,
                value: queryTarget?.name,
            };
        });

        setQueryTargetOptions(renditionsQueryTargets);

        setLoadingQueryTargets(false);
    }, [queryTargets]);

    const loadRenditionsQueryTargetMetadata = useCallback(async () => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const renditionsQueryTargetMetadata = queryTargets.Renditions[0].metadata;

        const renditionsFields = renditionsQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        renditionsFields.sort((a, b) => a?.label.localeCompare(b?.label));

        const allFieldOptions = [
            {
                label: 'Fields',
                options: renditionsFields,
            },
        ];

        setFieldOptions(allFieldOptions);

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadMatchedDocumentsQueryTargetOptions = useCallback(() => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const matchedDocumentsQueryTargets = queryTargets['Matched Documents'].map((queryTarget) => {
            return {
                label: `${queryTarget?.label} (${queryTarget?.name})`,
                value: queryTarget?.name,
            };
        });

        setQueryTargetOptions(matchedDocumentsQueryTargets);

        setLoadingQueryTargets(false);
    }, [queryTargets]);

    const loadMatchedDocumentsQueryTargetMetadata = useCallback(async () => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const matchedDocumentsQueryTargetMetadata = queryTargets['Matched Documents'][0].metadata;

        const matchedDocumentsFields = matchedDocumentsQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        matchedDocumentsFields.sort((a, b) => a?.label.localeCompare(b?.label));

        const outboundRelationshipOptions = createRelationshipOptions(
            matchedDocumentsQueryTargetMetadata.relationships,
            'reference_outbound',
            false,
        );

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: matchedDocumentsFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadJobsQueryTargetOptions = useCallback(() => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const jobsQueryTargets = queryTargets.Jobs.map((queryTarget) => {
            return {
                label: `${queryTarget?.label} (${queryTarget?.name})`,
                value: queryTarget?.name,
            };
        });

        setQueryTargetOptions(jobsQueryTargets);

        setLoadingQueryTargets(false);
    }, [queryTargets]);

    const loadJobInstanceQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const jobInstanceQueryTargetMetadata = queryTargets.Jobs[0].metadata;

        const jobInstanceFields = jobInstanceQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        jobInstanceFields.sort((a, b) => a?.label.localeCompare(b?.label));

        const allFieldOptions = [
            {
                label: 'Fields',
                options: jobInstanceFields,
            },
        ];

        setFieldOptions(allFieldOptions);

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadJobHistoryQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const jobHistoryQueryTargetMetadata = queryTargets.Jobs[1].metadata;

        const jobHistoryFields = jobHistoryQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        jobHistoryFields.sort((a, b) => a?.label.localeCompare(b?.label));

        let inboundRelationshipOptions = [];
        jobHistoryQueryTargetMetadata.relationships.forEach((relationship) => {
            inboundRelationshipOptions.push(
                ...createRelationshipOptionsFromFields(relationship, queryTargets.Jobs[2].metadata.fields, true),
            );
        });

        const relationshipFieldOptions = [{ label: 'Inbound Relationships', options: inboundRelationshipOptions }];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: jobHistoryFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadJobTaskHistoryQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const jobTaskHistoryQueryTargetMetadata = queryTargets.Jobs[2].metadata;

        const jobTaskHistoryFields = jobTaskHistoryQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        jobTaskHistoryFields.sort((a, b) => a?.label.localeCompare(b?.label));

        let outboundRelationshipOptions = [];
        jobTaskHistoryQueryTargetMetadata.relationships.forEach((relationship) => {
            outboundRelationshipOptions.push(
                ...createRelationshipOptionsFromFields(relationship, queryTargets.Jobs[1].metadata.fields),
            );
        });

        const relationshipFieldOptions = [{ label: 'Inbound Relationships', options: outboundRelationshipOptions }];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: jobTaskHistoryFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadGroupsQueryTargetOptions = useCallback(() => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const groupsQueryTargets = queryTargets.Groups.map((queryTarget) => {
            return {
                label: `${queryTarget?.label} (${queryTarget?.name})`,
                value: queryTarget?.name,
            };
        });

        setQueryTargetOptions(groupsQueryTargets);

        setLoadingQueryTargets(false);
    }, [queryTargets]);

    const loadGroupQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const groupsQueryTargetMetadata = queryTargets.Groups[0].metadata;

        const groupsFields = groupsQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        groupsFields.sort((a, b) => a?.label.localeCompare(b?.label));

        let inboundRelationshipOptions = [];
        groupsQueryTargetMetadata.relationships.forEach((relationship) => {
            inboundRelationshipOptions.push(
                ...createRelationshipOptionsFromFields(relationship, queryTargets.Groups[1].metadata.fields, true),
            );
        });

        const relationshipFieldOptions = [{ label: 'Inbound Relationships', options: inboundRelationshipOptions }];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: groupsFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadGroupMembershipQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const groupMembershipQueryTargetMetadata = queryTargets.Groups[1].metadata;

        const groupMembershipFields = groupMembershipQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        groupMembershipFields.sort((a, b) => a?.label.localeCompare(b?.label));

        let outboundRelationshipOptions = [];
        groupMembershipQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship.relationship_name === 'user__sysr') {
                outboundRelationshipOptions.push(...createRelationshipOptions([relationship], 'reference_outbound'));
            } else {
                outboundRelationshipOptions.push(
                    ...createRelationshipOptionsFromFields(relationship, queryTargets.Groups[0].metadata.fields),
                );
            }
        });

        const relationshipFieldOptions = [{ label: 'Outbound Relationships', options: outboundRelationshipOptions }];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: groupMembershipFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);

        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadWorkflowQueryTargetOptions = useCallback(() => {
        setLoadingQueryTargets(true);
        setQueryTargetsError('');

        const workflowQueryTargets = queryTargets.Workflows.map((queryTarget) => {
            return {
                label: `${queryTarget?.label} (${queryTarget?.name})`,
                value: queryTarget?.name,
            };
        });

        setQueryTargetOptions(workflowQueryTargets);
        setLoadingQueryTargets(false);
    }, [queryTargets]);

    const loadActiveWorkflowObjectsQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const workflowQueryTargetMetadata = queryTargets.Workflows[0].metadata;

        const workflowFields = workflowQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        workflowFields.sort((a, b) => a?.label.localeCompare(b?.label));

        const outboundRelationshipOptions = createRelationshipOptions(
            workflowQueryTargetMetadata.relationships,
            'reference_outbound',
            false,
        );

        let inboundRelationshipOptions = [];
        workflowQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship?.relationship_type === 'reference_inbound') {
                const relationshipQueryTarget = queryTargets.Workflows.find(
                    (queryTarget) => queryTarget?.name === relationship.relationship_query_target,
                );
                const relationshipQueryTargetMetadata = relationshipQueryTarget?.metadata;
                if (relationshipQueryTargetMetadata?.fields) {
                    inboundRelationshipOptions.push(
                        ...createRelationshipOptionsFromFields(
                            relationship,
                            relationshipQueryTargetMetadata?.fields,
                            true,
                        ),
                    );
                }
            }
        });

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
            { label: 'Inbound Relationships', options: inboundRelationshipOptions },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: workflowFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);
        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadInactiveWorkflowObjectsQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const workflowQueryTargetMetadata = queryTargets.Workflows[1].metadata;

        const workflowFields = workflowQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        workflowFields.sort((a, b) => a?.label.localeCompare(b?.label));

        const outboundRelationshipOptions = createRelationshipOptions(
            workflowQueryTargetMetadata.relationships,
            'reference_outbound',
            false,
        );

        let inboundRelationshipOptions = [];
        workflowQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship?.relationship_type === 'reference_inbound') {
                const relationshipQueryTarget = queryTargets.Workflows.find(
                    (queryTarget) => queryTarget?.name === relationship.relationship_query_target,
                );
                const relationshipQueryTargetMetadata = relationshipQueryTarget?.metadata;
                if (relationshipQueryTargetMetadata?.fields) {
                    inboundRelationshipOptions.push(
                        ...createRelationshipOptionsFromFields(
                            relationship,
                            relationshipQueryTargetMetadata?.fields,
                            true,
                        ),
                    );
                }
            }
        });

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
            { label: 'Inbound Relationships', options: inboundRelationshipOptions },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: workflowFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);
        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadActiveWorkflowItemsQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const workflowItemsQueryTargetMetadata = queryTargets.Workflows[2].metadata;

        const workflowItemFields = workflowItemsQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        workflowItemFields.sort((a, b) => a?.label.localeCompare(b?.label));

        let outboundRelationshipOptions = [];
        workflowItemsQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship?.relationship_type === 'reference_outbound') {
                const relationshipQueryTarget = queryTargets.Workflows.find(
                    (queryTarget) => queryTarget?.name === relationship.relationship_query_target,
                );
                const relationshipQueryTargetMetadata = relationshipQueryTarget?.metadata;

                if (relationshipQueryTargetMetadata?.fields) {
                    outboundRelationshipOptions.push(
                        ...createRelationshipOptionsFromFields(
                            relationship,
                            relationshipQueryTargetMetadata?.fields,
                            true,
                        ),
                    );
                }
            }
        });

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: workflowItemFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);
        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadInactiveWorkflowItemsQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const workflowItemsQueryTargetMetadata = queryTargets.Workflows[3].metadata;

        const workflowItemFields = workflowItemsQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        workflowItemFields.sort((a, b) => a?.label.localeCompare(b?.label));

        let outboundRelationshipOptions = [];
        workflowItemsQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship?.relationship_type === 'reference_outbound') {
                const relationshipQueryTarget = queryTargets.Workflows.find(
                    (queryTarget) => queryTarget?.name === relationship.relationship_query_target,
                );
                const relationshipQueryTargetMetadata = relationshipQueryTarget?.metadata;

                if (relationshipQueryTargetMetadata?.fields) {
                    outboundRelationshipOptions.push(
                        ...createRelationshipOptionsFromFields(
                            relationship,
                            relationshipQueryTargetMetadata?.fields,
                            true,
                        ),
                    );
                }
            }
        });

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: workflowItemFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);
        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadActiveWorkflowTaskQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const workflowTasksQueryTargetMetadata = queryTargets.Workflows[4].metadata;

        const workflowTaskFields = workflowTasksQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        workflowTaskFields.sort((a, b) => a?.label.localeCompare(b?.label));

        let outboundRelationshipOptions = [];
        workflowTasksQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship?.relationship_type === 'reference_outbound') {
                if (relationship?.field) {
                    outboundRelationshipOptions.push(
                        ...createRelationshipOptions([relationship], 'reference_outbound', false),
                    );
                } else {
                    const relationshipQueryTarget = queryTargets.Workflows.find(
                        (queryTarget) => queryTarget?.name === relationship.relationship_query_target,
                    );
                    const relationshipQueryTargetMetadata = relationshipQueryTarget?.metadata;

                    if (relationshipQueryTargetMetadata?.fields) {
                        outboundRelationshipOptions.push(
                            ...createRelationshipOptionsFromFields(
                                relationship,
                                relationshipQueryTargetMetadata?.fields,
                                true,
                            ),
                        );
                    }
                }
            }
        });

        let inboundRelationshipOptions = [];
        workflowTasksQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship?.relationship_type === 'reference_inbound') {
                const relationshipQueryTarget = queryTargets.Workflows.find(
                    (queryTarget) => queryTarget?.name === relationship.relationship_query_target,
                );
                const relationshipQueryTargetMetadata = relationshipQueryTarget?.metadata;
                if (relationshipQueryTargetMetadata?.fields) {
                    inboundRelationshipOptions.push(
                        ...createRelationshipOptionsFromFields(
                            relationship,
                            relationshipQueryTargetMetadata?.fields,
                            true,
                        ),
                    );
                }
            }
        });

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
            { label: 'Inbound Relationships', options: inboundRelationshipOptions },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: workflowTaskFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);
        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadInactiveWorkflowTaskQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const workflowTasksQueryTargetMetadata = queryTargets.Workflows[5].metadata;

        const workflowTaskFields = workflowTasksQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        workflowTaskFields.sort((a, b) => a?.label.localeCompare(b?.label));

        let outboundRelationshipOptions = [];
        workflowTasksQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship?.relationship_type === 'reference_outbound') {
                if (relationship?.field) {
                    outboundRelationshipOptions.push(
                        ...createRelationshipOptions([relationship], 'reference_outbound', false),
                    );
                } else {
                    const relationshipQueryTarget = queryTargets.Workflows.find(
                        (queryTarget) => queryTarget?.name === relationship.relationship_query_target,
                    );
                    const relationshipQueryTargetMetadata = relationshipQueryTarget?.metadata;

                    if (relationshipQueryTargetMetadata?.fields) {
                        outboundRelationshipOptions.push(
                            ...createRelationshipOptionsFromFields(
                                relationship,
                                relationshipQueryTargetMetadata?.fields,
                                true,
                            ),
                        );
                    }
                }
            }
        });

        let inboundRelationshipOptions = [];
        workflowTasksQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship?.relationship_type === 'reference_inbound') {
                const relationshipQueryTarget = queryTargets.Workflows.find(
                    (queryTarget) => queryTarget?.name === relationship.relationship_query_target,
                );
                const relationshipQueryTargetMetadata = relationshipQueryTarget?.metadata;
                if (relationshipQueryTargetMetadata?.fields) {
                    inboundRelationshipOptions.push(
                        ...createRelationshipOptionsFromFields(
                            relationship,
                            relationshipQueryTargetMetadata?.fields,
                            true,
                        ),
                    );
                }
            }
        });

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
            { label: 'Inbound Relationships', options: inboundRelationshipOptions },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: workflowTaskFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);
        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadActiveWorkflowTaskItemQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const workflowTaskItemQueryTargetMetadata = queryTargets.Workflows[6].metadata;

        const workflowTaskItemFields = workflowTaskItemQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        workflowTaskItemFields.sort((a, b) => a?.label.localeCompare(b?.label));

        let outboundRelationshipOptions = [];
        workflowTaskItemQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship?.relationship_type === 'reference_outbound') {
                const relationshipQueryTarget = queryTargets.Workflows.find(
                    (queryTarget) => queryTarget?.name === relationship.relationship_query_target,
                );
                const relationshipQueryTargetMetadata = relationshipQueryTarget?.metadata;

                if (relationshipQueryTargetMetadata?.fields) {
                    outboundRelationshipOptions.push(
                        ...createRelationshipOptionsFromFields(
                            relationship,
                            relationshipQueryTargetMetadata?.fields,
                            true,
                        ),
                    );
                }
            }
        });

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: workflowTaskItemFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);
        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    const loadInactiveWorkflowTaskItemQueryTargetMetadata = useCallback(() => {
        setLoadingFieldMetadata(true);
        setFieldOptionsError('');

        const workflowTaskItemQueryTargetMetadata = queryTargets.Workflows[7].metadata;

        const workflowTaskItemFields = workflowTaskItemQueryTargetMetadata.fields.map((currentField) => {
            return {
                value: currentField.field,
                label: currentField.label ? `${currentField.label} (${currentField.field})` : currentField.field,
                fieldType: currentField.fieldType,
            };
        });
        workflowTaskItemFields.sort((a, b) => a?.label.localeCompare(b?.label));

        let outboundRelationshipOptions = [];
        workflowTaskItemQueryTargetMetadata.relationships.forEach((relationship) => {
            if (relationship?.relationship_type === 'reference_outbound') {
                const relationshipQueryTarget = queryTargets.Workflows.find(
                    (queryTarget) => queryTarget?.name === relationship.relationship_query_target,
                );
                const relationshipQueryTargetMetadata = relationshipQueryTarget?.metadata;

                if (relationshipQueryTargetMetadata?.fields) {
                    outboundRelationshipOptions.push(
                        ...createRelationshipOptionsFromFields(
                            relationship,
                            relationshipQueryTargetMetadata?.fields,
                            true,
                        ),
                    );
                }
            }
        });

        const relationshipFieldOptions = [
            {
                label: 'Outbound Relationships',
                options: outboundRelationshipOptions,
            },
        ];

        const allFieldOptions = [
            {
                label: 'Fields',
                options: workflowTaskItemFields,
            },
            ...relationshipFieldOptions,
        ];

        setFieldOptions(allFieldOptions);
        setLoadingFieldMetadata(false);
    }, [queryTargets]);

    /**
     * Helper function that determines if provided object field is a lookup field. Used to exclude
     * unsearchable lookup fields from the WHERE clause builder
     */
    const isLookupField = (field) => {
        return field?.lookup_source_field !== null && field?.lookup_source_field !== undefined;
    };

    /**
     * Helper function that determines if provided object field is an Object LC state field. Used to exclude
     * unsearchable lookup fields from the WHERE clause builder
     */
    const isObjectLifecycleStateField = (field) => {
        return field?.type === 'Component' && field?.component === 'Objectlifecyclestate';
    };

    /**
     * Retrieves picklist values for the selected picklist name. Creates selectable options and loads them into state.
     * @param picklistName
     */
    const fetchPicklistValues = async (picklistName) => {
        let { response } = await retrievePicklistValues(picklistName);

        if (response?.responseStatus === 'SUCCESS') {
            const picklistOptions = response?.picklistValues?.map((picklistValue) => ({
                value: picklistValue.name,
                label: picklistValue.label,
            }));

            setPicklistValueOptions(picklistOptions);
        } else {
            setPicklistValueOptions([]);
        }
    };

    /**
     * Retrieves Object LC state values for the selected Object lifecycle. Creates selectable options and loads them
     * into state.
     * @param objectLifecycleName
     */
    const fetchObjectLifecycleStateValues = async (objectLifecycleName) => {
        let { response } = await retrieveComponentRecordXmlJson(objectLifecycleName);

        if (response?.responseStatus === 'SUCCESS') {
            const lifecycleStateOptions = response?.data?.states?.map((lifecycleState) => ({
                value: lifecycleState.name,
                label: lifecycleState.label,
            }));

            setObjectLifecycleStateOptions(lifecycleStateOptions);
        } else {
            setObjectLifecycleStateOptions([]);
        }
    };

    /**
     * Helper function that creates array of the default selectable options for a relationship. These include
     * hard-coded fields for objects and documents.
     * @param relationships - array of relationship objects (e.g. from Retrieve Object Metadata response)
     * @param relationshipType - type of relationship (child, parent, inbound, outbound, etc.)
     * @param includeSubqueryTarget - if a relationship type will be a subquery, includes subquery target in the
     *     options
     * @returns {Array} default selection fields for given relationship type
     */
    const createRelationshipOptions = (relationships, relationshipType, includeSubqueryTarget = false) => {
        return relationships
            .filter((relationship) => relationship?.relationship_type === relationshipType)
            .flatMap((relationship) => {
                const idFields = !relationship?.excludeIdField
                    ? [
                          includeSubqueryTarget
                              ? {
                                    label: `${relationship?.relationship_label} (${relationship?.relationship_name}): ID (id)`,
                                    value: `${relationship?.relationship_name}.id`,
                                    fieldType: 'ID',
                                }
                              : {
                                    label: `${relationship?.relationship_label} (${relationship?.relationship_name}): ID (id)`,
                                    value: `${relationship?.field}`,
                                    fieldType: 'ID',
                                },
                      ]
                    : [];

                const commonFields = [
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Name (name__v)`,
                        value: `${relationship?.relationship_name}.name__v`,
                        fieldType: 'String',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Created By (created_by__v)`,
                        value: `${relationship?.relationship_name}.created_by__v`,
                        fieldType: 'Object',
                    },
                ];

                const objectFields = [
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Created Date (created_date__v)`,
                        value: `${relationship?.relationship_name}.created_date__v`,
                        fieldType: 'DateTime',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Status (status__v)`,
                        value: `${relationship?.relationship_name}.status__v`,
                        fieldType: 'Picklist',
                        picklist: 'default_status__v',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Last Modified By (modified_by__v)`,
                        value: `${relationship?.relationship_name}.modified_by__v`,
                        fieldType: 'Object',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Last Modified Date (modified_date__v)`,
                        value: `${relationship?.relationship_name}.modified_date__v`,
                        fieldType: 'DateTime',
                    },
                ];

                const documentFields = [
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Title (title__v)`,
                        value: `${relationship?.relationship_name}.title__v`,
                        fieldType: 'String',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Type (type__v)`,
                        value: `${relationship?.relationship_name}.type__v`,
                        fieldType: 'String',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Subtype (subtype__v)`,
                        value: `${relationship?.relationship_name}.subtype__v`,
                        fieldType: 'String',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Classification (classification__v)`,
                        value: `${relationship?.relationship_name}.classification__v`,
                        fieldType: 'String',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Document Number (document_number__v)`,
                        value: `${relationship?.relationship_name}.document_number__v`,
                        fieldType: 'String',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Lifecycle (lifecycle__v)`,
                        value: `${relationship?.relationship_name}.lifecycle__v`,
                        fieldType: 'String',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Created Date (document_creation_date__v)`,
                        value: `${relationship?.relationship_name}.document_creation_date__v`,
                        fieldType: 'DateTime',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Status (status__v)`,
                        value: `${relationship?.relationship_name}.status__v`,
                        fieldType: 'String',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Last Modified By (last_modified_by__v)`,
                        value: `${relationship?.relationship_name}.last_modified_by__v`,
                        fieldType: 'Object',
                    },
                    {
                        label: `${relationship?.relationship_label} (${relationship?.relationship_name}): Last Modified Date (version_modified_date__v)`,
                        value: `${relationship?.relationship_name}.version_modified_date__v`,
                        fieldType: 'DateTime',
                    },
                ];

                const fields = [
                    ...idFields,
                    ...commonFields,
                    ...(relationship?.object?.name === 'documents' ? documentFields : objectFields),
                ];

                return fields.map((fieldOption) => ({
                    ...fieldOption,
                    ...(includeSubqueryTarget && {
                        subqueryTarget: relationship?.relationship_name,
                    }),
                }));
            });
    };

    /**
     * Helper function that creates array of selectable options for a relationship from provided fields.
     * @param relationship - relationship object (e.g. modeled from Retrieve Object Metadata response)
     * @param includeSubqueryTarget - if a relationship type will be a subquery, includes subquery target in the options
     * @returns {Array} selection fields for given relationship
     */
    const createRelationshipOptionsFromFields = (relationship, fields, includeSubqueryTarget = false) => {
        return fields.map((field) => ({
            label: `${relationship?.relationship_label} (${relationship?.relationship_name}): ${field.label} (${field.field})`,
            value: `${relationship?.relationship_name}.${field.field}`,
            fieldType: field.fieldType,
            ...(includeSubqueryTarget && {
                subqueryTarget: relationship?.relationship_name,
            }),
        }));
    };

    /**
     * Helper function that creates array of selectable options for a given query target and fields.
     * @param queryTarget - query target
     * @param fields - array of fields (api name, label, field type)
     * @param isSubquery - if this query target will be used in a subquery
     * @param labelPrefix - the label to display before the actual field label (e.g. Attachments)
     * @returns {Array} selectable field options for the given query target & fields
     */
    const createQueryFieldOptions = (queryTarget, fields, isSubquery = false, labelPrefix = '') => {
        // Subqueries (e.g. attachments) need the react-select options to have the subquery target and field type
        if (isSubquery) {
            return fields.map((field) => ({
                label: field.label
                    ? `${labelPrefix} (${queryTarget}): ${field.label} (${field.field})`
                    : `${labelPrefix} (${queryTarget}): ${field.field}`,
                value: `${queryTarget}.${field.field}`,
                subqueryTarget: queryTarget,
                fieldType: field.fieldType,
            }));
        } else {
            return fields.map((field) => ({
                label: field.label ? `${field.label} (${field.field})` : `${field.field}`,
                value: field.field,
                fieldType: field.fieldType,
            }));
        }
    };

    /**
     * Builds a VQL query based on the users current selections
     */
    const buildQuery = () => {
        const primaryFields = selectedFields?.filter((field) => !field?.subqueryTarget);
        const subqueryFields = selectedFields?.filter((field) => field?.subqueryTarget);

        const dataGroupedBySubquery = subqueryFields.reduce((groupedBySubqueryTarget, field) => {
            const subqueryTarget = field.subqueryTarget;
            if (!groupedBySubqueryTarget[subqueryTarget]) {
                groupedBySubqueryTarget[subqueryTarget] = [];
            }
            groupedBySubqueryTarget[subqueryTarget].push(field.value);
            return groupedBySubqueryTarget;
        }, {});

        // Transform the grouped subquery data into a consistent structure
        const subqueryData = Object.entries(dataGroupedBySubquery).map(([key, values]) => ({
            subqueryTarget: key,
            values: values,
        }));

        // Gather primary fields in comma-delimited string
        let fieldsString = '';
        if (primaryFields.length > 0) {
            fieldsString += primaryFields?.map((field) => field?.value)?.join(', ');
        }

        // Append subqueries to the primary fields string
        if (subqueryData.length > 0) {
            subqueryData.forEach((subqueryObject) => {
                const subqueryValues = subqueryObject?.values?.map((value) =>
                    value?.substring(value?.indexOf('.') + 1),
                );
                fieldsString += `, \n\t(SELECT ${subqueryValues.join(', ')} FROM ${subqueryObject.subqueryTarget})`;
            });
        }

        // Create where clause string
        let whereClause = '';
        if (selectedFilters?.length > 0) {
            whereClause = '\nWHERE ';
            selectedFilters.forEach((filter, index) => {
                if (!filter?.field) {
                    return;
                } // Don't build empty filters without a field specified
                if (index !== 0) {
                    whereClause += ` ${logicalOperator} `;
                }

                if (filter?.operator.value === 'CONTAINS') {
                    let filterValue = '';
                    if (Array.isArray(filter?.value)) {
                        // Multi-select picklists are in an array and should be comma-delimited & wrapped in a string
                        filterValue = `${filter.value.map((value) => `'${value.value}'`).join(', ')}`;
                    } else if (filter?.value?.includes(',')) {
                        // Values with a comma are the user passing multiple values so comma-delimit & wrap each in a string
                        filterValue = filter.value
                            ?.split(',')
                            .map((value) => `'${value.trim()}'`)
                            .join(',');
                    } else {
                        // All other values are simply wrapped in a string
                        filterValue = `'${filter.value}'`;
                    }

                    whereClause += `(${filter?.field?.value} ${filter.operator.value} (${filterValue}))`;
                } else {
                    if (
                        filter?.field.fieldType === 'String' ||
                        filter?.field.fieldType === 'Date' ||
                        filter?.field.fieldType === 'DateTime' ||
                        filter?.field.fieldType === 'ID' ||
                        filter?.field.fieldType === 'Object' ||
                        (filter?.field.fieldType === 'Component' && !filter?.field?.isObjectLifecycleStateField)
                    ) {
                        // Wrap all String/Date/DateTime/ID/Object values in a string
                        whereClause += `(${filter?.field?.value} ${filter.operator.value} '${filter.value}')`;
                    } else if (filter?.field.fieldType === 'Picklist' || filter?.field?.isObjectLifecycleStateField) {
                        // Wrap all Picklists and ObjectLCState values in their own string
                        whereClause += `(${filter?.field?.value} ${filter.operator.value} '${filter.value.value}')`;
                    } else {
                        // Everything else gets the raw value
                        whereClause += `(${filter?.field?.value} ${filter.operator.value} ${filter.value})`;
                    }
                }
            });
        }

        const queryString = `SELECT ${fieldsString} \nFROM ${selectedQueryTarget?.value} ${whereClause}`;

        setCode(queryString);
    };

    /**
     * Returns true if the current query can be built, otherwise false (e.g. if there are empty filters)
     */
    const canBuildQuery = () => {
        /*
            Cannot build a query if:
                No selected object
                No selected fields
                Empty field/operator/value rows in the where clause
         */
        let canBuild = true;

        if (!selectedQueryTarget?.value || selectedFields.length === 0) {
            canBuild = false;
        }

        if (selectedFilters?.length > 0) {
            selectedFilters.forEach((filter) => {
                if (!filter?.field || !filter?.operator || !filter?.value) {
                    canBuild = false;
                }
            });
        }

        return canBuild;
    };

    /**
     * Returns the supported operator options for a provided field type
     * @param fieldType
     */
    const getOperatorOptions = (fieldType) => {
        const supportedOperators = supportedQueryFilterOperators[fieldType] || supportedQueryFilterOperators['Default'];
        return convertArrayToSelectOptions(supportedOperators);
    };

    const booleanValueOptions = convertArrayToSelectOptions(booleanValues);

    /**
     * Creates an empty, new query filter row.
     */
    const addNewFilterRow = () => {
        const newFilterRow = {
            field: '',
            operator: '',
            value: '',
        };

        setSelectedFilters((prevFilters) => [...prevFilters, newFilterRow]);
    };

    /**
     * Creates a new query filter row based on the previous query results.
     */
    const addPreviousResultsFilterRow = () => {
        const newFilterRow = {
            field: { value: previousQueryResults?.relationship, label: previousQueryResults?.relationship },
            operator: { value: 'CONTAINS', label: 'CONTAINS' },
            value: previousQueryResults?.values?.map((value) => ({ value: value, label: value })),
        };

        setSelectedFilters((prevFilters) => [...prevFilters, newFilterRow]);
    };

    /**
     * Removes a row from the selected filters.
     * @param {Number} rowToRemove - index of the row to remove
     */
    const removeFilterRow = (rowToRemove) => {
        const updatedSelectedFilters = selectedFilters.filter((_, filterRowIndex) => {
            return filterRowIndex !== rowToRemove;
        });

        setSelectedFilters(updatedSelectedFilters);
    };

    /**
     * Handles updates to the selected query filters.
     * @param {String} newValue - new value of the field being updated
     * @param {Number} rowIndex - index of the updated row
     * @param {String} field - field being updated
     */
    const handleSelectedFilterEdits = (newValue, rowIndex, field) => {
        const rowIndexAsNumber = Number(rowIndex);
        const previousFilterRow = selectedFilters[rowIndexAsNumber];

        const updatedSelectedFilters = [...selectedFilters];
        updatedSelectedFilters[rowIndexAsNumber] = {
            ...updatedSelectedFilters[rowIndexAsNumber],
            [field]: newValue,
        };

        // If the field has been updated to a Picklist or LC State, load the appropriate options
        if (field === 'field' && newValue?.fieldType === 'Picklist') {
            // Document fields provide the picklist entry names, not a reference to the picklist, so load those directly
            if (newValue?.picklistEntries) {
                const picklistOptions = newValue?.picklistEntries?.map((picklistValue) => ({
                    value: picklistValue,
                    label: picklistValue,
                }));

                setPicklistValueOptions(picklistOptions);
            } else if (newValue?.picklist) {
                fetchPicklistValues(newValue.picklist);
            }
        } else if (field === 'field' && newValue?.isObjectLifecycleStateField) {
            fetchObjectLifecycleStateValues(`Objectlifecycle.${newValue.lifecycle}`);
        }

        /*
             Clear existing values if:
             - The field was a Picklist (or Obj LC State) and operator changed from CONTAINS to anything else (or vice versa)
             - The field type changed (e.g. String to Picklist)
             - The field changed to or from an Object LC State field
             - The field was changed to a different Picklist
         */
        if (
            ((previousFilterRow?.field?.fieldType === 'Picklist' ||
                previousFilterRow?.field?.isObjectLifecycleStateField) &&
                previousFilterRow?.operator?.value === 'CONTAINS' &&
                updatedSelectedFilters[rowIndexAsNumber]?.operator?.value !== 'CONTAINS') ||
            (previousFilterRow?.operator?.value !== 'CONTAINS' &&
                updatedSelectedFilters[rowIndexAsNumber]?.operator?.value === 'CONTAINS') ||
            updatedSelectedFilters[rowIndexAsNumber]?.field?.fieldType !== previousFilterRow?.field?.fieldType ||
            updatedSelectedFilters[rowIndexAsNumber]?.field?.isObjectLifecycleStateField !==
                previousFilterRow?.field?.isObjectLifecycleStateField ||
            (field === 'field' && newValue?.picklist && newValue?.picklist !== previousFilterRow?.field?.picklist)
        ) {
            updatedSelectedFilters[rowIndexAsNumber] = {
                ...updatedSelectedFilters[rowIndexAsNumber],
                value: '',
            };
        }

        setSelectedFilters(updatedSelectedFilters);
    };

    const queryCategoryOptions = convertArrayToSelectOptions(queryCategories);

    /**
     * If there is every only one query target option, load that as the default query target
     */
    useEffect(() => {
        if (queryTargetOptions?.length === 1) {
            setSelectedQueryTarget(queryTargetOptions[0]);
        }
    }, [queryTargetOptions]);

    /**
     * When the selected query target changes, clear the fields and re-load them for the new target.
     */
    useEffect(() => {
        setFieldOptions([]);
        setSelectedFields([]);
        setSelectedFilters([]);

        if (selectedQueryTarget?.value && selectedQueryCategory?.value) {
            switch (selectedQueryCategory?.value) {
                case 'Objects':
                    fetchObjectMetadata();
                    break;
                case 'Documents':
                    loadDocumentQueryTargetMetadata();
                    break;
                case 'Document Roles':
                    loadDocumentRoleQueryTargetMetadata();
                    break;
                case 'Document Relationships':
                    loadDocumentRelationshipsQueryTargetMetadata();
                    break;
                case 'Matched Documents':
                    loadMatchedDocumentsQueryTargetMetadata();
                    break;
                case 'Binders':
                    switch (selectedQueryTarget?.value) {
                        case 'binders':
                            loadBinderQueryTargetMetadata();
                            break;
                        case 'binder_node__sys':
                            loadBinderNodesQueryTargetMetadata();
                            break;
                        default:
                    }
                    break;
                case 'Users':
                    loadUsersQueryTargetMetadata();
                    break;
                case 'Renditions':
                    loadRenditionsQueryTargetMetadata();
                    break;
                case 'Jobs':
                    switch (selectedQueryTarget?.value) {
                        case 'job_instance__sys':
                            loadJobInstanceQueryTargetMetadata();
                            break;
                        case 'job_history__sys':
                            loadJobHistoryQueryTargetMetadata();
                            break;
                        case 'job_task_history__sys':
                            loadJobTaskHistoryQueryTargetMetadata();
                            break;
                        default:
                    }
                    break;
                case 'Groups':
                    switch (selectedQueryTarget?.value) {
                        case 'group__sys':
                            loadGroupQueryTargetMetadata();
                            break;
                        case 'group_membership__sys':
                            loadGroupMembershipQueryTargetMetadata();
                            break;
                        default:
                    }
                    break;
                case 'Workflows':
                    switch (selectedQueryTarget?.value) {
                        case 'active_workflow__sys':
                            loadActiveWorkflowObjectsQueryTargetMetadata();
                            break;
                        case 'inactive_workflow__sys':
                            loadInactiveWorkflowObjectsQueryTargetMetadata();
                            break;
                        case 'active_workflow_item__sys':
                            loadActiveWorkflowItemsQueryTargetMetadata();
                            break;
                        case 'inactive_workflow_item__sys':
                            loadInactiveWorkflowItemsQueryTargetMetadata();
                            break;
                        case 'active_workflow_task__sys':
                            loadActiveWorkflowTaskQueryTargetMetadata();
                            break;
                        case 'inactive_workflow_task__sys':
                            loadInactiveWorkflowTaskQueryTargetMetadata();
                            break;
                        case 'active_workflow_task_item__sys':
                            loadActiveWorkflowTaskItemQueryTargetMetadata();
                            break;
                        case 'inactive_workflow_task_item__sys':
                            loadInactiveWorkflowTaskItemQueryTargetMetadata();
                            break;
                        default:
                    }
                    break;
                default:
            }
        }
    }, [
        selectedQueryTarget,
        fetchObjectMetadata,
        loadDocumentQueryTargetMetadata,
        loadDocumentRoleQueryTargetMetadata,
        loadDocumentRelationshipsQueryTargetMetadata,
        loadMatchedDocumentsQueryTargetMetadata,
        loadBinderQueryTargetMetadata,
        loadBinderNodesQueryTargetMetadata,
        loadUsersQueryTargetMetadata,
        loadRenditionsQueryTargetMetadata,
        loadJobInstanceQueryTargetMetadata,
        loadJobHistoryQueryTargetMetadata,
        loadJobTaskHistoryQueryTargetMetadata,
        loadGroupQueryTargetMetadata,
        loadGroupMembershipQueryTargetMetadata,
        loadActiveWorkflowObjectsQueryTargetMetadata,
        loadInactiveWorkflowObjectsQueryTargetMetadata,
        loadActiveWorkflowItemsQueryTargetMetadata,
        loadInactiveWorkflowItemsQueryTargetMetadata,
        loadActiveWorkflowTaskQueryTargetMetadata,
        loadInactiveWorkflowTaskQueryTargetMetadata,
        loadActiveWorkflowTaskItemQueryTargetMetadata,
        loadInactiveWorkflowTaskItemQueryTargetMetadata,
        selectedQueryCategory,
    ]);

    /**
     * When the selected query category changes, clear the query target and reload the query target options
     */
    useEffect(() => {
        setSelectedQueryTarget(null); // Must set to null so the current option clears from React-Select
        setQueryTargetOptions([]);

        if (selectedQueryCategory?.value) {
            switch (selectedQueryCategory?.value) {
                case 'Objects':
                    fetchVaultObjects();
                    break;
                case 'Documents':
                    loadDocumentQueryTargetOptions();
                    break;
                case 'Document Roles':
                    loadDocumentRoleQueryTargetOptions();
                    break;
                case 'Document Relationships':
                    loadDocumentRelationshipsQueryTargetOptions();
                    break;
                case 'Matched Documents':
                    loadMatchedDocumentsQueryTargetOptions();
                    break;
                case 'Binders':
                    loadBinderQueryTargetOptions();
                    break;
                case 'Users':
                    loadUsersQueryTargetOptions();
                    break;
                case 'Renditions':
                    loadRenditionsQueryTargetOptions();
                    break;
                case 'Jobs':
                    loadJobsQueryTargetOptions();
                    break;
                case 'Groups':
                    loadGroupsQueryTargetOptions();
                    break;
                case 'Workflows':
                    loadWorkflowQueryTargetOptions();
                    break;
                default:
            }
        }
    }, [
        selectedQueryCategory,
        loadDocumentQueryTargetOptions,
        loadDocumentRoleQueryTargetOptions,
        loadDocumentRelationshipsQueryTargetOptions,
        loadMatchedDocumentsQueryTargetOptions,
        loadBinderQueryTargetOptions,
        loadUsersQueryTargetOptions,
        loadRenditionsQueryTargetOptions,
        loadJobsQueryTargetOptions,
        loadGroupsQueryTargetOptions,
        loadWorkflowQueryTargetOptions,
    ]);

    return {
        queryCategoryOptions,
        selectedQueryCategory,
        setSelectedQueryCategory,
        queryTargetOptions,
        queryTargetsError,
        loadingQueryTargets,
        selectedQueryTarget,
        setSelectedQueryTarget,
        fieldOptions,
        fieldOptionsError,
        loadingFieldMetadata,
        selectedFields,
        setSelectedFields,
        selectedFilters,
        logicalOperator,
        setLogicalOperator,
        getOperatorOptions,
        booleanValueOptions,
        picklistValueOptions,
        objectLifecycleStateOptions,
        handleSelectedFilterEdits,
        addNewFilterRow,
        removeFilterRow,
        addPreviousResultsFilterRow,
        buildQuery,
        canBuildQuery,
    };
}
