import {
    Tr,
    Td,
    Button,
    Tooltip,
    Collapse,
    Card,
    CardBody,
    Table,
    Tbody,
    Flex,
    Text,
    Box,
    IconButton,
} from '@chakra-ui/react';
import { Fragment, useState } from 'react';
import { PiArrowCounterClockwise, PiCaretDownBold, PiCaretRightBold } from 'react-icons/pi';
import { formatDateTime } from '../../../services/SharedServices';

export default function QueryHistoryRow({ query, loadQueryIntoEditor }) {
    const [showRowDetails, setShowRowDetails] = useState(false);
    const toggleRowDetails = () => setShowRowDetails(!showRowDetails);

    return (
        <>
            <Tr>
                <Td width={'min-content'}>
                    <IconButton
                        variant='ghost'
                        aria-label='Expand/Collapse Row Details'
                        icon={showRowDetails ? <PiCaretDownBold /> : <PiCaretRightBold />}
                        size='sm'
                        onClick={toggleRowDetails}
                    />
                </Td>
                <Td width={'min-content'}>{formatDateTime(query.time)}</Td>
                <Td width={'min-content'}>
                    <Tooltip label='Rebuild' placement='bottom-start'>
                        <IconButton
                            variant='ghost'
                            colorScheme='blue'
                            aria-label='Rebuild Query'
                            icon={<PiArrowCounterClockwise />}
                            size='sm'
                            onClick={() => loadQueryIntoEditor(query?.queryString)}
                        />
                    </Tooltip>
                </Td>
                <Td width={'100%'} maxWidth={0}>
                    {query.queryTarget}
                </Td>
            </Tr>
            {showRowDetails && (
                <Tr width={'min-content'}>
                    <Td colSpan={5}>
                        <Collapse startingHeight={0} in={showRowDetails}>
                            <Card size={'sm'} marginY={1}>
                                <CardBody>
                                    <Table variant='simple' size='sm'>
                                        <Tbody>
                                            <Tr>
                                                <Td {...TableColumnStyle}>Time: </Td>
                                                <Td>{formatDateTime(query.time)}</Td>
                                            </Tr>
                                            <Tr>
                                                <Td {...TableColumnStyle}>Target: </Td>
                                                <Td>{query.queryTarget}</Td>
                                            </Tr>
                                            <Tr>
                                                <Td {...TableColumnStyle}>Results: </Td>
                                                <Td>{query.results}</Td>
                                            </Tr>
                                            <Tr>
                                                <Td {...TableColumnStyle}>Response Time: </Td>
                                                <Td>{query.responseTimeInMs} ms</Td>
                                            </Tr>
                                            <Tr>
                                                <Td {...TableColumnStyle}>Response Size: </Td>
                                                <Td>{query.responseSizeInKB} KB</Td>
                                            </Tr>
                                            <Tr>
                                                <Td {...TableColumnStyle}>
                                                    <Flex
                                                        justifyContent={'flex-end'}
                                                        alignItems={'center'}
                                                        width={'100%'}
                                                    >
                                                        <Box>Query String:</Box>
                                                    </Flex>
                                                </Td>
                                                <Td width={'100%'} maxWidth={0}>
                                                    <Box overflow='hidden' textOverflow='ellipsis' whiteSpace='normal'>
                                                        {query.queryString}
                                                    </Box>
                                                </Td>
                                            </Tr>
                                            <Tr>
                                                <Td {...TableColumnStyle}>Execution ID: </Td>
                                                <Td>{query.vaultApiExecutionId}</Td>
                                            </Tr>
                                        </Tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Collapse>
                    </Td>
                </Tr>
            )}
        </>
    );
}

const TableColumnStyle = {
    maxWidth: 'min-content',
    fontSize: 'sm',
    textAlign: 'right',
    color: 'gray.500',
    fontStyle: 'italic',
};
