import { Box } from '@chakra-ui/react';
import { Select, chakraComponents } from 'chakra-react-select';
import { PiMagnifyingGlass } from 'react-icons/pi';
import useFileBrowserSearch from '../../../hooks/file-browser/useFileBrowserSearch';
import { InputGroup } from '../../shared/ui-components/input-group';

const Input = (props) => <chakraComponents.Input {...props} isHidden={false} />;

export default function DirectDataBrowserSearchBar({
    directDataTree,
    handleDirectDataSearchResultClick,
    directDataSearchOptions,
}) {
    const {
        searchValue: directDataSearchValue,
        searchInputValue: directDataSearchInputValue,
        onSearchValueChange: onDirectDataSearchValueChange,
        onSearchInputChange: onDirectDataSearchInputChange,
    } = useFileBrowserSearch({
        fileTree: directDataTree,
        handleSearchResultClick: handleDirectDataSearchResultClick,
    });

    return (
        <InputGroup marginX='5px' flexGrow={1} startElement={<PiMagnifyingGlass size={24} />}>
            <Box width='100%' marginRight='6px'>
                <Select
                    options={directDataSearchOptions.length > 0 ? directDataSearchOptions : []}
                    isClearable
                    value={directDataSearchValue}
                    inputValue={directDataSearchInputValue}
                    onInputChange={onDirectDataSearchInputChange}
                    onChange={onDirectDataSearchValueChange}
                    controlShouldRenderValue={false}
                    placeholder='Type to search direct data files...'
                    noOptionsMessage={() =>
                        directDataSearchInputValue.length === 0
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
