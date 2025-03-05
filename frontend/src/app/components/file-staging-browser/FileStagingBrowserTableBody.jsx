import { Flex, Icon, IconButton, Spacer, Tbody, Td, Text, Tooltip, Tr } from '@chakra-ui/react';
import { PiCopy, PiDownloadSimple, PiFileText, PiFolder } from 'react-icons/pi';
import { formatDateTime, formatBytesToUserFriendlyFormat } from '../../services/SharedServices';

export default function FileStagingBrowserTableBody({
    fileStagingTree,
    selectedFolder,
    onSelect,
    handleDownloadItemClick,
}) {
    const folderData = fileStagingTree[selectedFolder.index];

    return (
        <Tbody>
            {folderData?.children?.length > 0 ? (
                folderData.children.map((itemKey, index) => {
                    const item = fileStagingTree[itemKey];
                    return (
                        <Tr
                            key={index}
                            onClick={item.isFolder ? () => onSelect(item) : undefined}
                            _hover={{
                                bg: 'beige.color_mode',
                                cursor: item.isFolder ? 'pointer' : 'default',
                                '.icon-buttons': { visibility: 'visible', opacity: 1 }, // Show buttons on hover
                            }}
                        >
                            <Td {...TdStyle} textAlign='center'>
                                <Icon as={item.isFolder ? PiFolder : PiFileText} boxSize='6' />
                            </Td>
                            <Td {...TdStyle}>
                                <Flex alignItems='center' width='100%'>
                                    <Text isTruncated maxWidth='20vw' title={item.data.name}>
                                        {item.data.name}
                                    </Text>
                                    <Spacer />
                                </Flex>
                            </Td>
                            <Td {...TdStyle}>
                                {item.data.size ? formatBytesToUserFriendlyFormat(item.data.size) : '-'}
                            </Td>
                            <Td {...TdStyle}>
                                {item.data.modified_date ? formatDateTime(item.data.modified_date) : '-'}
                            </Td>
                            <Td {...TdStyle} textAlign='right'>
                                {!item.isFolder && (
                                    <Tooltip label='Download file' placement='top' hasArrow>
                                        <IconButton
                                            {...IconButtonStyle}
                                            className='icon-buttons'
                                            onClick={() => handleDownloadItemClick(item)}
                                            aria-label='Download file'
                                            icon={<PiDownloadSimple />}
                                        />
                                    </Tooltip>
                                )}
                                <Tooltip label='Copy full path' placement='top' hasArrow>
                                    <IconButton
                                        {...IconButtonStyle}
                                        className='icon-buttons'
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent row click
                                            navigator.clipboard.writeText(item.data.path);
                                        }}
                                        aria-label='Copy path'
                                        icon={<PiCopy />}
                                    />
                                </Tooltip>
                            </Td>
                        </Tr>
                    );
                })
            ) : (
                <Tr>
                    <Td {...TdStyle} colSpan='5' textAlign='center'>
                        NO ITEMS FOUND
                    </Td>
                </Tr>
            )}
        </Tbody>
    );
}

const TdStyle = {
    borderBottom: 'solid thin',
    borderColor: 'gray.300',
    verticalAlign: 'center',
    fontSize: '16px',
};

const IconButtonStyle = {
    _hover: {
        backgroundColor: 'yellow.color_mode',
    },
    size: 'md',
    marginLeft: '8px',
    variant: 'ghost',
    style: {
        position: 'static',
        zIndex: 'auto',
    },
    visibility: 'hidden',
    opacity: 0,
    transition: 'opacity 0.2s ease-in-out, visibility 0.2s',
};
