import {
    Table,
    Alert,
    Flex,
    Box,
    Text,
    Button,
    TableRootProps,
    ButtonProps,
    BoxProps,
    FlexProps,
    TableHeaderProps,
} from '@chakra-ui/react';
import { PiPlus, PiFloppyDisk } from 'react-icons/pi';
import { SavedVault } from '../../hooks/login/useSavedVaultData';
import useSavedVaultsTable from '../../hooks/login/useSavedVaultsTable';
import SavedVaultsTableRow from './SavedVaultsTableRow';
import { Dispatch, SetStateAction } from 'react';

interface SavedVaultsTableProps {
    savedVaultData: Array<SavedVault>;
    setSavedVaultData: Dispatch<SetStateAction<Array<SavedVault>>>;
    setUsername: Dispatch<SetStateAction<string>>;
    setVaultDNS: Dispatch<SetStateAction<string>>;
    setFocusToPasswordInput: () => void;
    isEditable: boolean;
    toggleEditMode: () => void;
}

export default function SavedVaultsTable({
    savedVaultData,
    setSavedVaultData,
    setVaultDNS,
    setUsername,
    setFocusToPasswordInput,
    isEditable,
    toggleEditMode,
}: SavedVaultsTableProps) {
    const {
        defaultVaultRowIndex,
        handleRowClick,
        handleSavedVaultEdits,
        handleDefaultRowChanged,
        addNewEditableRow,
        removeRow,
    } = useSavedVaultsTable({
        savedVaultData,
        setSavedVaultData,
        setVaultDNS,
        setUsername,
        setFocusToPasswordInput,
        isEditable,
    });

    return (
        <Flex flexDirection='column' height='100%'>
            <Box {...TableBoxStyle}>
                <Flex {...TableContainerStyle}>
                    <Table.Root {...TableStyle}>
                        <Table.Header {...ThStyle}>
                            <Table.Row>
                                <Table.ColumnHeader>Vault DNS</Table.ColumnHeader>
                                <Table.ColumnHeader>Username</Table.ColumnHeader>
                                <Table.ColumnHeader>Default?</Table.ColumnHeader>
                                {isEditable && <Table.ColumnHeader />}
                            </Table.Row>
                        </Table.Header>
                        <Table.Body>
                            {savedVaultData.map((savedVault, savedVaultRowIndex) => (
                                <SavedVaultsTableRow
                                    key={savedVaultRowIndex}
                                    savedVault={savedVault}
                                    savedVaultRowIndex={savedVaultRowIndex}
                                    defaultVaultRowIndex={defaultVaultRowIndex}
                                    handleRowClick={handleRowClick}
                                    handleSavedVaultEdits={handleSavedVaultEdits}
                                    handleDefaultRowChanged={handleDefaultRowChanged}
                                    isEditable={isEditable}
                                    removeRow={removeRow}
                                />
                            ))}
                        </Table.Body>
                    </Table.Root>
                </Flex>
            </Box>
            {isEditable && (
                <Box>
                    {savedVaultData.length < 100 ? (
                        <>
                            <Button
                                {...AddRowButtonStyle}
                                onClick={() => {
                                    addNewEditableRow();
                                }}
                            >
                                <PiPlus />
                                <Text>Add Row</Text>
                            </Button>
                            <Button {...SaveButtonStyle} onClick={toggleEditMode}>
                                <PiFloppyDisk />
                                <Text>Save</Text>
                            </Button>
                        </>
                    ) : (
                        <Alert.Root status='warning'>
                            <Alert.Indicator />
                            You have reached the max allowed number of saved Vaults (100).
                        </Alert.Root>
                    )}
                </Box>
            )}
        </Flex>
    );
}

const TableBoxStyle: BoxProps = {
    overflowY: 'auto',
    marginY: '10px',
    maxHeight: '80vh',
};

const TableContainerStyle: FlexProps = {
    maxWidth: '100%',
    maxHeight: '95%',
    borderRadius: '8px',
    overflowX: 'unset',
    overflowY: 'unset',
    backgroundColor: 'white_color_mode',
};

const TableStyle: TableRootProps = {
    variant: 'outline',
    interactive: true,
    size: 'sm',
    maxHeight: '100px',
    overflow: 'auto',
};

const ThStyle: TableHeaderProps = {
    position: 'sticky',
    top: 0,
    border: 'none',
    zIndex: 10,
};

const AddRowButtonStyle: ButtonProps = {
    variant: 'subtle',
    size: 'sm',
    position: 'sticky',
    bottom: '0',
    colorPalette: 'blue',
    marginLeft: '5px',
    marginTop: '10px',
    padding: '5px',
};

const SaveButtonStyle: ButtonProps = {
    variant: 'solid',
    size: 'sm',
    position: 'sticky',
    bottom: '0',
    colorPalette: 'blue',
    marginLeft: '5px',
    marginTop: '10px',
    padding: '5px',
};
