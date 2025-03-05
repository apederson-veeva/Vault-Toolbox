import { useEffect, useRef, useState } from 'react';

export default function useQuerySidePanel() {
    const [sidePanelCollapsed, setSidePanelCollapsed] = useState(false);
    const [displayQueryBuilder, setDisplayQueryBuilder] = useState(true);
    const [displayQueryHistory, setDisplayQueryHistory] = useState(false);

    const sidePanelRef = useRef(null);

    /**
     * Opens/closes query builder
     */
    const toggleQueryBuilder = () => {
        // If query builder is open, close it and collapse the side panel
        if (displayQueryBuilder && !sidePanelCollapsed) {
            setSidePanelCollapsed(true);
        } else {
            // If query builder is closed, open the side panel and hide query history (if it's open)
            setSidePanelCollapsed(false);
            setDisplayQueryHistory(false);
        }
        setDisplayQueryBuilder(!displayQueryBuilder);
    };

    /**
     * Opens/closes query history
     */
    const toggleQueryHistory = () => {
        // If query history is open, close it and collapse the side panel
        if (displayQueryHistory && !sidePanelCollapsed) {
            setSidePanelCollapsed(true);
        } else {
            // If query history is closed, open the side panel and hide query builder (if it's open)
            setSidePanelCollapsed(false);
            setDisplayQueryBuilder(false);
        }
        setDisplayQueryHistory(!displayQueryHistory);
    };

    const onSidePanelCollapse = (isCollapsed) => {
        setSidePanelCollapsed(isCollapsed);
    };

    useEffect(() => {
        if (sidePanelCollapsed) {
            sidePanelRef.current?.collapse();
            !setDisplayQueryHistory(false);
            setDisplayQueryBuilder(false);
        } else {
            sidePanelRef.current?.expand();
        }
    }, [sidePanelCollapsed]);

    return {
        sidePanelRef,
        sidePanelCollapsed,
        onSidePanelCollapse,
        displayQueryBuilder,
        displayQueryHistory,
        toggleQueryBuilder,
        toggleQueryHistory,
    };
}
