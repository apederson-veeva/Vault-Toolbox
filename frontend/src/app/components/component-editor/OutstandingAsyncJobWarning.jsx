import { Button } from '@chakra-ui/react';
import { DialogRoot, DialogContent, DialogHeader, DialogBody, DialogFooter } from '../shared/ui-components/dialog';

export default function OutstandingAsyncJobWarning({ open, onClose, onConfirm, currentComponent }) {
    const clearAsyncJob = () => {
        onClose();
        onConfirm(currentComponent);
    };

    return (
        <DialogRoot open={open} onOpenChange={onClose} role='alertdialog'>
            <DialogContent>
                <DialogHeader fontSize='lg' fontWeight='bold'>
                    Outstanding Async Job Request
                </DialogHeader>
                <DialogBody fontSize='lg'>
                    You have an outstanding asynchrynous MDL job request. If you continue, your job results will be
                    cleared.
                </DialogBody>
                <DialogFooter>
                    <Button onClick={onClose} marginRight='5px' variant='subtle'>
                        Cancel
                    </Button>
                    <Button colorPalette='red' onClick={clearAsyncJob}>
                        Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
}
