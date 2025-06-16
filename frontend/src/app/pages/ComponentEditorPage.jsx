import { Box, Flex, IconButton, Spacer, VStack } from '@chakra-ui/react';
import { PiTreeStructureBold } from 'react-icons/pi';
import { Panel, PanelGroup } from 'react-resizable-panels';
import ComponentDirectoryPanel from '../components/component-editor/ComponentDirectoryPanel';
import ComponentEditorHeaderRow from '../components/component-editor/ComponentEditorHeaderRow';
import ComponentEditorIsland from '../components/component-editor/ComponentEditorIsland';
import OutstandingAsyncJobWarning from '../components/component-editor/OutstandingAsyncJobWarning';
import ContextualHelpButton from '../components/shared/ContextualHelpButton';
import TelemetryData from '../components/shared/TelemetryData';
import VaultInfoIsland from '../components/shared/VaultInfoIsland';
import useComponentEditor from '../hooks/component-editor/useComponentEditor';
import useComponentTree from '../hooks/component-editor/useComponentTree';

export default function ComponentEditorPage() {
    const { componentTree, componentTreeError, retrieveComponentTree, loadingComponentTree } = useComponentTree();
    const {
        code,
        setCode,
        selectedComponent,
        setSelectedComponent,
        consoleOutput,
        executeMdl,
        executeMdlAsync,
        retrieveMdlAsyncResults,
        onSelect,
        updateSelectedComponent,
        closeOutstandingAsyncJobWarning,
        toggleComponentTree,
        mdlTelemetryData,
        isExecutingApiCall,
        isExecutingMdl,
        asyncJobId,
        showOutstandingAsyncJobWarning,
        selectedComponentPendingConfirmation,
        displayComponentTree,
        sidePanelCollapsed,
        setSidePanelCollapsed,
        componentDirectoryPanelRef,
    } = useComponentEditor();

    return (
        <>
            <Flex justify='flex-start' height='100%'>
                <PanelGroup direction='horizontal' autoSaveId='ComponentEditorPage-PanelGroup'>
                    <Panel id='component-editor-panel' order={1}>
                        <VStack {...ComponentEditorStackStyle}>
                            <ComponentEditorHeaderRow
                                setSelectedComponent={setSelectedComponent}
                                executeMdl={executeMdl}
                                executeMdlAsync={executeMdlAsync}
                                retrieveMdlAsyncResults={retrieveMdlAsyncResults}
                                asyncJobId={asyncJobId}
                                isExecutingMdl={isExecutingMdl}
                            />
                            <ComponentEditorIsland
                                consoleOutput={consoleOutput}
                                code={code}
                                setCode={setCode}
                                isExecutingApiCall={isExecutingApiCall}
                            />
                            <VaultInfoIsland>
                                <TelemetryData telemetryData={mdlTelemetryData} />
                            </VaultInfoIsland>
                        </VStack>
                    </Panel>
                    {displayComponentTree ? (
                        <ComponentDirectoryPanel
                            retrieveComponentTree={retrieveComponentTree}
                            loadingComponentTree={loadingComponentTree}
                            selectedComponent={selectedComponent}
                            setSelectedComponent={setSelectedComponent}
                            componentTree={componentTree}
                            onSelect={onSelect}
                            componentTreeError={componentTreeError}
                            sidePanelCollapsed={sidePanelCollapsed}
                            setSidePanelCollapsed={setSidePanelCollapsed}
                            componentDirectoryPanelRef={componentDirectoryPanelRef}
                        />
                    ) : null}
                </PanelGroup>
                <Box height='100vh' flex='0 0 auto'>
                    <Flex flexDirection='column' height='100%'>
                        <IconButton
                            onClick={toggleComponentTree}
                            size='auto'
                            borderRadius='6px'
                            margin='5px'
                            color={displayComponentTree ? 'white' : 'veeva_orange_color_mode'}
                            backgroundColor={displayComponentTree ? 'veeva_orange_color_mode' : 'transparent'}
                        >
                            <PiTreeStructureBold size={20} style={{ margin: '4px' }} />
                        </IconButton>
                        <Spacer />
                        <ContextualHelpButton tooltip='MDL Documentation' url='https://developer.veevavault.com/mdl/' />
                    </Flex>
                </Box>
            </Flex>
            {showOutstandingAsyncJobWarning && (
                <OutstandingAsyncJobWarning
                    open={showOutstandingAsyncJobWarning}
                    onClose={closeOutstandingAsyncJobWarning}
                    onConfirm={updateSelectedComponent}
                    currentComponent={selectedComponentPendingConfirmation}
                />
            )}
        </>
    );
}

const ComponentEditorStackStyle = {
    height: '100%',
    backgroundColor: 'veeva_light_gray_color_mode',
    flex: 1,
    boxShadow: 'inset -5px 0 8px -8px rgba(0,0,0,0.3), inset 5px 0 8px -8px rgba(0,0,0,0.3)',
    gap: 0,
};
