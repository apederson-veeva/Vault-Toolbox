import {
    Flex,
    Tabs,
    Separator,
    FlexProps,
    TabsRootProps,
    TabsIndicatorProps,
    TabsTriggerProps,
    TabsListProps,
} from '@chakra-ui/react';
import PageSettingsTab from './PageSettingsTab';
import GeneralSettingsTab from './GeneralSettingsTab';

export default function SettingsIsland() {
    return (
        <Flex {...ParentFlexStyle}>
            <Flex flexDirection='column' height='100%' width='100%'>
                <Tabs.Root {...TabsStyle} defaultValue='general'>
                    <Tabs.List {...TabListStyle}>
                        <Tabs.Trigger {...GeneralSettingsTabStyle}>
                            <Flex width='180px' alignItems='center' justifyContent='center'>
                                General
                            </Flex>
                        </Tabs.Trigger>
                        <Tabs.Trigger {...ToolSettingsTabStyle}>
                            <Flex width='180px' alignItems='center' justifyContent='center'>
                                Tools
                            </Flex>
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Tabs.Indicator {...TabIndicatorStyle} />
                    <Tabs.Content value='general'>
                        <GeneralSettingsTab />
                    </Tabs.Content>
                    <Tabs.Content value='tools'>
                        <PageSettingsTab />
                    </Tabs.Content>
                </Tabs.Root>
            </Flex>
            <Separator border='1px solid thin' />
        </Flex>
    );
}

const ParentFlexStyle: FlexProps = {
    height: '100%',
    width: 'calc(100% - 20px)',
    margin: '0px 0px 5px 0px',
    borderRadius: '8px',
    backgroundColor: 'white_color_mode',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
};

const TabsStyle: TabsRootProps = {
    flex: '0 0 auto',
    position: 'relative',
    variant: 'plain',
    size: 'lg',
};

const TabListStyle: TabsListProps = {
    height: '60px',
    width: '100%',
    borderBottom: 'solid 3px',
    borderBottomColor: 'gray.400',
};

const TabStyle = {
    color: 'veeva_orange_color_mode',
    fontSize: 'xl',
    width: '180px',
    height: '100%',
};

const GeneralSettingsTabStyle: TabsTriggerProps = {
    value: 'general',
    ...TabStyle,
};

const ToolSettingsTabStyle: TabsTriggerProps = {
    value: 'tools',
    ...TabStyle,
};

const TabIndicatorStyle: TabsIndicatorProps = {
    marginTop: '-3px',
    height: '3px',
    width: '180px',
    backgroundColor: 'veeva_orange_color_mode',
    zIndex: 1,
};
