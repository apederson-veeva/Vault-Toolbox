import { Flex, Heading } from '@chakra-ui/react';
import FileStagingBrowserSearchBar from './FileStagingBrowserSearchBar';

export default function FileStagingBrowserHeaderRow({ fileStagingTree, onSelect, fileUploadRootProviderAttributes }) {
    return (
        <Flex width='100%' margin='10px' alignItems='center'>
            <Heading {...HeadingStyle}>File Staging Browser</Heading>
            <FileStagingBrowserSearchBar fileStagingTree={fileStagingTree} onSelect={onSelect} />
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
