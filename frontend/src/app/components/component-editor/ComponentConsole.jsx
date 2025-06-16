import { Flex, Box, Tabs, Spacer } from '@chakra-ui/react';
import JsonSyntaxHighlighter from '../shared/JsonSyntaxHighlighter';

export default function ComponentConsole({ consoleOutput }) {
    return (
        <Tabs.Root {...ComponentConsoleTabsStyle} defaultValue='response'>
            <Flex flexDirection='column' height='100%'>
                {consoleOutput ? (
                    <Tabs.Content backgroundColor='veeva_sunset_yellow.five_percent_opacity' value='response'>
                        <JsonSyntaxHighlighter dataToDisplay={consoleOutput} />
                    </Tabs.Content>
                ) : null}
                <Spacer backgroundColor='veeva_sunset_yellow.five_percent_opacity' />
                <Box {...TabBoxStyle}>
                    <Tabs.List {...TabListStyle}>
                        <Tabs.Trigger {...TabLabelStyle} value='response'>
                            <Flex width='180px' alignItems='center' justifyContent='center'>
                                Response
                            </Flex>
                        </Tabs.Trigger>
                        <Tabs.Indicator {...TabIndicatorStyle} />
                    </Tabs.List>
                </Box>
            </Flex>
        </Tabs.Root>
    );
}

const ComponentConsoleTabsStyle = {
    variant: 'plain',
    position: 'relative',
    colorPalette: 'veeva_orange_color_mode',
    size: 'lg',
    height: '100%',
};

const TabListStyle = {
    flex: 1,
    width: '100%',
    height: '60px',
    borderTop: 'solid 3px',
    borderTopColor: 'gray.400',
    borderBottomRadius: '8px',
};

const TabBoxStyle = {
    backgroundColor: 'white_color_mode',
    position: 'sticky',
    bottom: '0',
    borderBottomRadius: '8px',
};

const TabLabelStyle = {
    fontSize: 'xl',
    color: 'veeva_orange_color_mode',
    borderBottom: 'none',
    borderBottomRadius: '8px',
    width: '180px',
    height: '100%',
};

const TabIndicatorStyle = {
    marginTop: '-3px',
    height: '3px',
    backgroundColor: 'veeva_orange_color_mode',
    width: '180px',
    zIndex: 1,
};
