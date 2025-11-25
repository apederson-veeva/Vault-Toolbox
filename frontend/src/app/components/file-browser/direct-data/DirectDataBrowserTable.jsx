import { Table } from '@chakra-ui/react';
import useFolderContents from '../../../hooks/file-browser/useFolderContents';
import { isSandboxVault } from '../../../services/SharedServices';
import { Toaster } from '../../shared/ui-components/toaster';
import DownloadProgressModal from '../DownloadProgressModal';
import DirectDataVirtualizedTable from './DirectDataVirtualizedTable';

const DIRECT_DATA_TABLE_HEADERS = ['kind', 'name', 'start_time', 'stop_time', 'size', 'record_count', 'fileparts'];

export default function DirectDataBrowserTable({
    directDataTree,
    tableHeight,
    selectedDirectDataFolder,
    downloadingDirectDataFileName,
    handleDownloadDirectDataItemClick,
    selectedDirectDataSearchResult,
    downloadDirectDataItemStatus,
    setDownloadDirectDataItemStatus,
    isFileDownloadModalOpen,
    setIsFileDownloadModalOpen,
    closeDownloadModal,
}) {
    const { fileData } = useFolderContents({ fileTree: directDataTree, selectedFolder: selectedDirectDataFolder });

    return (
        <>
            {fileData?.length > 0 ? (
                <DirectDataVirtualizedTable
                    tableHeight={`${tableHeight}px`}
                    headers={DIRECT_DATA_TABLE_HEADERS}
                    data={fileData}
                    downloadingDirectDataFileName={downloadingDirectDataFileName}
                    handleDownloadDirectDataItemClick={handleDownloadDirectDataItemClick}
                    selectedDirectDataSearchResult={selectedDirectDataSearchResult}
                    selectedDirectDataFolder={selectedDirectDataFolder}
                    setIsFileDownloadModalOpen={setIsFileDownloadModalOpen}
                />
            ) : (
                <Table.Root backgroundColor='veeva_sunset_yellow.five_percent_opacity' size='md' variant='simple'>
                    <Table.Header
                        {...TableHeaderStyle}
                        backgroundColor={isSandboxVault() ? 'veeva_sandbox_green.500' : 'veeva_midnight_indigo.500'}
                    >
                        <Table.Row>
                            {DIRECT_DATA_TABLE_HEADERS.map((headerValue, headerCount) => (
                                <Table.ColumnHeader key={headerCount} {...TableHeaderStyle}>
                                    {headerValue}
                                </Table.ColumnHeader>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell {...TableCellStyle} colSpan='7' textAlign='center'>
                                NO ITEMS FOUND
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            )}
            <DownloadProgressModal
                isModalOpen={isFileDownloadModalOpen}
                closeModal={closeDownloadModal}
                downloadingFileName={downloadingDirectDataFileName}
                downloadStatus={downloadDirectDataItemStatus}
                setDownloadStatus={setDownloadDirectDataItemStatus}
            />
            <Toaster />
        </>
    );
}

const TableHeaderStyle = {
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

const TableCellStyle = {
    borderBottom: 'solid thin',
    borderColor: 'gray.300',
    verticalAlign: 'center',
    fontSize: '16px',
    whiteSpace: 'nowrap',
};
