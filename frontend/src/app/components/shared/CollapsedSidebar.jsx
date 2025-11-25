import { Separator, Flex, IconButton, Spacer, Link } from '@chakra-ui/react';
import { PiListBold, PiSignOut, PiGear } from 'react-icons/pi';
import { Link as RouteLink } from 'react-router-dom';
import SidebarItems from '../../utils/shared/SidebarItems';
import SidebarItem from './SidebarItem';
import { Tooltip } from './ui-components/tooltip';

export default function CollapsedSidebar({ onOpen, onClose, currentRoute, logout }) {
    return (
        <Flex {...CollapsedSidebarFlexStyle}>
            <IconButton onClick={onOpen} {...ExpandSidebarButtonStyle}>
                <PiListBold style={{ width: 38, height: 38, margin: '10px' }} />
            </IconButton>
            {SidebarItems.map((tool) => (
                <SidebarItem key={tool.name} item={tool} currentRoute={currentRoute} onClose={onClose} />
            ))}
            <Spacer />
            <Link as={RouteLink} to='/settings' onClick={onClose} _hover={{ textDecoration: 'none' }} focusRing='none'>
                <Tooltip content='Settings' openDelay={0} positioning={{ placement: 'right' }}>
                    <Flex
                        {...SettingsIconButtonStyle}
                        borderColor={currentRoute === '/settings' ? 'veeva_orange_color_mode' : 'transparent'}
                    >
                        <PiGear style={{ width: 24, height: 24, transform: 'rotate(20deg)' }} />
                    </Flex>
                </Tooltip>
            </Link>
            <Flex width='100%' paddingX='10px'>
                <Separator
                    css={{ width: '100%', borderColor: 'gray_background_color_mode', borderWidth: '0 0 1px 0' }}
                />
            </Flex>
            <Tooltip content='Logout' positioning={{ placement: 'right' }} openDelay={0}>
                <IconButton onClick={logout} {...LogoutIconButtonStyle}>
                    <PiSignOut style={{ width: 24, height: 24 }} />
                </IconButton>
            </Tooltip>
        </Flex>
    );
}

const CollapsedSidebarFlexStyle = {
    flexDirection: 'column',
    height: '100%',
    width: 'auto',
    overflowY: 'auto',
    alignItems: 'center',
};

const ExpandSidebarButtonStyle = {
    width: '100%',
    height: '58px',
    variant: 'ghost',
    borderRadius: 0,
};

const LogoutIconButtonStyle = {
    variant: 'ghost',
    backgroundColor: 'white_color_mode',
    _hover: {
        backgroundColor: 'blue.400',
        color: 'white',
    },
    height: '42px',
    width: '42px',
    padding: '5px',
    margin: '10px',
    borderRadius: '10px',
};

const SettingsIconButtonStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    variant: 'ghost',
    backgroundColor: 'white_color_mode',
    _hover: {
        bg: 'veeva_orange_color_mode',
        color: 'white',
    },
    height: '42px',
    width: '42px',
    padding: '5px',
    margin: '10px',
    borderRadius: '10px',
    borderWidth: '3px',
};
