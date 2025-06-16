import { Button, Alert, Card, Flex, VStack, Field, Input, Spacer, Heading, Table, Box } from '@chakra-ui/react';
import { getVaultId } from '../../services/SharedServices';
import { DialogBody, DialogContent, DialogFooter, DialogRoot } from '../shared/ui-components/dialog';
import VaultInfoTable from '../vault-info/VaultInfoTable';

function ConfirmDataDeletion({
    open,
    onClose,
    onSubmit,
    dataType,
    selectedData,
    deleteConfirmationText,
    setDeleteConfirmationText,
}) {
    const submitDeletion = () => {
        onClose();
        onSubmit();
    };

    const canDelete = () => {
        return deleteConfirmationText === getVaultId();
    };

    return (
        <DialogRoot open={open} onOpenChange={onClose}>
            <DialogContent {...ModalStyle}>
                <Flex flexDirection='column'>
                    <DialogBody flex='0 0 90%'>
                        <Alert.Root {...AlertStyle}>
                            <Alert.Indicator color='white_color_mode' />
                            <Alert.Title>Deleting Vault Data</Alert.Title>
                            <Alert.Description>
                                You are about to delete Vault data. THIS CANNOT BE UNDONE.
                            </Alert.Description>
                        </Alert.Root>
                        <VaultInfoTable />
                        <Card.Root {...CardStyle}>
                            <Card.Body>
                                <Heading {...TableHeaderStyle}>Selections:</Heading>
                                <Flex {...TableContainerStyle}>
                                    <Table.Root {...TableStyle}>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell {...TableColumnStyle}>Action: </Table.Cell>
                                                <Table.Cell>DELETE</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell {...TableColumnStyle}>Data Type: </Table.Cell>
                                                <Table.Cell>{dataType}</Table.Cell>
                                            </Table.Row>
                                            <Table.Row {...SelectedDataRowStyle}>
                                                <Table.Cell {...TableColumnStyle}>Selected Data: </Table.Cell>
                                                {selectedData.toString() ? (
                                                    <Table.Cell>
                                                        {selectedData.map((value, i) => (
                                                            <Box key={i}>{value}</Box>
                                                        ))}
                                                    </Table.Cell>
                                                ) : (
                                                    <Table.Cell>All Objects and Documents</Table.Cell>
                                                )}
                                            </Table.Row>
                                        </Table.Body>
                                    </Table.Root>
                                </Flex>
                            </Card.Body>
                        </Card.Root>
                    </DialogBody>
                    <DialogFooter minHeight='min-content'>
                        <Flex width='100%' alignItems='flex-end'>
                            <VStack width='max-content'>
                                <Field.Root invalid={!canDelete()}>
                                    <Field.HelperText margin='5px'>
                                        Enter the Vault ID to enable deletion:
                                    </Field.HelperText>
                                    <Input
                                        backgroundColor='white_color_mode'
                                        value={deleteConfirmationText}
                                        onChange={(event) => setDeleteConfirmationText(event.currentTarget.value)}
                                        placeholder='Vault ID'
                                    />
                                </Field.Root>
                            </VStack>
                            <Spacer />
                            <Box>
                                <Button variant='subtle' onClick={onClose} margin='5px'>
                                    Cancel
                                </Button>
                                <Button
                                    colorPalette='red'
                                    margin='5px'
                                    onClick={submitDeletion}
                                    disabled={!canDelete()}
                                >
                                    Delete
                                </Button>
                            </Box>
                        </Flex>
                    </DialogFooter>
                </Flex>
            </DialogContent>
        </DialogRoot>
    );
}

const ModalStyle = {
    minWidth: '50vw',
    minHeight: 'min-content',
    fontSize: 'md',
    backgroundColor: 'veeva_light_gray_color_mode',
};

const AlertStyle = {
    backgroundColor: 'red.400',
    color: 'white_color_mode',
    status: 'error',
    marginBottom: '10px',
    borderRadius: '8px',
};

const CardStyle = {
    marginTop: '10px',
    maxHeight: '30vh',
    overflowY: 'auto',
    backgroundColor: 'white_color_mode',
};

const TableContainerStyle = {
    maxHeight: '35vh',
    overflowX: 'unset',
    overflowY: 'unset',
};

const TableStyle = {
    variant: 'simple',
    size: 'sm',
    overflowY: 'auto',
};

const TableHeaderStyle = {
    size: 'md',
    textTransform: 'capitalize',
    fontWeight: 'normal',
    padding: '5px',
};

const TableColumnStyle = {
    fontWeight: 'bold',
    textAlign: 'left',
    verticalAlign: 'top',
    width: '1%',
    whiteSpace: 'nowrap',
    _last: { width: '100%' },
};

const SelectedDataRowStyle = {
    maxHeight: '20vh',
    overflowY: 'auto',
};

export default ConfirmDataDeletion;
