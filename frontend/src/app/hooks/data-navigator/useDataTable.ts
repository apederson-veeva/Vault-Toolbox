import { useMemo } from 'react';
import { VaultRecord, VaultRecordField } from './useDataReducer';
import {
    createColumnHelper,
    FilterFn,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    Row as TableRow,
} from '@tanstack/react-table';

export default function useDataTable({ recordData }: { recordData: VaultRecord | undefined }) {
    /**
     * Custom multi-select filter function for the data type column
     * @param row - table row data
     * @param columnId - id of the column being filtering by
     * @param filterValue - value of the filter
     */
    const multiSelectFilterFn: FilterFn<VaultRecordField> = (
        row: TableRow<VaultRecordField>,
        columnId: string,
        filterValue: any,
    ): boolean => {
        const rowValue = row.getValue(columnId);
        if (filterValue?.includes(rowValue)) {
            return true;
        }

        return false;
    };

    /**
     * Custom filter function for the field value column. Searches both the field value and object reference name.
     * @param row - table row data
     * @param columnId - id of the column being filtering by
     * @param filterValue - value of the filter
     */
    const fieldValueFilterFn: FilterFn<VaultRecordField> = (
        row: TableRow<VaultRecordField>,
        columnId: string,
        filterValue: any,
    ): boolean => {
        const rowValue = String(row.getValue(columnId))?.toLowerCase();
        const rowObjectReferenceName = String(row.original.objectReferenceRecordName)?.toLowerCase();
        const filterValueLowerCase = String(filterValue)?.toLowerCase();

        if (rowValue?.includes(filterValueLowerCase)) {
            return true;
        }

        if (rowObjectReferenceName?.includes(filterValueLowerCase)) {
            return true;
        }

        return false;
    };

    const columnHelper = createColumnHelper<VaultRecordField>();
    const tableColumns = useMemo(
        () => [
            columnHelper.accessor('label', {
                header: () => 'Label',
                cell: (info) => info.getValue(),
                enableColumnFilter: true,
            }),

            columnHelper.accessor('name', {
                header: () => 'Name',
                cell: (info) => info.getValue(),
                enableColumnFilter: true,
            }),

            columnHelper.accessor('type', {
                header: () => 'Data Type',
                cell: (info) => info.getValue(),
                enableSorting: false,
                enableColumnFilter: true,
                filterFn: multiSelectFilterFn,
            }),

            columnHelper.accessor('value', {
                header: () => 'Value',
                cell: (info) => info.getValue(),
                enableSorting: false,
                enableColumnFilter: true,
                filterFn: fieldValueFilterFn,
            }),
        ],
        [],
    );

    const table = useReactTable({
        data: recordData?.rows || [],
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getSortedRowModel: getSortedRowModel(),
        filterFns: {
            multiSelectFilterFn,
        },
    });

    return {
        table,
    };
}
