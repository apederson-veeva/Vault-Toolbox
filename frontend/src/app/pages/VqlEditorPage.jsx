import { Box, Flex, VStack, Spacer, IconButton, Separator } from '@chakra-ui/react';
import { PiClockCounterClockwiseBold, PiTreeStructureBold } from 'react-icons/pi';
import { Panel, PanelGroup } from 'react-resizable-panels';
import ContextualHelpButton from '../components/shared/ContextualHelpButton';
import TelemetryData from '../components/shared/TelemetryData';
import VaultInfoIsland from '../components/shared/VaultInfoIsland';
import VerticalResizeHandle from '../components/shared/VerticalResizeHandle';
import VqlEditorIsland from '../components/vql-editor/VqlEditorIsland';
import VqlHeaderRow from '../components/vql-editor/VqlHeaderRow';
import VqlProdVaultWarningModal from '../components/vql-editor/VqlProdVaultWarningModal';
import QueryBuilderContainer from '../components/vql-editor/query-builder/QueryBuilderContainer';
import QueryHistoryContainer from '../components/vql-editor/query-history/QueryHistoryContainer';
import useQueryBuilder from '../hooks/vql-editor/useQueryBuilder';
import useQueryHistory from '../hooks/vql-editor/useQueryHistory';
import useQuerySidePanel from '../hooks/vql-editor/useQuerySidePanel';
import useVqlQuery from '../hooks/vql-editor/useVqlQuery';
import { isProductionVault } from '../services/SharedServices';

export default function VqlEditorPage() {
    const { queryHistory, updateQueryHistory } = useQueryHistory();
    const {
        code,
        setCode,
        consoleOutput,
        queryEditorTabIndex,
        previousPage,
        nextPage,
        queryDescribe,
        isExecutingQuery,
        isDownloading,
        queryTelemetryData,
        previousQueryResults,
        setPreviousQueryResults,
        submitVqlQuery,
        downloadQueryResults,
        loadQueryIntoEditor,
        getMaxRowSize,
        queryNextPage,
        queryPreviousPage,
        canDownload,
        getSubqueryFieldCount,
        isPicklist,
        isPrimaryFieldRichText,
        isPrimaryFieldString,
        isSubqueryObject,
    } = useVqlQuery({ updateQueryHistory });
    const {
        queryCategoryOptions,
        selectedQueryCategory,
        setSelectedQueryCategory,
        queryTargetOptions,
        queryTargetsError,
        loadingQueryTargets,
        selectedQueryTarget,
        setSelectedQueryTarget,
        fieldOptions,
        fieldOptionsError,
        loadingFieldMetadata,
        selectedFields,
        setSelectedFields,
        selectedFilters,
        handleSelectedFilterEdits,
        logicalOperator,
        setLogicalOperator,
        getOperatorOptions,
        booleanValueOptions,
        picklistValueOptions,
        objectLifecycleStateOptions,
        addNewFilterRow,
        removeFilterRow,
        addPreviousResultsFilterRow,
        buildQuery,
        canBuildQuery,
    } = useQueryBuilder({ setCode, previousQueryResults, setPreviousQueryResults });
    const {
        sidePanelRef,
        sidePanelCollapsed,
        onSidePanelCollapse,
        displayQueryBuilder,
        displayQueryHistory,
        toggleQueryBuilder,
        toggleQueryHistory,
    } = useQuerySidePanel();

    return (
        <>
            <Flex justify='flex-start' height='100%'>
                <PanelGroup direction='horizontal'>
                    <Panel id='vql-editor-panel' order={1}>
                        <VStack {...VqlEditorStackStyle}>
                            <VqlHeaderRow
                                consoleOutput={consoleOutput[queryEditorTabIndex]}
                                submitVqlQuery={submitVqlQuery}
                                downloadQueryResults={downloadQueryResults}
                                isExecutingQuery={isExecutingQuery}
                                isDownloading={isDownloading}
                                canDownload={canDownload}
                            />
                            <VqlEditorIsland
                                code={code}
                                setCode={setCode}
                                isExecutingApiCall={isExecutingQuery}
                                consoleOutput={consoleOutput[queryEditorTabIndex]}
                                queryDescribe={queryDescribe}
                                getSubqueryFieldCount={getSubqueryFieldCount}
                                isPicklist={isPicklist}
                                isPrimaryFieldRichText={isPrimaryFieldRichText}
                                isPrimaryFieldString={isPrimaryFieldString}
                                isSubqueryObject={isSubqueryObject}
                                getMaxRowSize={getMaxRowSize}
                                isDownloading={isDownloading}
                                nextPage={nextPage}
                                previousPage={previousPage}
                                queryNextPage={queryNextPage}
                                queryPreviousPage={queryPreviousPage}
                            />
                            <VaultInfoIsland>
                                <TelemetryData telemetryData={queryTelemetryData} />
                            </VaultInfoIsland>
                        </VStack>
                    </Panel>
                    {!sidePanelCollapsed ? (
                        <>
                            <VerticalResizeHandle sidePanelCollapsed={sidePanelCollapsed} />
                            <Panel
                                id='query-side-panel'
                                order={2}
                                defaultSize={50}
                                minSize={10}
                                maxSize={50}
                                collapsible
                                onCollapse={() => onSidePanelCollapse(true)}
                                onExpand={() => onSidePanelCollapse(false)}
                                ref={sidePanelRef}
                            >
                                {displayQueryBuilder ? (
                                    <QueryBuilderContainer
                                        queryCategoryOptions={queryCategoryOptions}
                                        selectedQueryCategory={selectedQueryCategory}
                                        setSelectedQueryCategory={setSelectedQueryCategory}
                                        queryTargetOptions={queryTargetOptions}
                                        queryTargetsError={queryTargetsError}
                                        loadingQueryTargets={loadingQueryTargets}
                                        selectedQueryTarget={selectedQueryTarget}
                                        setSelectedQueryTarget={setSelectedQueryTarget}
                                        selectedFields={selectedFields}
                                        setSelectedFields={setSelectedFields}
                                        selectedFilters={selectedFilters}
                                        handleSelectedFilterEdits={handleSelectedFilterEdits}
                                        fieldOptions={fieldOptions}
                                        fieldOptionsError={fieldOptionsError}
                                        loadingFieldMetadata={loadingFieldMetadata}
                                        buildQuery={buildQuery}
                                        canBuildQuery={canBuildQuery}
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
                                ) : null}
                                {displayQueryHistory ? (
                                    <QueryHistoryContainer
                                        queryHistory={queryHistory}
                                        loadQueryIntoEditor={loadQueryIntoEditor}
                                    />
                                ) : null}
                            </Panel>
                            {!sidePanelCollapsed ? <Separator {...VerticalDividerStyle} /> : null}
                        </>
                    ) : null}
                </PanelGroup>
                <Box height='100vh' flex='0 0'>
                    <Flex flexDirection='column' height='100%'>
                        <IconButton
                            onClick={toggleQueryBuilder}
                            color={displayQueryBuilder ? 'white' : 'veeva_orange_color_mode'}
                            backgroundColor={displayQueryBuilder ? 'veeva_orange_color_mode' : 'transparent'}
                            {...ToggleSidebarButtonStyle}
                        >
                            <PiTreeStructureBold size={20} style={{ margin: '4px' }} />
                        </IconButton>
                        <IconButton
                            onClick={toggleQueryHistory}
                            color={displayQueryHistory ? 'white' : 'veeva_orange_color_mode'}
                            backgroundColor={displayQueryHistory ? 'veeva_orange_color_mode' : 'transparent'}
                            {...ToggleSidebarButtonStyle}
                        >
                            <PiClockCounterClockwiseBold size={20} style={{ margin: '4px' }} />
                        </IconButton>
                        <Spacer />
                        <ContextualHelpButton tooltip='VQL Documentation' url='https://developer.veevavault.com/vql/' />
                    </Flex>
                </Box>
            </Flex>
            {isProductionVault() ? <VqlProdVaultWarningModal /> : null}
        </>
    );
}

const VqlEditorStackStyle = {
    height: '100%',
    backgroundColor: 'veeva_light_gray_color_mode',
    flex: 1,
    boxShadow: 'inset -5px 0 8px -8px rgba(0,0,0,0.3), inset 5px 0 8px -8px rgba(0,0,0,0.3)',
    gap: 0,
};

const ToggleSidebarButtonStyle = {
    size: 'auto',
    borderRadius: '6px',
    margin: '5px',
};

const VerticalDividerStyle = {
    orientation: 'vertical',
    borderColor: 'veeva_light_gray.500',
    height: 'auto',
    borderWidth: '1px',
};
