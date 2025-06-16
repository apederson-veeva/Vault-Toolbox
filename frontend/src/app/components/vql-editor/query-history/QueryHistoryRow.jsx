import { Collapsible, Card, Table, Flex, Box, IconButton } from '@chakra-ui/react';
import { useState } from 'react';
import { PiArrowCounterClockwise, PiCaretRightBold, PiCaretUpBold } from 'react-icons/pi';
import { formatDateTime } from '../../../services/SharedServices';
import { Tooltip } from '../../shared/ui-components/tooltip';

export default function QueryHistoryRow({ query, loadQueryIntoEditor }) {
    const [showRowDetails, setShowRowDetails] = useState(false);
    const toggleRowDetails = () => setShowRowDetails(!showRowDetails);

    return (
        <>
            <Table.Row>
                <Table.Cell width='min-content'>
                    <IconButton
                        variant='ghost'
                        aria-label='Expand/Collapse Row Details'
                        size='sm'
                        onClick={toggleRowDetails}
                    >
                        {showRowDetails ? <PiCaretUpBold /> : <PiCaretRightBold />}
                    </IconButton>
                </Table.Cell>
                <Table.Cell
                    width='min-content'
                    style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                    }}
                >
                    {formatDateTime(query.time)}
                </Table.Cell>
                <Table.Cell width='min-content'>
                    <Tooltip content='Rebuild' openDelay={0} positioning={{ placement: 'bottom-start' }}>
                        <IconButton
                            variant='ghost'
                            colorPalette='blue'
                            size='sm'
                            onClick={() => loadQueryIntoEditor(query?.queryString)}
                        >
                            <PiArrowCounterClockwise />
                        </IconButton>
                    </Tooltip>
                </Table.Cell>
                <Table.Cell width='100%' maxWidth={0}>
                    {query.queryTarget}
                </Table.Cell>
            </Table.Row>
            {showRowDetails && (
                <Table.Row width='min-content'>
                    <Table.Cell colSpan={5}>
                        <Collapsible.Root open={showRowDetails}>
                            <Collapsible.Content>
                                <Card.Root size='sm' marginY={1}>
                                    <Card.Body>
                                        <Table.Root variant='simple' size='sm'>
                                            <Table.Body>
                                                <Table.Row>
                                                    <Table.Cell {...TableColumnStyle}>Time: </Table.Cell>
                                                    <Table.Cell>{formatDateTime(query.time)}</Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell {...TableColumnStyle}>Target: </Table.Cell>
                                                    <Table.Cell>{query.queryTarget}</Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell {...TableColumnStyle}>Results: </Table.Cell>
                                                    <Table.Cell>{query.results}</Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell {...TableColumnStyle}>Response Time: </Table.Cell>
                                                    <Table.Cell>{query.responseTimeInMs} ms</Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell {...TableColumnStyle}>Response Size: </Table.Cell>
                                                    <Table.Cell>{query.responseSizeInKB} KB</Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell {...TableColumnStyle}>
                                                        <Flex
                                                            justifyContent='flex-end'
                                                            alignItems='center'
                                                            width='100%'
                                                        >
                                                            <Box>Query String:</Box>
                                                        </Flex>
                                                    </Table.Cell>
                                                    <Table.Cell width='100%' maxWidth={0}>
                                                        <Box
                                                            overflow='hidden'
                                                            textOverflow='ellipsis'
                                                            whiteSpace='normal'
                                                        >
                                                            {query.queryString}
                                                        </Box>
                                                    </Table.Cell>
                                                </Table.Row>
                                                <Table.Row>
                                                    <Table.Cell {...TableColumnStyle}>Execution ID: </Table.Cell>
                                                    <Table.Cell>{query.vaultApiExecutionId}</Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table.Root>
                                    </Card.Body>
                                </Card.Root>
                            </Collapsible.Content>
                        </Collapsible.Root>
                    </Table.Cell>
                </Table.Row>
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
    whiteSpace: 'nowrap',
    overflow: 'hidden',
};
