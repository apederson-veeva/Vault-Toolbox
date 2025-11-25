import {
    Flex,
    Popover,
    IconButton,
    Portal,
    Button,
    VStack,
    IconButtonProps,
    PopoverContentProps,
    ButtonProps,
} from '@chakra-ui/react';
import { Column } from '@tanstack/react-table';
import { VaultRecordField } from '../../hooks/data-navigator/useDataReducer';
import { PiFunnel, PiFunnelFill } from 'react-icons/pi';
import { Checkbox } from '../shared/ui-components/checkbox';
import useMultiSelectColumnFilter from '../../hooks/data-navigator/useMultiSelectColumnFilter';

interface MultiSelectColumnFilterProps {
    dataRows: VaultRecordField[] | undefined;
    column: Column<any, unknown>;
}

export default function MultiSelectColumnFilter({ dataRows, column }: MultiSelectColumnFilterProps) {
    const { checkedItems, possibleFilterValues, clearFilters, handleChecked } = useMultiSelectColumnFilter({
        dataRows,
        column,
    });

    return (
        <Popover.Root size='xs' positioning={{ placement: 'bottom-start' }}>
            <Popover.Trigger asChild>
                <IconButton {...FilterButtonStyle}>
                    {checkedItems.length > 0 ? <PiFunnelFill /> : <PiFunnel />}
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content {...PopoverContentStyle}>
                        <Popover.Header paddingBottom={0}>
                            <Flex justifyContent='flex-end'>
                                <Button
                                    {...ClearFilterButtonStyle}
                                    disabled={checkedItems.length === 0}
                                    onClick={clearFilters}
                                >
                                    Clear
                                </Button>
                            </Flex>
                        </Popover.Header>
                        <Popover.Body paddingTop={0}>
                            <VStack gap={2} align='stretch' maxHeight='50vh' overflow='auto'>
                                {possibleFilterValues.items.map((filterValue: any, index: any) => (
                                    <Checkbox
                                        variant='subtle'
                                        key={index}
                                        checked={checkedItems.includes(filterValue)}
                                        onCheckedChange={(e) => handleChecked(e.checked, filterValue)}
                                    >
                                        {String(filterValue)}
                                    </Checkbox>
                                ))}
                            </VStack>
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>
    );
}

const FilterButtonStyle: IconButtonProps = {
    variant: 'ghost',
    size: 'xs',
    color: 'veeva_orange_color_mode',
};

const ClearFilterButtonStyle: ButtonProps = {
    size: 'xs',
    variant: 'ghost',
    color: 'hyperlink_blue_color_mode',
};

const PopoverContentStyle: PopoverContentProps = {
    width: 'max-content',
    marginX: '10px',
    backgroundColor: 'white_color_mode',
};
