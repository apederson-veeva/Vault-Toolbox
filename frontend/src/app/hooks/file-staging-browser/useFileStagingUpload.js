import { createFolderOrFile } from '../../services/ApiService';
import { useFileUpload } from '@chakra-ui/react';
import { toaster } from '../../components/shared/ui-components/toaster';

export default function useFileStagingUpload({ handleReloadFileStagingTreeFolder, selectedFolder }) {
    const fileUploadRootProviderAttributes = useFileUpload({
        maxFiles: 1,
        maxFileSize: 52428800,
        onFileAccept: (details) => {
            fileUploadRootProviderAttributes.clearFiles();
            if (details.files.length < 1) {
                return;
            }
            const uploadPromise = handleFileUpload(details.files, selectedFolder.data.path);
            toaster.promise(uploadPromise, {
                success: (response) => ({
                    title: `${response.responseStatus}`,
                    description: `${response?.data.name} uploaded successfully to ${response.data.path}`,
                    duration: 5000,
                }),
                error: (error) => ({
                    title: 'FAILURE',
                    description: error.message,
                    duration: 10000,
                }),
                loading: {
                    title: 'Uploading',
                    description: `Uploading to ${selectedFolder.data.path}`,
                },
            });
        },
        onFileReject: (details) => {
            fileUploadRootProviderAttributes.clearFiles();
            if (details.files.length < 1) {
                return;
            }
            if (details?.files[0]?.errors[0] === 'FILE_TOO_LARGE') {
                toaster.create({
                    title: 'BROWSER PLUGIN UPLOAD SIZE LIMIT',
                    description: (
                        <>
                            Uploading files above 50mb are only supported via{' '}
                            <a
                                href='https://developer.veevavault.com/api/25.1/#resumable-upload-sessions'
                                target='_blank'
                                rel='noopener noreferrer'
                                style={{ textDecoration: 'underline' }}
                            >
                                API
                            </a>
                            .
                        </>
                    ),
                    type: 'error',
                    duration: 10000,
                });
            }
        },
    });

    /**
     * Handles uploading a file to the selected folder
     * @param files - the file to upload
     * @param selectedFolderPath - the path of the selected folder to upload the file to
     * @returns {Promise<void>}
     */
    const handleFileUpload = async (files, selectedFolderPath) => {
        return new Promise(async (resolve, reject) => {
            try {
                const file = files[0];
                const destinationPath = `${selectedFolderPath.slice(1)}/${file.name}`;

                const response = await createFolderOrFile('FILE', destinationPath, file);

                if (response && response.responseStatus === 'SUCCESS') {
                    handleReloadFileStagingTreeFolder(selectedFolderPath.slice(1));
                    resolve(response);
                } else if (response?.responseStatus === 'FAILURE') {
                    reject(new Error(response?.errors[0]?.message || 'Upload Failed'));
                } else {
                    reject(new Error('Unknown Error Occurred'));
                }
            } catch (error) {
                reject(error);
            }
        });
    };

    return {
        handleFileUpload,
        fileUploadRootProviderAttributes,
    };
}
