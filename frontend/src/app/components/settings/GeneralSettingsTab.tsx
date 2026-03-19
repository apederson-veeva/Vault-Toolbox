import { Box, Text, Switch, Heading, Table, Icon, Flex, BoxProps, TableCellProps } from '@chakra-ui/react';
import { PiInfo } from 'react-icons/pi';
import useIntegratedLogin from '../../hooks/login/useIntegratedLogin';
import { useColorMode } from '../shared/ui-components/color-mode';

export default function GeneralSettingsTab() {
    const { colorMode, toggleColorMode } = useColorMode();
    const { integratedLoginIsEnabled, toggleIntegratedLogin } = useIntegratedLogin();

    return (
        <Box {...ParentBoxStyle}>
            <Table.Root size='sm' variant='line'>
                <Table.Body>
                    <Table.Row backgroundColor='white_color_mode'>
                        <Table.Cell {...FirstColumnCellStyle}>
                            <Heading size='md'>Dark Mode</Heading>
                        </Table.Cell>
                        <Table.Cell {...SecondColumnCellStyle}>
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
                        <Table.Cell {...ThirdColumnCellStyle}>
                            <Flex alignItems='center'>
                                <Icon as={PiInfo} {...IconStyle} />
                                <Text color='veeva_dark_gray_text_color_mode' fontSize='xs'>
                                    Enables <b>Dark Mode</b>.
                                </Text>
                            </Flex>
                        </Table.Cell>
                    </Table.Row>
                    <Table.Row backgroundColor='white_color_mode'>
                        <Table.Cell {...FirstColumnCellStyle}>
                            <Heading size='md'>Integrated Login</Heading>
                        </Table.Cell>
                        <Table.Cell {...SecondColumnCellStyle}>
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
                        <Table.Cell {...ThirdColumnCellStyle}>
                            <Flex alignItems='center'>
                                <Icon as={PiInfo} {...IconStyle} />
                                <Text color='veeva_dark_gray_text_color_mode' fontSize='xs'>
                                    <b>Automatically</b> login using your existing Vault session when launched from a
                                    browser tab with an active Vault UI session. By enabling <b>Integrated Login</b>,
                                    you authorize Vault Toolbox - Unhinged Edition to automatically authenticate and read Vault data using
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

const ParentBoxStyle: BoxProps = {
    paddingX: 3,
    overflow: 'auto',
};

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
