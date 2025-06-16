import { Box, Text, Heading, Table, Icon, Flex, Switch } from '@chakra-ui/react';
import { PiEye, PiEyeSlash, PiInfo } from 'react-icons/pi';
import { useSettings } from '../../context/SettingsContext';

export default function FeatureSettingsTab() {
    const { settings, setPageVisibility } = useSettings();

    return (
        <Box {...ParentBoxStyle}>
            <Table.Root variant='simple' size='sm'>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width='min-content' whiteSpace='nowrap'>
                            <Heading size='md'>Component Editor</Heading>
                        </Table.Cell>
                        <Table.Cell width='min-content' whiteSpace='nowrap' overflow='hidden'>
                            <Switch.Root
                                colorPalette='green'
                                color='white'
                                size='lg'
                                marginLeft='10px'
                                checked={settings.componentEditor.enabled}
                                onCheckedChange={({ checked }) => setPageVisibility('componentEditor', checked)}
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
                        <Table.Cell width='100%' maxWidth={0}>
                            <Flex alignItems='center'>
                                <Icon as={PiInfo} boxSize='24px' color='blue_color_mode' marginRight='5px' />
                                <Text color='veeva_dark_gray_text_color_mode' fontSize='xs'>
                                    Allows you to <b>Get</b> and <b>Change</b> component configuration via the Metadata
                                    API.
                                </Text>
                            </Flex>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width='min-content' whiteSpace='nowrap'>
                            <Heading size='md'>VQL Editor</Heading>
                        </Table.Cell>
                        <Table.Cell width='min-content' whiteSpace='nowrap' overflow='hidden'>
                            <Switch.Root
                                colorPalette='green'
                                color='white'
                                size='lg'
                                marginLeft='10px'
                                checked={settings.vqlEditor.enabled}
                                onCheckedChange={({ checked }) => setPageVisibility('vqlEditor', checked)}
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
                        <Table.Cell width='100%' maxWidth={0}>
                            <Flex alignItems='center'>
                                <Icon as={PiInfo} boxSize='24px' color='blue_color_mode' marginRight='5px' />
                                <Text color='veeva_dark_gray_text_color_mode' fontSize='xs'>
                                    Allows you to <b>Run</b> VQL queries and <b>Export</b> results to CSV.
                                </Text>
                            </Flex>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width='min-content' whiteSpace='nowrap'>
                            <Heading size='md'>Data Tools</Heading>
                        </Table.Cell>
                        <Table.Cell width='min-content' whiteSpace='nowrap' overflow='hidden'>
                            <Switch.Root
                                colorPalette='green'
                                color='white'
                                size='lg'
                                marginLeft='10px'
                                checked={settings.dataTools.enabled}
                                onCheckedChange={({ checked }) => setPageVisibility('dataTools', checked)}
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
                        <Table.Cell width='100%' maxWidth={0}>
                            <Flex alignItems='center'>
                                <Icon as={PiInfo} boxSize='24px' color='blue_color_mode' marginRight='5px' />
                                <Text color='veeva_dark_gray_text_color_mode' fontSize='xs'>
                                    Allows you to run <b>Count</b> and <b>Delete</b> data jobs for objects and document
                                    types.
                                </Text>
                            </Flex>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width='min-content' whiteSpace='nowrap'>
                            <Heading size='md'>File Browser</Heading>
                        </Table.Cell>
                        <Table.Cell width='min-content' whiteSpace='nowrap' overflow='hidden'>
                            <Switch.Root
                                colorPalette='green'
                                color='white'
                                size='lg'
                                marginLeft='10px'
                                checked={settings.fileBrowser.enabled}
                                onCheckedChange={({ checked }) => setPageVisibility('fileBrowser', checked)}
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
                        <Table.Cell width='100%' maxWidth={0}>
                            <Flex alignItems='center'>
                                <Icon as={PiInfo} boxSize='24px' color='blue_color_mode' marginRight='5px' />
                                <Text color='veeva_dark_gray_text_color_mode' fontSize='xs'>
                                    Allows you to <b>Browse</b>, <b>Download</b>, and <b>Upload</b> files from Vault{' '}
                                    <b>File Staging</b>.
                                </Text>
                            </Flex>
                        </Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table.Root>
        </Box>
    );
}

const ParentBoxStyle = {
    paddingX: 3,
    overflow: 'auto',
};
