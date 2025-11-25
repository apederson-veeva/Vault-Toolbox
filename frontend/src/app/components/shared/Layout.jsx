import { Flex, Box } from '@chakra-ui/react';
import { ErrorBoundary } from 'react-error-boundary';
import { Outlet } from 'react-router-dom';
import useIdleTimer from '../../hooks/shared/useIdleTimer';
import useVaultSessionKeepAlive from '../../hooks/shared/useVaultSessionKeepAlive';
import ErrorPage from '../../pages/ErrorPage';
import IdleWarningDialog from './IdleWarningDialog';
import Sidebar from './Sidebar';

export default function Layout() {
    const { timeoutState, promptOpen, remainingTime, activate } = useIdleTimer();
    useVaultSessionKeepAlive({ timeoutState });

    return (
        <Flex height='100vh'>
            <Box flex='none' width='auto'>
                <Sidebar />
            </Box>
            <Box flex={1} overflow='auto'>
                <ErrorBoundary fallbackRender={ErrorPage}>
                    <Outlet />
                </ErrorBoundary>
            </Box>
            {promptOpen ? (
                <IdleWarningDialog promptOpen={promptOpen} activate={activate} remainingTime={remainingTime} />
            ) : null}
        </Flex>
    );
}
