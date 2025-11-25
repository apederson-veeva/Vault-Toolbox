import { useEffect, useState } from 'react';

export const FILE_STAGING = 'FILE_STAGING';
export const DIRECT_DATA = 'DIRECT_DATA';

export function useFileBrowserTabs({ showFileStaging, showDirectData }) {
    const [activeTab, setActiveTab] = useState(FILE_STAGING);

    useEffect(() => {
        if (!showFileStaging && showDirectData) {
            setActiveTab(DIRECT_DATA);
        }
    }, [showFileStaging, showDirectData]);

    return {
        activeTab,
        setActiveTab,
    };
}
