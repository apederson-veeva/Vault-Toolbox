import { Flex, Icon, IconButton, Spacer, Text, Table } from '@chakra-ui/react';
import { useState } from 'react';
import { PiCopy, PiDownloadSimple, PiFileText, PiFolder } from 'react-icons/pi';
import { formatDateTime, formatBytesToUserFriendlyFormat } from '../../services/SharedServices';
import { Tooltip } from '../shared/ui-components/tooltip';

export default function FileStagingBrowserTableBody({
    fileStagingTree,
    selectedFolder,
    onSelect,
    handleDownloadItemClick,
}) {
    const folderData = fileStagingTree[selectedFolder.index];
    const [hoveredRow, setHoveredRow] = useState(null);

    return (
        <Table.Body>
            {folderData?.children?.length > 0 ? (
                folderData.children.map((itemKey, index) => {
                    const item = fileStagingTree[itemKey];

                    return (
                        <Table.Row
                            key={index}
                            onClick={item.isFolder ? () => onSelect(item) : undefined}
                            onMouseEnter={() => setHoveredRow(index)}
                            onMouseLeave={() => setHoveredRow(null)}
                            _hover={{
                                bg: 'beige_color_mode',
                                cursor: item.isFolder ? 'pointer' : 'default',
                            }}
                        >
                            <Table.Cell {...TdStyle} textAlign='center'>
                                <Icon as={item.isFolder ? PiFolder : PiFileText} boxSize='6' />
                            </Table.Cell>
                            <Table.Cell {...TdStyle}>
                                <Flex alignItems='center' width='100%'>
                                    <Text truncate maxWidth='20vw' title={item.data.name}>
                                        {item.data.name}
                                    </Text>
                                    <Spacer />
                                </Flex>
                            </Table.Cell>
                            <Table.Cell {...TdStyle}>
                                {item.data.size ? formatBytesToUserFriendlyFormat(item.data.size) : '-'}
                            </Table.Cell>
                            <Table.Cell {...TdStyle}>
                                {item.data.modified_date ? formatDateTime(item.data.modified_date) : '-'}
                            </Table.Cell>
                            <Table.Cell {...TdStyle} textAlign='right'>
                                {!item.isFolder && (
                                    <Tooltip showArrow content='Download file' positioning={{ placement: 'top' }}>
                                        <IconButton
                                            {...IconButtonStyle}
                                            style={{
                                                visibility: hoveredRow === index ? 'visible' : 'hidden',
                                                opacity: hoveredRow === index ? 1 : 0,
                                                transition: 'opacity 0.2s ease-in-out, visibility 0.2s',
                                            }}
                                            onClick={() => handleDownloadItemClick(item)}
                                            aria-label='Download file'
                                        >
                                            <PiDownloadSimple />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <Tooltip showArrow content='Copy full path' positioning={{ placement: 'top' }}>
                                    <IconButton
                                        {...IconButtonStyle}
                                        style={{
                                            visibility: hoveredRow === index ? 'visible' : 'hidden',
                                            opacity: hoveredRow === index ? 1 : 0,
                                            transition: 'opacity 0.2s ease-in-out, visibility 0.2s',
                                        }}
                                        onClick={(e) => {
                                            e.stopPropagation(); // Prevent row click
                                            navigator.clipboard.writeText(item.data.path);
                                        }}
                                        aria-label='Copy path'
                                    >
                                        <PiCopy />
                                    </IconButton>
                                </Tooltip>
                            </Table.Cell>
                        </Table.Row>
                    );
                })
            ) : (
                <Table.Row>
                    <Table.Cell {...TdStyle} colSpan='5' textAlign='center'>
                        NO ITEMS FOUND
                    </Table.Cell>
                </Table.Row>
            )}
        </Table.Body>
    );
}

const TdStyle = {
    borderBottom: 'solid thin',
    borderColor: 'gray.300',
    verticalAlign: 'center',
    fontSize: '16px',
    whiteSpace: 'nowrap',
};

const IconButtonStyle = {
    _hover: {
        backgroundColor: 'yellow_color_mode',
    },
    size: 'md',
    marginLeft: '8px',
    variant: 'ghost',
};
