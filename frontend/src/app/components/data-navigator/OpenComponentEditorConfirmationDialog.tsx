import { Button, Flex, Spacer, Box, Text, ButtonProps, DialogCloseTriggerProps } from '@chakra-ui/react';
import { Link as RouteLink } from 'react-router-dom';
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogCloseTrigger,
    DialogBody,
    DialogFooter,
} from '../shared/ui-components/dialog';

interface OpenComponentEditorConfirmationDialogProps {
    confirmDialogIsOpen: boolean;
    onCloseConfirmDialog: () => void;
    component: string;
}

export default function OpenComponentEditorConfirmationDialog({
    confirmDialogIsOpen,
    onCloseConfirmDialog,
    component,
}: OpenComponentEditorConfirmationDialogProps) {
    return (
        <DialogRoot open={confirmDialogIsOpen} onOpenChange={onCloseConfirmDialog} size='sm'>
            <DialogContent backgroundColor='white_color_mode'>
                <DialogHeader paddingY='20px' fontSize='lg' fontWeight='bold'>
                    Open in Component Editor?
                </DialogHeader>
                <DialogCloseTrigger {...ModelCloseButtonStyle} />
                <DialogBody paddingY='10px'>
                    <Text fontSize='sm'>
                        Leaving this page will result in your current work being lost. Do you wish to continue?
                    </Text>
                </DialogBody>
                <DialogFooter paddingY='10px'>
                    <Flex width='100%'>
                        <Spacer />
                        <Box>
                            <Button onClick={onCloseConfirmDialog} {...CancelButtonStyle}>
                                Cancel
                            </Button>
                            <RouteLink
                                to='/component-editor'
                                state={{
                                    component,
                                }}
                            >
                                <Button onClick={onCloseConfirmDialog} {...ContinueButtonStyle}>
                                    Continue
                                </Button>
                            </RouteLink>
                        </Box>
                    </Flex>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
}

const ModelCloseButtonStyle: DialogCloseTriggerProps = {
    position: 'absolute',
    top: '10px',
    right: '24px',
};

const CancelButtonStyle: ButtonProps = {
    marginRight: '5px',
    size: 'sm',
    variant: 'subtle',
};

const ContinueButtonStyle: ButtonProps = {
    size: 'sm',
    colorPalette: 'red',
};
