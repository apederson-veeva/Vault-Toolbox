import { useState } from 'react';
import { toaster } from '../../components/shared/ui-components/toaster';
import { downloadItemContent } from '../../services/ApiService';

export default function useFileStagingBrowser({ fileStagingRoot, fileStagingTreeRef }) {
    const [selectedFolder, setSelectedFolder] = useState(fileStagingRoot);

    /**
     * Returns an array of nested paths from a given full path.
     * @param {String} filePath - The full path to a folder
     * @returns {string[]} - An array of nested paths
     */
    const getNestedPaths = (filePath) => {
        const segments = filePath.split('/').filter(Boolean);
        const nestedPaths = ['/'];
        let currentPath = '';

        segments.forEach((segment) => {
            currentPath = `${currentPath}/${segment}`;
            nestedPaths.push(currentPath);
        });

        return nestedPaths.slice(0, -1);
    };

    /**
     * Handles when a folder is selected in the Table Body, Breadcrumbs, or Tree.
     * Expands the Tree to the selected folder, and displays the contents in the Table Body.
     * @param {Object} selectedFolder
     */
    const onSelect = (selectedFolder) => {
        setSelectedFolder(selectedFolder);
        const nestedPaths = getNestedPaths(selectedFolder.index);
        fileStagingTreeRef.current.expandSubsequently(nestedPaths);
        fileStagingTreeRef.current.selectItems([selectedFolder.index]);
    };

    /**
     * Handles when a file's "Download" Icon is clicked.
     * @param {Object} item - File Staging Item
     * @returns {Promise<void>}
     */
    const handleDownloadItemClick = async (item) => {
        const downloadItemResponse = await downloadItemContent(item.data.path.replace(/^\//, '')); // Remove the leading / from the item path

        if (downloadItemResponse?.responseStatus === 'FAILURE') {
            let errorString = '';
            if (downloadItemResponse?.errors?.length > 0) {
                errorString = `${downloadItemResponse.errors[0].type} : ${downloadItemResponse.errors[0].message}`;
            }
            toaster.create({
                title: `${downloadItemResponse.errors[0].type}`,
                description: `${downloadItemResponse.errors[0].message}`,
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
            return;
        }

        const downloadUrl = URL.createObjectURL(downloadItemResponse);
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.download = item.data.name;
        document.body.appendChild(link);
        link.click();
    };

    return {
        selectedFolder,
        onSelect,
        handleDownloadItemClick,
    };
}
