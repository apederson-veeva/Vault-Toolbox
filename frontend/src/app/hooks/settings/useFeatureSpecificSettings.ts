import { useState, useEffect } from 'react';
import {
    FeatureSettings,
    FeatureSettingsKeyType,
    FeatureSettingsMetadata,
    VaultToolboxSettings,
} from '../../utils/settings/VaultToolboxSettings';

interface FeatureSpecificSettingsProps {
    pageId: string;
    featureFlag: FeatureSettingsKeyType;
    settings: VaultToolboxSettings;
    setFeatureFlag: ({
        pageId,
        enabled,
        featureFlag,
    }: {
        pageId: string;
        enabled: boolean;
        featureFlag: string;
    }) => void;
    setPageVisibility: (pageId: string, enabled: boolean) => void;
}

export default function useFeatureSpecificSettings({
    pageId,
    featureFlag,
    settings,
    setFeatureFlag,
    setPageVisibility,
}: FeatureSpecificSettingsProps) {
    const [featureLabel, setFeatureLabel] = useState('');
    const [featureInfoText, setFeatureInfoText] = useState('');
    const [isThisFeatureSettingEnabled, setIsThisFeatureSettingEnabled] = useState(true);
    const [isThisPageEnabled, setIsThisPageEnabled] = useState(true);

    const handleCheckedChange = (checked: boolean) => {
        setFeatureFlag({ pageId, enabled: checked, featureFlag });
        setIsThisFeatureSettingEnabled(checked);
    };

    /**
     * Determines if the current page should be disabled. Currently only applies if both File Staging and DD API
     * feature settings are disabled on the File Browser page.
     * @param featureSettings
     */
    const shouldPageBeDisabled = (featureSettings: FeatureSettings | undefined): boolean => {
        if (pageId === 'fileBrowser' && featureSettings && isThisPageEnabled) {
            const showFileStaging = !!featureSettings?.showFileStaging;
            const showDirectData = !!featureSettings?.showDirectData;

            if (!showFileStaging && !showDirectData) {
                return true;
            }
        }

        return false;
    };

    /*
        When settings or the feature flag change, update our feature-specific state values (label, info text, enabled)
     */
    useEffect(() => {
        const featureSettings = settings[pageId]?.featureSettings;
        if (featureSettings) {
            setIsThisFeatureSettingEnabled(!!featureSettings[featureFlag]);
        }

        if (shouldPageBeDisabled(featureSettings)) {
            setPageVisibility(pageId, false);
        }

        if (featureFlag in FeatureSettingsMetadata) {
            const featureFlagKey = featureFlag as FeatureSettingsKeyType;
            const featureSettingsMetadata = FeatureSettingsMetadata[featureFlagKey];

            setFeatureLabel(featureSettingsMetadata?.label);
            setFeatureInfoText(featureSettingsMetadata?.infoText);
        }
    }, [settings, featureFlag, pageId, setPageVisibility, setFeatureFlag]);

    useEffect(() => {
        setIsThisPageEnabled(settings[pageId]?.enabled !== false);
    }, [pageId, settings]);

    return {
        featureLabel,
        featureInfoText,
        isThisFeatureSettingEnabled,
        isThisPageEnabled,
        handleCheckedChange,
    };
}
