import { Flex, FlexProps, Heading, HeadingProps, Text, TextProps } from '@chakra-ui/react';

export default function IntegratedLoginAlert() {
    return (
        <Flex {...AlertStyle}>
            <Heading {...AlertTitleStyle}>Integrated Login with Vault UI</Heading>
            <Flex flexDirection='row' align='center'>
                <Text {...AlertDescriptionStyle}>
                    Vault Toolbox now supports Integrated Login when launched from a browser tab with an active Vault UI
                    session. This option supports all Vault user authentication types including{' '}
                    <i>Basic Username/Password</i> and <i>Single Sign-on</i>. By enabling Integrated Login, you
                    authorize Vault Toolbox to automatically authenticate and read Vault data using your existing Vault
                    session.
                </Text>
            </Flex>
        </Flex>
    );
}

const AlertStyle: FlexProps = {
    backgroundColor: 'legacy_alert_background_color_mode',
    color: 'fg',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '8px',
    padding: '10px',
};

const AlertTitleStyle: HeadingProps = {
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 1,
};

const AlertDescriptionStyle: TextProps = {
    fontSize: 'md',
    textAlign: 'justify',
};
