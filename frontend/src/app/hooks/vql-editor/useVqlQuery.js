import { useState, useEffect, useCallback } from 'react';
import { query, queryByPage } from '../../services/ApiService';

export default function useVqlQuery({ updateQueryHistory }) {
    const [code, setCode] = useState('');
    const [consoleOutput, setConsoleOutput] = useState([]);
    const [previousPage, setPreviousPage] = useState();
    const [nextPage, setNextPage] = useState();
    const [queryDescribe, setQueryDescribe] = useState();
    const [isExecutingQuery, setIsExecutingQuery] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [queryTelemetryData, setQueryTelemetryData] = useState({});
    const [previousQueryResults, setPreviousQueryResults] = useState({});
    const queryEditorTabIndex = 0;

    const OBJECT = 'object';
    const PICKLIST = 'Picklist';
    const OBJECT_REFERENCE = 'ObjectReference';

    /**
     * Executes VQL query
     */
    const submitVqlQuery = async () => {
        setIsExecutingQuery(true);
        setPreviousQueryResults({});
        const { queryResponse, responseTelemetry, responseHeaders } = await query(code);

        // Display the result in console output
        if (queryResponse) {
            setConsoleOutput((previousConsoleOutput) => {
                const tmpArray = [...previousConsoleOutput];
                tmpArray[queryEditorTabIndex] = queryResponse;
                return tmpArray;
            });

            if (queryResponse.queryDescribe) {
                setQueryDescribe(queryResponse.queryDescribe);

                cacheQueryResults(queryResponse);
            } else {
                setQueryDescribe();
            }

            logQueryHistory(queryResponse, responseTelemetry, responseHeaders);
        }

        setQueryTelemetryData(responseTelemetry ? responseTelemetry : {});
        setIsExecutingQuery(false);
    };

    /**
     * Stores the query target and id's from the query results in memory.
     * This allows us to chain queries and suggest filters by the previous results in query builder.
     * @param queryResponse
     */
    const cacheQueryResults = (queryResponse) => {
        const queryTarget = queryResponse.queryDescribe?.object?.name;
        const queryHasIdField = queryResponse.queryDescribe?.fields?.some((field) => field?.name === 'id');

        if (!queryTarget || !queryHasIdField) {
            return;
        }

        const queryResultIds = queryResponse?.data?.map((result) => result.id);
        if (queryResultIds.length > 0) {
            setPreviousQueryResults({
                queryTarget,
                values: queryResultIds,
                relationship: null,
                isMatch: false,
            });
        }
    };

    /**
     * Logs a query to query history
     * @param queryResponse
     * @param queryTelemetry
     * @param responseHeaders
     */
    const logQueryHistory = (queryResponse, queryTelemetry, responseHeaders) => {
        const time = new Date().getTime();
        const queryTarget = queryResponse?.queryDescribe?.object?.name || 'N/A';
        const queryString = code;
        const vaultResponseStatus = queryResponse?.responseStatus || 'N/A';
        const results = queryResponse?.responseDetails?.total || 'N/A';
        const responseTimeInMs = queryTelemetry?.executionTimeInMS || 'N/A';
        const responseSizeInKB = queryTelemetry?.responseSizeInKB || 'N/A';
        const vaultApiExecutionId = responseHeaders?.get('x-vaultapi-executionid') || 'N/A';

        const newQueryHistoryEntry = {
            time,
            queryTarget,
            queryString,
            vaultResponseStatus,
            results,
            responseTimeInMs,
            responseSizeInKB,
            vaultApiExecutionId,
        };

        updateQueryHistory(newQueryHistoryEntry);
    };

    /**
     * Loads a query from history into the query editor
     * @param queryString - query string to load
     */
    const loadQueryIntoEditor = useCallback((queryString) => {
        setCode(queryString);
    }, []);

    /**
     * Executes next_page query.
     */
    const queryNextPage = useCallback(async () => {
        setIsExecutingQuery(true);
        const { queryResponse, responseTelemetry } = await queryByPage(nextPage);

        // Display the result in console output
        if (queryResponse) {
            setConsoleOutput((previousConsoleOutput) => {
                const tmpArray = [...previousConsoleOutput];
                tmpArray[queryEditorTabIndex] = queryResponse;
                return tmpArray;
            });
        }

        setQueryTelemetryData(responseTelemetry ? responseTelemetry : {});

        setIsExecutingQuery(false);
    }, [nextPage, queryEditorTabIndex]);

    /**
     * Executes previous_page query.
     */
    const queryPreviousPage = useCallback(async () => {
        setIsExecutingQuery(true);
        const { queryResponse, responseTelemetry } = await queryByPage(previousPage);

        // Display the result in console output
        if (queryResponse) {
            setConsoleOutput((previousConsoleOutput) => {
                const tmpArray = [...previousConsoleOutput];
                tmpArray[queryEditorTabIndex] = queryResponse;
                return tmpArray;
            });
        }

        setQueryTelemetryData(responseTelemetry ? responseTelemetry : {});

        setIsExecutingQuery(false);
    }, [previousPage, queryEditorTabIndex]);

    /**
     * Handler for downloading query results to CSV
     */
    const downloadQueryResults = async () => {
        setIsDownloading(true);
        try {
            const csvData = await getCsvData();

            let csvContent = '';
            csvData.forEach((rowArray) => {
                if (typeof rowArray === 'string') {
                    csvContent += `${rowArray}\r\n`;
                } else {
                    const tmpRow = rowArray.map((item) => {
                        if (item !== null) {
                            item = item.toString();
                            item = item.replace(/"/g, '""'); // Escape double quotes within a field
                        }
                        return item;
                    });
                    const row = '"' + tmpRow.join('","') + '"'; // Wrap each value in double quotes
                    csvContent += `${row}\r\n`;
                }
            });

            const encodedUri = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent);
            const link = document.createElement('a');
            const filename = queryDescribe?.object?.name
                ? `query_results (${queryDescribe.object.name}).csv`
                : 'query_results.csv';

            link.setAttribute('href', encodedUri);
            link.setAttribute('download', filename);
            document.body.appendChild(link);

            link.click(); // Downloads the data to CSV
        } finally {
            setIsDownloading(false);
        }
    };

    /**
     * Converts query response data into array of arrays for printing to CSV
     * @returns
     */
    const getCsvData = async () => {
        const csvData = [];

        if (
            consoleOutput[queryEditorTabIndex]?.data &&
            consoleOutput[queryEditorTabIndex].data.length > 0 &&
            queryDescribe
        ) {
            addHeadersToCsvArray(csvData);

            let tempPreviousPage = previousPage;
            let queryResponse = consoleOutput[queryEditorTabIndex];

            // If we have a previousPage, start by resetting us to the first page of the query
            while (tempPreviousPage) {
                ({ queryResponse } = await queryByPage(tempPreviousPage));
                tempPreviousPage = queryResponse?.responseDetails?.previous_page
                    ? queryResponse?.responseDetails?.previous_page
                    : '';
            }

            // Loop through every page of results and add them to the csvData array
            let tempNextPage = queryResponse?.responseDetails?.next_page;
            while (tempNextPage) {
                await appendQueryDataToCsvArray(queryResponse, csvData);

                ({ queryResponse } = await queryByPage(tempNextPage));
                tempNextPage = queryResponse?.responseDetails?.next_page;
            }

            await appendQueryDataToCsvArray(queryResponse, csvData);
        } else {
            // Default message if there's no query data
            csvData.push('No results to display');
        }
        return csvData;
    };

    /**
     * Adds headers (field names) to the provided array
     * @param {Array} csvData
     */
    const addHeadersToCsvArray = (csvData) => {
        const headers = [];
        // Get the headers from the first row of data (so the order is correct)
        Object.keys(consoleOutput[queryEditorTabIndex].data[0]).map((dataKey) => {
            const firstRowResultValue = consoleOutput[queryEditorTabIndex].data[0][dataKey];

            // Picklists and standard field headers
            if (
                isPicklist(dataKey) ||
                isObjectReference(dataKey) ||
                Array.isArray(firstRowResultValue) || // Doc-object relationships (e.g. document_expense_report__cr.name__v) can return arrays, similar to Picklist values
                typeof firstRowResultValue !== OBJECT ||
                firstRowResultValue === null
            ) {
                headers.push(dataKey);
            } else {
                // Subquery headers
                // Get subquery fields from query describe (in case there isn't subquery data in the first row)
                return queryDescribe?.subqueries
                    ?.find((subquery) => subquery.relationship === dataKey)
                    ?.fields.map((field) => {
                        headers.push(`${dataKey}.${field.name}`);
                    });
            }
        });
        csvData.push(headers);
    };

    /**
     * Adds query data (field values) to the provided array.
     * @param queryResponse
     * @param {Array} csvData
     */
    const appendQueryDataToCsvArray = async (queryResponse, csvData) => {
        for (let rowCount = 0; rowCount < queryResponse?.data?.length; rowCount += 1) {
            const queryRow = queryResponse?.data[rowCount];
            // Build a CSV row for each row of subquery data
            const queryRowSize = getTotalSubqueryRowSize(queryRow);

            // For each subquery on this row, get all the subquery data, including paginated data
            const subqueryData = await getPaginatedSubqueryDataForRow(queryRow);

            for (let rowIndex = 0; rowIndex < queryRowSize; rowIndex += 1) {
                const dataRow = [];

                Object.keys(queryRow).map((dataRowKey) => {
                    const dataRowValue = queryRow[dataRowKey];

                    if (typeof dataRowValue === OBJECT && dataRowValue !== null) {
                        // Print the appropriate row of subquery results
                        if (dataRowValue?.data?.length > 0 && rowIndex < subqueryData[dataRowKey]?.length) {
                            const subqueryDataRow = subqueryData[dataRowKey][rowIndex];

                            Object.values(subqueryDataRow).map((subqueryDataField) => {
                                if (Array.isArray(subqueryDataField)) {
                                    dataRow.push(subqueryDataField.join(',').toString());
                                } else {
                                    dataRow.push(subqueryDataField);
                                }
                            });
                        } else if (dataRowValue?.length > 0) {
                            // Picklist field values
                            dataRow.push(dataRowValue.join(','));
                        } else {
                            // Print empty cells
                            const subqueryFieldCount = getSubqueryFieldCount(dataRowKey);
                            for (let count = 0; count < subqueryFieldCount; count += 1) {
                                dataRow.push('');
                            }
                        }
                    } else {
                        // Normal fields
                        dataRow.push(dataRowValue);
                    }
                });
                csvData.push(dataRow);
            }
        }
    };

    /**
     * Given a query row, finds the subqueries and returns an object containing
     * all pages of that subquery's data.
     * @param {Object} queryRow
     * @returns subquery data object (e.g. subqueryData = { "subqueryKey" : [subqueryDataRow1, ...] })
     */
    const getPaginatedSubqueryDataForRow = async (queryRow) => {
        let subqueryData = {};
        for (const key of Object.keys(queryRow)) {
            if (isSubqueryObject(key)) {
                const dataRowValue = queryRow[key];

                let tempSubqueryResponseData = dataRowValue?.data;
                let tempNextPage = dataRowValue?.responseDetails?.next_page;

                const tmpSubqueryDataArray = new Array();
                while (tempNextPage) {
                    tmpSubqueryDataArray.push(...tempSubqueryResponseData);

                    const { queryResponse } = await queryByPage(tempNextPage);
                    tempSubqueryResponseData = queryResponse?.data;
                    tempNextPage = queryResponse?.responseDetails?.next_page;
                }

                tmpSubqueryDataArray.push(...tempSubqueryResponseData);

                subqueryData[key] = tmpSubqueryDataArray;
            }
        }
        return subqueryData;
    };

    /**
     * Determines the number of fields in a subquery
     * @param {string} subquery relationship
     * @returns a count of the fields in the provided subquery, or default of 1
     */
    const getSubqueryFieldCount = useCallback(
        (subquery) => {
            if (queryDescribe?.subqueries?.length > 0) {
                return queryDescribe.subqueries.find(
                    (currentSubquery) =>
                        currentSubquery.relationship === subquery || currentSubquery.alias === subquery,
                )?.fields.length;
            }
            return 1;
        },
        [queryDescribe],
    );

    /**
     * Determines if the provided field is a picklist (either in the primary query or in a subquery).
     * @param {string} fieldName
     * @returns true if the field is a picklist, otherwise false
     */
    const isPicklist = useCallback(
        (fieldName) => {
            // Check if the field is a primary field picklist
            let isPicklist = queryDescribe?.fields?.some(
                (field) => field.name === fieldName && field.type === PICKLIST,
            );

            if (!isPicklist) {
                isPicklist = queryDescribe?.subqueries?.some((subquery) =>
                    subquery?.fields?.some((field) => field.name === fieldName && field.type === PICKLIST),
                );
            }

            return isPicklist;
        },
        [queryDescribe],
    );

    /**
     * Determines if the provided field is a ObjectReference field from a document (either in the primary query or in a
     * subquery).
     * @param {string} fieldName
     * @returns true if the field is a ObjectReference, otherwise false
     */
    const isObjectReference = useCallback(
        (fieldName) => {
            // Check if the field is a primary field ObjectReference
            let isObjectReference = queryDescribe?.fields?.some(
                (field) => field.name === fieldName && field.type === OBJECT_REFERENCE,
            );

            if (!isObjectReference) {
                isObjectReference = queryDescribe?.subqueries?.some((subquery) =>
                    subquery?.fields?.some((field) => field.name === fieldName && field.type === OBJECT_REFERENCE),
                );
            }

            return isObjectReference;
        },
        [queryDescribe],
    );

    /**
     * Determines if the provided field is a richtext field in the primary query.
     * @param {string} fieldName
     * @returns true if the field is a RichText field on the primary query, otherwise false
     */
    const isPrimaryFieldRichText = useCallback(
        (fieldName) => {
            // Check if the field is a primary field richtext
            let isRichText = queryDescribe?.fields?.some(
                (field) => field.name === fieldName && field.type === 'RichText',
            );

            if (!isRichText) {
                isRichText = queryDescribe?.subqueries?.some((subquery) =>
                    subquery?.fields?.some((field) => field.name === fieldName && field.type === 'RichText'),
                );
            }

            return isRichText;
        },
        [queryDescribe],
    );

    /**
     * Determines if the provided field is a String field in the primary query.
     * @param {string} fieldName
     * @returns true if the field is a RichText field on the primary query, otherwise false
     */
    const isPrimaryFieldString = useCallback(
        (fieldName) => {
            // Check if the field is a primary field String
            let isString = queryDescribe?.fields?.some((field) => field.name === fieldName && field.type === 'String');

            return isString;
        },
        [queryDescribe],
    );

    /**
     * Determines if the current field value is a subquery object
     * @param {string} field
     * @returns true if is a subquery, otherwise false
     */
    const isSubqueryObject = useCallback(
        (field) => {
            if (queryDescribe?.subqueries?.length > 0) {
                return queryDescribe.subqueries.some(
                    (currentSubquery) => currentSubquery.relationship === field || currentSubquery.alias === field,
                );
            }
            return false;
        },
        [queryDescribe],
    );

    /**
     * Determines the MAX size of any subqueries in a row of VQL response data. Only accounts for the first page of
     * subquery results.
     * @param {Object} row of VQL data
     * @returns maximum subquery size (for this page of results)
     */
    const getMaxRowSize = useCallback((row) => {
        let maxRowSize = 1; // Default to 1 row size

        Object.values(row).forEach((rowDataValue) => {
            if (typeof rowDataValue === OBJECT) {
                if (rowDataValue?.responseDetails?.size > maxRowSize) {
                    maxRowSize = rowDataValue.responseDetails.size;
                }
            }
        });

        return maxRowSize;
    }, []);

    /**
     * Determines the TOTAL size of any subqueries in a row of VQL response data across all pages.
     * @param {Object} row of VQL data
     * @returns total subquery size across all pages of results
     */
    const getTotalSubqueryRowSize = useCallback((row) => {
        let totalSubqueryRowSize = 1; // Default to 1 row size

        Object.values(row).forEach((rowDataValue) => {
            if (typeof rowDataValue === OBJECT) {
                if (rowDataValue?.responseDetails?.total > totalSubqueryRowSize) {
                    totalSubqueryRowSize = rowDataValue.responseDetails.total;
                }
            }
        });

        return totalSubqueryRowSize;
    }, []);

    /**
     * Determines if the download button should be enabled.
     * @returns true if user can download results, false otherwise
     */
    const canDownload = useCallback(() => {
        if (
            consoleOutput[queryEditorTabIndex]?.responseStatus !== 'FAILURE' &&
            consoleOutput[queryEditorTabIndex]?.responseDetails?.size > 0
        ) {
            return true;
        }
        return false;
    }, [consoleOutput, queryEditorTabIndex]);

    /**
     * Loads the default query string into the code editor, either from local storage or using a generic default
     * documents query
     */
    const loadDefaultQueryString = () => {
        const currentSavedQueries = JSON.parse(localStorage.getItem('savedQueries')) || [];

        const defaultQueryIndex = currentSavedQueries.findIndex((savedQuery) => savedQuery?.isDefaultQuery === true);

        if (defaultQueryIndex !== -1) {
            const currentDefaultQuery = currentSavedQueries[defaultQueryIndex];
            if (currentDefaultQuery?.queryString) {
                setCode(currentDefaultQuery?.queryString);
            }
        } else {
            setCode('SELECT id, name__v \nFROM person__sys');
        }
    };

    /**
     * Whenever the console output changes, re-load previous/next page
     */
    useEffect(() => {
        /**
         * Reads previous_page from the VQL query response and loads it into state.
         * @param {Object} response - VQL query response
         */
        function loadPreviousPage(response) {
            if (response?.responseDetails?.previous_page) {
                setPreviousPage(response?.responseDetails?.previous_page);
            } else {
                setPreviousPage();
            }
        }

        /**
         * Reads next_page from the VQL query response and loads it into state.
         * @param {Object} response - VQL query response
         */
        function loadNextPage(response) {
            if (response?.responseDetails?.next_page) {
                setNextPage(response?.responseDetails?.next_page);
            } else {
                setNextPage();
            }
        }

        loadPreviousPage(consoleOutput[queryEditorTabIndex]);
        loadNextPage(consoleOutput[queryEditorTabIndex]);
    }, [consoleOutput]);

    /**
     * Load the default query string on page load
     */
    useEffect(() => {
        loadDefaultQueryString();
    }, []);

    return {
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
        loadQueryIntoEditor,
        downloadQueryResults,
        queryNextPage,
        queryPreviousPage,
        canDownload,
        getSubqueryFieldCount,
        isPicklist,
        isPrimaryFieldRichText,
        getMaxRowSize,
        isPrimaryFieldString,
        isSubqueryObject,
    };
}
