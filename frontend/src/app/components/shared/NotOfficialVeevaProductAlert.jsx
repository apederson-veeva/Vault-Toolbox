import { Alert, AlertIcon, AlertDescription, Text, Link, Box } from '@chakra-ui/react';
import { PiArrowSquareOutLight } from 'react-icons/pi';

export default function NotOfficialVeevaProductAlert() {
    return (
        <Alert {...AlertStyle} justifyContent='center'>
            <AlertIcon boxSize='30px' />
            <AlertDescription {...AlertDescriptionStyle}>
                <Text>
                    Vault Toolbox is a collection of open-source tools created and maintained by the Vault Developer
                    Support Team. While not official Veeva products, dedicated support for these tools can be accessed
                    exclusively through the{' '}
                    <Link href='https://veevaconnect.com/communities/ATeJ3k8lgAA/about' isExternal {...HyperlinkStyle}>
                        Vault for Developers community
                        <Box as={PiArrowSquareOutLight} display='inline' />
                    </Link>{' '}
                    on Veeva Connect. Vault Product Support cannot assist with these open-source tools.
                </Text>
            </AlertDescription>
        </Alert>
    );
}

const AlertStyle = {
    status: 'info',
    variant: 'subtle',
    width: '50%',
    minWidth: '500px',
    justifyContent: 'center',
    borderRadius: '8px',
};

const AlertDescriptionStyle = {
    fontSize: 'md',
    alignContent: 'center',
};

const HyperlinkStyle = {
    textDecoration: 'underline',
    color: 'hyperlink_blue.color_mode',
};
