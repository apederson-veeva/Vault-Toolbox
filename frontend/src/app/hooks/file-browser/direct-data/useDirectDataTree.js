import { useCallback, useEffect, useState } from 'react';
import { retrieveAvailableDirectDataFiles } from '../../../services/ApiService';

const DIRECT_DATA_FILE_EXTRACT_TYPES = ['Full', 'Incremental', 'Log'];
const INITIAL_DIRECT_DATA_TREE = {
    root: { index: 'root', data: 'root', isFolder: true, children: DIRECT_DATA_FILE_EXTRACT_TYPES },
    Full: { index: 'Full', isFolder: true, children: [], data: { name: 'Full' } },
    Incremental: { index: 'Incremental', isFolder: true, children: [], data: { name: 'Incremental' } },
    Log: { index: 'Log', isFolder: true, children: [], data: { name: 'Log' } },
};

export default function useDirectDataTree({ isActive }) {
    const [directDataTree, setDirectDataTree] = useState({});
    const [directDataTreeError, setDirectDataTreeError] = useState('');
    const [loadingDirectDataTree, setLoadingDirectDataTree] = useState(false);
    const [selectedDirectDataFolder, setSelectedDirectDataFolder] = useState(INITIAL_DIRECT_DATA_TREE.Full);
    const [selectedDirectDataTreeItems, setSelectedDirectDataTreeItems] = useState([
        selectedDirectDataFolder?.index || 'Full',
    ]);

    /**
     * Builds the Direct Data tree from the retrieveAvailableDirectDataFiles API
     * @param {Object} tmpDirectDataFileTree - Temporary Direct Data tree
     */
    const buildDirectDataTree = useCallback(async (tmpDirectDataFileTree) => {
        const { response } = await retrieveAvailableDirectDataFiles();
        if (response?.responseStatus === 'FAILURE') {
            const errorMsg = response.errors?.[0]?.message || `Failed to fetch Direct Data files.`;
            throw new Error(errorMsg);
        }
        for (const extractType of DIRECT_DATA_FILE_EXTRACT_TYPES) {
            const filteredItems = response.data.filter((item) => {
                return item.extract_type === `${extractType.toLowerCase()}_directdata`;
            });
            filteredItems.forEach((item) => {
                const itemKey = `${extractType}/${item.name}`;
                tmpDirectDataFileTree[itemKey] = {
                    index: itemKey,
                    isFolder: false,
                    children: [],
                    isDirectDataItem: true,
                    data: {
                        name: item.name,
                        filename: item.filename,
                        start_time: item.start_time,
                        stop_time: item.stop_time,
                        record_count: item.record_count,
                        size: item.size,
                        fileparts: item.fileparts,
                        filepart_details: item.filepart_details.map((part) => {
                            return {
                                name: part.name,
                                filepart: part.filepart,
                                size: part.size,
                                url: part.url,
                                md5checksum: part.md5checksum,
                            };
                        }),
                    },
                };
                tmpDirectDataFileTree[extractType].children.push(itemKey);
            });
        }
        return tmpDirectDataFileTree;
    }, []);

    /**
     * Calls the Vault REST API to build the Direct Data tree
     * @returns {Promise<void>}
     */
    const retrieveDirectDataFileTree = useCallback(async () => {
        setLoadingDirectDataTree(true);
        setDirectDataTreeError('');

        try {
            const initialTree = JSON.parse(JSON.stringify(INITIAL_DIRECT_DATA_TREE));
            const populatedTree = await buildDirectDataTree(initialTree);
            setDirectDataTree(populatedTree);
        } catch (error) {
            setDirectDataTreeError(error?.message || 'Error retrieving direct data tree');
        } finally {
            setLoadingDirectDataTree(false);
        }
    }, [buildDirectDataTree]);

    /**
     * Whenever the selected tree folder changes, update the selected tree items. This is so we can imperatively
     * control the UI of the tree.
     */
    useEffect(() => {
        if (selectedDirectDataFolder?.index) {
            setSelectedDirectDataTreeItems([selectedDirectDataFolder.index]);
        }
    }, [selectedDirectDataFolder]);

    /**
     * Load the DD file tree when the tab becomes active (selected)
     */
    useEffect(() => {
        if (isActive) {
            retrieveDirectDataFileTree();
        }
    }, [isActive, retrieveDirectDataFileTree]);

    return {
        directDataTree,
        selectedDirectDataFolder,
        setSelectedDirectDataFolder,
        selectedDirectDataTreeItems,
        setSelectedDirectDataTreeItems,
        loadingDirectDataTree,
        directDataTreeError,
    };
}
