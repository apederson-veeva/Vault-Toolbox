import { useEffect, useRef, useState } from 'react';
import { listItemsAtAPath, listItemsAtAPathByPage } from '../../services/ApiService';

export default function useFileStagingTree() {
    const [fileStagingTree, setFileStagingTree] = useState({});
    const [fileStagingTreeError, setFileStagingTreeError] = useState('');
    const [loadingFileStagingTree, setLoadingFileStagingTree] = useState(false);
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
            setFileStagingTreeError(error?.message || error?.toString() || 'An unexpected error occurred');
        } finally {
            setLoadingFileStagingTree(false);
        }
    };

    const retrieveNextPage = async (nextPage, tmpFileStagingTree) => {
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

            if (nextPageResponse.data) {
                await buildFileStagingTree(nextPageResponse, tmpFileStagingTree);
            }
        } catch (error) {
            setFileStagingTreeError(error?.message || error?.toString() || 'An unexpected error occurred');
        }
    };

    /**
     * Builds the File Staging tree from the listItemsAtAPath API
     * @param {Object} listItemsResponse - Response from the listItemsAtAPath API
     * @param {Object} tmpFileStagingTree - Temporary file staging tree
     */
    const buildFileStagingTree = async (listItemsResponse, tmpFileStagingTree) => {
        /**
         * Recursive function to add an item to the tree
         * @param {Object} item - File Staging Tree Item (file or folder)
         * @param {string[]} parts - Array of individual parts from a full path
         * @param {String} parent - Item's parent path
         * @param {Object} tree - File Staging Tree
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

        listItemsResponse.data.forEach((item) => {
            const parts = item.path.split('/').filter(Boolean);
            addToTree(item, parts, '/', tmpFileStagingTree);
        });

        // Check for next_page and fetch more data if it exists
        if (listItemsResponse.responseDetails?.next_page) {
            await retrieveNextPage(listItemsResponse.responseDetails.next_page, tmpFileStagingTree);
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

    useEffect(() => {
        retrieveFileStagingTree();
    }, []);

    return {
        fileStagingTree,
        handleReloadFileStagingTree,
        loadingFileStagingTree,
        fileStagingTreeError,
        fileStagingTreeEnvironmentRef,
        fileStagingTreeRef,
        fileStagingRoot,
    };
}
