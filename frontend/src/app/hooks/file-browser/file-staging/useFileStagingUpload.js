import { useFileUpload } from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { toaster } from '../../../components/shared/ui-components/toaster';
import { createFolderOrFile } from '../../../services/ApiService';
import { chunkFile, pollJobStatus } from '../../../services/SharedServices';
import {
    abortUploadSession,
    commitUploadSession,
    createResumableUploadSession,
    uploadToASession,
} from '../../../services/vapil/FileStagingRequest';

const MAX_FILE_SIZE = 536870912000; // 500 GB
const MAX_FILE_PART_SIZE = 52428800; // 50 MB

export default function useFileStagingUpload({ handleReloadFileStagingTreeFolder, selectedFileStagingFolder }) {
    const [creatingFileStagingFolder, setCreatingFileStagingFolder] = useState(false);
    const [newFileStagingFolderName, setNewFileStagingFolderName] = useState('');

    const createFileStagingFolderInputRef = useRef(null);

    const fileUploadRootProviderAttributes = useFileUpload({
        maxFiles: 1,
        maxFileSize: MAX_FILE_SIZE,
        onFileAccept: (details) => {
            fileUploadRootProviderAttributes.clearFiles();
            if (details.files.length < 1) {
                return;
            }

            let uploadPromise;
            const filePath = selectedFileStagingFolder?.data?.path;

            if (selectedFileStagingFolder) {
                if (details.files[0].size <= MAX_FILE_PART_SIZE) {
                    uploadPromise = handleFileUpload(details.files, filePath);
                } else {
                    uploadPromise = handleResumableFileUpload(details.files, filePath);
                }
            }
            toaster.promise(uploadPromise, {
                success: (response) => {
                    handleReloadFileStagingTreeFolder(filePath.slice(1));

                    return {
                        title: `${response.responseStatus}`,
                        description: `${details.files[0].name} uploaded successfully to ${filePath.slice(1)}`,
                        duration: 5000,
                    };
                },
                error: (error) => ({
                    title: 'FAILURE',
                    description: error.message,
                    duration: 10000,
                }),
                loading: {
                    title: 'Uploading',
                    description: `Uploading to ${selectedFileStagingFolder?.data?.path}`,
                },
            });
        },
        onFileReject: (details) => {
            fileUploadRootProviderAttributes.clearFiles();
            if (details.files.length < 1) {
                return;
            }
            let errorMessage = 'Unexpected error';
            if (details?.files[0]?.errors[0]) {
                errorMessage = details?.files[0]?.errors[0];
            }
            toaster.create({
                title: 'FAILURE',
                description: errorMessage,
                type: 'error',
                duration: 10000,
            });
        },
    });

    /**
     * Handles uploading a file to the selected folder
     * @param files - the file to upload
     * @param selectedFolderPath - the path of the selected folder to upload the file to
     * @returns {Promise<void>}
     */
    const handleFileUpload = async (files, selectedFolderPath) => {
        const file = files[0];
        const destinationPath = `${selectedFolderPath.slice(1)}/${file.name}`;

        const response = await createFolderOrFile('FILE', destinationPath, file);

        if (response?.responseStatus === 'SUCCESS') {
            return response;
        }

        if (response?.responseStatus === 'FAILURE') {
            throw new Error(response?.errors[0]?.message || 'Upload Failed');
        }

        throw new Error('Unknown Error Occurred');
    };

    /**
     * Handles uploading a file to the selected folder via resumable file upload endpoint
     * @param files - the file to upload
     * @param selectedFolderPath - the path of the selected folder to upload the file to
     * @returns {Promise<void>}
     */
    const handleResumableFileUpload = async (files, selectedFolderPath) => {
        try {
            const file = files[0];
            const destinationPath = `${selectedFolderPath.slice(1)}/${file.name}`;
            const fileSize = file.size;

            const { response: uploadSessionIdResponse } = await createResumableUploadSession(
                destinationPath,
                fileSize,
                true,
            );

            if (!uploadSessionIdResponse || uploadSessionIdResponse.responseStatus !== 'SUCCESS') {
                throw new Error(
                    uploadSessionIdResponse?.errors[0]?.message || 'Failed to create resumable upload session',
                );
            }

            const uploadSessionId = uploadSessionIdResponse.data.id;
            const fileParts = chunkFile(file);

            for (let i = 0; i < fileParts.length; i++) {
                const filepart = fileParts[i];
                const partNumber = i + 1;

                const { response: uploadFilepartResponse } = await uploadToASession(
                    uploadSessionId,
                    filepart,
                    filepart.size,
                    null,
                    partNumber,
                );

                if (!uploadFilepartResponse || uploadFilepartResponse.responseStatus === 'FAILURE') {
                    await abortUploadSession(uploadSessionId);
                    throw new Error(
                        uploadFilepartResponse?.errors[0]?.message ||
                            `Failed to upload filepart ${partNumber}. Aborting upload session.`,
                    );
                }
            }
            const { response: commitResponse } = await commitUploadSession(uploadSessionId);

            if (!commitResponse || commitResponse.responseStatus === 'FAILURE') {
                await abortUploadSession(uploadSessionId);
                throw new Error(
                    commitResponse?.errors[0]?.message || `Failed to commit session. Aborting upload session.`,
                );
            }

            return pollJobStatus(commitResponse.data.job_id);
        } catch (error) {
            console.error('Upload failed:', error);
            throw error;
        }
    };

    /**
     * Handles folder creation
     * @param folderName
     * @returns {Promise<void>}
     */
    const handleFolderCreate = async (folderName) => {
        const destinationPath = `${selectedFileStagingFolder.data.path.slice(1)}/${folderName}`;

        const response = await createFolderOrFile('FOLDER', destinationPath, null);

        if (response?.responseStatus === 'SUCCESS') {
            handleReloadFileStagingTreeFolder(selectedFileStagingFolder.data.path.slice(1));
            return response;
        }

        if (response?.responseStatus === 'FAILURE') {
            throw new Error(response?.errors[0]?.message || 'Upload Failed');
        }
        throw new Error('Unknown Error Occurred');
    };

    const handleCreateFileStagingFolderInputKeyDown = (e) => {
        if (e.key === 'Enter' && newFileStagingFolderName.trim() !== '') {
            handleFolderCreate(newFileStagingFolderName.trim());
            setCreatingFileStagingFolder(false);
            setNewFileStagingFolderName('');
        }

        if (e.key === 'Escape') {
            setCreatingFileStagingFolder(false);
            setNewFileStagingFolderName('');
        }
    };

    useEffect(() => {
        if (creatingFileStagingFolder) {
            createFileStagingFolderInputRef?.current?.focus();
        }
    }, [creatingFileStagingFolder]);

    return {
        createFileStagingFolderInputRef,
        creatingFileStagingFolder,
        setCreatingFileStagingFolder,
        newFileStagingFolderName,
        setNewFileStagingFolderName,
        fileUploadRootProviderAttributes,
        handleCreateFileStagingFolderInputKeyDown,
    };
}
