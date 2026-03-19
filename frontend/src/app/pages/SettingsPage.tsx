import { VStack, Flex, Box, Spacer, Heading, StackProps, HeadingProps } from '@chakra-ui/react';
import { PanelGroup, Panel } from 'react-resizable-panels';
import SettingsIsland from '../components/settings/SettingsIsland';
import ContextualHelpButton from '../components/shared/ContextualHelpButton';
import VaultInfoIsland from '../components/shared/VaultInfoIsland';

export default function SettingsPage() {
    return (
        <Flex justify='flex-start' height='100%'>
            <VStack {...SettingsStackStyle}>
                <Flex width='100%' height='40px' margin='10px' alignItems='center'>
                    <Heading {...HeadingStyle}>Settings</Heading>
                </Flex>
                <SettingsIsland />
                <VaultInfoIsland />
            </VStack>
            <Box height='100vh' flex='0 0'>
                <Flex flexDirection='column' height='100%'>
                    <Spacer />
                    <ContextualHelpButton tooltip='Vault Toolbox - Unhinged Edition' url='https://github.com/veeva/Vault-Toolbox' />
                </Flex>
            </Box>
        </Flex>
    );
}

const SettingsStackStyle: StackProps = {
    height: '100%',
    backgroundColor: 'veeva_light_gray_color_mode',
    flex: 1,
    boxShadow: 'inset -5px 0 8px -8px rgba(0,0,0,0.3), inset 5px 0 8px -8px rgba(0,0,0,0.3)',
    gap: 0,
};

const HeadingStyle: HeadingProps = {
    color: 'veeva_orange_color_mode',
    minWidth: 'max-content',
    marginLeft: '25px',
    marginRight: '5px',
    fontSize: '2rem',
};
