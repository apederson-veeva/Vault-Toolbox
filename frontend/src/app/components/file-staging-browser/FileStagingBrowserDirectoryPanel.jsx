import { Box, Heading, Progress, Separator, Stack } from '@chakra-ui/react';
import { Panel } from 'react-resizable-panels';
import FileStagingTree from './FileStagingTree';
import ApiErrorMessageCard from '../shared/ApiErrorMessageCard';

export default function FileStagingBrowserDirectoryPanel({
    fileStagingTree,
    loadingFileStagingTree,
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
                    <Separator {...HorizontalDividerStyle} />
                </Box>
                {fileStagingTreeError ? (
                    <ApiErrorMessageCard content='file staging directory' errorMessage={fileStagingTreeError} />
                ) : loadingFileStagingTree ? (
                    <Progress.Root size='sm' value={null}>
                        <Progress.Track>
                            <Progress.Range />
                        </Progress.Track>
                    </Progress.Root>
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
    color: 'veeva_orange_color_mode',
    size: 'xl',
    fontWeight: 'bold',
    margin: '5px',
};

const HorizontalDividerStyle = {
    borderColor: 'veeva_light_gray.500',
    borderWidth: '1px',
};

const FileStagingTreeBoxStyle = {
    paddingX: 3,
    overflow: 'auto',
};
