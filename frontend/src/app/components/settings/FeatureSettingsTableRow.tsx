import { Text, Heading, Table, Icon, Flex, Switch, TableCellProps } from '@chakra-ui/react';
import { PiInfo } from 'react-icons/pi';
import { FeatureSettingsKeyType, VaultToolboxSettings } from '../../utils/settings/VaultToolboxSettings';
import useFeatureSpecificSettings from '../../hooks/settings/useFeatureSpecificSettings';

interface FeatureSettingsTableRowProps {
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

export default function FeatureSettingsTableRow({
    pageId,
    featureFlag,
    settings,
    setFeatureFlag,
    setPageVisibility,
}: FeatureSettingsTableRowProps) {
    const { featureLabel, featureInfoText, isThisFeatureSettingEnabled, isThisPageEnabled, handleCheckedChange } =
        useFeatureSpecificSettings({ pageId, featureFlag, settings, setFeatureFlag, setPageVisibility });

    return (
        <Table.Row backgroundColor='veeva_light_gray_color_mode'>
            <Table.Cell {...FirstColumnCellStyle}>
                <Heading size='sm'>{featureLabel}</Heading>
            </Table.Cell>
            <Table.Cell {...SecondColumnCellStyle}>
                <Switch.Root
                    colorPalette='green'
                    color='white'
                    size='lg'
                    marginLeft='10px'
                    disabled={!isThisPageEnabled}
                    checked={isThisFeatureSettingEnabled}
                    onCheckedChange={({ checked }) => handleCheckedChange(checked)}
                >
                    <Switch.HiddenInput />
                    <Switch.Control>
                        <Switch.Thumb />
                    </Switch.Control>
                    <Switch.Label />
                </Switch.Root>
            </Table.Cell>
            <Table.Cell {...ThirdColumnCellStyle}>
                <Flex alignItems='center'>
                    <Icon as={PiInfo} {...IconStyle} />
                    <Text
                        color='veeva_dark_gray_text_color_mode'
                        fontSize='xs'
                        dangerouslySetInnerHTML={{
                            __html: featureInfoText,
                        }}
                    />
                </Flex>
            </Table.Cell>
        </Table.Row>
    );
}

const TableCellStyle: TableCellProps = {
    borderBottomWidth: 0,
};

const FirstColumnCellStyle: TableCellProps = {
    width: 'min-content',
    whiteSpace: 'nowrap',
    ...TableCellStyle,
};

const SecondColumnCellStyle: TableCellProps = {
    overflow: 'hidden',
    ...FirstColumnCellStyle,
};

const ThirdColumnCellStyle: TableCellProps = {
    width: '100%',
    maxWidth: 0,
    ...TableCellStyle,
};

const IconStyle = {
    boxSize: '24px',
    color: 'blue_color_mode',
    marginRight: '5px',
};

const TableColumnStyle = {
    maxWidth: 'min-content',
    fontSize: 'sm',
    textAlign: 'right',
    color: 'gray.500',
    fontStyle: 'italic',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
};
