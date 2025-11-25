import { Flex, Link, Icon } from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';
import { Tooltip } from './ui-components/tooltip';

export default function SidebarItem({ item, currentRoute, children, onClose }) {
    const { settings } = useSettings();

    // Don't render if page is disabled, unless it's marked as alwaysShow (e.g. Vault Info)
    if (item.pageId && !item.alwaysShow && settings[item.pageId]?.enabled === false) {
        return null;
    }

    let thisItemsRoute = item.route;
    if (item.route !== '/') {
        thisItemsRoute = `/${item.route}`;
    }

    return (
        <Tooltip content={item.name} openDelay={0} positioning={{ placement: 'right' }}>
            <Link as={RouteLink} to={item.route} onClick={onClose} _hover={{ textDecoration: 'none' }} focusRing='none'>
                <Flex
                    {...SidebarItemStyle}
                    borderColor={thisItemsRoute === currentRoute ? 'veeva_orange_color_mode' : 'transparent'}
                >
                    {item.icon && <Icon {...IconStyle} as={item.icon} />}
                    {children}
                </Flex>
            </Link>
        </Tooltip>
    );
}

const SidebarItemStyle = {
    width: '100%',
    justifyContent: 'left',
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

const IconStyle = {
    boxSize: 8,
    _hover: { color: 'white' },
};
