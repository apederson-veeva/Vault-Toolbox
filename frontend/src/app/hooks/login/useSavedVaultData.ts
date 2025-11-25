import { useState, useEffect, useRef, useCallback, Dispatch, SetStateAction } from 'react';
import { VAULT_SUBDOMAINS } from '../../services/SharedServices';

const SAVED_VAULTS = 'savedVaults';
const DEFAULT = 'default';
const VAULT_DNS = 'vaultDNS';
const USERNAME = 'username';

export interface SavedVault {
    vaultDNS?: string;
    username?: string;
    default?: boolean;
}

interface UseSavedVaultDataProps {
    setUserName: Dispatch<SetStateAction<string>>;
    setVaultDNS: Dispatch<SetStateAction<string>>;
    setFocusToPasswordInput: () => void;
    setFocusToUsernameInput: () => void;
}

export default function useSavedVaultData({
    setUserName,
    setVaultDNS,
    setFocusToPasswordInput,
    setFocusToUsernameInput,
}: UseSavedVaultDataProps) {
    const [savedVaultData, setSavedVaultData] = useState<Array<SavedVault>>([]);
    const savedVaultDataRef = useRef(savedVaultData);

    /**
     * Loads the Saved Vaults table from Chrome storage into state.
     * If a default is set, loads those values into input fields.
     */
    const loadSavedVaults: () => Promise<void> = async () => {
        await chrome.storage.local.get(SAVED_VAULTS).then((result) => {
            setSavedVaultData(result[SAVED_VAULTS] ? result[SAVED_VAULTS] : []);

            if (result[SAVED_VAULTS]) {
                const savedVaults = result[SAVED_VAULTS];
                const defaultVaultIndex = savedVaults.findIndex((row: SavedVault) => row[DEFAULT] === true);

                // If a default Vault is set, load those fields into the input form
                if (defaultVaultIndex !== -1) {
                    setVaultDNS(savedVaults[defaultVaultIndex][VAULT_DNS].trim());
                    setUserName(savedVaults[defaultVaultIndex][USERNAME].trim());

                    setFocusToPasswordInput();
                }
            }
        });
    };

    /**
     * Handler for loading Saved Vaults. Also loads defaults when launching from a Vault.
     */
    const setDefaultsOnLoad: () => Promise<void> = useCallback(async () => {
        // Load saved Vaults from storage
        await loadSavedVaults();

        // If launched from a Vault, load that DNS instead of default
        await chrome.runtime.sendMessage({ action: 'getOriginatingUrl' }, (response) => {
            if (response && response.originatingUrl) {
                if (VAULT_SUBDOMAINS.some((subdomain) => response.originatingUrl.includes(subdomain))) {
                    const parsedURL = new URL(response.originatingUrl);
                    setVaultDNS(parsedURL.hostname.trim());

                    if (savedVaultDataRef.current.length > 0) {
                        const vaultIndex = savedVaultDataRef.current.findIndex(
                            (row) => row[VAULT_DNS] === parsedURL.hostname,
                        );

                        // If the originating Vault is in the saved Vault table, load its username
                        if (vaultIndex !== -1) {
                            setUserName(savedVaultDataRef?.current[vaultIndex][USERNAME]?.trim() || '');
                            setFocusToPasswordInput();
                        } else {
                            setUserName('');
                            setFocusToUsernameInput();
                        }
                    }
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        savedVaultDataRef.current = savedVaultData;
    }, [savedVaultData]);

    /**
     * Retrieve Saved Vaults defaults on page load.
     */
    useEffect(() => {
        setDefaultsOnLoad();
    }, [setDefaultsOnLoad]);

    return { savedVaultData, setSavedVaultData };
}
