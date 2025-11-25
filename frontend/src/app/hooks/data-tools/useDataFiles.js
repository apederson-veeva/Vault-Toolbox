import { useEffect, useState, useCallback } from 'react';
import { createFolderOrFile, listItemsAtAPath } from '../../services/ApiService';

export default function useDataFiles({ vaultToolboxPath }) {
    const [countFiles, setCountFiles] = useState([]);
    const [deleteFiles, setDeleteFiles] = useState([]);
    const [loadingFiles, setLoadingFiles] = useState(false);
    const [fetchFilesError, setFetchFilesError] = useState({ hasError: false, errorMessage: '' });
    const [secondsRemaining, setSecondsRemaining] = useState(30);
    const [activePolling, setActivePolling] = useState(true);

    /**
     * Retrieves Vault Data Tools files from File Staging. If necessary, creates
     * required file staging folders for current user.
     * @param {boolean} hasBeenCalledRecursively
     */
    const fetchFileData = useCallback(
        async (hasBeenCalledRecursively) => {
            setFetchFilesError({ hasError: false, errorMessage: '' }); // Clear existing errors
            setLoadingFiles(true);

            if (!vaultToolboxPath) return;
            const countFolderPath = `${vaultToolboxPath}/count`;
            const deleteFolderPath = `${vaultToolboxPath}/delete`;

            let tmpCountFiles;
            const countResponse = await listItemsAtAPath(countFolderPath);
            if (countResponse?.responseStatus === 'SUCCESS') {
                if (countResponse?.data) {
                    tmpCountFiles = countResponse.data.map((item) => ({
                        fileTimestamp: item.modified_date,
                        filePath: item.path,
                    }));
                }
            } else if (countResponse?.errors) {
                countResponse.errors.map(async (error) => {
                    if (error?.type === 'MALFORMED_URL') {
                        // Create the necessary folders and try again (once)
                        const createFoldersResponse = await createVaultDataToolsFileStagingFolders();
                        if (createFoldersResponse && !hasBeenCalledRecursively) {
                            fetchFileData(true);
                        } else {
                            setFetchFilesError({
                                hasError: true,
                                errorMessage: 'Error creating necessary file staging folders',
                            });
                        }
                    } else {
                        let error = 'Error retrieving count data files';
                        if (countResponse?.errors?.length > 0) {
                            error = `${countResponse?.errors[0]?.type} : ${countResponse?.errors[0]?.message}`;
                        }
                        setFetchFilesError({ hasError: true, errorMessage: error });
                    }
                });
            }
            setCountFiles(tmpCountFiles);

            let tmpDeleteFiles;
            const deleteResponse = await listItemsAtAPath(deleteFolderPath);
            if (deleteResponse?.responseStatus === 'SUCCESS') {
                if (deleteResponse?.data) {
                    tmpDeleteFiles = deleteResponse.data.map((item) => ({
                        fileTimestamp: item.modified_date,
                        filePath: item.path,
                    }));
                }
            } else if (deleteResponse?.errors) {
                deleteResponse.errors.map(async (error) => {
                    if (error?.type === 'MALFORMED_URL') {
                        // Create the necessary folders and try again (once)
                        const createFoldersResponse = await createVaultDataToolsFileStagingFolders();
                        if (createFoldersResponse && !hasBeenCalledRecursively) {
                            fetchFileData(true);
                        } else {
                            setFetchFilesError({
                                hasError: true,
                                errorMessage: 'Error creating necessary file staging folders',
                            });
                        }
                    } else {
                        let error = 'Error retrieving delete data files';
                        if (deleteResponse?.errors?.length > 0) {
                            error = `${deleteResponse?.errors[0]?.type} : ${deleteResponse?.errors[0]?.message}`;
                        }
                        setFetchFilesError({ hasError: true, errorMessage: error });
                    }
                });
            }
            setDeleteFiles(tmpDeleteFiles);

            setLoadingFiles(false);
        },
        [vaultToolboxPath, createVaultDataToolsFileStagingFolders],
    );

    /**
     * Creates folders required for Vault Data Tools
     * @returns true for success, false otherwise
     */
    const createVaultDataToolsFileStagingFolders = useCallback(async () => {
        const countFolderPath = `${vaultToolboxPath}/count`;
        const deleteFolderPath = `${vaultToolboxPath}/delete`;

        let response = await createFolderOrFile('FOLDER', vaultToolboxPath);
        if (!response?.responseStatus === 'SUCCESS') {
            return false;
        }

        response = await createFolderOrFile('FOLDER', countFolderPath);
        if (!response?.responseStatus === 'SUCCESS') {
            return false;
        }

        response = await createFolderOrFile('FOLDER', deleteFolderPath);
        if (!response?.responseStatus === 'SUCCESS') {
            return false;
        }

        // All folders created successfully
        return true;
    }, [vaultToolboxPath]);

    const handleFileRefresh = useCallback(() => {
        fetchFileData();
        setSecondsRemaining(30);
    }, [fetchFileData]);

    // Fetch result from the Vault File Staging area upon load or when the path changes
    useEffect(() => {
        fetchFileData();
    }, [fetchFileData, vaultToolboxPath]);

    // Fetch results from the Vault File Staging area every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setSecondsRemaining((secondsRemaining) => secondsRemaining - 1);

            if (secondsRemaining === 0 && activePolling) {
                handleFileRefresh();
            }
        }, 1000); // Update every second

        return () => clearInterval(interval);
    }, [secondsRemaining, fetchFileData, activePolling, handleFileRefresh]);

    // Timeout auto-refresh after 5 minutes
    useEffect(() => {
        const activePollingTimeout = setTimeout(
            () => {
                setActivePolling(false);
            },
            5 * 60 * 1000, // 5 minutes
        );

        return () => clearTimeout(activePollingTimeout);
    }, []);

    return {
        countFiles,
        deleteFiles,
        loadingFiles,
        fetchFilesError,
        secondsRemaining,
        activePolling,
        handleFileRefresh,
    };
}
