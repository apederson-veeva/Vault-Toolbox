import { Center, Flex, Spinner, Table } from '@chakra-ui/react';
import VerticalResizeHandle from '../shared/VerticalResizeHandle';
import FileStagingBrowserBreadcrumb from './FileStagingBrowserBreadcrumb';
import FileStagingBrowserTableBody from './FileStagingBrowserTableBody';
import FileStagingBrowserTableHeader from './FileStagingBrowserTableHeader';

export default function FileStagingBrowserIsland({
    fileStagingTree,
    loadingFileStagingTree,
    handleReloadFileStagingTreeFolder,
    loadingFileStagingTreeFolder,
    selectedFolder,
    onSelect,
    handleDownloadItemClick,
    fileUploadRootProviderAttributes,
}) {
    return (
        <Flex {...ParentFlexStyle}>
            <VerticalResizeHandle />
            <Flex flexDirection='column' height='100%' width='100%' overflow='auto'>
                <FileStagingBrowserBreadcrumb
                    fileStagingTree={fileStagingTree}
                    selectedFolder={selectedFolder}
                    handleReloadFileStagingTreeFolder={handleReloadFileStagingTreeFolder}
                    onSelect={onSelect}
                    fileUploadRootProviderAttributes={fileUploadRootProviderAttributes}
                />
                <Flex overflow='auto' marginRight='16px'>
                    {loadingFileStagingTree || loadingFileStagingTreeFolder ? (
                        <Center>
                            <Spinner />
                        </Center>
                    ) : (
                        <Flex {...TableContainerStyle}>
                            <Table.Root
                                backgroundColor='veeva_sunset_yellow.five_percent_opacity'
                                size='md'
                                variant='simple'
                            >
                                <FileStagingBrowserTableHeader />
                                <FileStagingBrowserTableBody
                                    fileStagingTree={fileStagingTree}
                                    selectedFolder={selectedFolder}
                                    onSelect={onSelect}
                                    handleDownloadItemClick={handleDownloadItemClick}
                                />
                            </Table.Root>
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
    overflowY: 'auto',
    width: 'calc(100% - 20px)',
    margin: '0px',
    borderRadius: '8px',
    backgroundColor: 'white_color_mode',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
};

const TableContainerStyle = {
    width: '100%',
    overflowX: 'unset',
    overflowY: 'unset',
    color: 'text_color_mode',
};
