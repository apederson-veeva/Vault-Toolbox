import { Flex, Tabs, Separator } from '@chakra-ui/react';
import FeatureSettingsTab from './FeatureSettingsTab';
import GeneralSettingsTab from './GeneralSettingsTab';

export default function SettingsIsland() {
    return (
        <Flex {...ParentFlexStyle}>
            <Flex flexDirection='column' height='100%' width='100%'>
                <Tabs.Root {...TabsStyle} defaultValue='general'>
                    <Tabs.List {...TabListStyle}>
                        <Tabs.Trigger {...TabStyle} value='general'>
                            <Flex width='180px' alignItems='center' justifyContent='center'>
                                General
                            </Flex>
                        </Tabs.Trigger>
                        <Tabs.Trigger {...TabStyle} value='tools'>
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
                        <FeatureSettingsTab />
                    </Tabs.Content>
                </Tabs.Root>
            </Flex>
            <Separator border='1px solid thin' />
        </Flex>
    );
}

const ParentFlexStyle = {
    height: '100%',
    width: 'calc(100% - 20px)',
    margin: '0px',
    borderRadius: '8px',
    backgroundColor: 'white_color_mode',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
};

const TabsStyle = {
    flex: '0 0 auto',
    position: 'relative',
    variant: 'unstyled',
    size: 'lg',
};

const TabListStyle = {
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

const TabIndicatorStyle = {
    marginTop: '-3px',
    height: '3px',
    width: '180px',
    backgroundColor: 'veeva_orange_color_mode',
    zIndex: 1,
};
