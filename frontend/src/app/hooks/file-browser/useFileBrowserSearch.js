import { useState } from 'react';

export default function useFileBrowserSearch({ fileTree, handleSearchResultClick }) {
    const [searchValue, setSearchValue] = useState();
    const [searchInputValue, setSearchInputValue] = useState('');

    /**
     * Update the input search value in state as it changes.
     * @param inputValue - user's input value
     * @param action - the action taken on the Select element
     */
    const onSearchInputChange = (inputValue, { action }) => {
        if (action === 'input-change') {
            setSearchInputValue(inputValue);
        }
    };

    /**
     * When a search value is selected, update state and call the handler for search result selection.
     * @param option - the selected search option
     */
    const onSearchValueChange = (option) => {
        setSearchValue(option);
        setSearchInputValue(option?.label || '');

        const selectedFile = fileTree[option?.value];
        if (selectedFile) {
            handleSearchResultClick(selectedFile);
        }
    };

    return {
        searchValue,
        searchInputValue,
        onSearchValueChange,
        onSearchInputChange,
    };
}
