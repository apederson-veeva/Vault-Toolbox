import { useCallback, useEffect, useMemo, useState } from 'react';
import { VaultRecordField } from './useDataReducer';
import { createListCollection } from '@chakra-ui/react';
import { Column } from '@tanstack/react-table';

interface UseMultiSelectColumnFilterProps {
    column: Column<any, unknown>;
    dataRows: VaultRecordField[] | undefined;
}

export default function useMultiSelectColumnFilter({ dataRows, column }: UseMultiSelectColumnFilterProps) {
    const [checkedItems, setCheckedItems] = useState<string[]>([]);

    /*
        Build the list of possible filter values
     */
    const possibleFilterValues = useMemo(() => {
        if (!dataRows) {
            return createListCollection({ items: [] });
        }

        const allRowValues: any = dataRows.map((value: VaultRecordField) => {
            return value?.type;
        });

        const uniqueValues = new Set(allRowValues);
        return createListCollection({
            items: Array.from(uniqueValues),
        });
    }, [dataRows]);

    /*
        Handle checkbox changes
     */
    const handleChecked = useCallback((checked: string | boolean, option: string) => {
        if (checked) {
            setCheckedItems((prev) => [...prev, option]);
        } else {
            setCheckedItems((prev) => prev.filter((item) => item !== option));
        }
    }, []);

    /*
        Handle clearing all filter selections
     */
    const clearFilters = useCallback(() => {
        setCheckedItems([]);
        column.setFilterValue(undefined);
    }, [column]);

    /*
        Update the filter value whenever checkedItems array changes
     */
    useEffect(() => {
        column.setFilterValue(checkedItems.length > 0 ? checkedItems : undefined);
    }, [checkedItems, column]);

    return {
        checkedItems,
        possibleFilterValues,
        clearFilters,
        handleChecked,
    };
}
