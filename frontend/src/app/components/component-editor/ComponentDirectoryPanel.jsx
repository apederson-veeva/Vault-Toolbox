import { Stack, Box, Heading, Separator, IconButton, Progress } from '@chakra-ui/react';
import { PiArrowClockwise } from 'react-icons/pi';
import { Panel } from 'react-resizable-panels';
import ApiErrorMessageCard from '../shared/ApiErrorMessageCard';
import VerticalResizeHandle from '../shared/VerticalResizeHandle';
import { Tooltip } from '../shared/ui-components/tooltip';
import ComponentTree from './ComponentTree';

export default function ComponentDirectoryPanel({
    retrieveComponentTree,
    loadingComponentTree,
    selectedComponent,
    setSelectedComponent,
    componentTree,
    onSelect,
    componentTreeError,
    sidePanelCollapsed,
    setSidePanelCollapsed,
    componentDirectoryPanelRef,
}) {
    return (
        <>
            <VerticalResizeHandle sidePanelCollapsed={sidePanelCollapsed} />
            <Panel
                id='component-tree-panel'
                order={2}
                defaultSize={30}
                minSize={10}
                maxSize={50}
                collapsible
                onCollapse={() => setSidePanelCollapsed(true)}
                onExpand={() => setSidePanelCollapsed(false)}
                ref={componentDirectoryPanelRef}
            >
                <Stack {...ParentStackStyle}>
                    <Box position='sticky'>
                        <Heading {...HeadingStyle}>Component Directory</Heading>
                        <Separator {...HorizontalDividerStyle} />
                        <Tooltip
                            content='Reload Component Directory'
                            openDelay={0}
                            positioning={{ placement: 'right' }}
                        >
                            <IconButton onClick={retrieveComponentTree} {...RefreshIconButtonStyle}>
                                <PiArrowClockwise size={20} style={{ margin: '4px' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                    {componentTreeError ? (
                        <ApiErrorMessageCard content='component directory' errorMessage={componentTreeError} />
                    ) : loadingComponentTree ? (
                        <Progress.Root size='sm' value={null}>
                            <Progress.Track>
                                <Progress.Range />
                            </Progress.Track>
                        </Progress.Root>
                    ) : (
                        <Box {...ComponentTreeBoxStyle}>
                            <ComponentTree
                                selectedComponent={selectedComponent}
                                setSelectedComponent={setSelectedComponent}
                                componentTree={componentTree[0]}
                                onSelect={onSelect}
                            />
                        </Box>
                    )}
                </Stack>
            </Panel>
            <Separator {...VerticalDividerStyle} />
        </>
    );
}

const ParentStackStyle = {
    height: '100%',
    flex: '0 0',
    backgroundColor: 'white_color_mode',
};

const HeadingStyle = {
    color: 'veeva_orange_color_mode',
    size: 'xl',
    fontWeight: 'bold',
    margin: '5px',
};

const HorizontalDividerStyle = {
    borderColor: 'veeva_light_gray.500',
    borderWidth: '1px',
};

const RefreshIconButtonStyle = {
    variant: 'subtle',
    colorPalette: 'gray',
    size: 'auto',
    borderRadius: '6px',
    margin: '5px',
};

const ComponentTreeBoxStyle = {
    paddingX: 3,
    overflow: 'auto',
};

const VerticalDividerStyle = {
    orientation: 'vertical',
    borderColor: 'veeva_light_gray.500',
    height: 'auto',
    borderWidth: '1px',
};
