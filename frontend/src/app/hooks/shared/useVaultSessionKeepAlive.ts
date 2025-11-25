import { useEffect } from 'react';
import { sessionKeepAlive } from '../../services/ApiService';

export default function useVaultSessionKeepAlive({ timeoutState }: { timeoutState: string }) {
    const vaultSessionKeepAlive = async () => {
        await sessionKeepAlive();
    };

    /**
     * Call the session keep alive endpoint
     */
    useEffect(() => {
        if (timeoutState === 'Idle') {
            // If user has gone idle, clear existing interval to stop session keep alive calls
            return () => clearInterval(runInterval);
        }

        vaultSessionKeepAlive();
        const runInterval = setInterval(vaultSessionKeepAlive, 9 * 60 * 1000);

        return () => clearInterval(runInterval);
    }, [timeoutState]);
}
