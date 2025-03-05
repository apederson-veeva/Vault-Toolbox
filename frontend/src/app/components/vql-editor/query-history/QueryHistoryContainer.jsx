import { Stack, Box, Heading, Divider, Tr, TableContainer, Table, Thead, Th, Tbody, Accordion } from '@chakra-ui/react';
import { memo } from 'react';
import QueryHistoryRow from './QueryHistoryRow';

export default memo(({ queryHistory, loadQueryIntoEditor }) => {
    return (
        <Stack {...ParentStackStyle}>
            <Box position='sticky'>
                <Heading {...HeadingStyle}>Query History</Heading>
                <Divider {...HorizontalDividerStyle} />
            </Box>
            <Box {...QueryHistoryBoxStyle}>
                <Accordion allowMultiple reduceMotion>
                    <TableContainer>
                        <Table variant='simple' size='sm'>
                            <Thead>
                                <Tr>
                                    <Th></Th>
                                    <Th>Time</Th>
                                    <Th></Th>
                                    <Th>Target</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {queryHistory.map((query, queryRowCount) => {
                                    return (
                                        <QueryHistoryRow
                                            query={query}
                                            loadQueryIntoEditor={loadQueryIntoEditor}
                                            key={queryRowCount}
                                        />
                                    );
                                })}
                            </Tbody>
                        </Table>
                    </TableContainer>
                </Accordion>
            </Box>
        </Stack>
    );
});

const ParentStackStyle = {
    height: '100%',
    flex: '0 0',
    backgroundColor: 'white.color_mode',
};

const HeadingStyle = {
    color: 'veeva_orange.color_mode',
    size: 'md',
    margin: '5px',
};

const HorizontalDividerStyle = {
    borderColor: 'veeva_light_gray.500',
    borderWidth: '1px',
};

const QueryHistoryBoxStyle = {
    paddingX: 3,
    overflow: 'auto',
};
