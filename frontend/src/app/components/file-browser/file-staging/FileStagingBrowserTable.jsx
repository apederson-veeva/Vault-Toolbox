import { Table } from '@chakra-ui/react';
import useConfirmFileStagingItemDeletion from '../../../hooks/file-browser/file-staging/useConfirmFileStagingItemDeletion';
import useFolderContents from '../../../hooks/file-browser/useFolderContents';
import { isSandboxVault } from '../../../services/SharedServices';
import { Toaster } from '../../shared/ui-components/toaster';
import DownloadProgressModal from '../DownloadProgressModal';
import FileStagingVirtualizedTable from '../file-staging/FileStagingVirtualizedTable';
import ConfirmFileOrFolderDeletion from './ConfirmFileOrFolderDeletion';

const FILE_STAGING_TABLE_HEADERS = ['kind', 'name', 'size', 'modified_date'];

export default function FileStagingBrowserTable({
    fileStagingTree,
    selectedFileStagingFolder,
    tableHeight,
    handleFileStagingFolderClick,
    handleDownloadFileStagingItemClick,
    downloadingFileStagingItemName,
    selectedFileStagingSearchResult,
    handleReloadFileStagingTreeFolder,
    isFileDownloadModalOpen,
    setIsFileDownloadModalOpen,
    closeDownloadModal,
    downloadFileStagingItemStatus,
    setDownloadFileStagingItemStatus,
}) {
    const { fileData } = useFolderContents({ fileTree: fileStagingTree, selectedFolder: selectedFileStagingFolder });

    const {
        isConfirmDeleteModalOpen,
        setIsConfirmDeleteModalOpen,
        closeConfirmDeleteModal,
        deleteConfirmationText,
        setDeleteConfirmationText,
        deletedItem,
        setDeletedItem,
        deleteFileStagingItem,
    } = useConfirmFileStagingItemDeletion({
        selectedFileStagingFolder,
        handleReloadFileStagingTreeFolder,
    });

    return (
        <>
            {fileData?.length > 0 ? (
                <FileStagingVirtualizedTable
                    tableHeight={`${tableHeight}px`}
                    headers={FILE_STAGING_TABLE_HEADERS}
                    data={fileData}
                    handleDownloadFileStagingItemClick={handleDownloadFileStagingItemClick}
                    handleFileStagingFolderClick={handleFileStagingFolderClick}
                    setIsConfirmDeleteModalOpen={setIsConfirmDeleteModalOpen}
                    setDeletedItem={setDeletedItem}
                    selectedFileStagingSearchResult={selectedFileStagingSearchResult}
                    selectedFileStagingFolder={selectedFileStagingFolder}
                    setIsFileDownloadModalOpen={setIsFileDownloadModalOpen}
                />
            ) : (
                <Table.Root backgroundColor='veeva_sunset_yellow.five_percent_opacity' size='md' variant='simple'>
                    <Table.Header
                        {...TableHeaderStyle}
                        backgroundColor={isSandboxVault() ? 'veeva_sandbox_green.500' : 'veeva_midnight_indigo.500'}
                    >
                        <Table.Row>
                            {FILE_STAGING_TABLE_HEADERS.map((headerValue, headerCount) => (
                                <Table.ColumnHeader key={headerCount} {...TableHeaderStyle}>
                                    {headerValue}
                                </Table.ColumnHeader>
                            ))}
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell {...TableCellStyle} colSpan='4' textAlign='center'>
                                NO ITEMS FOUND
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table.Root>
            )}
            <DownloadProgressModal
                isModalOpen={isFileDownloadModalOpen}
                closeModal={closeDownloadModal}
                downloadingFileName={downloadingFileStagingItemName}
                downloadStatus={downloadFileStagingItemStatus}
                setDownloadStatus={setDownloadFileStagingItemStatus}
            />
            <ConfirmFileOrFolderDeletion
                isConfirmDeleteModalOpen={isConfirmDeleteModalOpen}
                closeConfirmDeleteModal={closeConfirmDeleteModal}
                deleteFileStagingItem={deleteFileStagingItem}
                deletedItem={deletedItem}
                deleteConfirmationText={deleteConfirmationText}
                setDeleteConfirmationText={setDeleteConfirmationText}
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
