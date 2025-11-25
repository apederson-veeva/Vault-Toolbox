import { Box } from '@chakra-ui/react';
import { Select, chakraComponents } from 'chakra-react-select';
import { PiMagnifyingGlass } from 'react-icons/pi';
import useFileBrowserSearch from '../../../hooks/file-browser/useFileBrowserSearch';
import { InputGroup } from '../../shared/ui-components/input-group';

const Input = (props) => <chakraComponents.Input {...props} isHidden={false} />;

export default function FileStagingBrowserSearchBar({
    fileStagingTree,
    handleFileStagingSearchResultClick,
    fileStagingSearchOptions,
}) {
    const {
        searchValue: fileStagingSearchValue,
        searchInputValue: fileStagingSearchInputValue,
        onSearchValueChange: onFileStagingSearchValueChange,
        onSearchInputChange: onFileStagingSearchInputChange,
    } = useFileBrowserSearch({
        fileTree: fileStagingTree,
        handleSearchResultClick: handleFileStagingSearchResultClick,
    });

    return (
        <InputGroup marginX='5px' flexGrow={1} startElement={<PiMagnifyingGlass size={24} />}>
            <Box width='100%' marginRight='6px'>
                <Select
                    options={fileStagingSearchOptions.length > 0 ? fileStagingSearchOptions : []}
                    isClearable
                    value={fileStagingSearchValue}
                    inputValue={fileStagingSearchInputValue}
                    onInputChange={onFileStagingSearchInputChange}
                    onChange={onFileStagingSearchValueChange}
                    controlShouldRenderValue={false}
                    placeholder='Type to search file staging...'
                    noOptionsMessage={() =>
                        fileStagingSearchInputValue.length === 0
                            ? 'Type at least 1 character to search'
                            : 'No results found'
                    }
                    components={{
                        Input: Input,
                        DropdownIndicator: () => null,
                        IndicatorSeparator: () => null,
                    }}
                    menuPortalTarget={document.body}
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
