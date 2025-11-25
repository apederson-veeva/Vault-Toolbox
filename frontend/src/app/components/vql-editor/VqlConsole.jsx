import { Flex, Box, Spacer, Tabs, Table, Button, Tag, Text } from '@chakra-ui/react';
import { memo, useState, useEffect } from 'react';
import JsonSyntaxHighlighter from '../shared/JsonSyntaxHighlighter';
import VqlTableBody from './VqlTableBody';
import VqlTableHeader from './VqlTableHeader';

// Memoized to improve performance for very large query results
export default memo(
    ({
        consoleOutput,
        queryDescribe,
        getSubqueryFieldCount,
        isPicklist,
        isPrimaryFieldRichText,
        getMaxRowSize,
        nextPage,
        previousPage,
        queryNextPage,
        queryPreviousPage,
        isPrimaryFieldString,
        isSubqueryObject,
    }) => {
        const responseStatus = consoleOutput?.responseStatus;
        const defaultTab = responseStatus === 'FAILURE' ? 'json' : 'table';
        const hasSubqueries = queryDescribe?.subqueries?.length > 0;
        const headerRowSpan = hasSubqueries ? 2 : 1;

        const startingResultRange = consoleOutput?.responseDetails?.pageoffset + 1 || 1;
        const endingResultRange = consoleOutput?.responseDetails?.pageoffset + consoleOutput?.responseDetails?.size;
        const totalResults = consoleOutput?.responseDetails?.total;
        const hasResults = startingResultRange && endingResultRange && totalResults;

        const [activeTab, setActiveTab] = useState(defaultTab);

        useEffect(() => {
            setActiveTab(defaultTab);
        }, [defaultTab]);

        return (
            <Tabs.Root {...VqlConsoleTabsStyle} value={activeTab} onValueChange={(e) => setActiveTab(e.value)}>
                <Flex
                    flexDirection='column'
                    height='100%'
                    backgroundColor='veeva_sunset_yellow.five_percent_opacity'
                    borderBottomRadius='8px'
                >
                    {consoleOutput ? (
                        <Box overflow='auto'>
                            <Tabs.Content padding={0} value='table'>
                                {consoleOutput?.data && consoleOutput.data.length > 0 ? (
                                    <Table.Root size='md' variant='simple' stickyHeader>
                                        <VqlTableHeader
                                            consoleOutput={consoleOutput}
                                            queryDescribe={queryDescribe}
                                            hasSubqueries={hasSubqueries}
                                            isPicklist={isPicklist}
                                            isPrimaryFieldRichText={isPrimaryFieldRichText}
                                            isPrimaryFieldString={isPrimaryFieldString}
                                            isSubqueryObject={isSubqueryObject}
                                            getSubqueryFieldCount={getSubqueryFieldCount}
                                            headerRowSpan={headerRowSpan}
                                        />
                                        <VqlTableBody
                                            consoleOutput={consoleOutput}
                                            queryDescribe={queryDescribe}
                                            getMaxRowSize={getMaxRowSize}
                                        />
                                    </Table.Root>
                                ) : (
                                    <Box height='100%'>
                                        {consoleOutput?.data && (
                                            <JsonSyntaxHighlighter dataToDisplay='No results to display' />
                                        )}
                                    </Box>
                                )}
                            </Tabs.Content>
                            <Tabs.Content value='json'>
                                <JsonSyntaxHighlighter dataToDisplay={consoleOutput} />
                            </Tabs.Content>
                        </Box>
                    ) : null}
                    <Spacer />
                    <Tabs.List {...TabListStyle}>
                        <Tabs.Trigger {...TabLabelStyle} value='table'>
                            <Flex width='180px' alignItems='center' justifyContent='center'>
                                Table
                            </Flex>
                        </Tabs.Trigger>
                        <Tabs.Trigger {...TabLabelStyle} value='json'>
                            <Flex width='180px' alignItems='center' justifyContent='center'>
                                JSON
                            </Flex>
                        </Tabs.Trigger>
                        <Tabs.Indicator {...TabIndicatorStyle} />

                        <Spacer />
                        <Button {...PaginationButtonStyle} disabled={!previousPage} onClick={queryPreviousPage}>
                            <Text truncate>Previous Page</Text>
                        </Button>
                        {hasResults ? (
                            <Tag.Root {...PageNumberTagStyle}>
                                <Tag.Label color='veeva_dark_gray_text_color_mode'>
                                    {startingResultRange} - {endingResultRange} / {totalResults}
                                </Tag.Label>
                            </Tag.Root>
                        ) : null}
                        <Button {...PaginationButtonStyle} disabled={!nextPage} onClick={queryNextPage}>
                            <Text truncate>Next Page</Text>
                        </Button>
                    </Tabs.List>
                </Flex>
            </Tabs.Root>
        );
    },
);

const VqlConsoleTabsStyle = {
    variant: 'plain',
    position: 'relative',
    colorPalette: 'veeva_orange_color_mode',
    size: 'lg',
    height: '100%',
    borderBottomRadius: '8px',
};

const TabListStyle = {
    flex: 1,
    width: '100%',
    height: '60px',
    minHeight: '60px',
    maxHeight: '60px',
    borderTop: 'solid 3px',
    borderTopColor: 'gray.400',
    borderBottomRadius: '8px',
    bottom: 0,
    position: 'sticky',
    backgroundColor: 'white_color_mode',
};

const TabLabelStyle = {
    fontSize: 'xl',
    _selected: { color: 'veeva_orange_color_mode' },
    borderBottom: 'none',
    borderBottomRadius: '8px',
    width: '180px',
    minWidth: '180px',
    height: '100%',
};

const TabIndicatorStyle = {
    marginTop: '-3px',
    height: '3px',
    backgroundColor: 'veeva_orange_color_mode',
    width: '180px',
    zIndex: 1,
};

const PaginationButtonStyle = {
    backgroundColor: 'veeva_light_gray_color_mode',
    color: 'veeva_dark_gray_text_color_mode',
    boxShadow: '0 0 2px rgba(0,0,0,0.2)',
    fontSize: 'md',
    marginLeft: '0px',
    marginRight: '10px',
    marginY: '10px',
    width: '180px',
    variant: 'solid',
};

const PageNumberTagStyle = {
    backgroundColor: 'veeva_light_gray_color_mode',
    fontSize: 'md',
    color: 'veeva_dark_gray_text_color_mode',
    boxShadow: '0 0 2px rgba(0,0,0,0.2)',
    marginLeft: '0px',
    marginRight: '10px',
    marginY: '10px',
    width: 'auto',
    height: '40px',
    minWidth: 'max-content',
};
