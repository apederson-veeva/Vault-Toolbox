import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
    convertArrayToSelectOptions,
    getVaultApiVersion,
    getVaultDns,
    ReactSelectOption,
} from '../../services/SharedServices';
import { retrieveApiVersions } from '../../services/vapil/AuthenticationRequest';

interface UseEditApiVersionProps {
    onClose: () => void;
}

export default function useEditApiVersion({ onClose }: UseEditApiVersionProps) {
    const { sessionId } = useAuth();

    const [selectedApiVersion, setSelectedApiVersion] = useState<ReactSelectOption | null>({
        value: getVaultApiVersion(),
        label: getVaultApiVersion(),
    });
    const [apiVersions, setApiVersions] = useState<ReactSelectOption[]>([]);
    const [vaultApiVersionsError, setVaultApiVersionsError] = useState({
        hasError: false,
        errorMessage: '',
    });
    const [loadingVaultApiVersions, setLoadingVaultApiVersions] = useState<boolean>(false);

    /**
     * Retrieves the current Vault's API Versions
     * @returns {Promise<void>}
     */
    const getApiVersions: () => Promise<void> = useCallback(async () => {
        setVaultApiVersionsError({ hasError: false, errorMessage: '' });
        setLoadingVaultApiVersions(true);

        const { response } = await retrieveApiVersions(sessionId, getVaultDns());
        if (response?.responseStatus === 'SUCCESS') {
            if (response?.values) {
                const apiVersionsArray = Object.keys(response.values).map((key) => key);
                setApiVersions(convertArrayToSelectOptions(apiVersionsArray.reverse()));
            }
        } else {
            let error = '';
            if (response?.errors?.length > 0) {
                error = `${response.errors[0].type} : ${response.errors[0].message}`;
            }
            setVaultApiVersionsError({ hasError: true, errorMessage: error });
        }

        setLoadingVaultApiVersions(false);
    }, [sessionId]);

    /**
     * Handles closing the select API version modal.
     */
    const handleModalClose: () => void = () => {
        setSelectedApiVersion(null);
        onClose();
    };

    /**
     * Handles saving the selected API version.
     */
    const handleSave: () => void = () => {
        if (selectedApiVersion) {
            sessionStorage.setItem('vaultApiVersion', selectedApiVersion?.value);
        }
        onClose();
    };

    /**
     * Retrieve the Vault's API Versions when the Modal is rendered
     */
    useEffect(() => {
        getApiVersions();
    }, [getApiVersions]);

    return {
        selectedApiVersion,
        setSelectedApiVersion,
        apiVersions,
        vaultApiVersionsError,
        loadingVaultApiVersions,
        handleSave,
        handleModalClose,
    };
}
