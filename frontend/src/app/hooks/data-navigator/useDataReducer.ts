export interface VaultRecordField {
    label: string;
    name: string;
    type: string;
    value: any;
    required: boolean;
    maxLength: number;
    picklist: string;
    formula: string | undefined;
    lookupRelationshipName: string | undefined;
    objectReferenceApiName: string | undefined;
    objectReferenceRecordName: any;
    isRollup: boolean | undefined;
    componentType: string | undefined;
}

export interface VaultRecord {
    id: string;
    objectName: string;
    objectLabel: string;
    rows: VaultRecordField[];
}

type RecordsMap = Map<string, VaultRecord>;

export type Action =
    | { type: 'ADD_RECORD'; payload: { newRecord: VaultRecord } }
    | { type: 'REMOVE_RECORD'; payload: { recordId: string } };

export function useDataReducer(records: RecordsMap, action: Action): RecordsMap {
    switch (action.type) {
        case 'ADD_RECORD': {
            const newRecordData: VaultRecord = action.payload.newRecord;
            const newRecordId = newRecordData.id;

            const newRecordsMap = new Map(records);
            newRecordsMap.set(newRecordId, newRecordData);

            return newRecordsMap;
        }

        case 'REMOVE_RECORD': {
            const recordIdToRemove = action.payload.recordId;

            if (!records.has(recordIdToRemove)) {
                return records;
            }

            const newRecordsMap = new Map(records);
            newRecordsMap.delete(recordIdToRemove);

            return newRecordsMap;
        }

        default:
            return records;
    }
}
