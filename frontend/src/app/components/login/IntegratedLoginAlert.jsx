import { Alert, AlertTitle, AlertDescription, Flex } from '@chakra-ui/react';

export default function IntegratedLoginAlert() {
    return (
        <Alert {...AlertStyle}>
            <AlertTitle {...AlertTitleStyle}>Integrated Login with Vault UI</AlertTitle>
            <Flex flexDirection='row' align='center'>
                <AlertDescription {...AlertDescriptionStyle}>
                    Vault Toolbox now supports Integrated Login when launched from a browser tab with an active Vault UI
                    session. This option supports all Vault user authentication types including{' '}
                    <i>Basic Username/Password</i> and <i>Single Sign-on</i>. By enabling Integrated Login, you
                    authorize Vault Toolbox to automatically authenticate and read Vault data using your existing Vault
                    session.
                </AlertDescription>
            </Flex>
        </Alert>
    );
}

const AlertStyle = {
    status: 'info',
    variant: 'subtle',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: '8px',
};

const AlertTitleStyle = {
    fontSize: 'lg',
    textAlign: 'center',
    marginTop: 1,
    marginBottom: 1,
};

const AlertDescriptionStyle = {
    fontSize: 'md',
    textAlign: 'justify',
};
