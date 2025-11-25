import {
    IconButton,
    Table,
    Center,
    Editable,
    Box,
    IconButtonProps,
    EditablePreviewProps,
    TableRowProps,
} from '@chakra-ui/react';
import { PiCheck, PiMinusCircle } from 'react-icons/pi';
import { Checkbox } from '../shared/ui-components/checkbox';
import { Field } from '../shared/ui-components/field';
import { SavedVault } from '../../hooks/login/useSavedVaultData';

const VAULT_DNS = 'vaultDNS';
const USERNAME = 'username';

interface SavedVaultsTableRowProps {
    savedVault: SavedVault;
    savedVaultRowIndex: number;
    defaultVaultRowIndex: number;
    handleRowClick: (rowIndex: number) => void;
    handleSavedVaultEdits: (newValue: string | boolean, rowIndex: number, field: string) => void;
    handleDefaultRowChanged: (rowIndex: number) => void;
    isEditable: boolean;
    removeRow: (rowToRemove: number) => void;
}

export default function SavedVaultsTableRow({
    savedVault,
    savedVaultRowIndex,
    defaultVaultRowIndex,
    handleRowClick,
    handleSavedVaultEdits,
    handleDefaultRowChanged,
    isEditable,
    removeRow,
}: SavedVaultsTableRowProps) {
    return (
        <Table.Row key={savedVaultRowIndex} onClick={() => handleRowClick(savedVaultRowIndex)} {...TrStyle}>
            <Table.Cell>
                <Field>
                    <Editable.Root
                        value={savedVault?.vaultDNS}
                        disabled={!isEditable}
                        onValueChange={(e) => handleSavedVaultEdits(e.value, savedVaultRowIndex, VAULT_DNS)}
                        placeholder='Enter Vault DNS...'
                    >
                        <Editable.Preview {...EditablePreviewStyle} />
                        <Editable.Input />
                    </Editable.Root>
                </Field>
            </Table.Cell>
            <Table.Cell>
                <Field>
                    <Editable.Root
                        value={savedVault?.username}
                        disabled={!isEditable}
                        onValueChange={(e) => handleSavedVaultEdits(e.value, savedVaultRowIndex, USERNAME)}
                        placeholder='Enter Username...'
                    >
                        <Editable.Preview {...EditablePreviewStyle} />
                        <Editable.Input />
                    </Editable.Root>
                </Field>
            </Table.Cell>
            <Table.Cell>
                <Center>
                    {isEditable ? (
                        <Field>
                            <Checkbox
                                variant='subtle'
                                checked={defaultVaultRowIndex === savedVaultRowIndex}
                                onCheckedChange={() => {
                                    handleDefaultRowChanged(savedVaultRowIndex);
                                }}
                            />
                        </Field>
                    ) : (
                        <Box>{savedVault.default && <PiCheck />}</Box>
                    )}
                </Center>
            </Table.Cell>
            {isEditable && (
                <Table.Cell padding={0}>
                    <IconButton onClick={() => removeRow(savedVaultRowIndex)} {...RemoveRowButtonStyle}>
                        <PiMinusCircle />
                    </IconButton>
                </Table.Cell>
            )}
        </Table.Row>
    );
}

const TrStyle: TableRowProps = {
    _hover: {
        bg: 'gray_background_color_mode',
        cursor: 'pointer',
    },
};

const EditablePreviewStyle: EditablePreviewProps = {
    _hover: {
        bg: 'gray_background_color_mode',
        cursor: 'pointer',
    },
    minWidth: '150px',
};

const RemoveRowButtonStyle: IconButtonProps = {
    size: 'md',
    variant: 'ghost',
    colorPalette: 'red',
};
