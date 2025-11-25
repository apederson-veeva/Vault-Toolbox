import {
    Table,
    Card,
    Box,
    Heading,
    HeadingProps,
    TableCellProps,
    TableRowProps,
    TableColumnProps,
    CardRootProps,
} from '@chakra-ui/react';
import {
    getVaultDns,
    getVaultDomainType,
    getVaultId,
    getVaultName,
    getVaultUsername,
} from '../../services/SharedServices';

export default function VaultInfoTable() {
    return (
        <Card.Root {...VaultInfoCardStyle}>
            <Card.Body>
                <Box>
                    <Heading {...TableHeaderStyle}>Vault Information</Heading>
                    <Table.Root variant='line' size='sm'>
                        <Table.Body>
                            <Table.Row {...TableRowStyle}>
                                <Table.Cell {...TableColumnStyle}>Vault DNS: </Table.Cell>
                                <Table.Cell {...TableCellStyle}>{getVaultDns()}</Table.Cell>
                            </Table.Row>
                            <Table.Row {...TableRowStyle}>
                                <Table.Cell {...TableColumnStyle}>Vault ID: </Table.Cell>
                                <Table.Cell {...TableCellStyle}>{getVaultId()}</Table.Cell>
                            </Table.Row>
                            <Table.Row {...TableRowStyle}>
                                <Table.Cell {...TableColumnStyle}>Vault Name: </Table.Cell>
                                <Table.Cell {...TableCellStyle}>{getVaultName()}</Table.Cell>
                            </Table.Row>
                            <Table.Row {...TableRowStyle}>
                                <Table.Cell {...TableColumnStyle}>Domain Type: </Table.Cell>
                                <Table.Cell {...TableCellStyle}>{getVaultDomainType()}</Table.Cell>
                            </Table.Row>
                            <Table.Row {...TableRowStyle}>
                                <Table.Cell {...TableColumnStyle}>User: </Table.Cell>
                                <Table.Cell {...TableCellStyle}>{getVaultUsername()}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Card.Body>
        </Card.Root>
    );
}

const VaultInfoCardStyle: CardRootProps = {
    backgroundColor: 'white_color_mode',
    marginY: '25',
    border: 'transparent',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
};

const TableHeaderStyle: HeadingProps = {
    size: 'md',
    textTransform: 'capitalize',
    fontWeight: 'normal',
    padding: '5px',
};

const TableColumnStyle: TableCellProps = {
    fontWeight: 'bold',
    textAlign: 'right',
    borderBottomWidth: 0,
};

const TableCellStyle: TableCellProps = {
    borderBottomWidth: 0,
};

const TableRowStyle: TableRowProps = {
    backgroundColor: 'white_color_mode',
};
