import {
    Text,
    Heading,
    Table,
    Icon,
    Flex,
    Switch,
    TableCellProps,
    IconButton,
    Collapsible,
    Card,
} from '@chakra-ui/react';
import { PiCaretRightBold, PiCaretUpBold, PiEye, PiEyeSlash, PiInfo } from 'react-icons/pi';
import { FeatureSettingsKeyType, VaultToolboxSettings } from '../../utils/settings/VaultToolboxSettings';
import FeatureSettingsTableRow from './FeatureSettingsTableRow';
import usePageSettings from '../../hooks/settings/usePageSettings';

interface FeatureSettingsTableRowProps {
    pageId: string;
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

export default function PageSettingsTableRow({
    pageId,
    settings,
    setPageVisibility,
    setFeatureFlag,
}: FeatureSettingsTableRowProps) {
    const {
        pageLabel,
        pageInfoText,
        pageHasFeatureSpecificSettings,
        featureSettingKeys,
        showFeatureSpecificSettings,
        toggleRowDetails,
    } = usePageSettings({ pageId });

    return (
        <>
            <Table.Row backgroundColor='white_color_mode'>
                <Table.Cell width='min-content' {...TableCellStyle}>
                    <IconButton
                        variant='ghost'
                        aria-label='Expand/Collapse Row Details'
                        size='sm'
                        onClick={toggleRowDetails}
                    >
                        {showFeatureSpecificSettings ? <PiCaretUpBold /> : <PiCaretRightBold />}
                    </IconButton>
                </Table.Cell>
                <Table.Cell {...FirstColumnCellStyle}>
                    <Heading size='md'>{pageLabel}</Heading>
                </Table.Cell>
                <Table.Cell {...SecondColumnCellStyle}>
                    <Switch.Root
                        colorPalette='green'
                        color='white'
                        size='lg'
                        marginLeft='10px'
                        checked={settings[pageId]?.enabled !== false}
                        onCheckedChange={({ checked }) => setPageVisibility(pageId, checked)}
                    >
                        <Switch.HiddenInput />
                        <Switch.Control>
                            <Switch.Thumb />
                            <Switch.Indicator fallback={<Icon as={PiEyeSlash} />}>
                                <Icon as={PiEye} />
                            </Switch.Indicator>
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
                                __html: pageInfoText,
                            }}
                        />
                    </Flex>
                </Table.Cell>
            </Table.Row>
            {showFeatureSpecificSettings && pageHasFeatureSpecificSettings && (
                <Table.Row width='min-content' backgroundColor='white_color_mode'>
                    <Table.Cell colSpan={5} backgroundColor='white_color_mode' border='none'>
                        <Collapsible.Root open={showFeatureSpecificSettings}>
                            <Collapsible.Content>
                                <Card.Root
                                    size='sm'
                                    marginX='52px'
                                    backgroundColor='veeva_light_gray_color_mode'
                                    border='none'
                                >
                                    <Card.Body paddingY={0}>
                                        <Table.Root size='sm'>
                                            <Table.Body>
                                                {featureSettingKeys.map(
                                                    (featureSetting: FeatureSettingsKeyType, index: number) => {
                                                        return (
                                                            <FeatureSettingsTableRow
                                                                key={index}
                                                                pageId={pageId}
                                                                featureFlag={featureSetting}
                                                                settings={settings}
                                                                setFeatureFlag={setFeatureFlag}
                                                                setPageVisibility={setPageVisibility}
                                                            />
                                                        );
                                                    },
                                                )}
                                            </Table.Body>
                                        </Table.Root>
                                    </Card.Body>
                                </Card.Root>
                            </Collapsible.Content>
                        </Collapsible.Root>
                    </Table.Cell>
                </Table.Row>
            )}
        </>
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
