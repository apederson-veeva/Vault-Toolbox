import { Box, Text, Switch, Heading, Table, Icon, Flex } from '@chakra-ui/react';
import { PiInfo } from 'react-icons/pi';
import useIntegratedLogin from '../../hooks/login/useIntegratedLogin';
import { useColorMode } from '../shared/ui-components/color-mode';

export default function GeneralSettingsTab() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { integratedLoginIsEnabled, toggleIntegratedLogin } = useIntegratedLogin();

    return (
        <Box {...ParentBoxStyle}>
            <Table.Root variant='simple' size='sm'>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell width='min-content' whiteSpace='nowrap'>
                            <Heading size='md'>Dark Mode</Heading>
                        </Table.Cell>
                        <Table.Cell width='min-content' whiteSpace='nowrap' overflow='hidden'>
                            <Switch.Root
                                colorPalette='green'
                                marginLeft='10px'
                                checked={colorMode === 'dark'}
                                onCheckedChange={toggleColorMode}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <Switch.Label />
                            </Switch.Root>
                        </Table.Cell>
                        <Table.Cell width='100%' maxWidth={0}>
                            <Flex alignItems='center'>
                                <Icon as={PiInfo} boxSize='24px' color='blue_color_mode' marginRight='5px' />
                                <Text color='veeva_dark_gray_text_color_mode' fontSize='xs'>
                                    Enables <b>Dark Mode</b>.
                                </Text>
                            </Flex>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row>
                        <Table.Cell width='min-content' whiteSpace='nowrap'>
                            <Heading size='md'>Integrated Login</Heading>
                        </Table.Cell>
                        <Table.Cell width='min-content' whiteSpace='nowrap' overflow='hidden'>
                            <Switch.Root
                                colorPalette='green'
                                marginLeft='10px'
                                checked={integratedLoginIsEnabled}
                                onCheckedChange={toggleIntegratedLogin}
                            >
                                <Switch.HiddenInput />
                                <Switch.Control>
                                    <Switch.Thumb />
                                </Switch.Control>
                                <Switch.Label />
                            </Switch.Root>
                        </Table.Cell>
                        <Table.Cell width='100%' maxWidth={0}>
                            <Flex alignItems='center'>
                                <Icon as={PiInfo} boxSize='24px' color='blue_color_mode' marginRight='5px' />
                                <Text color='veeva_dark_gray_text_color_mode' fontSize='xs'>
                                    <b>Automatically</b> login using your existing Vault session when launched from a
                                    browser tab with an active Vault UI session. By enabling <b>Integrated Login</b>,
                                    you authorize Vault Toolbox to automatically authenticate and read Vault data using
                                    your existing Vault session.
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
