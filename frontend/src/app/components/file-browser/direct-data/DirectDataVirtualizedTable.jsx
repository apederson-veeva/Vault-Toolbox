import { Box, Table, Icon, IconButton } from '@chakra-ui/react';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { useVirtualizer } from '@tanstack/react-virtual';
import { useEffect, useMemo, useRef, useState } from 'react';
import { PiDownloadSimple, PiFileZip } from 'react-icons/pi';
import { formatBytesToUserFriendlyFormat, formatDateTime, isSandboxVault } from '../../../services/SharedServices';
import { Tooltip } from '../../shared/ui-components/tooltip';

/**
 * Renders a high-performance table with row virtualization
 */
export default function DirectDataVirtualizedTable({
    headers,
    data,
    tableHeight,
    downloadingDirectDataFileName,
    handleDownloadDirectDataItemClick,
    selectedDirectDataSearchResult,
    selectedDirectDataFolder,
    setIsFileDownloadModalOpen,
}) {
    const parentRef = useRef(null);
    const [highlightedRowId, setHighlightedRowId] = useState(null);
    const [hoveredRow, setHoveredRow] = useState(null);

    // Memoized table configuration
    const tableColumns = useMemo(() => {
        const dataColumns = headers.map((header) => {
            if (header.toLowerCase() === 'size') {
                return {
                    header: header,
                    accessorKey: `data.${header}`,
                    cell: (info) => {
                        const value = info.getValue();
                        return value ? formatBytesToUserFriendlyFormat(value) : '-';
                    },
                };
            } else if (header.toLowerCase() === 'start_date' || header.toLowerCase() === 'stop_date') {
                return {
                    header: header,
                    accessorKey: `data.${header}`,
                    cell: (info) => {
                        const value = info.getValue();
                        return value ? formatDateTime(value) : '-';
                    },
                };
            }
            return {
                header: header,
                accessorKey: `data.${header}`,
            };
        });

        return [
            ...dataColumns,
            {
                id: 'actions',
                header: '',
                size: 80,
                cell: (info) => {
                    const originalRowData = info.row.original;
                    const item = info.row.original;
                    const isDownloading = downloadingDirectDataFileName === item.data.name;

                    const isFolder = originalRowData.isFolder;

                    if (isFolder) {
                        return null;
                    }

                    return (
                        <Tooltip showArrow content='Download file' positioning={{ placement: 'top' }}>
                            <IconButton
                                {...IconButtonStyle}
                                style={{
                                    visibility: hoveredRow === info.row.id || isDownloading ? 'visible' : 'hidden',
                                    opacity: hoveredRow === info.row.id || isDownloading ? 1 : 0,
                                    transition: 'opacity 0.2s ease-in-out, visibility 0.2s',
                                }}
                                onClick={() =>
                                    handleDownloadDirectDataItemClick(originalRowData, setIsFileDownloadModalOpen)
                                }
                                aria-label='Download file'
                            >
                                <PiDownloadSimple />
                            </IconButton>
                        </Tooltip>
                    );
                },
            },
        ];
    }, [
        headers,
        handleDownloadDirectDataItemClick,
        downloadingDirectDataFileName,
        hoveredRow,
        setIsFileDownloadModalOpen,
    ]);

    const table = useReactTable({
        data: data,
        columns: tableColumns,
        getCoreRowModel: getCoreRowModel(),
    });
    const { rows } = table.getRowModel();

    // Configure virtualization
    const virtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 65, // Estimated row height in pixels
        overscan: 10, // Number of rows to render beyond visible area
    });

    const virtualItems = virtualizer.getVirtualItems();
    const totalSize = virtualizer.getTotalSize();

    /**
     * Add prefix and suffix padding rows to handle sticky header disappearing when scrolling
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

    useEffect(() => {
        if (virtualizer && selectedDirectDataSearchResult) {
            const rowIndex = rows.findIndex((row) => row.original.index === selectedDirectDataSearchResult.index);

            if (rowIndex !== -1) {
                if (rows[rowIndex].id !== highlightedRowId) {
                    virtualizer.scrollToIndex(rowIndex, { align: 'start', behavior: 'smooth' });
                    setHighlightedRowId(rows[rowIndex].id);
                }
            }
        }
    }, [selectedDirectDataSearchResult, virtualizer, rows, selectedDirectDataFolder, highlightedRowId]);

    useEffect(() => {
        if (highlightedRowId != null) {
            const timer = setTimeout(() => {
                setHighlightedRowId(null);
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [highlightedRowId]);

    useEffect(() => {
        setHighlightedRowId(null);
    }, [selectedDirectDataFolder]);

    return (
        <Box ref={parentRef} height={tableHeight} {...BoxStyle}>
            <Box height={`${virtualizer.getTotalSize()}px`}>
                <Table.Root
                    {...TableStyle}
                    backgroundColor='veeva_sunset_yellow.five_percent_opacity'
                    size='md'
                    variant='simple'
                    stickyHeader
                >
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
                                        {...ThStyle}
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

                            const isHighlighted = row.id === highlightedRowId;

                            return (
                                <Table.Row
                                    key={row.id}
                                    onMouseEnter={() => setHoveredRow(row.id)}
                                    onMouseLeave={() => setHoveredRow(null)}
                                    {...TdStyle}
                                    backgroundColor={isHighlighted ? 'veeva_orange_color_mode' : undefined}
                                    transition='background-color 0.5s ease-in-out'
                                    _hover={{
                                        bg: isHighlighted ? 'veeva_orange_color_mode' : 'beige_color_mode',
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.Cell
                                            {...TdStyle}
                                            height='40px'
                                            key={cell.id}
                                            whiteSpace='nowrap'
                                            overflow='hidden'
                                            textOverflow='ellipsis'
                                            textAlign={cell.column.id === 'actions' ? 'right' : 'left'}
                                            width={cell.column.columnDef.size === 0 ? 'min-content' : undefined}
                                        >
                                            {cell.column.id === 'data_kind' ? (
                                                <Icon as={PiFileZip} boxSize='6' />
                                            ) : (
                                                flexRender(cell.column.columnDef.cell, cell.getContext())
                                            )}
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
    );
}

const BoxStyle = {
    overflow: 'auto',
    width: '100%',
    border: 'none',
    fontSize: 'md',
};

const TableStyle = {
    width: '100%',
    layout: 'fixed',
};

const TdStyle = {
    borderBottom: 'solid thin',
    borderColor: 'gray.300',
    verticalAlign: 'center',
    fontSize: '16px',
    whiteSpace: 'nowrap',
};

const IconButtonStyle = {
    _hover: {
        backgroundColor: 'yellow_color_mode',
    },
    size: 'md',
    marginLeft: '8px',
    variant: 'ghost',
};

const ThStyle = {
    color: 'white',
    textAlign: 'left',
    width: '1%',
    whiteSpace: 'nowrap',
    _last: { width: '100%' },
    top: 0,
    border: 'none',
    textTransform: 'lowercase',
    fontSize: 'md',
};
