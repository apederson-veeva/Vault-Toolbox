import { useCallback, useEffect, useRef, useState } from 'react';
import { toaster } from '../../../components/shared/ui-components/toaster';
import { downloadDirectDataFile } from '../../../services/ApiService';
import { FAILURE, CANCELLED, SUCCESS, IN_PROGRESS } from '../useFileDownloadModal';

const showErrorToast = (error) => {
    const title = error?.type || 'Download Failed';
    const description = error?.message || 'An unknown error occurred.';

    toaster.create({
        title,
        description,
        status: 'error',
        duration: 5000,
        isClosable: true,
    });
};

export default function useDirectDataBrowser({ directDataTree, setSelectedDirectDataFolder }) {
    const [selectedDirectDataSearchResult, setSelectedDirectDataSearchResult] = useState(null);
    const [directDataSearchOptions, setDirectDataSearchOptions] = useState([]);
    const [downloadingDirectDataFileName, setDownloadingDirectDataFileName] = useState(null);
    const [downloadDirectDataItemStatus, setDownloadDirectDataItemStatus] = useState('');
    const downloadStatusRef = useRef(downloadDirectDataItemStatus);

    /**
     * Handles downloading a Direct Data item
     */
    const handleDownloadDirectDataItemClick = useCallback(async (item, setIsFileDownloadModalOpen) => {
        setDownloadDirectDataItemStatus(IN_PROGRESS);
        setIsFileDownloadModalOpen(true);
        const { fileparts, filepart_details, filename, name } = item.data;
        setDownloadingDirectDataFileName(name);

        try {
            if (fileparts === 1) {
                const response = await downloadDirectDataFile(filepart_details[0].name);

                if (response?.responseStatus === FAILURE) {
                    setDownloadDirectDataItemStatus(FAILURE);
                    showErrorToast(response.errors?.[0]);
                    return;
                }

                triggerDownload(response, filename);
            } else if (fileparts > 1) {
                const blobs = [];
                let downloadFailed = false;

                for (const part of filepart_details) {
                    if (downloadStatusRef.current === CANCELLED) {
                        downloadFailed = true;
                        setDownloadingDirectDataFileName(null);
                        setDownloadDirectDataItemStatus(FAILURE);
                        showErrorToast({ message: 'Download was cancelled by the user.' });
                        break;
                    }

                    const response = await downloadDirectDataFile(part.name);

                    if (response?.responseStatus === FAILURE) {
                        setDownloadDirectDataItemStatus(FAILURE);
                        showErrorToast(response.errors?.[0]);
                        downloadFailed = true;
                        break;
                    }

                    blobs.push(response);
                }

                if (!downloadFailed) {
                    const concatenatedBlob = new Blob(blobs);
                    triggerDownload(concatenatedBlob, filename);
                    setDownloadDirectDataItemStatus(SUCCESS);
                }
            } else {
                showErrorToast({ message: 'No file parts found to download.' });
            }
        } catch (error) {
            console.error('Download failed unexpectedly:', error);
            setDownloadDirectDataItemStatus(FAILURE);
            showErrorToast({ message: 'A network error occurred during the download.' });
        } finally {
            setDownloadingDirectDataFileName(null);
            setIsFileDownloadModalOpen(false);
        }
    }, []);

    const triggerDownload = (blob, filename) => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    };

    /**
     * Retrieves and sets the searchable items in the search bar, from the direct data tree.
     */
    const retrieveSearchOptions = useCallback(() => {
        const tmpSearchOptions = [];
        const excludedValues = ['root', 'Full', 'Incremental', 'Log'];

        if (directDataTree) {
            Object.values(directDataTree).forEach((item) => {
                if (!excludedValues.includes(item.index)) {
                    tmpSearchOptions.push({
                        value: item.index,
                        label: item.data?.name || item.index,
                    });
                }
            });
        }
        setDirectDataSearchOptions(tmpSearchOptions);
    }, [directDataTree]);

    /**
     * Handles when a search result is clicked.
     * @param {Object} item - Direct Data item
     */
    const handleDirectDataSearchResultClick = (item) => {
        setSelectedDirectDataSearchResult(item);
    };

    /**
     * Handles when a folder in the Direct Data folder tree is clicked. Clears existing search selections if needed.
     * @param {Object} item - selected folder item
     */
    const handleDirectDataFolderClick = (item) => {
        setSelectedDirectDataFolder(item);
        if (selectedDirectDataSearchResult) {
            setSelectedDirectDataSearchResult(null);
        }
    };

    /**
     * Sync the download status ref whenever the state changes
     */
    useEffect(() => {
        downloadStatusRef.current = downloadDirectDataItemStatus;
    }, [downloadDirectDataItemStatus]);

    /**
     * When a search result is selected, update the selected folder if needed.
     */
    useEffect(() => {
        if (selectedDirectDataSearchResult) {
            const parentFolder = Object.values(directDataTree).find((folder) =>
                folder.children.includes(selectedDirectDataSearchResult?.index),
            );
            setSelectedDirectDataFolder(parentFolder);
        }
    }, [selectedDirectDataSearchResult, directDataTree, setSelectedDirectDataFolder]);

    /**
     * Update the search options and default the selected folder to 'Full' anytime the tree changes
     */
    useEffect(() => {
        retrieveSearchOptions();
        setSelectedDirectDataFolder(directDataTree.Full);
    }, [directDataTree, retrieveSearchOptions, setSelectedDirectDataFolder]);

    return {
        downloadingDirectDataFileName,
        handleDownloadDirectDataItemClick,
        directDataSearchOptions,
        selectedDirectDataSearchResult,
        handleDirectDataFolderClick,
        handleDirectDataSearchResultClick,
        downloadDirectDataItemStatus,
        setDownloadDirectDataItemStatus,
    };
}
