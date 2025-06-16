import { useEffect, useState, useCallback } from 'react';
import { VAULT_SUBDOMAINS } from '../../services/SharedServices';

export default function useVaultSession() {
    const [originatingUrl, setOriginatingUrl] = useState(null);
    const [originatingVaultSession, setOriginatingVaultSession] = useState(null);

    /**
     * Sends a message to background.js to retrieve the originating URL. It the originating URL was a Vault, returns
     * that Vault's hostname
     * @returns {Promise<unknown>}
     */
    const getOriginatingVaultHostname = useCallback(() => {
        return new Promise((resolve, reject) => {
            chrome.runtime.sendMessage({ action: 'getOriginatingUrl' }, (response) => {
                if (VAULT_SUBDOMAINS?.some((subdomain) => response?.originatingUrl?.includes(subdomain))) {
                    const parsedURL = new URL(response.originatingUrl);
                    const originatingVaultHostname = parsedURL.hostname.trim();

                    resolve(originatingVaultHostname);
                } else {
                    reject('Originating URL does not match a Vault subdomain');
                }
            });
        });
    }, []);

    /**
     * Retrieves the session ID from the provided Vault
     * @param getOriginatingVaultHostname - hostname of the orginating Vault
     * @returns {Promise<unknown>}
     */
    const getOriginatingVaultSession = useCallback((getOriginatingVaultHostname) => {
        return new Promise((resolve, reject) => {
            chrome.cookies.get({ name: 'TK', url: `https://${getOriginatingVaultHostname}` }, (vaultSessionCookie) => {
                if (!vaultSessionCookie) {
                    reject(null);
                }

                resolve(vaultSessionCookie?.value);
            });
        });
    }, []);

    /**
     * If Toolbox was launched from Vault, retrieves the URL and session ID from that Vault and loads it into state
     * @returns {Promise<void>}
     */
    const loadVaultSession = useCallback(async () => {
        // Short-circuit if the user has already logged out of Toolbox in this session
        const hasLoggedOutThisSession = JSON.parse(sessionStorage.getItem('hasLoggedOutThisSession'));
        if (hasLoggedOutThisSession) {
            return;
        }

        try {
            const originatingVaultHostname = await getOriginatingVaultHostname();
            if (!originatingVaultHostname) {
                return;
            }

            const sessionId = await getOriginatingVaultSession(originatingVaultHostname);
            if (!sessionId) {
                return;
            }

            setOriginatingUrl(originatingVaultHostname);
            setOriginatingVaultSession(sessionId);
        } catch (error) {
            console.error('Error loading Vault session', error);
            return;
        }
    }, [getOriginatingVaultHostname, getOriginatingVaultSession]);

    /*
        If Toolbox was launched from a Vault, retrieve the Vault session ID
     */
    useEffect(() => {
        loadVaultSession();
    }, [loadVaultSession]);

    return {
        originatingUrl,
        originatingVaultSession,
    };
}
