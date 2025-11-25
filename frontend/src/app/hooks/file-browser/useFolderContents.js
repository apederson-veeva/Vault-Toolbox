import { useState, useEffect, useCallback } from 'react';

export default function useFolderContents({ fileTree, selectedFolder }) {
    const [fileData, setFileData] = useState([]);

    /**
     * Retrieves the files within a particular folder of the provided tree (File Staging or Direct Data)
     */
    const retrieveFolderData = useCallback(() => {
        const tempData = [];
        const folderData = fileTree[selectedFolder?.index];

        folderData?.children?.map((itemKey) => {
            const item = fileTree[itemKey];
            tempData.push(item);
        });

        setFileData(tempData);
    }, [fileTree, selectedFolder]);

    useEffect(() => {
        if (fileTree && selectedFolder) {
            retrieveFolderData();
        }
    }, [fileTree, selectedFolder, retrieveFolderData]);

    return {
        fileData,
    };
}
