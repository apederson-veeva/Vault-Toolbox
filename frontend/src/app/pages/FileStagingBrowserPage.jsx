import { Box, Flex, Spacer, VStack } from '@chakra-ui/react';
import { Panel, PanelGroup } from 'react-resizable-panels';
import FileStagingBrowserDirectoryPanel from '../components/file-staging-browser/FileStagingBrowserDirectoryPanel';
import FileStagingBrowserHeaderRow from '../components/file-staging-browser/FileStagingBrowserHeaderRow';
import FileStagingBrowserIsland from '../components/file-staging-browser/FileStagingBrowserIsland';
import ContextualHelpButton from '../components/shared/ContextualHelpButton';
import VaultInfoIsland from '../components/shared/VaultInfoIsland';
import useFileStagingBrowser from '../hooks/file-staging-browser/useFileStagingBrowser';
import useFileStagingTree from '../hooks/file-staging-browser/useFileStagingTree';
import useFileStagingUpload from '../hooks/file-staging-browser/useFileStagingUpload';

export default function FileStagingBrowserPage() {
    const {
        fileStagingTree,
        handleReloadFileStagingTree,
        loadingFileStagingTree,
        handleReloadFileStagingTreeFolder,
        loadingFileStagingTreeFolder,
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

    const { fileUploadRootProviderAttributes } = useFileStagingUpload({
        handleReloadFileStagingTreeFolder,
        selectedFolder,
    });

    return (
        <Flex justify='flex-start' height='100%'>
            <Box {...DirectoryPanelStyle}>
                <PanelGroup direction='horizontal' autoSaveId='FileStagingBrowserPage-PanelGroup'>
                    <FileStagingBrowserDirectoryPanel
                        fileStagingTree={fileStagingTree}
                        loadingFileStagingTree={loadingFileStagingTree}
                        fileStagingTreeError={fileStagingTreeError}
                        fileStagingTreeEnvironmentRef={fileStagingTreeEnvironmentRef}
                        fileStagingTreeRef={fileStagingTreeRef}
                        selectedFolder={selectedFolder}
                        onSelect={onSelect}
                    />
                    <Panel id='file-staging-browser-panel' order={2}>
                        <VStack {...StackStyle}>
                            <FileStagingBrowserHeaderRow
                                fileStagingTree={fileStagingTree}
                                onSelect={onSelect}
                                fileUploadRootProviderAttributes={fileUploadRootProviderAttributes}
                            />
                            <FileStagingBrowserIsland
                                fileStagingTree={fileStagingTree}
                                loadingFileStagingTree={loadingFileStagingTree}
                                handleReloadFileStagingTreeFolder={handleReloadFileStagingTreeFolder}
                                loadingFileStagingTreeFolder={loadingFileStagingTreeFolder}
                                selectedFolder={selectedFolder}
                                onSelect={onSelect}
                                handleDownloadItemClick={handleDownloadItemClick}
                                fileUploadRootProviderAttributes={fileUploadRootProviderAttributes}
                            />
                            <VaultInfoIsland />
                        </VStack>
                    </Panel>
                </PanelGroup>
            </Box>
            <Box height='100vh' flex='0 0' bg='white_color_mode'>
                <Flex flexDirection='column' height='100%'>
                    <Spacer />
                    <ContextualHelpButton
                        tooltip='Vault File Staging'
                        url='https://platform.veevavault.help/en/gr/38653/'
                    />
                </Flex>
            </Box>
        </Flex>
    );
}

const DirectoryPanelStyle = {
    height: '100%',
    backgroundColor: 'veeva_light_gray_color_mode',
    flex: 1,
    boxShadow: 'inset 5px 0 8px -8px rgba(0,0,0,0.3)',
    gap: 0,
};

const StackStyle = {
    height: '100%',
    backgroundColor: 'veeva_light_gray_color_mode',
    flex: 1,
    boxShadow: 'inset -5px 0 8px -8px rgba(0,0,0,0.3)',
    gap: 0,
};
