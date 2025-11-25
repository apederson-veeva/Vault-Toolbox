import { Box, Table, BoxProps } from '@chakra-ui/react';
import { useSettings } from '../../context/SettingsContext';
import PageSettingsTableRow from './PageSettingsTableRow';
import { defaultSettings } from '../../utils/settings/VaultToolboxSettings';

export default function PageSettingsTab() {
    const { settings, setPageVisibility, setFeatureFlag } = useSettings();

    return (
        <Box {...ParentBoxStyle}>
            <Table.Root size='sm' variant='line'>
                <Table.Body>
                    {Object.keys(defaultSettings).map((pageId: string, index: number) => {
                        return (
                            <PageSettingsTableRow
                                key={index}
                                pageId={pageId}
                                settings={settings}
                                setPageVisibility={setPageVisibility}
                                setFeatureFlag={setFeatureFlag}
                            />
                        );
                    })}
                </Table.Body>
            </Table.Root>
        </Box>
    );
}

const ParentBoxStyle: BoxProps = {
    paddingX: 3,
    overflow: 'auto',
};
