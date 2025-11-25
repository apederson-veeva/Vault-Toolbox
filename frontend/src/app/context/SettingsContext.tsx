import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { VaultToolboxSettings, defaultSettings } from '../utils/settings/VaultToolboxSettings';

// Action types
const UPDATE_PAGE_VISIBILITY = 'UPDATE_PAGE_VISIBILITY';
const UPDATE_FEATURE_FLAG = 'UPDATE_FEATURE_FLAG';

type ActionType = typeof UPDATE_PAGE_VISIBILITY | typeof UPDATE_FEATURE_FLAG;

interface Action {
    type: ActionType;
    pageId: string;
    enabled: boolean;
    featureFlag?: string;
}

function settingsReducer(state: VaultToolboxSettings, action: Action): VaultToolboxSettings {
    let currentFeatureSettings = state[action.pageId]?.featureSettings;
    if (!currentFeatureSettings) {
        currentFeatureSettings = defaultSettings[action.pageId].featureSettings;
    }

    switch (action.type) {
        case UPDATE_PAGE_VISIBILITY:
            return {
                ...state,
                [action.pageId]: {
                    enabled: action.enabled,
                    featureSettings: {
                        ...currentFeatureSettings,
                    },
                },
            };
        case UPDATE_FEATURE_FLAG:
            const currentPageSettings = state[action.pageId] || defaultSettings[action.pageId];
            const pageHasFeatureSpecificSettings: boolean = !!defaultSettings[action.pageId]?.featureSettings;

            if (!action?.featureFlag || !pageHasFeatureSpecificSettings) {
                return state;
            }

            return {
                ...state,
                [action.pageId]: {
                    ...currentPageSettings,
                    featureSettings: {
                        ...currentFeatureSettings,
                        [action.featureFlag]: action.enabled,
                    },
                },
            };
        default:
            return state;
    }
}

interface SettingsContextType {
    settings: VaultToolboxSettings;
    setPageVisibility: (pageId: string, enabled: boolean) => void;
    setFeatureFlag: ({
        pageId,
        enabled,
        featureFlag,
    }: {
        pageId: string;
        enabled: boolean;
        featureFlag: string;
    }) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
    const [settings, dispatch] = useReducer(settingsReducer, undefined, () => {
        const savedSettings = localStorage.getItem('vaultToolboxSettings');
        return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
    });

    useEffect(() => {
        localStorage.setItem('vaultToolboxSettings', JSON.stringify(settings));
    }, [settings]);

    const setPageVisibility = (pageId: string, enabled: boolean) => {
        dispatch({ type: UPDATE_PAGE_VISIBILITY, pageId, enabled });
    };

    const setFeatureFlag = ({
        pageId,
        enabled,
        featureFlag,
    }: {
        pageId: string;
        enabled: boolean;
        featureFlag: string;
    }) => {
        dispatch({ type: UPDATE_FEATURE_FLAG, pageId, featureFlag, enabled });
    };

    return (
        <SettingsContext.Provider value={{ settings, setPageVisibility, setFeatureFlag }}>
            {children}
        </SettingsContext.Provider>
    );
}

export const useSettings = () => {
    const context = useContext(SettingsContext);
    if (!context) {
        throw new Error('useSettings must be used within a SettingsProvider');
    }
    return context;
};
