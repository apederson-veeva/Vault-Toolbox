import { Box, Table, Center, Spinner } from '@chakra-ui/react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useMemo, useRef } from 'react';
import { isSandboxVault } from '../../services/SharedServices';

/**
 * Renders a high-performance table with row virtualization
 *
 * @param {Array<string>} headers - Array of column header names
 * @param {Array<Array>} data - 2D array of table data
 * @param {boolean} loading - Loading state flag
 * @param {string} chakraTableSize - Size variant for Chakra UI table
 * @param {string|number} tableHeight - Height of the table container
 *
 * @returns {JSX.Element} A virtualized table component
 */
export default function VirtualizedTable({ headers, data, loading, chakraTableSize, tableHeight }) {
    const parentRef = useRef(null);

    // Memoized table configuration
    const tableColumns = useMemo(() => {
        return headers.map((header, index) => ({
            header,
            footer: (props) => props.column.id,
            accessorKey: header,
            // Last column expands to fill space, others have fixed width
            size: index === headers.length - 1 ? 'undefined' : '0',
        }));
    }, [headers]);

    // Transform raw data into format required by react-table
    const tableData = useMemo(() => {
        return data.map((row) => {
            return headers.reduce((acc, header, index) => {
                acc[header] = row[index];
                return acc;
            }, {});
        });
    }, [data, headers]);

    const table = useReactTable({
        data: tableData,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
    });
    const { rows } = table.getRowModel();

    // Configure virtualization
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35, // Estimated row height
        overscan: 50, // Number of rows to render beyond visible area
    });

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    /**
     * Add prefix and suffix paddingrows to handle sticky header disappearing when scrolling
     * @see {@link https://github.com/TanStack/virtual/issues/640}
     */
    const getPrefixHeight = () => {
        const firstRow = virtualItems[0];
        return firstRow?.index > 0 ? firstRow.start : 0;
    };

    const getSuffixHeight = () => {
        const lastRow = virtualItems[virtualItems.length - 1];
        return lastRow?.index < rows.length - 1 ? totalSize - lastRow.end : 0;
    };

    return (
        <>
            {!loading ? (
                <Box ref={parentRef} height={tableHeight} {...BoxStyle}>
                    <Box height={`${virtualizer.getTotalSize()}px`}>
                        <Table.Root size={chakraTableSize} {...TableStyle} stickyHeader>
                            <Table.Header>
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <Table.Row
                                        key={headerGroup.id}
                                        backgroundColor={
                                            isSandboxVault() ? 'veeva_sandbox_green.500' : 'veeva_midnight_indigo.500'
                                        }
                                    >
                                        {headerGroup.headers.map((header) => (
                                            <Table.ColumnHeader
                                                key={header.id}
                                                width={`${header.getSize()}px`}
                                                color='white'
                                            >
                                                {flexRender(header.column.columnDef.header, header.getContext())}
                                            </Table.ColumnHeader>
                                        ))}
                                    </Table.Row>
                                ))}
                            </Table.Header>
                            <Table.Body>
                                <Table.Row height={`${getPrefixHeight()}px`} />
                                {virtualizer.getVirtualItems().map((virtualRow) => {
                                    const row = rows[virtualRow.index];

                                    return (
                                        <Table.Row key={row.id}>
                                            {row.getVisibleCells().map((cell) => (
                                                <Table.Cell
                                                    key={cell.id}
                                                    whiteSpace='nowrap'
                                                    overflow='hidden'
                                                    textOverflow='ellipsis'
                                                    width={cell.column.columnDef.size === 0 ? 'min-content' : undefined}
                                                >
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </Table.Cell>
                                            ))}
                                        </Table.Row>
                                    );
                                })}
                                <Table.Row height={`${getSuffixHeight()}px`} />
                            </Table.Body>
                        </Table.Root>
                    </Box>
                </Box>
            ) : (
                <Center>
                    <Spinner />
                </Center>
            )}
        </>
    );
}

const BoxStyle = {
    overflow: 'auto',
    width: '100%',
    borderWidth: '1px',
    fontSize: 'md',
};

const TableStyle = {
    width: '100%',
    layout: 'fixed',
};
