import { useCallback, useEffect, useReducer, useState } from 'react';
import {
    query,
    retrieveAllComponentMetadata,
    retrieveObjectCollection,
    retrieveObjectMetadata,
} from '../../services/ApiService';
import { useDataReducer, VaultRecord, VaultRecordField } from './useDataReducer';
import { toaster } from '../../components/shared/ui-components/toaster';
import {
    buildFieldNames,
    buildRecordDataRows,
    executeRecordQuery,
    fetchObjectFields,
    fetchUserNamesForRecord,
    parseAndValidateInput,
    VaultObject,
} from '../../utils/data-navigator/DataNavigatorHelper';

const TAB_LIMIT = 10;

export default function useDataNavigator() {
    const [vaultObjects, setVaultObjects] = useState<VaultObject[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [loadingRecord, setLoadingRecord] = useState<boolean>(false);
    const [selectedTab, setSelectedTab] = useState<string>('defaultTab');
    const [componentTypes, setComponentTypes] = useState<string[]>([]);

    const [records, dispatch] = useReducer(useDataReducer, new Map());

    /**
     * Fetches all data for a Vault record and adds it to Data Navigator as a new tab.
     *
     * It parses and validates the input, fetches the metadata for the object, builds a list of fields to query, and
     * executes a record query. It also performs secondary lookups for related records names (including users).
     *
     * It formats the combined data into a structured `VaultRecord` object, dispatches an action to add it to app state,
     * and sets the new record's tab as active.
     *
     * Error handling is incorporated throughout to provide clear user feedback.
     */
    const getRecordData = useCallback(
        async ({
            recordId: initialRecordId,
            objectName: initialObjectName,
        }: {
            recordId?: string;
            objectName?: string;
        }) => {
            if (records.size >= TAB_LIMIT) {
                showErrorNotification({
                    title: `Tab limit reached (${TAB_LIMIT})`,
                    description: 'Close an existing tab to continue',
                });
                return;
            }

            setLoadingRecord(true);
            try {
                const vaultObjectsMetadata: VaultObject[] =
                    vaultObjects.length > 0 ? vaultObjects : await retrieveObjectCollectionMetadata();

                const { recordId, objectName, inputError } = parseAndValidateInput({
                    initialRecordId,
                    initialObjectName,
                    userInput,
                    vaultObjectsMetadata,
                });
                if (inputError || !recordId || !objectName) {
                    showErrorNotification({
                        title: 'Invalid input',
                        description: inputError || 'Could not determine a valid record or object from the input',
                    });
                    return;
                }

                const { fields: objectFields, error: fetchObjectFieldsError } = await fetchObjectFields(objectName);
                if (fetchObjectFieldsError || !objectFields) {
                    showErrorNotification({
                        title: `Failed to load metadata for ${objectName}`,
                        description: fetchObjectFieldsError,
                    });
                    return;
                }

                const { objectFieldNames, relatedObjectNames, usersObjectFieldNames } = buildFieldNames(objectFields);
                const queryFields = [...objectFieldNames, ...relatedObjectNames];

                const { queryResponse, queryError } = await executeRecordQuery({ recordId, objectName, queryFields });
                if (queryError || !queryResponse) {
                    showErrorNotification({
                        title: `Failed to load record: ${recordId}`,
                        description: queryError || 'Record not found',
                    });
                    return;
                }

                // If we have references to the 'users' object, get their values and query for their name
                const usersObjectNamesMap = await fetchUserNamesForRecord(usersObjectFieldNames, queryResponse.data);

                const recordDataRows: VaultRecordField[] = buildRecordDataRows({
                    queryDescribeFields: queryResponse?.queryDescribe?.fields,
                    queryDataRow: queryResponse?.data[0],
                    objectFields,
                    usersObjectNamesMap,
                });

                // Create the full VaultRecord object
                const newRecord: VaultRecord = {
                    // Wrap id in String b/c some objects have numeric ids (e.g. user__sys), which JS will
                    // convert to a Number, which can cause issues with our Reducer logic
                    id: String(recordId),
                    objectName: queryResponse.queryDescribe?.object?.name,
                    objectLabel: queryResponse.queryDescribe?.object?.label,
                    rows: recordDataRows,
                };

                // Dispatch the action to add the new record to our main state
                dispatch({
                    type: 'ADD_RECORD',
                    payload: { newRecord },
                });

                setSelectedTab(newRecord.id);
            } catch (e: any) {
                console.error(e);
                showErrorNotification({
                    title: 'Unexpected error occurred',
                    description: e.message || 'Check console for details',
                });
            } finally {
                setLoadingRecord(false);
            }
        },
        [userInput, records],
    );

    /**
     * Call the Retrieve Object Collection endpoint. Creates an array of Vault objects (name/label/prefix); stores the
     * array in state and returns it directly for immediate use.
     */
    const retrieveObjectCollectionMetadata = async () => {
        const objectResponse = await retrieveObjectCollection();

        if (objectResponse?.responseStatus === 'SUCCESS') {
            const vaultObjectsArray: VaultObject[] = objectResponse?.objects?.map((object: any) => {
                return {
                    label: object.label,
                    name: object.name,
                    prefix: object.prefix,
                };
            });

            const sortedObjectCollectionMetadata: VaultObject[] = vaultObjectsArray.sort();
            setVaultObjects(sortedObjectCollectionMetadata);

            return sortedObjectCollectionMetadata;
        } else {
            return [];
        }
    };

    /**
     * Retrieve all Vault component types and load them into state. Can be used to determine which component types we
     * can view MDL for.
     */
    const retrieveComponentTypes = async () => {
        interface ComponentType {
            name: string;
            class: string;
        }

        interface MetaDataComponentTypeBulkResponse {
            responseStatus: string;
            data: ComponentType[];
        }

        const allComponentMetadataResponse: MetaDataComponentTypeBulkResponse = await retrieveAllComponentMetadata();
        if (allComponentMetadataResponse?.responseStatus === 'FAILURE' || !allComponentMetadataResponse?.data) {
            return;
        }

        const componentTypesArray: string[] = [];
        allComponentMetadataResponse?.data?.map((componentType: ComponentType) => {
            const componentName = componentType?.name;

            // Do not yet support loading code components
            if (componentType?.class === 'code') {
                return;
            }

            // Legacy workflows cannot be retrieved
            if (componentName === 'Workflow') {
                return;
            }

            componentTypesArray.push(componentName);
        });

        setComponentTypes(componentTypesArray);
    };

    /**
     * Handles removing a tab, and updates the selected tab if necessary
     * @param recordId - id of the record to remove
     */
    const removeTabHandler: (recordId: string) => void = (recordId: string) => {
        let newSelectedTabId: string = 'defaultTab';

        const recordsMapKeysArray: string[] = Array.from(records.keys());
        const indexOfKeyToRemove: number = recordsMapKeysArray.indexOf(recordId);

        const newRecordsMapKeysArray: string[] = [...recordsMapKeysArray];
        newRecordsMapKeysArray.splice(indexOfKeyToRemove, 1);

        // If selected tab was not removed, maintain focus there
        if (!newRecordsMapKeysArray.includes(selectedTab) && indexOfKeyToRemove !== -1) {
            const numberOfRemainingTabs: number = recordsMapKeysArray.length - 1;

            if (numberOfRemainingTabs >= 1) {
                // Default the new selected position to one left of the one deleted
                const newKeyPosition = indexOfKeyToRemove - 1;
                if (newKeyPosition >= 0) {
                    newSelectedTabId = recordsMapKeysArray[newKeyPosition];
                } else {
                    newSelectedTabId = newRecordsMapKeysArray[0];
                }

                setSelectedTab(newSelectedTabId);
            }
        }

        // Dispatch the action to add the new record to our main state
        dispatch({
            type: 'REMOVE_RECORD',
            payload: { recordId },
        });
    };

    /*
        On page load, retrieve the Vault's object collection metadata and component types. This is required to parse
        the record input (need to know the valid Object prefixes) and determine which components can be viewed (MDL)
     */
    useEffect(() => {
        retrieveObjectCollectionMetadata();
        retrieveComponentTypes();
    }, []);

    return {
        userInput,
        setUserInput,
        records,
        loadingRecord,
        getRecordData,
        selectedTab,
        setSelectedTab,
        removeTabHandler,
        componentTypes,
    };
}

interface ShowErrorNotificationProps {
    title: string;
    description: string;
    duration?: number;
}

/*
    Helper function for displaying error notifications (toasts)
 */
const showErrorNotification = ({ title, description, duration = 5000 }: ShowErrorNotificationProps) => {
    toaster.create({
        title,
        description,
        type: 'error',
        duration,
    });
};
