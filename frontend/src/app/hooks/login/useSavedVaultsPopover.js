import { useState } from 'react';

export default function useSavedVaultsPopover({ savedVaultData, setSavedVaultData }) {
    const [open, setOpen] = useState(false);
    const [isEditable, setIsEditable] = useState(false);

    const SAVED_VAULTS = 'savedVaults';

    /**
     *  Toggles edit mode. Saves changes when toggling out of edit-mode (since that means user clicked save).
     */
    const toggleEditMode = () => {
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
    const handleOpenChange = (isOpen) => {
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
