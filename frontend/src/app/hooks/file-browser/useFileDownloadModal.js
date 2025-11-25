import { useState } from 'react';

export const SUCCESS = 'SUCCESS';
export const FAILURE = 'FAILURE';
export const IN_PROGRESS = 'IN_PROGRESS';
export const CANCELLED = 'CANCELLED';

export default function useFileDownloadModal() {
    const [isFileDownloadModalOpen, setIsFileDownloadModalOpen] = useState(false);

    const closeDownloadModal = () => {
        setIsFileDownloadModalOpen(false);
    };

    return {
        isFileDownloadModalOpen,
        setIsFileDownloadModalOpen,
        closeDownloadModal,
    };
}
