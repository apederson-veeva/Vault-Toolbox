import { useEffect, useState } from 'react';

export default function useSavedQueries({ onClose, setCode }) {
    const [selectedQueryName, setSelectedQueryName] = useState('');
    const [isDefaultQuery, setIsDefaultQuery] = useState(false);
    const [savedQueries, setSavedQueries] = useState([]);
    const [savedQueryOptions, setSavedQueryOptions] = useState([]);

    /**
     * Handles closing the save query modal.
     */
    const handleModalClose = () => {
        setSelectedQueryName('');
        onClose();
    };

    /**
     * Handles saving the current query.
     * @param code - the query string to be saved
     * @returns {Promise<void>}
     */
    const handleSave = async (code) => {
        const currentSavedQueries = JSON.parse(localStorage.getItem('savedQueries')) || [];

        // If we have a new default, clear the existing default
        if (isDefaultQuery) {
            const previousDefaultQueryIndex = currentSavedQueries.findIndex(
                (savedQuery) => savedQuery?.isDefaultQuery === true,
            );
            if (previousDefaultQueryIndex !== -1 && currentSavedQueries[previousDefaultQueryIndex]) {
                currentSavedQueries[previousDefaultQueryIndex].isDefaultQuery = false;
            }
        }

        const selectedQueryIndex = currentSavedQueries.findIndex(
            (savedQuery) => savedQuery.name === selectedQueryName?.label,
        );
        if (selectedQueryIndex === -1) {
            currentSavedQueries.push({
                name: selectedQueryName?.label,
                queryString: code,
                isDefaultQuery,
            });
        } else {
            currentSavedQueries[selectedQueryIndex] = {
                name: selectedQueryName?.label,
                queryString: code,
                isDefaultQuery,
            };
        }

        await localStorage.setItem('savedQueries', JSON.stringify(currentSavedQueries));
        setSavedQueries(currentSavedQueries);
        handleModalClose();
    };

    const deleteSavedQuery = async () => {
        const currentSavedQueries = JSON.parse(localStorage.getItem('savedQueries')) || [];
        const updatedSavedQueries = currentSavedQueries.filter((savedQuery) => savedQuery?.name !== selectedQueryName);

        await localStorage.setItem('savedQueries', JSON.stringify(updatedSavedQueries));
        setSavedQueries(updatedSavedQueries);
    };

    /**
     * Helper function to generate selectable options for react-select
     * @param savedQuery
     * @returns {{label: String, value: String}}
     */
    const createSavedQueryOption = (savedQuery) => {
        return {
            value: savedQuery?.name,
            label: savedQuery?.name,
            isDefaultQuery: savedQuery?.isDefaultQuery,
        };
    };

    /**
     * Loads a saved query into the query editor
     * @param savedQuery - name of the saved query to load
     */
    const insertSavedQuery = (savedQuery) => {
        savedQueries.map((query) => {
            if (query.name === savedQuery) {
                setCode(query?.queryString);
            }
        });
    };

    /**
     * When the query name to save changes, update whether the current selected name is the current default query. Used
     * to display the "default" checkbox correctly in the VqlSaveQueryModal
     */
    useEffect(() => {
        const nameIsCurrentDefault = savedQueryOptions.some(
            (query) => query?.value === selectedQueryName?.value && query.isDefaultQuery,
        );

        setIsDefaultQuery(nameIsCurrentDefault);
    }, [selectedQueryName, savedQueryOptions]);

    /**
     * Whenever the saved queries update, also update the selectable query options for the drop-down
     */
    useEffect(() => {
        /**
         * Helper function to keep the selectable options when saving a query in-sync with the currently saved queries.
         */
        function updateSavedQueryOptions() {
            const currentSavedQueryOptions = [];
            savedQueries?.forEach((savedQuery) => {
                currentSavedQueryOptions.push(createSavedQueryOption(savedQuery));
            });
            setSavedQueryOptions(currentSavedQueryOptions);
        }

        updateSavedQueryOptions();
    }, [savedQueries]);

    /**
     * Read in the saved queries from local storage on page load
     */
    useEffect(() => {
        const currentSavedQueries = JSON.parse(localStorage.getItem('savedQueries')) || [];
        setSavedQueries(currentSavedQueries);
    }, []);

    return {
        selectedQueryName,
        setSelectedQueryName,
        isDefaultQuery,
        setIsDefaultQuery,
        savedQueries,
        savedQueryOptions,
        handleSave,
        handleModalClose,
        insertSavedQuery,
        deleteSavedQuery,
    };
}
