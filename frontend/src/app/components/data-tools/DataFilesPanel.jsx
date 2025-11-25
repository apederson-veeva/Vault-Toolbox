import { Flex, Box, IconButton, Tabs, Table, Text, Spacer, HStack, Center, Spinner } from '@chakra-ui/react';
import { PiArrowClockwise } from 'react-icons/pi';
import useDataFileModal from '../../hooks/data-tools/useDataFileModal';
import useDataFiles from '../../hooks/data-tools/useDataFiles';
import ApiErrorMessageCard from '../shared/ApiErrorMessageCard';
import DataFilesTableBody from './DataFilesTableBody';
import DataFilesTableHeader from './DataFilesTableHeader';
import FileContentsModal from './FileContentsModal';

export default function DataFilesPanel({ vaultToolboxPath }) {
    const {
        countFiles,
        deleteFiles,
        loadingFiles,
        fetchFilesError,
        secondsRemaining,
        activePolling,
        handleFileRefresh,
    } = useDataFiles({ vaultToolboxPath });
    const { isModalOpen, selectedCellData, closeModal, handleFileClick } = useDataFileModal();

    return (
        <Tabs.Root {...DataToolsTabsStyle} defaultValue='csv'>
            <Flex flexDirection='column' height='100%' overflow='auto'>
                <Flex overflow='auto' height='100%'>
                    <Tabs.Content padding={0} value='csv'>
                        <HStack>
                            <IconButton {...RefreshIconButtonStyle} onClick={handleFileRefresh}>
                                <PiArrowClockwise size={20} style={{ margin: '4px' }} />
                            </IconButton>
                            {activePolling ? <Text>Auto-refresh in {secondsRemaining} seconds...</Text> : null}
                        </HStack>
                        {loadingFiles ? (
                            <Center>
                                <Spinner />
                            </Center>
                        ) : (
                            <Box>
                                {!fetchFilesError.hasError ? (
                                    <Box>
                                        {countFiles && deleteFiles ? (
                                            <Flex {...TableContainerStyle}>
                                                <Table.Root size='md' variant='simple'>
                                                    <DataFilesTableHeader />
                                                    <DataFilesTableBody
                                                        countFiles={countFiles}
                                                        deleteFiles={deleteFiles}
                                                        handleClick={handleFileClick}
                                                    />
                                                </Table.Root>
                                            </Flex>
                                        ) : null}
                                    </Box>
                                ) : (
                                    <ApiErrorMessageCard
                                        content='files from Vault File Staging'
                                        errorMessage={fetchFilesError.errorMessage}
                                    />
                                )}
                            </Box>
                        )}
                        {isModalOpen ? (
                            <FileContentsModal open={isModalOpen} onClose={closeModal} cellData={selectedCellData} />
                        ) : null}
                    </Tabs.Content>
                </Flex>
                <Spacer />
                <Box {...TabBoxStyle}>
                    <Tabs.List {...TabListStyle}>
                        <Tabs.Trigger {...TabLabelStyle} value='csv'>
                            <Flex width='180px' alignItems='center' justifyContent='center'>
                                CSV
                            </Flex>
                        </Tabs.Trigger>
                        <Tabs.Indicator {...TabIndicatorStyle} />
                    </Tabs.List>
                </Box>
            </Flex>
        </Tabs.Root>
    );
}

const DataToolsTabsStyle = {
    variant: 'unstyled',
    position: 'relative',
    colorPalette: 'veeva_orange_color_mode',
    size: 'lg',
    maxWidth: '100%',
    height: '100%',
    backgroundColor: 'veeva_sunset_yellow.five_percent_opacity',
    borderBottomRadius: '8px',
};

const TableContainerStyle = {
    maxWidth: '100%',
    overflowX: 'unset',
    overflowY: 'unset',
    color: 'text_color_mode',
    backgroundColor: 'veeva_sunset_yellow.five_percent_opacity',
};

const TabListStyle = {
    flex: 1,
    height: '60px',
    width: '100%',
    borderTop: 'solid 3px',
    borderTopColor: 'gray.400',
    borderBottomRadius: '8px',
};

const TabBoxStyle = {
    backgroundColor: 'white_color_mode',
    position: 'sticky',
    left: '0',
    bottom: '0',
    borderBottomRadius: '8px',
};

const TabLabelStyle = {
    fontSize: 'xl',
    color: 'veeva_orange_color_mode',
    borderBottom: 'none',
    borderBottomRadius: '8px',
    width: '180px',
    height: '100%',
};

const TabIndicatorStyle = {
    marginTop: '-3px',
    height: '3px',
    backgroundColor: 'veeva_orange_color_mode',
    width: '180px',
    zIndex: 1,
};

const RefreshIconButtonStyle = {
    variant: 'subtle',
    size: 'auto',
    borderRadius: '6px',
    margin: '5px',
};
