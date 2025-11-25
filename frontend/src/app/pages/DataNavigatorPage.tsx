import { Box, Flex, Spacer, StackProps, VStack } from '@chakra-ui/react';
import ContextualHelpButton from '../components/shared/ContextualHelpButton';
import VaultInfoIsland from '../components/shared/VaultInfoIsland';
import DataNavigatorHeaderRow from '../components/data-navigator/DataNavigatorHeaderRow';
import DataNavigatorIsland from '../components/data-navigator/DataNavigatorIsland';
import useDataNavigator from '../hooks/data-navigator/useDataNavigator';

export default function DataNavigatorPage() {
    const {
        userInput,
        setUserInput,
        records,
        loadingRecord,
        getRecordData,
        selectedTab,
        setSelectedTab,
        removeTabHandler,
        componentTypes,
    } = useDataNavigator();

    return (
        <Flex justify='flex-start' height='100%'>
            <VStack {...StackStyle}>
                <DataNavigatorHeaderRow
                    userInput={userInput}
                    setUserInput={setUserInput}
                    getRecordData={getRecordData}
                    loadingRecord={loadingRecord}
                />
                <DataNavigatorIsland
                    records={records}
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    getRecordData={getRecordData}
                    removeTabHandler={removeTabHandler}
                    componentTypes={componentTypes}
                />
                <VaultInfoIsland />
            </VStack>
            <Box height='100vh' flex='0 0 auto'>
                <Flex flexDirection='column' height='100%'>
                    <Spacer />
                    <ContextualHelpButton tooltip='Data Navigator' url='https://github.com/veeva/Vault-Toolbox' />
                </Flex>
            </Box>
        </Flex>
    );
}

const StackStyle: StackProps = {
    height: '100%',
    backgroundColor: 'veeva_light_gray_color_mode',
    flex: 1,
    boxShadow: 'inset -5px 0 8px -8px rgba(0,0,0,0.3), inset 5px 0 8px -8px rgba(0,0,0,0.3)',
    gap: 0,
    minWidth: 0,
};
