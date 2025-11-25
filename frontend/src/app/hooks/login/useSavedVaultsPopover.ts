import { Dispatch, SetStateAction, useState } from 'react';
import { SavedVault } from './useSavedVaultData';

const SAVED_VAULTS = 'savedVaults';

interface UseSavedVaultsPopoverProps {
    savedVaultData: Array<SavedVault>;
    setSavedVaultData: Dispatch<SetStateAction<Array<SavedVault>>>;
}

export default function useSavedVaultsPopover({ savedVaultData, setSavedVaultData }: UseSavedVaultsPopoverProps) {
    const [open, setOpen] = useState<boolean>(false);
    const [isEditable, setIsEditable] = useState<boolean>(false);

    /**
     *  Toggles edit mode. Saves changes when toggling out of edit-mode (since that means user clicked save).
     */
    const toggleEditMode: () => void = () => {
        // If it was editable, save the changes
        if (isEditable) {
            chrome.storage.local.set({ [SAVED_VAULTS]: savedVaultData });
        }

        setIsEditable(!isEditable);
    };

    /**
     * Handles opening/closing popover. Discards unsaved changes.
     * @param {Boolean} isOpen - Whether the popover is open
     */
    const handleOpenChange: (isOpen: boolean) => void = (isOpen: boolean) => {
        // If closed without saving, discard changes
        if (!isOpen && isEditable) {
            setIsEditable(false);
            chrome.storage.local.get([SAVED_VAULTS]).then((result) => {
                setSavedVaultData(result[SAVED_VAULTS] ? result[SAVED_VAULTS] : []);
            });
        }
        setOpen(isOpen);
    };

    return { open, isEditable, toggleEditMode, handleOpenChange };
}
