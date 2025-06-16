import { Icon } from '@chakra-ui/react';
import { chakraComponents, CreatableSelect, Select } from 'chakra-react-select';
import { PiCaretDownBold } from 'react-icons/pi';

export default function CustomSelect({ displayDropdown = true, isCreatable = false, size = 'md', ...props }) {
    const components = CustomComponents(displayDropdown);

    /**
     * Create custom styling for the react-select
     * https://react-select.com/styles#inner-components
     */
    const selectStyles = {
        control: (provided) => ({
            ...provided,
            borderColor: 'light_gray_color_mode',
            borderRadius: '6px',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            padding: '3px',
        }),
        valueContainer: (provided) => ({
            ...provided,
            maxHeight: '50vh',
        }),
        groupHeading: (provided) => ({
            ...provided,
            backgroundColor: 'veeva_light_gray_color_mode',
            position: 'sticky',
            top: -1,
            zIndex: 1,
        }),
        menuList: (provided) => ({
            ...provided,
            maxHeight: '50vh',
            backgroundColor: 'white_color_mode',
        }),
    };

    return (
        <>
            {isCreatable ? (
                <CreatableSelect {...props} size={size} components={components} chakraStyles={selectStyles} />
            ) : (
                <Select {...props} size={size} components={components} chakraStyles={selectStyles} />
            )}
        </>
    );
}

const CustomComponents = (displayDropdown) => ({
    DropdownIndicator: displayDropdown
        ? (props) => (
              <chakraComponents.DropdownIndicator {...props}>
                  <Icon as={PiCaretDownBold} />
              </chakraComponents.DropdownIndicator>
          )
        : null,
});
