import { Button, Center, Spinner, Box } from '@chakra-ui/react';
import { PiFloppyDisk } from 'react-icons/pi';
import useEditApiVersion from '../../hooks/shared/useEditApiVersion';
import ApiErrorMessageCard from './ApiErrorMessageCard';
import CustomSelect from './CustomSelect';
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogCloseTrigger,
    DialogBody,
    DialogFooter,
} from './ui-components/dialog';
export default function EditApiVersionModal({ open, onClose }) {
    const {
        selectedApiVersion,
        setSelectedApiVersion,
        apiVersions,
        vaultApiVersionsError,
        loadingVaultApiVersions,
        handleSave,
        handleModalClose,
    } = useEditApiVersion({ onClose });

    return (
        <DialogRoot open={open} onOpenChange={handleModalClose} size='sm'>
            <DialogContent backgroundColor='white_color_mode'>
                <DialogHeader fontSize='lg' fontWeight='bold'>
                    Set Vault API Version
                </DialogHeader>
                <DialogCloseTrigger />
                <DialogBody>
                    {!vaultApiVersionsError.hasError ? (
                        <>
                            {!loadingVaultApiVersions ? (
                                <Box width='100%'>
                                    <CustomSelect
                                        options={apiVersions}
                                        value={selectedApiVersion}
                                        onChange={(newValue) => setSelectedApiVersion(newValue)}
                                    />
                                </Box>
                            ) : (
                                <Center>
                                    <Spinner />
                                </Center>
                            )}
                        </>
                    ) : (
                        <ApiErrorMessageCard
                            content='Vault API Versions'
                            errorMessage={vaultApiVersionsError.errorMessage}
                        />
                    )}
                </DialogBody>
                <DialogFooter>
                    <Button onClick={handleSave} {...SaveButtonStyle}>
                        <PiFloppyDisk style={{ width: 24, height: 24, marginRight: '5px' }} />
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
}

const SaveButtonStyle = {
    variant: 'solid',
    size: 'sm',
    colorPalette: 'blue',
    margin: '5px',
    padding: '10px',
};
