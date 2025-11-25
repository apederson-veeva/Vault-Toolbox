import { useState, useEffect } from 'react';
import {
    defaultSettings,
    FeatureSettingsKeyType,
    PageSettingsKeyType,
    PageSettingsMetadata,
} from '../../utils/settings/VaultToolboxSettings';

interface PageSettingsProps {
    pageId: string;
}

export default function usePageSettings({ pageId }: PageSettingsProps) {
    const [pageLabel, setPageLabel] = useState('');
    const [pageInfoText, setPageInfoText] = useState('');
    const [showFeatureSpecificSettings, setShowFeatureSpecificSettings] = useState(true);

    const toggleRowDetails = () => setShowFeatureSpecificSettings(!showFeatureSpecificSettings);

    const pageHasFeatureSpecificSettings = !!defaultSettings[pageId]?.featureSettings;
    const featureSettings = defaultSettings[pageId]?.featureSettings;
    const featureSettingKeys = featureSettings ? (Object.keys(featureSettings) as FeatureSettingsKeyType[]) : [];

    useEffect(() => {
        if (pageId in PageSettingsMetadata) {
            const pageKey = pageId as PageSettingsKeyType;
            const pageSettings = PageSettingsMetadata[pageKey];

            setPageLabel(pageSettings?.label);
            setPageInfoText(pageSettings?.infoText);
        }
    }, [pageId]);

    return {
        pageLabel,
        pageInfoText,
        pageHasFeatureSpecificSettings,
        featureSettingKeys,
        showFeatureSpecificSettings,
        toggleRowDetails,
    };
}
