import { VStack, CheckboxGroup } from '@chakra-ui/react';
import { Checkbox } from '../shared/ui-components/checkbox';

export default function DataSelectionCheckboxGroup({
    type,
    selectedDataType,
    dataToDisplay,
    selectedOptions,
    setSelectedOptions,
    handleAllChecked,
    handleSingleChecked,
    disabled,
    extractVaultNames,
}) {
    const isAllDataSelected = selectedDataType === 'ALL';

    return (
        <VStack {...StackStyle}>
            <Checkbox
                disabled={isAllDataSelected || disabled}
                checked={isAllDataSelected || selectedOptions.length === dataToDisplay.length}
                onCheckedChange={(e) => handleAllChecked(!!e.checked)}
                defaultChecked
                colorPalette='veeva_midnight_indigo'
                fontWeight='bold'
            >
                Select All {type}
            </Checkbox>
            <CheckboxGroup
                value={selectedOptions}
                onValueChange={(e) => setSelectedOptions(e.value)}
                disabled={isAllDataSelected || disabled}
            >
                {dataToDisplay.map((option) => (
                    <Checkbox
                        key={option}
                        name={option}
                        checked={isAllDataSelected || selectedOptions.includes(extractVaultNames(option))}
                        onCheckedChange={(e) => handleSingleChecked(e.checked, option)}
                        colorPalette='veeva_midnight_indigo'
                        paddingInlineStart='30px'
                    >
                        {option}
                    </Checkbox>
                ))}
            </CheckboxGroup>
        </VStack>
    );
}

const StackStyle = {
    align: 'left',
    padding: '10px',
    margin: '10px',
    backgroundColor: 'white_color_mode',
    borderRadius: '8px',
    overflow: 'auto',
    width: '50%',
    fontSize: 'md',
};
