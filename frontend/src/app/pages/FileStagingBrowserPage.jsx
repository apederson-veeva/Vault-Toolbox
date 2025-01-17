import { Box, Flex, Spacer, VStack } from '@chakra-ui/react';
import ContextualHelpButton from '../components/shared/ContextualHelpButton';
import useFileStagingTree from '../hooks/file-staging-browser/useFileStagingTree';
import useFileStagingBrowser from '../hooks/file-staging-browser/useFileStagingBrowser';
import FileStagingBrowserHeaderRow from '../components/file-staging-browser/FileStagingBrowserHeaderRow';
import FileStagingBrowserIsland from '../components/file-staging-browser/FileStagingBrowserIsland';
import FileStagingBrowserDirectoryPanel from '../components/file-staging-browser/FileStagingBrowserDirectoryPanel';
import VaultInfoIsland from '../components/shared/VaultInfoIsland';
import { Panel, PanelGroup } from 'react-resizable-panels';

export default function FileStagingBrowserPage() {
    const {
        fileStagingTree,
        handleReloadFileStagingTree,
        loadingFileStagingTree,
        fileStagingTreeError,
        fileStagingTreeEnvironmentRef,
        fileStagingTreeRef,
        fileStagingRoot,
    } = useFileStagingTree();

    const { selectedFolder, onSelect, handleDownloadItemClick } = useFileStagingBrowser({
        fileStagingRoot,
        fileStagingTree,
        fileStagingTreeEnvironmentRef,
        fileStagingTreeRef,
    });

    return (
        <Flex justify='flex-start' height='100%'>
            <Box {...DirectoryPanelStyle}>
                <PanelGroup direction='horizontal' autoSaveId='FileStagingBrowserPage-PanelGroup'>
                    <FileStagingBrowserDirectoryPanel
                        fileStagingTree={fileStagingTree}
                        handleReloadFileStagingTree={handleReloadFileStagingTree}
                        loadingFileStagingTree={loadingFileStagingTree}
                        fileStagingTreeError={fileStagingTreeError}
                        fileStagingTreeEnvironmentRef={fileStagingTreeEnvironmentRef}
                        fileStagingTreeRef={fileStagingTreeRef}
                        selectedFolder={selectedFolder}
                        onSelect={onSelect}
                    />
                    <Panel id='file-staging-browser-panel' order={2}>
                        <VStack {...StackStyle}>
                            <FileStagingBrowserHeaderRow fileStagingTree={fileStagingTree} onSelect={onSelect} />
                            <FileStagingBrowserIsland
                                fileStagingTree={fileStagingTree}
                                loadingFileStagingTree={loadingFileStagingTree}
                                selectedFolder={selectedFolder}
                                onSelect={onSelect}
                                handleDownloadItemClick={handleDownloadItemClick}
                            />
                            <VaultInfoIsland />
                        </VStack>
                    </Panel>
                </PanelGroup>
            </Box>
            <Box height='100vh' flex='0 0' bg='white.color_mode'>
                <Flex flexDirection='column' height='100%'>
                    <Spacer />
                    <ContextualHelpButton
                        tooltip='Vault File Staging Server'
                        url='https://platform.veevavault.help/en/gr/38653/'
                    />
                </Flex>
            </Box>
        </Flex>
    );
}

const DirectoryPanelStyle = {
    height: '100%',
    backgroundColor: 'veeva_light_gray.color_mode',
    flex: 1,
    boxShadow: 'inset 5px 0 8px -8px rgba(0,0,0,0.3)',
    spacing: 0,
};

const StackStyle = {
    height: '100%',
    backgroundColor: 'veeva_light_gray.color_mode',
    flex: 1,
    boxShadow: 'inset -5px 0 8px -8px rgba(0,0,0,0.3)',
    spacing: 0,
};
