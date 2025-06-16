import { Box, Flex, IconButton, Input } from '@chakra-ui/react';
import { PiMinusCircleBold } from 'react-icons/pi';
import CustomSelect from '../../shared/CustomSelect';

export default function QueryFilterRow({
    fieldOptions,
    handleSelectedFilterEdits,
    removeFilterRow,
    filter,
    filterRowIndex,
    getOperatorOptions,
    booleanValueOptions,
    picklistValueOptions,
    objectLifecycleStateOptions,
}) {
    const fieldType = filter?.field?.fieldType;
    const operatorOptions = getOperatorOptions(fieldType);
    const operator = filter?.operator;

    const primaryFields = fieldOptions.find((option) => option.label === 'Fields')?.options;
    const referenceOutboundFields = fieldOptions.find((option) => option.label === 'Outbound Relationships')?.options;
    const referenceParentFields = fieldOptions.find((option) => option.label === 'Parent Relationships')?.options;
    const objectFields = [
        ...primaryFields,
        ...(referenceOutboundFields || []),
        ...(referenceParentFields || []),
    ]?.filter(
        (field) =>
            (field.fieldType !== 'RichText' &&
                field.fieldType !== 'LongText' &&
                !field?.formula &&
                !field.isLookupField) ||
            (field.isLookupField && field.isSearchable),
    );

    return (
        <Flex key={filterRowIndex} {...FlexStyle}>
            <Box {...FieldBoxStyle}>
                <CustomSelect
                    options={objectFields}
                    placeholder='Field'
                    value={filter.field}
                    onChange={(newValue) => handleSelectedFilterEdits(newValue, filterRowIndex, 'field')}
                />
            </Box>
            <Box {...OperatorBoxStyle}>
                <CustomSelect
                    options={operatorOptions}
                    placeholder='Operator'
                    displayDropdown={false}
                    value={filter.operator}
                    onChange={(newValue) => handleSelectedFilterEdits(newValue, filterRowIndex, 'operator')}
                />
            </Box>
            {fieldType === 'Boolean' ? (
                <Box {...SelectValueBoxStyle}>
                    <CustomSelect
                        options={booleanValueOptions}
                        placeholder={fieldType ? `Value (${fieldType})` : 'Value'}
                        displayDropdown={false}
                        value={filter.value?.value}
                        onChange={(newValue) => handleSelectedFilterEdits(newValue?.value, filterRowIndex, 'value')}
                    />
                </Box>
            ) : (
                <>
                    {fieldType === 'Picklist' ? (
                        <Box {...SelectValueBoxStyle}>
                            <CustomSelect
                                options={picklistValueOptions}
                                isMulti={operator.value === 'CONTAINS'}
                                placeholder={fieldType ? `Value (${fieldType})` : 'Value'}
                                displayDropdown={false}
                                value={filter.value}
                                onChange={(newValue) => handleSelectedFilterEdits(newValue, filterRowIndex, 'value')}
                            />
                        </Box>
                    ) : (
                        <>
                            {filter?.field?.isObjectLifecycleStateField ? (
                                <Box {...SelectValueBoxStyle}>
                                    <CustomSelect
                                        options={objectLifecycleStateOptions}
                                        isMulti={operator.value === 'CONTAINS'}
                                        placeholder={fieldType ? `Value (${fieldType})` : 'Value'}
                                        displayDropdown={false}
                                        value={filter.value}
                                        onChange={(newValue) =>
                                            handleSelectedFilterEdits(newValue, filterRowIndex, 'value')
                                        }
                                    />
                                </Box>
                            ) : (
                                <>
                                    {operator.value === 'CONTAINS' ? (
                                        <Box {...SelectValueBoxStyle}>
                                            <CustomSelect
                                                isMulti
                                                isCreatable
                                                placeholder={`Enter multiple values (${fieldType})`}
                                                formatCreateLabel={(filter) => `Add: ${filter}`}
                                                noOptionsMessage={() => 'Press enter to add values...'}
                                                displayDropdown={false}
                                                value={filter.value}
                                                onChange={(newValue) =>
                                                    handleSelectedFilterEdits(newValue, filterRowIndex, 'value')
                                                }
                                            />
                                        </Box>
                                    ) : (
                                        <Input
                                            placeholder={fieldType ? `Value (${fieldType})` : 'Value'}
                                            value={filter.value}
                                            onChange={(event) =>
                                                handleSelectedFilterEdits(event.target.value, filterRowIndex, 'value')
                                            }
                                            {...InputStyle}
                                        />
                                    )}
                                </>
                            )}
                        </>
                    )}
                </>
            )}
            <IconButton {...DeleteRowButtonStyle} onClick={() => removeFilterRow(filterRowIndex)}>
                <PiMinusCircleBold size={18} />
            </IconButton>
        </Flex>
    );
}

const FlexStyle = {
    align: 'center',
    width: '100%',
};

const FieldBoxStyle = {
    marginRight: '5px',
    height: '100%',
    minWidth: '200px',
};

const OperatorBoxStyle = {
    marginRight: '5px',
    height: '100%',
    minWidth: '110px',
};

const SelectValueBoxStyle = {
    marginRight: '5px',
    height: '100%',
    flexGrow: 1,
};

const DeleteRowButtonStyle = {
    variant: 'ghost',
    borderRadius: 'full',
    align: 'left',
    marginRight: '5px',
    color: 'veeva_sunset_red_color_mode',
    size: 'sm',
    'aria-label': 'Delete filter row',
};

const InputStyle = {
    height: '100%',
    size: 'sm',
    variant: 'outline',
    borderColor: 'light_gray_color_mode',
    marginRight: '5px',
};
