import { useEffect, useState } from 'react';

const QUERY_HISTORY = 'queryHistory';

export default function useQueryHistory() {
    const [queryHistory, setQueryHistory] = useState([]);

    /**
     * Handles saving a new query history entry (updates state and localStorage)
     * @param newQueryHistoryEntry - the new query history object to be saved
     */
    const updateQueryHistory = (newQueryHistoryEntry) => {
        const currentQueryHistory = queryHistory || [];

        // Limit to 20 entries
        if (currentQueryHistory.length === 20) {
            currentQueryHistory.pop();
        }
        currentQueryHistory.push(newQueryHistoryEntry);
        sortQueryHistoryChronologically(currentQueryHistory);

        setQueryHistory(currentQueryHistory);
        localStorage.setItem(QUERY_HISTORY, JSON.stringify(currentQueryHistory));
    };

    /**
     * Sorts provided query history chronologically (oldest to newest)
     * @param currentQueryHistory - query history array to sort
     * @returns {Array} sorted array
     */
    const sortQueryHistoryChronologically = (currentQueryHistory) => {
        currentQueryHistory.sort((firstQuery, secondQuery) => new Date(secondQuery?.time) - new Date(firstQuery?.time));
    };

    /**
     * Read in the saved queries from local storage on page load
     */
    useEffect(() => {
        const currentQueryHistory = JSON.parse(localStorage.getItem(QUERY_HISTORY)) || [];
        sortQueryHistoryChronologically(currentQueryHistory);

        setQueryHistory(currentQueryHistory);
    }, []);

    return {
        queryHistory,
        updateQueryHistory,
    };
}
