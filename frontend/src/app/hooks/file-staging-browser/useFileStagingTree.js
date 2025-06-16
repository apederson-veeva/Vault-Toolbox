import { useEffect, useRef, useState } from 'react';
import { listItemsAtAPath, listItemsAtAPathByPage } from '../../services/ApiService';

export default function useFileStagingTree() {
    const [fileStagingTree, setFileStagingTree] = useState({});
    const [fileStagingTreeError, setFileStagingTreeError] = useState('');
    const [loadingFileStagingTree, setLoadingFileStagingTree] = useState(false);
    const [loadingFileStagingTreeFolder, setLoadingFileStagingTreeFolder] = useState(false);
    const fileStagingTreeEnvironmentRef = useRef();
    const fileStagingTreeRef = useRef();
    const fileStagingRoot = {
        index: '/',
        isFolder: true,
        children: [],
        data: {
            name: '/',
            path: '/',
        },
    };

    /**
     * Calls the Vault REST API to build the File Staging tree
     * @returns {Promise<void>}
     */
    const retrieveFileStagingTree = async () => {
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

        tmpFileStagingTree['/'] = fileStagingRoot;

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
            setFileStagingTreeError(error?.message || error?.toString() || 'Error retrieving file staging tree');
        } finally {
            setLoadingFileStagingTree(false);
        }
    };

    /**
     * Calls the Vault REST API List Items at a Path endpoint with next_page url
     * @param {String} nextPage - Next page URL
     * @returns {Promise<void>}
     */
    const retrieveNextPage = async (nextPage) => {
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
    };

    /**
     * Method that is called recursively to add a File Staging item to the tree, and also check for and add
     * the nested folders leading up to the item (IE: /folder1/folder2/file.txt)
     * @param item - File Staging item
     * @param parts - Array of individual parts from a full path
     * @param parent - Parent to the current part being added
     * @param tree - File Staging tree
     */
    const addToTree = (item, parts, parent, tree) => {
        // Adjust the parent path to prevent double slashes
        const parentPath = parent === '/' ? '' : parent;
        const partKey = `${parentPath}/${parts[0]}`; // Construct unique key without double slash
        const isFolder = parts.length > 1 || item.kind === 'folder';

        if (!tree[partKey]) {
            tree[partKey] = {
                index: partKey,
                isFolder: isFolder,
                children: [],
                data: {
                    name: parts[0],
                    path: partKey,
                    ...(!isFolder && {
                        size: item.size,
                        modified_date: item.modified_date,
                    }),
                },
            };
            tree[parent].children.push(partKey);
        }

        if (parts.length > 1) {
            parts.shift();
            addToTree(item, parts, partKey, tree);
        }
    };

    /**
     * Builds the File Staging tree from the listItemsAtAPath API
     * @param {Object} listItemsResponse - Response from the listItemsAtAPath API
     * @param {Object} tmpFileStagingTree - Temporary file staging tree
     */
    const buildFileStagingTree = async (listItemsResponse, tmpFileStagingTree) => {
        listItemsResponse.data.forEach((item) => {
            const parts = item.path.split('/').filter(Boolean);
            addToTree(item, parts, '/', tmpFileStagingTree);
        });

        // Check for next_page and fetch more data if it exists
        if (listItemsResponse.responseDetails?.next_page) {
            const listItemsPageResponse = await retrieveNextPage(
                listItemsResponse.responseDetails.next_page,
                tmpFileStagingTree,
            );
            if (listItemsPageResponse?.data) {
                await buildFileStagingTree(listItemsPageResponse, tmpFileStagingTree);
            }
        }
    };

    /**
     * Retrieves file staging tree, waits for tree ref to initialize, then
     * sets expanded folders using callback
     * @param {Function} callback - Callback function to execute after tree is reloaded
     * @returns {Promise<void>}
     */
    const handleReloadFileStagingTree = async (callback) => {
        /**
         * Handles waiting for tree to initialize during reload
         * @param {Number} timeout - Timeout in milliseconds
         * @returns {Promise<unknown>}
         */
        const waitForTreeRefToInitialize = (timeout = 5000) =>
            new Promise((resolve, reject) => {
                const startTime = Date.now();

                const checkRef = () =>
                    fileStagingTreeRef.current
                        ? resolve()
                        : Date.now() - startTime >= timeout
                          ? reject(new Error('Timeout waiting for fileStagingTreeRef to initialize'))
                          : setTimeout(checkRef, 50);

                checkRef();
            });

        try {
            await retrieveFileStagingTree();
            await waitForTreeRefToInitialize();
            callback?.();
        } catch (error) {
            setFileStagingTreeError(error?.message || error?.toString() || 'Error reloading file staging tree');
        }
    };

    /**
     * Calls Vault REST API List Items at a path endpoint for a specific path and updates that folder
     * and all sub components in the file staging tree
     * @param {String} selectedFolderPath - Folder path to call the API for and update the tree
     * @returns {Promise<void>}
     */
    const handleReloadFileStagingTreeFolder = async (selectedFolderPath) => {
        try {
            setLoadingFileStagingTreeFolder(true);

            // Fetch latest items for the folder
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

            // Remove each item listed in `children` before resetting
            if (tmpFileStagingTree[updatedPath]?.children) {
                tmpFileStagingTree[updatedPath].children.forEach((child) => {
                    delete tmpFileStagingTree[child];
                });
            }

            // Reset `children` before repopulating with the new response
            tmpFileStagingTree[updatedPath] = {
                ...tmpFileStagingTree[updatedPath],
                children: [],
            };
            await updateFileStagingTreeFolder(listItemsResponse, tmpFileStagingTree);
            setFileStagingTree(tmpFileStagingTree);
        } catch (error) {
            setFileStagingTreeError(error?.message || error?.toString() || 'Error reloading file staging tree folder');
        } finally {
            setLoadingFileStagingTreeFolder(false);
        }
    };

    /**
     * Updates the file staging tree with the list items response and calls for next page results if required
     * @param listItemsResponse - Response from the listItemsAtAPath API
     * @param tmpFileStagingTree - Temporary file staging tree as it's being built
     * @returns {Promise<null>}
     */
    const updateFileStagingTreeFolder = async (listItemsResponse, tmpFileStagingTree = null) => {
        listItemsResponse.data.forEach((item) => {
            const parts = item.path.split('/').filter(Boolean);
            addToTree(item, parts, '/', tmpFileStagingTree);
        });

        // Check for next_page and fetch more data if it exists
        if (listItemsResponse.responseDetails?.next_page) {
            const listItemsPageResponse = await retrieveNextPage(
                listItemsResponse.responseDetails.next_page,
                tmpFileStagingTree,
            );
            if (listItemsPageResponse?.data) {
                await updateFileStagingTreeFolder(listItemsPageResponse, tmpFileStagingTree);
            }
        }
        return tmpFileStagingTree;
    };

    useEffect(() => {
        retrieveFileStagingTree();
    }, []);

    return {
        fileStagingTree,
        handleReloadFileStagingTree,
        loadingFileStagingTree,
        handleReloadFileStagingTreeFolder,
        loadingFileStagingTreeFolder,
        fileStagingTreeError,
        fileStagingTreeEnvironmentRef,
        fileStagingTreeRef,
        fileStagingRoot,
    };
}
