import { Box, Button, Flex, Heading, HStack, VStack } from '@chakra-ui/react';
import { Fragment } from 'react';
import { PiPlus } from 'react-icons/pi';
import { RadioGroup, Radio } from '../../shared/ui-components/radio';
import QueryFilterRow from './QueryFilterRow';
export default function WhereClauseBuilder({
    fieldOptions,
    selectedFilters,
    handleSelectedFilterEdits,
    logicalOperator,
    setLogicalOperator,
    getOperatorOptions,
    booleanValueOptions,
    addNewFilterRow,
    removeFilterRow,
    picklistValueOptions,
    objectLifecycleStateOptions,
    previousQueryResults,
    addPreviousResultsFilterRow,
}) {
    return (
        <Flex {...FlexStyle}>
            <Box minWidth='75px' marginRight='5px'>
                <Heading size='sm'>Where: </Heading>
            </Box>
            <VStack {...VStackStyle}>
                {selectedFilters.length > 1 ? (
                    <Flex width='100%' align='center'>
                        <RadioGroup
                            onValueChange={(e) => setLogicalOperator(e.value)}
                            value={logicalOperator}
                            colorPalette='veeva_midnight_indigo'
                        >
                            <HStack>
                                <Radio value='AND'>AND</Radio>
                                <Radio value='OR'>OR</Radio>
                            </HStack>
                        </RadioGroup>
                    </Flex>
                ) : null}
                {selectedFilters.map((filter, filterRowIndex) => {
                    return (
                        <Fragment key={`fragment-${filterRowIndex}`}>
                            <QueryFilterRow
                                fieldOptions={fieldOptions}
                                handleSelectedFilterEdits={handleSelectedFilterEdits}
                                filter={filter}
                                filterRowIndex={filterRowIndex}
                                getOperatorOptions={getOperatorOptions}
                                booleanValueOptions={booleanValueOptions}
                                picklistValueOptions={picklistValueOptions}
                                objectLifecycleStateOptions={objectLifecycleStateOptions}
                                removeFilterRow={removeFilterRow}
                            />
                        </Fragment>
                    );
                })}
                <Flex gap='5px'>
                    <Button {...AddFilterButtonStyle} onClick={addNewFilterRow}>
                        <PiPlus />
                        Add Filter
                    </Button>
                    {previousQueryResults?.isMatch && previousQueryResults?.values?.length > 0 && (
                        <Button {...AddPreviousResultsFilterButtonStyle} onClick={addPreviousResultsFilterRow}>
                            <PiPlus />
                            Filter By Previous Results? {previousQueryResults?.queryTarget} (
                            {previousQueryResults?.values?.length})
                        </Button>
                    )}
                </Flex>
            </VStack>
        </Flex>
    );
}

const FlexStyle = {
    marginX: '5px',
    marginY: '10px',
    align: 'top',
};

const VStackStyle = {
    width: '100%',
    align: 'left',
    flexGrow: 1,
};

const AddFilterButtonStyle = {
    maxWidth: 'max-content',
    borderRadius: '6px',
    variant: 'subtle',
    colorPalette: 'blue',
    size: 'sm',
    'aria-label': 'Add filter row button',
};

const AddPreviousResultsFilterButtonStyle = {
    maxWidth: 'max-content',
    borderRadius: '6px',
    variant: 'subtle',
    colorPalette: 'green',
    size: 'sm',
    'aria-label': 'Add filter row button',
};
