import {
    IconButton,
    Flex,
    Spacer,
    IconButtonProps,
    ButtonProps,
    PopoverContentProps,
    PopoverHeaderProps,
} from '@chakra-ui/react';
import { Button, Text } from '@chakra-ui/react';
import { PiCaretDownBold, PiX, PiNotePencil, PiFloppyDisk } from 'react-icons/pi';
import useSavedVaultsPopover from '../../hooks/login/useSavedVaultsPopover';
import {
    PopoverBody,
    PopoverContent,
    PopoverRoot,
    PopoverHeader,
    PopoverTrigger,
} from '../shared/ui-components/popover';
import SavedVaultsTable from './SavedVaultsTable';
import { Dispatch, SetStateAction } from 'react';
import { SavedVault } from '../../hooks/login/useSavedVaultData';

interface SavedVaultsPopoverProps {
    setUsername: Dispatch<SetStateAction<string>>;
    setVaultDNS: Dispatch<SetStateAction<string>>;
    setFocusToPasswordInput: () => void;
    savedVaultData: Array<SavedVault>;
    setSavedVaultData: Dispatch<SetStateAction<Array<SavedVault>>>;
}

export default function SavedVaultsPopover({
    setVaultDNS,
    setUsername,
    setFocusToPasswordInput,
    savedVaultData,
    setSavedVaultData,
}: SavedVaultsPopoverProps) {
    const { open, isEditable, toggleEditMode, handleOpenChange } = useSavedVaultsPopover({
        savedVaultData,
        setSavedVaultData,
    });

    return (
        <PopoverRoot
            positioning={{ placement: 'right-start' }}
            open={open}
            onOpenChange={(e) => handleOpenChange(e.open)}
            lazyMount={true}
        >
            <PopoverTrigger asChild>
                <IconButton {...IconButtonStyle}>
                    <PiCaretDownBold />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent {...PopoverContentStyle} css={{ '--popover-bg': 'blue.100' }}>
                <PopoverHeader {...PopoverHeaderStyle}>
                    <Flex alignItems='center'>
                        <Text fontSize='md'>Saved Vaults</Text>
                        <Button
                            {...ToggleEditModeButtonStyle}
                            onClick={toggleEditMode}
                            color={isEditable ? 'blue_color_mode' : ''}
                        >
                            {isEditable ? (
                                <PiFloppyDisk style={{ width: 24, height: 24 }} />
                            ) : (
                                <PiNotePencil style={{ width: 24, height: 24 }} />
                            )}
                        </Button>
                        <Spacer />
                        <Button {...CloseButtonStyle} onClick={() => handleOpenChange(false)}>
                            <PiX />
                        </Button>
                    </Flex>
                </PopoverHeader>
                <PopoverBody>
                    <SavedVaultsTable
                        savedVaultData={savedVaultData}
                        setSavedVaultData={setSavedVaultData}
                        setVaultDNS={setVaultDNS}
                        setUsername={setUsername}
                        setFocusToPasswordInput={setFocusToPasswordInput}
                        isEditable={isEditable}
                        toggleEditMode={toggleEditMode}
                    />
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
}

const IconButtonStyle: IconButtonProps = {
    backgroundColor: 'gray_background_color_mode',
    variant: 'ghost',
};

const PopoverContentStyle: PopoverContentProps = {
    minW: { base: '100%', lg: 'max-content' },
    borderRadius: 'md',
    backgroundColor: 'white_color_mode',
};

const PopoverHeaderStyle: PopoverHeaderProps = {
    fontWeight: 'semibold',
    backgroundColor: 'gray_background_color_mode',
    borderTopRadius: 'md',
    padding: '8px',
};

const ToggleEditModeButtonStyle: ButtonProps = {
    size: 'sm',
    marginLeft: '5px',
    padding: '0',
    backgroundColor: 'gray_background_color_mode',
    variant: 'ghost',
};

const CloseButtonStyle: ButtonProps = {
    size: 'sm',
    backgroundColor: 'gray_background_color_mode',
    _hover: { backgroundColor: 'veeva_light_gray_color_mode' },
    variant: 'ghost',
};
