import { Flex, Spacer, Box, Link, useDisclosure, FlexProps, BoxProps, LinkProps } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { getVaultApiVersion, getVaultDns, getVaultName } from '../../services/SharedServices';
import EditApiVersionModal from './EditApiVersionModal';
import { Tooltip } from './ui-components/tooltip';

export default function VaultInfoIsland({ children }: { children?: ReactNode }) {
    const { open, onOpen, onClose } = useDisclosure();
    const fullVaultURL: string = `https://${getVaultDns()}`;
    const vaultDomain: string | undefined = getVaultDns()?.split('.')[0]; // Remove .veevavault.com

    return (
        <Flex {...ParentFlexStyle}>
            <Box {...BoxStyle}>
                <Tooltip content={fullVaultURL} openDelay={0} positioning={{ placement: 'top-end' }}>
                    <Link href={fullVaultURL} target='_blank' rel='noopener noreferrer'>
                        {getVaultName()} ({vaultDomain})
                    </Link>
                </Tooltip>
            </Box>
            <Spacer />
            {children}
            <Box whiteSpace='nowrap'>
                API Version:
                <Tooltip content='Edit Vault API Version' openDelay={0} positioning={{ placement: 'top-start' }}>
                    <Link {...ApiVersionTextStyle} onClick={onOpen}>
                        {getVaultApiVersion()}
                    </Link>
                </Tooltip>
            </Box>
            {open ? <EditApiVersionModal open={open} onClose={onClose} /> : null}
        </Flex>
    );
}

const ParentFlexStyle: FlexProps = {
    height: '42px',
    width: 'calc(100% - 20px)',
    margin: '5px 0px 10px',
    paddingX: '10px',
    borderRadius: '8px',
    align: 'center',
    backgroundColor: 'white_color_mode',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
    gap: '5px',
    overflowX: 'auto',
    overflowY: 'hidden',
};

const BoxStyle: BoxProps = {
    height: '42px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'underline',
    whiteSpace: 'nowrap',
};

const ApiVersionTextStyle: LinkProps = {
    textDecoration: 'underline',
    display: 'inline',
    marginLeft: '5px',
    color: 'veeva_orange_color_mode',
};
