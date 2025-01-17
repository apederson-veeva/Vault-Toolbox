import { useEffect, useState } from 'react';

export default function useFileStagingSearch({ fileStagingTree, onSelect }) {
    const [searchValue, setSearchValue] = useState('');
    const [selectedSearchResult, setSelectedSearchResult] = useState(null);
    const [searchOptions, setSearchOptions] = useState([]);

    /**
     * Retrieves and sets the searchable items in the search bar, from the File Staging Tree.
     */
    const retrieveSearchOptions = () => {
        const tmpSearchOptions = [];
        if (fileStagingTree) {
            Object.values(fileStagingTree).forEach((item) => {
                tmpSearchOptions.push({
                    value: item.index,
                    label: item.data.name,
                });
            });
        }
        setSearchOptions(tmpSearchOptions);
    };

    /**
     * Handles when a search result is clicked.
     * @param {Object} item - File Staging Item
     */
    const handleSearchResultClick = (item) => {
        setSelectedSearchResult(null); // Clear the selected item
        setSearchValue(''); // Clear the input field
        const itemToSelect = item.isFolder
            ? item
            : Object.values(fileStagingTree).find((parentItem) => parentItem.children.includes(item.index));
        onSelect(itemToSelect);
    };

    useEffect(() => {
        retrieveSearchOptions();
    }, [fileStagingTree]);

    return {
        handleSearchResultClick,
        searchOptions,
        searchValue,
        setSearchValue,
        selectedSearchResult,
    };
}
