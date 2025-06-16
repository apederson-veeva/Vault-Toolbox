import { useDisclosure } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';
import useLogout from '../../hooks/shared/useLogout';
import CollapsedSidebar from './CollapsedSidebar';
import DrawerSidebar from './DrawerSidebar';

export default function Sidebar() {
    const { open, onOpen, onClose } = useDisclosure();
    const logout = useLogout();

    const location = useLocation();
    const currentRoute = location.pathname;

    return (
        <>
            {open && <DrawerSidebar open={open} onClose={onClose} currentRoute={currentRoute} logout={logout} />}
            <CollapsedSidebar onOpen={onOpen} onClose={onClose} currentRoute={currentRoute} logout={logout} />
        </>
    );
}
