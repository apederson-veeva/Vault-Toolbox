import { IconButton, Flex, Spacer } from '@chakra-ui/react';
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

export default function SavedVaultsPopover({
    setVaultDNS,
    setUsername,
    setFocusToPasswordInput,
    savedVaultData,
    setSavedVaultData,
}) {
    const { open, isEditable, toggleEditMode, handleOpenChange } = useSavedVaultsPopover({
        savedVaultData,
        setSavedVaultData,
    });

    return (
        <PopoverRoot
            positioning={{ placement: 'right-start' }}
            open={open}
            onOpenChange={(e) => handleOpenChange(e.open)}
            lazyMounted
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

const IconButtonStyle = {
    backgroundColor: 'gray_background_color_mode',
    variant: 'ghost',
};

const PopoverContentStyle = {
    minW: { base: '100%', lg: 'max-content' },
    borderRadius: 'md',
    backgroundColor: 'white_color_mode',
};

const PopoverHeaderStyle = {
    fontWeight: 'semibold',
    backgroundColor: 'gray_background_color_mode',
    borderTopRadius: 'md',
    padding: '8px',
};

const ToggleEditModeButtonStyle = {
    size: 'sm',
    marginLeft: '5px',
    padding: '0',
    backgroundColor: 'gray_background_color_mode',
    variant: 'ghost',
};

const CloseButtonStyle = {
    size: 'sm',
    backgroundColor: 'gray_background_color_mode',
    _hover: { backgroundColor: 'veeva_light_gray_color_mode' },
    variant: 'ghost',
};
