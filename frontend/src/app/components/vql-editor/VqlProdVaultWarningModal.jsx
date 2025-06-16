import { Box, useDisclosure, Link } from '@chakra-ui/react';
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogFooter,
    DialogCloseTrigger,
} from '../shared/ui-components/dialog';
export default function VqlProdVaultWarningModal() {
    const { open, onClose } = useDisclosure({ defaultOpen: true });

    return (
        <DialogRoot open={open} onOpenChange={onClose}>
            <DialogContent backgroundColor='white_color_mode'>
                <DialogHeader paddingY='20px' fontSize='lg' fontWeight='bold'>
                    Production Vault Warning
                </DialogHeader>
                <DialogCloseTrigger {...ModelCloseButtonStyle} />
                <DialogBody paddingY='0px' fontSize='md'>
                    <Box>
                        You are about to run VQL Queries against a Production Vault, which may affect end-user
                        experience.
                    </Box>
                    <Box marginTop='10px'>
                        Please follow{' '}
                        <Link
                            href='https://developer.veevavault.com/vql/#query-performance-best-practices'
                            target='_blank'
                            rel='noopener noreferrer'
                            {...HyperlinkStyle}
                        >
                            VQL Best Practices
                        </Link>{' '}
                        to minimize the effect of the queries on the Vault.
                    </Box>
                </DialogBody>
                <DialogFooter paddingY='10px' />
            </DialogContent>
        </DialogRoot>
    );
}

const ModelCloseButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '24px',
};

const HyperlinkStyle = {
    textDecoration: 'underline',
    color: 'hyperlink_blue_color_mode',
};
