import { Center, Flex, Spinner, Table, TableContainer } from '@chakra-ui/react';
import FileStagingBrowserTableHeader from './FileStagingBrowserTableHeader';
import FileStagingBrowserTableBody from './FileStagingBrowserTableBody';
import VerticalResizeHandle from '../shared/VerticalResizeHandle';
import FileStagingBrowserBreadcrumb from './FileStagingBrowserBreadcrumb';

export default function FileStagingBrowserIsland({
    fileStagingTree,
    loadingFileStagingTree,
    selectedFolder,
    onSelect,
    handleDownloadItemClick,
}) {
    return (
        <Flex {...ParentFlexStyle}>
            <VerticalResizeHandle />
            <Flex flexDirection='column' height='100%' width='100%' overflow='auto'>
                <FileStagingBrowserBreadcrumb
                    fileStagingTree={fileStagingTree}
                    selectedFolder={selectedFolder}
                    onSelect={onSelect}
                />
                <Flex overflow='auto' marginRight='16px'>
                    {loadingFileStagingTree ? (
                        <Center>
                            <Spinner />
                        </Center>
                    ) : (
                        <TableContainer {...TableContainerStyle}>
                            <Table
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
                            </Table>
                        </TableContainer>
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
    backgroundColor: 'white.color_mode',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
};

const TableContainerStyle = {
    width: '100%',
    overflowX: 'unset',
    overflowY: 'unset',
    color: 'text.color_mode',
};
