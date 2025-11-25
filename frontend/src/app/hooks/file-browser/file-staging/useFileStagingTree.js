import { useCallback, useEffect, useState } from 'react';
import { listItemsAtAPath, listItemsAtAPathByPage } from '../../../services/ApiService';

const fileStagingRoot = {
    index: '/',
    data: {
        name: '/',
        path: '/',
    },
    isFolder: true,
    children: [],
};

export default function useFileStagingTree({ isActive }) {
    const [fileStagingTree, setFileStagingTree] = useState({});
    const [fileStagingTreeError, setFileStagingTreeError] = useState('');
    const [loadingFileStagingTree, setLoadingFileStagingTree] = useState(false);
    const [loadingFileStagingTreeFolder, setLoadingFileStagingTreeFolder] = useState(false);
    const [selectedFileStagingFolder, setSelectedFileStagingFolder] = useState({ ...fileStagingRoot });
    const [selectedFileStagingTreeItems, setSelectedFileStagingTreeItems] = useState([
        selectedFileStagingFolder?.index || '/',
    ]);
    const [expandedFileStagingTreeItems, setExpandedFileStagingTreeItems] = useState(['/']);

    /**
     * Method that is called recursively to add a File Staging item to the tree, and also check for and add
     * the nested folders leading up to the item (IE: /folder1/folder2/file.txt)
     * @param item - File Staging item
     * @param parts - Array of individual parts from a full path
     * @param parent - Parent to the current part being added
     * @param tree - File Staging tree
     */
    const addToFileStagingTree = useCallback((item, parts, parent, tree) => {
        const parentPath = parent === '/' ? '' : parent;
        const partKey = `${parentPath}/${parts[0]}`;
        const isFolder = parts.length > 1 || item.kind === 'folder';

        if (!tree[partKey]) {
            tree[partKey] = {
                index: partKey,
                isFolder: isFolder,
                children: [],
                data: {
                    name: parts[0],
                    path: partKey,
                    size: item.size || null, // Only exists for files, not folders
                    modified_date: item.modified_date || null, // Only exists for files, not folders
                },
            };

            tree[parent].children.push(partKey);
        }

        if (parts.length > 1) {
            parts.shift();
            addToFileStagingTree(item, parts, partKey, tree);
        }
    }, []);

    /**
     * Calls the Vault REST API List Items at a Path endpoint with next_page url
     * @param {String} nextPage - Next page URL
     * @returns {Promise<void>}
     */
    const retrieveNextPage = useCallback(async (nextPage) => {
        try {
            const nextPageResponse = await listItemsAtAPathByPage(nextPage);
            if (nextPageResponse?.responseStatus === 'FAILURE') {
                let error = '';
                if (nextPageResponse?.errors?.length > 0) {
                    error = `${nextPageResponse.errors[0].type} : ${nextPageResponse.errors[0].message}`;
                }
                setFileStagingTreeError(error);
                return;
            }
            return nextPageResponse;
        } catch (error) {
            setFileStagingTreeError(error?.message || error?.toString() || 'Error retrieving next page results');
        }
    }, []);

    /**
     * Builds the File Staging tree from the listItemsAtAPath API
     * @param {Object} listItemsResponse - Response from the listItemsAtAPath API
     * @param {Object} tmpFileStagingTree - Temporary file staging tree
     */
    const buildFileStagingTree = useCallback(
        async (listItemsResponse, tmpFileStagingTree) => {
            for (const item of listItemsResponse.data) {
                const parts = item.path.split('/').filter(Boolean);
                addToFileStagingTree(item, parts, '/', tmpFileStagingTree);
            }

            if (listItemsResponse.responseDetails?.next_page) {
                const listItemsPageResponse = await retrieveNextPage(listItemsResponse.responseDetails.next_page);
                if (listItemsPageResponse?.data) {
                    await buildFileStagingTree(listItemsPageResponse, tmpFileStagingTree);
                }
            }
        },
        [addToFileStagingTree, retrieveNextPage],
    );

    /**
     * Calls the Vault REST API to build the File Staging tree
     * @returns {Promise<void>}
     */
    const retrieveFileStagingTree = useCallback(async () => {
        setLoadingFileStagingTree(true);
        setFileStagingTreeError('');
        const tmpFileStagingTree = {
            root: {
                index: 'root',
                data: 'root',
                isFolder: true,
                children: ['/'],
            },
        };

        tmpFileStagingTree['/'] = JSON.parse(JSON.stringify(fileStagingRoot));

        try {
            const listItemsResponse = await listItemsAtAPath('', true);
            if (listItemsResponse?.responseStatus === 'FAILURE') {
                let error = '';
                if (listItemsResponse?.errors?.length > 0) {
                    error = `${listItemsResponse.errors[0].type} : ${listItemsResponse.errors[0].message}`;
                }
                setFileStagingTreeError(error);
                return;
            }
            if (listItemsResponse.data) {
                await buildFileStagingTree(listItemsResponse, tmpFileStagingTree);
                setFileStagingTree(tmpFileStagingTree);
            }
        } catch (error) {
            setFileStagingTreeError(error?.message || 'Error retrieving file staging tree');
        } finally {
            setLoadingFileStagingTree(false);
        }
    }, [buildFileStagingTree]);

    /**
     * Updates the file staging tree with the list items response and calls for next page results if required
     * @param listItemsResponse - Response from the listItemsAtAPath API
     * @param tmpFileStagingTree - Temporary file staging tree as it's being built
     * @returns {Promise<null>}
     */
    const updateFileStagingTreeFolder = useCallback(
        async (listItemsResponse, tmpFileStagingTree) => {
            for (const item of listItemsResponse.data) {
                const parts = item.path.split('/').filter(Boolean);
                addToFileStagingTree(item, parts, '/', tmpFileStagingTree);
            }
            if (listItemsResponse.responseDetails?.next_page) {
                const listItemsPageResponse = await retrieveNextPage(listItemsResponse.responseDetails.next_page);
                if (listItemsPageResponse?.data) {
                    await updateFileStagingTreeFolder(listItemsPageResponse, tmpFileStagingTree);
                }
            }
        },
        [addToFileStagingTree, retrieveNextPage],
    );

    /**
     * Calls Vault REST API List Items at a path endpoint for a specific path and updates that folder
     * and all subcomponents in the file staging tree
     * @param {String} selectedFolderPath - Folder path to call the API for and update the tree
     * @returns {Promise<void>}
     */
    const handleReloadFileStagingTreeFolder = async (selectedFolderPath) => {
        try {
            setLoadingFileStagingTreeFolder(true);
            const listItemsResponse = await listItemsAtAPath(selectedFolderPath, true);

            if (listItemsResponse?.responseStatus === 'FAILURE') {
                let error = '';
                if (listItemsResponse?.errors?.length > 0) {
                    error = `${listItemsResponse.errors[0].type} : ${listItemsResponse.errors[0].message}`;
                }
                setFileStagingTreeError(error);
                return;
            }

            const updatedPath = selectedFolderPath.startsWith('/') ? selectedFolderPath : `/${selectedFolderPath}`;
            const tmpFileStagingTree = { ...fileStagingTree };

            const clearSubtree = (tree, parentIndex) => {
                const children = tree[parentIndex]?.children || [];
                children.forEach((childKey) => {
                    if (tree[childKey]?.isFolder) {
                        clearSubtree(tree, childKey);
                    }
                    delete tree[childKey];
                });
                if (tree[parentIndex]) {
                    tree[parentIndex].children = [];
                }
            };

            clearSubtree(tmpFileStagingTree, updatedPath);

            await updateFileStagingTreeFolder(listItemsResponse, tmpFileStagingTree);
            setFileStagingTree(tmpFileStagingTree);
        } catch (error) {
            setFileStagingTreeError(error?.message || error?.toString() || 'Error reloading file staging tree folder');
        } finally {
            setLoadingFileStagingTreeFolder(false);
        }
    };

    useEffect(() => {
        if (isActive) {
            retrieveFileStagingTree();
        }
    }, [isActive, retrieveFileStagingTree]);

    return {
        fileStagingTree,
        selectedFileStagingFolder,
        setSelectedFileStagingFolder,
        selectedFileStagingTreeItems,
        setSelectedFileStagingTreeItems,
        expandedFileStagingTreeItems,
        setExpandedFileStagingTreeItems,
        loadingFileStagingTree,
        handleReloadFileStagingTreeFolder,
        loadingFileStagingTreeFolder,
        fileStagingTreeError,
    };
}
