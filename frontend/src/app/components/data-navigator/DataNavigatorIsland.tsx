import {
    Flex,
    Box,
    Tabs,
    FlexProps,
    TabsListProps,
    TabsTriggerProps,
    TabsIndicatorProps,
    UseTabsReturn,
} from '@chakra-ui/react';
import DataTabs from './DataTabs';

export default function DataNavigatorIsland({
    records,
    selectedTab,
    setSelectedTab,
    getRecordData,
    removeTabHandler,
    componentTypes,
}: {
    records: any;
    selectedTab: string;
    setSelectedTab: (selectedTab: string) => void;
    getRecordData: ({ recordId, objectName }: { recordId?: string; objectName?: string }) => void;
    removeTabHandler: (id: string, tabs: UseTabsReturn) => void;
    componentTypes: string[];
}) {
    return (
        <Flex {...ParentFlexStyle}>
            <Tabs.Root defaultValue='records' {...DataNavigatorTabsStyle}>
                <Flex flexDirection='column' height='100%' width='100%'>
                    <Box flex='1' minHeight='0'>
                        <Tabs.Content padding={0} height='100%' value='records'>
                            <DataTabs
                                records={records}
                                selectedTab={selectedTab}
                                setSelectedTab={setSelectedTab}
                                getRecordData={getRecordData}
                                removeTabHandler={removeTabHandler}
                                componentTypes={componentTypes}
                            />
                        </Tabs.Content>
                    </Box>
                    <Box>
                        <Tabs.List {...TabListStyle}>
                            <Tabs.Trigger {...TabLabelStyle}>
                                <Flex width='180px' alignItems='center' justifyContent='center'>
                                    Records
                                </Flex>
                            </Tabs.Trigger>
                            <Tabs.Indicator {...TabIndicatorStyle} />
                        </Tabs.List>
                    </Box>
                </Flex>
            </Tabs.Root>
        </Flex>
    );
}

const ParentFlexStyle: FlexProps = {
    height: '100%',
    maxHeight: '100%',
    overflowY: 'auto',
    width: 'calc(100% - 20px)',
    margin: '0px 0px 5px 0px',
    borderRadius: '8px',
    backgroundColor: 'veeva_sunset_yellow.five_percent_opacity', // Combined background
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
    flexDirection: 'column',
};

const DataNavigatorTabsStyle: Tabs.RootProps = {
    variant: 'plain',
    position: 'relative',
    colorPalette: 'veeva_orange_color_mode',
    size: 'lg',
    height: '100%',
    borderBottomRadius: '8px',
};

const TabListStyle: TabsListProps = {
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

const TabLabelStyle: TabsTriggerProps = {
    value: 'records',
    fontSize: 'xl',
    _selected: { color: 'veeva_orange_color_mode' },
    borderBottom: 'none',
    borderBottomRadius: '8px',
    width: '180px',
    minWidth: '180px',
    height: '100%',
};

const TabIndicatorStyle: TabsIndicatorProps = {
    marginTop: '-3px',
    width: '180px',
    height: '3px',
    backgroundColor: 'veeva_orange_color_mode',
    zIndex: 1,
};
