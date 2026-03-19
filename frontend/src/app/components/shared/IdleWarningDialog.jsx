import { Button } from '@chakra-ui/react';
import { DialogRoot, DialogContent, DialogHeader, DialogBody, DialogFooter } from './ui-components/dialog';

export default function IdleWarningDialog({ promptOpen, activate, remainingTime }) {
    return (
        <DialogRoot open={promptOpen} size='sm'>
            <DialogContent backgroundColor='white_color_mode'>
                <DialogHeader paddingY='20px' fontSize='lg' fontWeight='bold'>
                    Are you still here?
                </DialogHeader>
                <DialogBody paddingY='0px'>
                    You have been inactive for a while. To protect your account, Vault Toolbox - Unhinged Edition will stop renewing your
                    session in {remainingTime} seconds.
                </DialogBody>
                <DialogFooter paddingY='10px'>
                    <Button onClick={() => activate()} {...ButtonStyle}>
                        Still here
                    </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
}

const ButtonStyle = {
    variant: 'solid',
    size: 'sm',
    colorPalette: 'red',
    padding: '10px',
};
