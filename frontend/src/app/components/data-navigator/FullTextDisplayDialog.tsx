import { Box, Portal, Dialog, CloseButton, BoxProps, DialogContentProps } from '@chakra-ui/react';
import { memo } from 'react';

interface FullTextDisplayDialogProps {
    fieldType: string;
    value: any;
    isOverflown: boolean;
}

export default memo(({ fieldType, value, isOverflown }: FullTextDisplayDialogProps) => {
    return (
        <Dialog.Root motionPreset='slide-in-bottom'>
            {isOverflown && (
                <Dialog.Trigger asChild>
                    <Box {...ShowMoreTextStyle}>Show more</Box>
                </Dialog.Trigger>
            )}
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content {...DialogContentStyle}>
                        <Dialog.Header>
                            <Dialog.Title>{fieldType}</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body overflow='auto'>
                            {fieldType === 'RichText' ? (
                                <Box dangerouslySetInnerHTML={{ __html: value }} />
                            ) : (
                                <Box whiteSpace='pre-wrap'>{value}</Box>
                            )}
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size='sm' />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
});

const ShowMoreTextStyle: BoxProps = {
    textDecoration: 'underline',
    _hover: { cursor: 'pointer' },
    color: 'veeva_orange_color_mode',
};

const DialogContentStyle: DialogContentProps = {
    maxW: '80vw',
    maxH: '80vh',
    minW: '80vw',
    minH: '80vh',
    overflow: 'auto',
    fontSize: 'md',
    backgroundColor: 'white_color_mode',
};
