import { Flex, Heading } from '@chakra-ui/react';
import { FILE_STAGING } from '../../hooks/file-browser/useFileBrowserTabs';
import DirectDataBrowserSearchBar from './direct-data/DirectDataBrowserSearchBar';
import FileStagingBrowserSearchBar from './file-staging/FileStagingBrowserSearchBar';

export default function FileBrowserHeaderRow({
    activeTab,
    fileStagingTree,
    handleFileStagingSearchResultClick,
    fileStagingSearchOptions,
    directDataTree,
    handleDirectDataSearchResultClick,
    directDataSearchOptions,
    showFileStaging,
    showDirectData,
}) {
    return (
        <Flex width='100%' marginTop='10px' alignItems='center'>
            <Heading {...HeadingStyle}>File Browser</Heading>
            {activeTab === FILE_STAGING && showFileStaging ? (
                <FileStagingBrowserSearchBar
                    fileStagingTree={fileStagingTree}
                    handleFileStagingSearchResultClick={handleFileStagingSearchResultClick}
                    fileStagingSearchOptions={fileStagingSearchOptions}
                />
            ) : showDirectData ? (
                <DirectDataBrowserSearchBar
                    directDataTree={directDataTree}
                    handleDirectDataSearchResultClick={handleDirectDataSearchResultClick}
                    directDataSearchOptions={directDataSearchOptions}
                />
            ) : null}
        </Flex>
    );
}

const HeadingStyle = {
    color: 'veeva_orange_color_mode',
    minWidth: 'max-content',
    marginLeft: '25px',
    marginRight: '5px',
    fontSize: '2rem',
};
