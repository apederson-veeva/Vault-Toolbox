import { Flex, Box, Table, TableRootProps } from '@chakra-ui/react';
import { isSandboxVault } from '../../services/SharedServices';
import { PiArrowCircleDownBold, PiArrowCircleUpBold } from 'react-icons/pi';
import { VaultRecordField, VaultRecord } from '../../hooks/data-navigator/useDataReducer';
import { flexRender } from '@tanstack/react-table';
import MultiSelectColumnFilter from './MultiSelectColumnFilter';
import useDataTable from '../../hooks/data-navigator/useDataTable';
import FieldTypeCell from './FieldTypeCell';
import FieldLabelCell from './FieldLabelCell';
import FieldValueCell from './FieldValueCell';
import SearchableColumnFilter from './SearchableColumnFilter';
import FieldNameCell from './FieldNameCell';
import { useState } from 'react';

interface DataTableProps {
    recordData: VaultRecord | undefined;
    getRecordData: ({ recordId, objectName }: { recordId?: string; objectName?: string }) => void;
    componentTypes: string[];
}

export default function DataTable({ recordData, getRecordData, componentTypes }: DataTableProps) {
    const { table } = useDataTable({ recordData });
    const [hoveredRow, setHoveredRow] = useState<number | null>(null);

    return (
        <Table.Root {...TableStyle}>
            <Table.Header {...ThStyle}>
                {table.getHeaderGroups().map((headerGroup) => (
                    <Table.Row
                        backgroundColor={isSandboxVault() ? 'veeva_sandbox_green.500' : 'veeva_midnight_indigo.500'}
                        key={headerGroup.id}
                    >
                        {headerGroup.headers.map((header) => (
                            <Table.ColumnHeader
                                key={header.id}
                                onClick={header.column.getToggleSortingHandler()}
                                _hover={header.column.getCanSort() ? { cursor: 'pointer' } : undefined}
                                {...ThStyle}
                            >
                                <Flex alignItems='center' gap={1}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                    {header.column.getIsSorted() === 'asc' ? (
                                        <PiArrowCircleUpBold />
                                    ) : header.column.getIsSorted() === 'desc' ? (
                                        <PiArrowCircleDownBold />
                                    ) : null}
                                    {header.column.getCanFilter() ? (
                                        <Box onClick={(e) => e.stopPropagation()}>
                                            {header.column.id === 'type' ? (
                                                <MultiSelectColumnFilter
                                                    column={header.column}
                                                    dataRows={recordData?.rows}
                                                />
                                            ) : (
                                                <SearchableColumnFilter column={header.column} />
                                            )}
                                        </Box>
                                    ) : null}
                                </Flex>
                            </Table.ColumnHeader>
                        ))}
                    </Table.Row>
                ))}
            </Table.Header>
            <Table.Body>
                {table.getRowModel().rows.map((row, index) => (
                    <Table.Row
                        key={row.id}
                        backgroundColor='veeva_sunset_yellow.five_percent_opacity'
                        onMouseEnter={() => setHoveredRow(index)}
                        onMouseLeave={() => setHoveredRow(null)}
                        _hover={{
                            backgroundColor: 'beige_color_mode',
                        }}
                    >
                        {row.getVisibleCells().map((cell) => {
                            const cellData: VaultRecordField = cell.getContext().row.original;

                            return (
                                <Table.Cell key={cell.id} {...TdStyle}>
                                    {cell.column.id === 'label' && <FieldLabelCell cellData={cellData} />}
                                    {cell.column.id === 'name' && <FieldNameCell cellData={cellData} />}
                                    {cell.column.id === 'type' && <FieldTypeCell cellData={cellData} />}
                                    {cell.column.id === 'value' && (
                                        <FieldValueCell
                                            cellData={cellData}
                                            objectName={recordData?.objectName}
                                            getRecordData={getRecordData}
                                            componentTypes={componentTypes}
                                            isHovered={hoveredRow === index}
                                        />
                                    )}
                                </Table.Cell>
                            );
                        })}
                    </Table.Row>
                ))}
            </Table.Body>
        </Table.Root>
    );
}

const TableStyle: TableRootProps = {
    backgroundColor: 'white_color_mode',
    size: 'md',
    variant: 'line',
    stickyHeader: true,
    tableLayout: 'fixed',
};

const ThStyle = {
    color: 'white',
    textAlign: 'left',
    whiteSpace: 'nowrap',
    top: 0,
    position: 'sticky',
    border: 'none',
    textTransform: 'uppercase',
    fontSize: 'md',
    zIndex: 1,
};

const TdStyle = {
    borderBottom: 'solid thin',
    borderColor: 'gray.300',
    verticalAlign: 'center',
    fontSize: '12px',
    fontWeight: 'bold',
    whiteSpace: 'nowrap',
    textAlign: 'left',
};
