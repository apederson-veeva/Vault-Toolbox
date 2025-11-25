import { useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getVaultDNS } from '../../services/ApiService';

export default function useLogout() {
    const { setIsLoggedIn, setSessionId } = useAuth();

    return useCallback(() => {
        setIsLoggedIn(false);
        setSessionId('');
        chrome.cookies.remove({
            name: 'vaultToolboxSessionId',
            url: `https://${getVaultDNS()}`,
        });
        sessionStorage.clear();

        // Set a flag, so we don't log you back in automatically if you launched Toolbox from a Vault
        sessionStorage.setItem('hasLoggedOutThisSession', 'true');
        document.title = 'Vault Toolbox';
    }, [setIsLoggedIn, setSessionId]);
}
