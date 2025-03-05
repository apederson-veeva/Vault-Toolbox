import { Box, Button, Divider, Heading, Stack } from '@chakra-ui/react';
import QueryTargetSelector from './QueryTargetSelector';
import QueryFieldsSelector from './QueryFieldsSelector';
import QueryCategorySelector from './QueryCategorySelector';
import WhereClauseBuilder from './WhereClauseBuilder';

export default function QueryBuilderContainer({
    queryCategoryOptions,
    selectedQueryCategory,
    setSelectedQueryCategory,
    queryTargetOptions,
    queryTargetsError,
    loadingQueryTargets,
    selectedQueryTarget,
    setSelectedQueryTarget,
    selectedFields,
    setSelectedFields,
    fieldOptions,
    fieldOptionsError,
    loadingFieldMetadata,
    buildQuery,
    canBuildQuery,
    selectedFilters,
    handleSelectedFilterEdits,
    logicalOperator,
    setLogicalOperator,
    getOperatorOptions,
    booleanValueOptions,
    addNewFilterRow,
    picklistValueOptions,
    objectLifecycleStateOptions,
    removeFilterRow,
    previousQueryResults,
    addPreviousResultsFilterRow,
}) {
    return (
        <Stack {...ParentStackStyle}>
            <Box position='sticky'>
                <Heading {...HeadingStyle}>Query Builder</Heading>
                <Divider {...HorizontalDividerStyle} />
            </Box>
            <Box position='sticky' marginRight='5px'>
                <Button {...BuildQueryButtonStyle} onClick={buildQuery} isDisabled={!canBuildQuery()}>
                    Build Query in Editor
                </Button>
            </Box>
            <Box {...QueryBuilderBoxStyle}>
                <QueryCategorySelector
                    queryCategoryOptions={queryCategoryOptions}
                    selectedQueryCategory={selectedQueryCategory}
                    setSelectedQueryCategory={setSelectedQueryCategory}
                />
                {selectedQueryCategory ? (
                    <QueryTargetSelector
                        queryTargetOptions={queryTargetOptions}
                        queryTargetsError={queryTargetsError}
                        selectedQueryTarget={selectedQueryTarget}
                        setSelectedQueryTarget={setSelectedQueryTarget}
                        loadingQueryTargets={loadingQueryTargets}
                    />
                ) : null}
                {selectedQueryTarget ? (
                    <>
                        <QueryFieldsSelector
                            selectedFields={selectedFields}
                            setSelectedFields={setSelectedFields}
                            fieldOptions={fieldOptions}
                            fieldOptionsError={fieldOptionsError}
                            loadingFieldMetadata={loadingFieldMetadata}
                        />
                        <WhereClauseBuilder
                            fieldOptions={fieldOptions}
                            selectedFilters={selectedFilters}
                            handleSelectedFilterEdits={handleSelectedFilterEdits}
                            logicalOperator={logicalOperator}
                            setLogicalOperator={setLogicalOperator}
                            getOperatorOptions={getOperatorOptions}
                            booleanValueOptions={booleanValueOptions}
                            addNewFilterRow={addNewFilterRow}
                            picklistValueOptions={picklistValueOptions}
                            objectLifecycleStateOptions={objectLifecycleStateOptions}
                            removeFilterRow={removeFilterRow}
                            previousQueryResults={previousQueryResults}
                            addPreviousResultsFilterRow={addPreviousResultsFilterRow}
                        />
                    </>
                ) : null}
            </Box>
        </Stack>
    );
}

const ParentStackStyle = {
    height: '100%',
    flex: '0 0',
    backgroundColor: 'white.color_mode',
};

const HeadingStyle = {
    color: 'veeva_orange.color_mode',
    size: 'md',
    margin: '5px',
};

const HorizontalDividerStyle = {
    borderColor: 'veeva_light_gray.500',
    borderWidth: '1px',
};

const BuildQueryButtonStyle = {
    size: 'sm',
    width: '100%',
    borderRadius: '6px',
    color: 'white',
    backgroundColor: 'veeva_orange.color_mode',
    fontWeight: 'bold',
};

const QueryBuilderBoxStyle = {
    height: '100%',
    overflow: 'auto',
};
