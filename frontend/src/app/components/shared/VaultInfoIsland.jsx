import { Flex, Spacer, Box, Link, useDisclosure } from '@chakra-ui/react';
import { getVaultApiVersion, getVaultDns, getVaultName } from '../../services/SharedServices';
import EditApiVersionModal from './EditApiVersionModal';
import { Tooltip } from './ui-components/tooltip';

export default function VaultInfoIsland({ children }) {
    const { open, onOpen, onClose } = useDisclosure();
    const fullVaultURL = `https://${getVaultDns()}`;
    const [vaultDomain] = getVaultDns().split('.'); // Remove .veevavault.com

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

const ParentFlexStyle = {
    height: '42px',
    width: 'calc(100% - 20px)',
    margin: '10px 0px',
    paddingX: '10px',
    borderRadius: '8px',
    align: 'center',
    backgroundColor: 'white_color_mode',
    boxShadow: '0 0 5px rgba(0,0,0,0.3)',
    gap: '5px',
    overflowX: 'auto',
    overflowY: 'hidden',
};

const BoxStyle = {
    height: '42px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    textDecoration: 'underline',
    whiteSpace: 'nowrap',
};

const ApiVersionTextStyle = {
    textDecoration: 'underline',
    display: 'inline',
    marginLeft: '5px',
    color: 'veeva_orange_color_mode',
};
