import { Box, Divider, Heading, IconButton, Progress, Stack, Tooltip } from '@chakra-ui/react';
import { Panel } from 'react-resizable-panels';
import { PiArrowClockwise } from 'react-icons/pi';
import FileStagingTree from './FileStagingTree';
import ApiErrorMessageCard from '../shared/ApiErrorMessageCard';

export default function FileStagingBrowserDirectoryPanel({
    fileStagingTree,
    loadingFileStagingTree,
    handleReloadFileStagingTree,
    fileStagingTreeError,
    fileStagingTreeEnvironmentRef,
    fileStagingTreeRef,
    selectedFolder,
    onSelect,
}) {
    return (
        <Panel id='file-staging-browser-directory-panel' order={1} defaultSize={30} minSize={10} maxSize={45}>
            <Stack maxHeight='100vh'>
                <Box position='sticky' paddingX={3}>
                    <Heading {...HeadingStyle}>File Staging Directory</Heading>
                    <Divider {...HorizontalDividerStyle} />
                    <Tooltip label='Reload File Staging Directory' placement='right'>
                        <IconButton
                            icon={<PiArrowClockwise size={20} style={{ margin: '4px' }} />}
                            onClick={() =>
                                handleReloadFileStagingTree(() => selectedFolder && onSelect?.(selectedFolder))
                            }
                            {...RefreshIconButtonStyle}
                        />
                    </Tooltip>
                </Box>
                {fileStagingTreeError ? (
                    <ApiErrorMessageCard content='file staging directory' errorMessage={fileStagingTreeError} />
                ) : loadingFileStagingTree ? (
                    <Progress size='sm' isIndeterminate />
                ) : (
                    <Box {...FileStagingTreeBoxStyle}>
                        <FileStagingTree
                            fileStagingTree={fileStagingTree}
                            selectedFolder={selectedFolder}
                            fileStagingTreeEnvironmentRef={fileStagingTreeEnvironmentRef}
                            fileStagingTreeRef={fileStagingTreeRef}
                            onSelect={onSelect}
                        />
                    </Box>
                )}
            </Stack>
        </Panel>
    );
}

const HeadingStyle = {
    color: 'veeva_orange.color_mode',
    size: 'md',
    margin: '5px',
};

const HorizontalDividerStyle = {
    borderColor: 'veeva_light_gray.500',
    borderWidth: '1px',
};

const RefreshIconButtonStyle = {
    size: 'auto',
    borderRadius: '8px',
    margin: '5px',
};

const FileStagingTreeBoxStyle = {
    paddingX: 3,
    overflow: 'auto',
};
