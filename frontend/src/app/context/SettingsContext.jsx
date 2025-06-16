import { createContext, useContext, useReducer, useEffect } from 'react';

const SettingsContext = createContext();

const defaultSettings = {
    componentEditor: {
        enabled: true,
    },
    vqlEditor: {
        enabled: true,
    },
    dataTools: {
        enabled: true,
    },
    fileBrowser: {
        enabled: true,
    },
};

// Action types
const UPDATE_PAGE_VISIBILITY = 'UPDATE_PAGE_VISIBILITY';

function settingsReducer(state, action) {
    switch (action.type) {
        case UPDATE_PAGE_VISIBILITY:
            return {
                ...state,
                [action.pageId]: {
                    enabled: action.enabled,
                },
            };
        default:
            return state;
    }
}

export function SettingsProvider({ children }) {
    const [settings, dispatch] = useReducer(settingsReducer, undefined, () => {
        const savedSettings = localStorage.getItem('vaultToolboxSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('vaultToolboxSettings', JSON.stringify(settings));
    }, [settings]);

    const setPageVisibility = (pageId, enabled) => {
        dispatch({ type: UPDATE_PAGE_VISIBILITY, pageId, enabled });
    };

    return <SettingsContext.Provider value={{ settings, setPageVisibility }}>{children}</SettingsContext.Provider>;
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
