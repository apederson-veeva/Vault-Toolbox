import { Button, Flex, Spacer, Box, Text } from '@chakra-ui/react';
import { useRef } from 'react';
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogCloseTrigger,
    DialogBody,
    DialogFooter,
} from '../shared/ui-components/dialog';

export default function VqlConfirmQueryDeletionModal({ open, onClose, onSubmit, savedQueryName }) {
    const deleteQueryButtonRef = useRef(null);
    const submitQueryDeletion = () => {
        onClose();
        onSubmit();
    };

    return (
        <DialogRoot open={open} onOpenChange={onClose} size='sm' initialFocusEl={deleteQueryButtonRef}>
            <DialogContent backgroundColor='white_color_mode'>
                <DialogHeader paddingY='20px' fontSize='lg' fontWeight='bold'>
                    Delete Saved Query?
                </DialogHeader>
                <DialogCloseTrigger {...ModelCloseButtonStyle} />
                <DialogBody paddingY='10px'>
                    <Text fontSize='sm'>This will delete your saved query '{savedQueryName}'</Text>
                </DialogBody>
                <DialogFooter paddingY='10px'>
                    <Flex width='100%'>
                        <Spacer />
                        <Box>
                            <Button onClick={onClose} {...CancelButtonStyle}>
                                Cancel
                            </Button>
                            <Button onClick={submitQueryDeletion} ref={deleteQueryButtonRef} {...DeleteButtonStyle}>
                                Delete
                            </Button>
                        </Box>
                    </Flex>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
}

const ModelCloseButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '24px',
};

const CancelButtonStyle = {
    marginRight: '5px',
    size: 'sm',
    variant: 'subtle',
};

const DeleteButtonStyle = {
    size: 'sm',
    colorPalette: 'red',
};
