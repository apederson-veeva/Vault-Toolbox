import { useState } from 'react';
import { toaster } from '../../../components/shared/ui-components/toaster';
import { handleDeleteFileStagingItem } from '../../../services/ApiService';
import { pollJobStatus } from '../../../services/SharedServices';

export default function useConfirmFileStagingItemDeletion({
    selectedFileStagingFolder,
    handleReloadFileStagingTreeFolder,
}) {
    const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
    const [deleteConfirmationText, setDeleteConfirmationText] = useState('');
    const [deletedItem, setDeletedItem] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);

    const closeConfirmDeleteModal = () => {
        setIsConfirmDeleteModalOpen(false);
    };

    /**
     * Retrieves the path of a File Staging item
     * @param folder
     */
    const getPath = (folder) => {
        if (folder && folder.isFolder) {
            const parentPath = folder.data.path.substring(0, folder.data.path.lastIndexOf('/'));
            return parentPath === '' ? '/' : parentPath;
        } else {
            return folder ? folder.data.path : '';
        }
    };

    /**
     * Deletes a File Staging item
     * @returns {Promise<void>}
     */
    const deleteFileStagingItem = async () => {
        setIsDeleting(true);
        const deletePromise = performDeleteAndPoll();

        toaster.promise(deletePromise, {
            loading: {
                title: 'Deleting',
                description: `Deleting ${deletedItem?.data?.name}`,
            },
            success: (response) => {
                const path = getPath(selectedFileStagingFolder);
                handleReloadFileStagingTreeFolder(path.slice(1));

                setIsDeleting(false);
                setDeletedItem(null);
                return {
                    title: `${response.responseStatus}`,
                    description: `${deletedItem.data.name} deleted successfully.`,
                    duration: 5000,
                };
            },
            error: (error) => {
                setIsDeleting(false);
                setDeletedItem(null);
                return {
                    title: 'FAILURE',
                    description: error.message,
                    duration: 10000,
                };
            },
        });
    };

    /**
     * Initiates the deletion of a File Staging item and polls the status of that deletion job until it's complete.
     * @returns {Promise<object>}
     */
    const performDeleteAndPoll = async () => {
        const deleteResponse = await handleDeleteFileStagingItem(deletedItem.data.path, true);

        if (deleteResponse?.responseStatus === 'SUCCESS') {
            const jobId = deleteResponse.data.job_id;
            const jobResponse = await pollJobStatus(jobId);

            if (jobResponse?.responseStatus === 'SUCCESS' && jobResponse?.data?.status === 'SUCCESS') {
                return jobResponse;
            }

            if (jobResponse?.responseStatus === 'FAILURE' || jobResponse?.data?.status === 'FAILURE') {
                throw new Error(jobResponse?.errors[0]?.message || 'Upload Failed');
            }

            throw new Error('Unknown Error Occurred');
        }

        if (deleteResponse?.responseStatus === 'FAILURE') {
            throw new Error(deleteResponse?.errors[0]?.message || 'Upload Failed');
        }

        throw new Error('Unknown Error Occurred');
    };

    return {
        isConfirmDeleteModalOpen,
        setIsConfirmDeleteModalOpen,
        closeConfirmDeleteModal,
        deleteConfirmationText,
        setDeleteConfirmationText,
        deleteFileStagingItem,
        isDeleting,
        deletedItem,
        setDeletedItem,
    };
}
