import { Button, Separator, Flex, Image, Link, Spacer, Stack, Text } from '@chakra-ui/react';
import { PiSignOut, PiGear } from 'react-icons/pi';
import { Link as RouteLink } from 'react-router-dom';
import logo from '../../../images/veeva-logo.png';
import SidebarItems from '../../utils/shared/SidebarItems';
import SidebarItem from './SidebarItem';
import { DrawerBackdrop, DrawerBody, DrawerContent, DrawerRoot } from './ui-components/drawer';
import { Tooltip } from './ui-components/tooltip';

export default function DrawerSidebar({ open, onClose, currentRoute, logout }) {
    return (
        <DrawerRoot open={open} placement='left' onOpenChange={onClose}>
            <DrawerBackdrop />
            <DrawerContent maxWidth='max-content' backgroundColor='white_color_mode'>
                <DrawerBody paddingY={0} paddingX='10px'>
                    <Flex flexDirection='column' height='100%'>
                        {/* Wrap header text in empty Link so it gets Drawer focus onOpen
                            This prevents focus going to 1st sidebar item and triggering toolitp */}
                        <Link as={RouteLink} _hover={{ textDecoration: 'none' }} focusRing='none'>
                            <Flex {...DevToolsFlexStyle}>
                                <Image src={logo} {...ToolboxIconStyle} />
                                <Text {...DevToolsTextStyle}>Vault Tools</Text>
                            </Flex>
                        </Link>
                        <Stack gap={0} marginTop={0}>
                            {SidebarItems.map((tool) => (
                                <SidebarItem key={tool.name} item={tool} currentRoute={currentRoute} onClose={onClose}>
                                    <Text marginLeft={4} fontSize='lg'>
                                        {tool.name}
                                    </Text>
                                </SidebarItem>
                            ))}
                        </Stack>
                        <Spacer />
                        <Link
                            as={RouteLink}
                            to='/settings'
                            onClick={onClose}
                            _hover={{ textDecoration: 'none' }}
                            focusRing='none'
                        >
                            <Tooltip content='Settings' openDelay={0} positioning={{ placement: 'right' }}>
                                <Flex
                                    {...SettingsButtonStyle}
                                    borderColor={
                                        currentRoute === '/settings' ? 'veeva_orange_color_mode' : 'transparent'
                                    }
                                >
                                    <PiGear style={{ width: 24, height: 24, transform: 'rotate(20deg)' }} />
                                    <Text marginLeft={4} fontSize='lg'>
                                        Settings
                                    </Text>
                                </Flex>
                            </Tooltip>
                        </Link>
                        <Flex width='100%' paddingX='5px'>
                            <Separator
                                css={{
                                    width: '100%',
                                    borderColor: 'gray_background_color_mode',
                                    borderWidth: '0 0 1px 0',
                                }}
                            />
                        </Flex>
                        <Button {...LogoutBtnStyle} onClick={logout}>
                            <PiSignOut style={{ width: 24, height: 24 }} />
                            Logout
                        </Button>
                    </Flex>
                </DrawerBody>
            </DrawerContent>
        </DrawerRoot>
    );
}

/**
 * Height set to match corresponding icon on the collapsed sidebar
 */
const DevToolsFlexStyle = {
    width: '100%',
    height: '58px',
    alignItems: 'center',
    justifyContent: 'center',
};

const DevToolsTextStyle = {
    fontSize: '2xl',
    fontWeight: 'bold',
    color: 'veeva_orange_color_mode',
};

const ToolboxIconStyle = {
    boxSize: '24px',
    alt: 'Vault Toolbox Icon',
    marginX: '5px',
};

const LogoutBtnStyle = {
    fontSize: 'md',
    variant: 'subtle',
    align: 'center',
    height: '42px',
    padding: '5px',
    marginX: 0,
    marginY: '10px',
    borderRadius: '10px',
    role: 'group',
    cursor: 'pointer',
    _hover: {
        backgroundColor: 'blue.400',
        color: 'white',
    },
};

const SettingsButtonStyle = {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    marginY: '10px',
    marginX: 0,
    borderWidth: '3px',
    borderRadius: '10px',
    role: 'group',
    cursor: 'pointer',
    _hover: {
        bg: 'veeva_orange_color_mode',
        color: 'white',
    },
    borderColor: 'veeva_orange_color_mode',
    fontSize: 'md',
};
