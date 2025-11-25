import { Icon, Flex, Text, Link, Box } from '@chakra-ui/react';
import { FlexProps, LinkProps } from '@chakra-ui/react';
import { PiArrowSquareOutLight, PiInfoFill } from 'react-icons/pi';

export default function NotOfficialVeevaProductAlert() {
    return (
        <Flex {...AlertStyle}>
            <Icon as={PiInfoFill} boxSize='30px' color='blue_color_mode' marginRight='10px' />
            <Flex {...AlertDescriptionStyle}>
                <Text>
                    Vault Toolbox is a collection of open-source tools created and maintained by the Vault Developer
                    Support Team. While not official Veeva products, dedicated support for these tools can be accessed
                    exclusively through the{' '}
                    <Link
                        href='https://veevaconnect.com/communities/ATeJ3k8lgAA/about'
                        target='_blank'
                        rel='noopener noreferrer'
                        {...HyperlinkStyle}
                    >
                        Vault for Developers community
                        <Box as={PiArrowSquareOutLight} display='inline' />
                    </Link>{' '}
                    on Veeva Connect. Vault Product Support cannot assist with these open-source tools.
                </Text>
            </Flex>
        </Flex>
    );
}

const AlertStyle: FlexProps = {
    backgroundColor: 'legacy_alert_background_color_mode',
    color: 'fg',
    width: '50%',
    minWidth: '500px',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '8px',
    padding: '10px',
};

const AlertDescriptionStyle: FlexProps = {
    fontSize: 'md',
    alignContent: 'center',
};

const HyperlinkStyle: LinkProps = {
    textDecoration: 'underline',
    color: 'hyperlink_blue_color_mode',
};
