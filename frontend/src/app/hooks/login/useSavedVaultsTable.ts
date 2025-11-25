import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { SavedVault } from './useSavedVaultData';

const DEFAULT = 'default';
const VAULT_DNS = 'vaultDNS';
const USERNAME = 'username';

interface UseSavedVaultsTableProps {
    savedVaultData: Array<SavedVault>;
    setSavedVaultData: Dispatch<SetStateAction<Array<SavedVault>>>;
    setVaultDNS: Dispatch<SetStateAction<string>>;
    setUsername: Dispatch<SetStateAction<string>>;
    setFocusToPasswordInput: () => void;
    isEditable: boolean;
}

export default function useSavedVaultsTable({
    savedVaultData,
    setSavedVaultData,
    setVaultDNS,
    setUsername,
    setFocusToPasswordInput,
    isEditable,
}: UseSavedVaultsTableProps) {
    const [defaultVaultRowIndex, setDefaultVaultRowIndex] = useState(-1);

    /**
     * Loads the DNS/username from a row in the Saved Vaults table into the input form.
     * @param {Number} rowIndex - index of the selected row
     */
    const handleRowClick: (rowIndex: number) => void = (rowIndex: number) => {
        const selectedVault: SavedVault = savedVaultData[rowIndex];
        if (selectedVault && !isEditable) {
            setVaultDNS(selectedVault?.vaultDNS?.trim() || '');
            setUsername(selectedVault?.username?.trim() || '');

            setFocusToPasswordInput();
        }
    };

    /**
     * Handles updates to the Saved Vaults table.
     * @param {String} newValue - new value of the field being updated
     * @param {Number} rowIndex - index of the updated row
     * @param {String} field - field within the row being updated
     */
    const handleSavedVaultEdits = (newValue: string | boolean, rowIndex: number, field: string) => {
        const rowIndexAsNumber = Number(rowIndex);

        const updatedSavedVaults = [...savedVaultData];
        updatedSavedVaults[rowIndexAsNumber] = {
            ...updatedSavedVaults[rowIndexAsNumber],
            [field]: newValue,
        };

        // If we updated the default field, change the default value on all other rows to false
        if (field === DEFAULT) {
            updatedSavedVaults.map((row, index) => {
                if (row[DEFAULT] === true && index !== rowIndexAsNumber) {
                    row[DEFAULT] = false;
                }
                return row;
            });
        }

        setSavedVaultData(updatedSavedVaults);
    };

    /**
     * Updates the default row in the Saved Vaults table.
     * @param {Number} rowIndex - index of the updated row
     */
    const handleDefaultRowChanged: (rowIndex: number) => void = (rowIndex: number) => {
        // If this row is already selected, de-select it
        if (rowIndex === defaultVaultRowIndex) {
            setDefaultVaultRowIndex(-1);
            handleSavedVaultEdits(false, rowIndex, DEFAULT);
        } else {
            setDefaultVaultRowIndex(rowIndex);
            handleSavedVaultEdits(true, rowIndex, DEFAULT);
        }
    };

    /**
     * Adds a new editable row to the Saved Vaults table.
     */
    const addNewEditableRow: () => void = () => {
        const newEditableRow = {
            [VAULT_DNS]: '',
            [USERNAME]: '',
            [DEFAULT]: false,
        };

        setSavedVaultData((prevSavedVaultData) => [...prevSavedVaultData, newEditableRow]);
    };

    /**
     * Removes a row from the Saved Vaults table.
     * @param {Number} rowToRemove - index of the row to remove
     */
    const removeRow: (rowToRemove: number) => void = (rowToRemove: number) => {
        setSavedVaultData(savedVaultData.filter((_, savedVaultRowIndex) => savedVaultRowIndex !== rowToRemove));
    };

    /**
     * Update default vault row index whenever savedVaultData is updated (to display checkbox buttons correctly)
     */
    useEffect(() => {
        setDefaultVaultRowIndex(savedVaultData?.findIndex((row) => row[DEFAULT] === true));
    }, [savedVaultData]);

    return {
        defaultVaultRowIndex,
        handleRowClick,
        handleSavedVaultEdits,
        handleDefaultRowChanged,
        addNewEditableRow,
        removeRow,
    };
}
