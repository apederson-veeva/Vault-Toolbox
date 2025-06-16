import { Table, Card, Box, Heading } from '@chakra-ui/react';
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
                    <Table.Root variant='simple' size='sm'>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell {...TableColumnStyle}>Vault DNS: </Table.Cell>
                                <Table.Cell>{getVaultDns()}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell {...TableColumnStyle}>Vault ID: </Table.Cell>
                                <Table.Cell>{getVaultId()}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell {...TableColumnStyle}>Vault Name: </Table.Cell>
                                <Table.Cell>{getVaultName()}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell {...TableColumnStyle}>Domain Type: </Table.Cell>
                                <Table.Cell>{getVaultDomainType()}</Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell {...TableColumnStyle}>User: </Table.Cell>
                                <Table.Cell>{getVaultUsername()}</Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table.Root>
                </Box>
            </Card.Body>
        </Card.Root>
    );
}

const VaultInfoCardStyle = {
    backgroundColor: 'white_color_mode',
    marginY: '25',
    border: 'transparent',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
};

const TableHeaderStyle = {
    size: 'md',
    textTransform: 'capitalize',
    fontWeight: 'normal',
    padding: '5px',
};

const TableColumnStyle = {
    fontWeight: 'bold',
    textAlign: 'right',
};
