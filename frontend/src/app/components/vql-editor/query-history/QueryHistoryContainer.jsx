import { Stack, Box, Heading, Separator, Table } from '@chakra-ui/react';
import { memo } from 'react';
import QueryHistoryRow from './QueryHistoryRow';

export default memo(({ queryHistory, loadQueryIntoEditor }) => {
    return (
        <Stack {...ParentStackStyle}>
            <Box position='sticky'>
                <Heading {...HeadingStyle}>Query History</Heading>
                <Separator {...HorizontalDividerStyle} />
            </Box>
            <Box {...QueryHistoryBoxStyle}>
                <Table.Root variant='simple' size='sm'>
                    <Table.Header>
                        <Table.Row>
                            <Table.ColumnHeader />
                            <Table.ColumnHeader>Time</Table.ColumnHeader>
                            <Table.ColumnHeader />
                            <Table.ColumnHeader>Target</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {queryHistory.map((query, queryRowCount) => {
                            return (
                                <QueryHistoryRow
                                    query={query}
                                    loadQueryIntoEditor={loadQueryIntoEditor}
                                    key={queryRowCount}
                                />
                            );
                        })}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Stack>
    );
});

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

const QueryHistoryBoxStyle = {
    paddingX: 3,
    overflow: 'auto',
};
