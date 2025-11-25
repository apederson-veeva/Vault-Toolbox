import { useEffect, useState, useCallback } from 'react';
import { query, retrieveDomainInformation } from '../../services/ApiService';

interface VaultInfoError {
    hasError: boolean;
    errorMessage: string;
}

interface VaultInfo {
    id: number;
    vault_name__v: string;
}

export default function useVaultInfo(): { vaultInfoError: VaultInfoError; loadingVaultInfo: boolean } {
    const [vaultInfoError, setVaultInfoError] = useState<VaultInfoError>({ hasError: false, errorMessage: '' });
    const [loadingVaultInfo, setLoading] = useState(false);

    /**
     * Retrieves Vault info via the Retrieve Domain Information and Validate Session
     * User endpoints.
     */
    const getVaultInfo = useCallback(async () => {
        setVaultInfoError({ hasError: false, errorMessage: '' });
        setLoading(true);

        const domainInfoResponse = await retrieveDomainInformation();
        if (domainInfoResponse?.responseStatus === 'SUCCESS') {
            const vaultIdString: string | null = sessionStorage.getItem('vaultId');
            const vaultId: number | null = vaultIdString ? parseInt(vaultIdString, 10) : null;
            const vaults = domainInfoResponse?.domain__v?.vaults__v;
            vaults.forEach((vault: VaultInfo) => {
                if (vault.id === vaultId) {
                    sessionStorage.setItem('vaultName', vault?.vault_name__v);

                    // Rename the tab with the Vault name
                    document.title = `VT - ${vault?.vault_name__v}`;
                }
            });
            sessionStorage.setItem('domainType', domainInfoResponse?.domain__v?.domain_type__v);

            // If domain info call is successful, query for the username
            const { queryResponse } = await query(
                `SELECT username__sys FROM user__sys WHERE id = '${sessionStorage.getItem('userId')}'`,
            );
            if (queryResponse?.responseStatus !== 'FAILURE') {
                sessionStorage.setItem('userName', queryResponse?.data[0]?.username__sys);
            } else {
                let error: string = '';
                if (queryResponse?.errors?.length > 0) {
                    error = `${queryResponse.errors[0].type} : ${queryResponse.errors[0].message}`;
                }
                setVaultInfoError({ hasError: true, errorMessage: error });
            }
        } else {
            let error: string = '';
            if (domainInfoResponse?.errors?.length > 0) {
                error = `${domainInfoResponse.errors[0].type} : ${domainInfoResponse.errors[0].message}`;
            }
            setVaultInfoError({ hasError: true, errorMessage: error });
        }

        setLoading(false);
    }, []);

    /**
     * Retrieve Vault Info on page load, if we don't already have it
     */
    useEffect(() => {
        if (!sessionStorage.getItem('vaultName')) {
            getVaultInfo();
        }
    }, [getVaultInfo]);

    return {
        vaultInfoError,
        loadingVaultInfo,
    };
}
