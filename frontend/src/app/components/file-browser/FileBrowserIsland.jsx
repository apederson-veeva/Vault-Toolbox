import { Box, Center, Flex, Spinner } from '@chakra-ui/react';
import { useRef } from 'react';
import { DIRECT_DATA, FILE_STAGING } from '../../hooks/file-browser/useFileBrowserTabs';
import useFileDownloadModal from '../../hooks/file-browser/useFileDownloadModal';
import useElementHeight from '../../hooks/shared/useElementHeight';
import useRemainingHeight from '../../hooks/shared/useRemainingHeight';
import VerticalResizeHandle from '../shared/VerticalResizeHandle';
import DirectDataBrowserBreadcrumb from './direct-data/DirectDataBrowserBreadcrumb';
import DirectDataBrowserTable from './direct-data/DirectDataBrowserTable';
import FileStagingBrowserBreadcrumb from './file-staging/FileStagingBrowserBreadcrumb';
import FileStagingBrowserTable from './file-staging/FileStagingBrowserTable';

export default function FileBrowserIsland({
    activeTab,
    fileStagingTree,
    selectedFileStagingFolder,
    handleReloadFileStagingTreeFolder,
    handleFileStagingFolderClick,
    handleDownloadFileStagingItemClick,
    loadingFileStagingTree,
    loadingFileStagingTreeFolder,
    selectedFileStagingSearchResult,
    downloadFileStagingItemStatus,
    setDownloadFileStagingItemStatus,
    directDataTree,
    selectedDirectDataFolder,
    downloadingDirectDataFileName,
    handleDownloadDirectDataItemClick,
    downloadingFileStagingItemName,
    loadingDirectDataTree,
    selectedDirectDataSearchResult,
    showFileStaging,
    showDirectData,
    downloadDirectDataItemStatus,
    setDownloadDirectDataItemStatus,
}) {
    const { isFileDownloadModalOpen, setIsFileDownloadModalOpen, closeDownloadModal } = useFileDownloadModal();
    const breadcrumbRef = useRef(null);

    const { elementHeight: containerHeight, elementRef: containerRef } = useElementHeight();
    const tableHeight = useRemainingHeight({
        refs: [breadcrumbRef],
        totalHeight: containerHeight,
        padding: 40,
    });

    const isLoading =
        activeTab === FILE_STAGING ? loadingFileStagingTree || loadingFileStagingTreeFolder : loadingDirectDataTree;

    return (
        <Flex {...ParentFlexStyle} ref={containerRef}>
            <VerticalResizeHandle />
            <Flex flexDirection='column' height='100%' width='100%' overflow='auto'>
                <Box ref={breadcrumbRef}>
                    {activeTab === FILE_STAGING && showFileStaging ? (
                        <FileStagingBrowserBreadcrumb
                            fileStagingTree={fileStagingTree}
                            selectedFileStagingFolder={selectedFileStagingFolder}
                            handleReloadFileStagingTreeFolder={handleReloadFileStagingTreeFolder}
                            handleFileStagingFolderClick={handleFileStagingFolderClick}
                        />
                    ) : showDirectData ? (
                        <DirectDataBrowserBreadcrumb selectedDirectDataFolder={selectedDirectDataFolder} />
                    ) : null}
                </Box>
                <Flex overflow='auto'>
                    {isLoading ? (
                        <Center width='100%' height='200px'>
                            <Spinner size='xl' />
                        </Center>
                    ) : (
                        <Flex {...TableContainerStyle}>
                            {activeTab === DIRECT_DATA && showDirectData ? (
                                <DirectDataBrowserTable
                                    directDataTree={directDataTree}
                                    selectedDirectDataFolder={selectedDirectDataFolder}
                                    tableHeight={tableHeight}
                                    downloadingDirectDataFileName={downloadingDirectDataFileName}
                                    handleDownloadDirectDataItemClick={handleDownloadDirectDataItemClick}
                                    selectedDirectDataSearchResult={selectedDirectDataSearchResult}
                                    downloadDirectDataItemStatus={downloadDirectDataItemStatus}
                                    setDownloadDirectDataItemStatus={setDownloadDirectDataItemStatus}
                                    isFileDownloadModalOpen={isFileDownloadModalOpen}
                                    setIsFileDownloadModalOpen={setIsFileDownloadModalOpen}
                                    closeDownloadModal={closeDownloadModal}
                                />
                            ) : showFileStaging ? (
                                <FileStagingBrowserTable
                                    fileStagingTree={fileStagingTree}
                                    selectedFileStagingFolder={selectedFileStagingFolder}
                                    handleFileStagingFolderClick={handleFileStagingFolderClick}
                                    tableHeight={tableHeight}
                                    handleDownloadFileStagingItemClick={handleDownloadFileStagingItemClick}
                                    downloadingFileStagingItemName={downloadingFileStagingItemName}
                                    selectedFileStagingSearchResult={selectedFileStagingSearchResult}
                                    handleReloadFileStagingTreeFolder={handleReloadFileStagingTreeFolder}
                                    isFileDownloadModalOpen={isFileDownloadModalOpen}
                                    setIsFileDownloadModalOpen={setIsFileDownloadModalOpen}
                                    closeDownloadModal={closeDownloadModal}
                                    downloadFileStagingItemStatus={downloadFileStagingItemStatus}
                                    setDownloadFileStagingItemStatus={setDownloadFileStagingItemStatus}
                                />
                            ) : null}
                        </Flex>
                    )}
                </Flex>
            </Flex>
        </Flex>
    );
}

const ParentFlexStyle = {
    height: '100%',
    maxHeight: '100%',
    borderRadius: '8px',
    backgroundColor: 'white_color_mode',
};

const TableContainerStyle = {
    width: '100%',
    overflowX: 'unset',
    overflowY: 'unset',
    color: 'text_color_mode',
};
