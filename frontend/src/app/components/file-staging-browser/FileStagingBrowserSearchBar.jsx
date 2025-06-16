import { Box } from '@chakra-ui/react';
import { Select } from 'chakra-react-select';
import { PiMagnifyingGlass } from 'react-icons/pi';
import useFileStagingSearch from '../../hooks/file-staging-browser/useFileStagingSearch';
import { InputGroup } from '../shared/ui-components/input-group';

export default function FileStagingBrowserSearchBar({ fileStagingTree, onSelect }) {
    const { handleSearchResultClick, searchOptions, searchValue, setSearchValue, selectedSearchResult } =
        useFileStagingSearch({
            fileStagingTree,
            onSelect,
        });

    return (
        <InputGroup marginX='5px' flexGrow={1} startElement={<PiMagnifyingGlass size={24} />}>
            <Box width='100%' marginRight='6px'>
                <Select
                    value={selectedSearchResult}
                    openMenuOnClick={false}
                    options={searchValue.length > 0 ? searchOptions : []} // Only show options if input has at least 1 character
                    onInputChange={(value) => setSearchValue(value)}
                    placeholder='Type to search...'
                    onChange={(option) => handleSearchResultClick(fileStagingTree[option.value])}
                    noOptionsMessage={() =>
                        searchValue.length === 0 ? 'Type at least 1 character to search' : 'No results found'
                    }
                    components={{
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                    }}
                    chakraStyles={{
                        control: (provided) => ({
                            ...provided,
                            ...SelectComponentStyles,
                        }),
                        menu: (provided) => ({
                            ...provided,
                        }),
                    }}
                />
            </Box>
        </InputGroup>
    );
}

const SelectComponentStyles = {
    paddingLeft: '3rem',
    boxShadow: '0 0 5px rgba(0,0,0,0.25)',
    backgroundColor: 'white_color_mode',
    color: 'text_color_mode',
    border: 'transparent',
    borderRadius: 'md',
};
