import { Flex, Box, Field, Input, Stack, Button, Tabs, ButtonGroup, Text } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import useIntegratedLogin from '../../hooks/login/useIntegratedLogin';
import useSavedVaultData from '../../hooks/login/useSavedVaultData';
import useVaultLoginForm from '../../hooks/login/useVaultLoginForm';
import useVaultSession from '../../hooks/shared/useVaultSession';
import { Switch } from '../shared/ui-components/switch';
import IntegratedLoginAlert from './IntegratedLoginAlert';
import SavedVaultsPopover from './SavedVaultsPopover';

export default function LoginCard() {
    const { integratedLoginIsEnabled, toggleIntegratedLogin } = useIntegratedLogin();
    const { isLoggedIn, setIsLoggedIn, setSessionId } = useAuth();
    const { originatingUrl, originatingVaultSession } = useVaultSession();
    const navigate = useNavigate();

    const {
        loading,
        error,
        userName,
        setUserName,
        password,
        setPassword,
        loginSessionId,
        setLoginSessionId,
        vaultDNS,
        setVaultDNS,
        loginFormTabValue,
        isIntegratedLoginTabSelected,
        canSubmit,
        handleSubmit,
        handleAuthTypeChange,
        setFocusToPasswordInput,
        setFocusToUsernameInput,
        passwordRef,
        usernameRef,
        sessionIdRef,
        loginButtonRef,
        handleKeyDown,
    } = useVaultLoginForm({
        setSessionId,
        setIsLoggedIn,
        originatingUrl,
        originatingVaultSession,
        integratedLoginIsEnabled,
    });

    const { savedVaultData, setSavedVaultData } = useSavedVaultData({
        setUserName,
        setVaultDNS,
        setFocusToPasswordInput,
        setFocusToUsernameInput,
    });

    /**
     * If sessionId is populated, re-route to home page, since auth was successful.
     */
    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    return (
        <Box {...LoginCardBoxStyle}>
            <Stack gap={0}>
                <Field.Root id='dns' required marginBottom={4}>
                    <Field.Label>Vault DNS</Field.Label>
                    <Flex width='100%'>
                        <ButtonGroup colorPalette='gray' width='100%' disabled={isIntegratedLoginTabSelected()}>
                            <Input
                                type='dns'
                                value={isIntegratedLoginTabSelected() && originatingUrl ? originatingUrl : vaultDNS}
                                onChange={(event) => setVaultDNS(event.currentTarget.value.trim())}
                                disabled={isIntegratedLoginTabSelected()}
                                variant='outline'
                                borderColor='light_gray_color_mode'
                                borderRadius='md'
                            />
                            <SavedVaultsPopover
                                setVaultDNS={setVaultDNS}
                                setUsername={setUserName}
                                setFocusToPasswordInput={setFocusToPasswordInput}
                                savedVaultData={savedVaultData}
                                setSavedVaultData={setSavedVaultData}
                            />
                        </ButtonGroup>
                    </Flex>
                </Field.Root>
                <Tabs.Root
                    fitted
                    variant='outline'
                    value={loginFormTabValue}
                    onValueChange={(e) => handleAuthTypeChange(e.value)}
                >
                    <Tabs.List borderBottom='1px solid' borderColor='gray_background_color_mode'>
                        <Tabs.Trigger value='basic' {...TabStyle}>
                            Basic
                        </Tabs.Trigger>
                        <Tabs.Trigger value='session' {...TabStyle}>
                            Session
                        </Tabs.Trigger>
                        <Tabs.Trigger value='integrated' {...TabStyle}>
                            Integrated
                        </Tabs.Trigger>
                    </Tabs.List>
                    <Flex minH='14vh'>
                        <Tabs.Content value='basic' marginBottom={4} paddingBottom={0}>
                            <Field.Root id='username' required invalid={error.hasError}>
                                <Field.Label>
                                    User Name
                                    <Field.RequiredIndicator />
                                </Field.Label>
                                <Input
                                    type='email'
                                    value={userName}
                                    onChange={(event) => setUserName(event.currentTarget.value.trim())}
                                    ref={usernameRef}
                                    onKeyDown={handleKeyDown}
                                    variant='outline'
                                    borderColor='light_gray_color_mode'
                                />
                            </Field.Root>
                            <Field.Root id='password' required invalid={error.hasError} marginTop='8px'>
                                <Field.Label>
                                    Password
                                    <Field.RequiredIndicator />
                                </Field.Label>
                                <Input
                                    type='password'
                                    value={password}
                                    onChange={(event) => setPassword(event.currentTarget.value)}
                                    ref={passwordRef}
                                    onKeyDown={handleKeyDown}
                                    variant='outline'
                                    borderColor='light_gray_color_mode'
                                />
                                <Field.ErrorText>{error.errorMessage}</Field.ErrorText>
                            </Field.Root>
                        </Tabs.Content>
                        <Tabs.Content value='session' marginBottom={4} paddingBottom={0}>
                            <Field.Root id='session' required invalid={error.hasError}>
                                <Field.Label>
                                    Session Id
                                    <Field.RequiredIndicator />
                                </Field.Label>
                                <Input
                                    type='session'
                                    value={loginSessionId}
                                    onChange={(event) => setLoginSessionId(event.currentTarget.value)}
                                    ref={sessionIdRef}
                                    onKeyDown={handleKeyDown}
                                    variant='outline'
                                    borderColor='light_gray_color_mode'
                                />
                                <Field.ErrorText>{error.errorMessage}</Field.ErrorText>
                            </Field.Root>
                        </Tabs.Content>
                        <Tabs.Content value='integrated' marginBottom={4} paddingBottom={0}>
                            <IntegratedLoginAlert />
                            <Flex {...ToggleSwitchFlexStyle}>
                                <Switch
                                    checked={integratedLoginIsEnabled}
                                    onCheckedChange={() => toggleIntegratedLogin()}
                                    colorPalette='blue'
                                />
                                <Text marginX='10px'>Enable Auto-Integrated Login (All Vaults)</Text>
                            </Flex>
                            <Field.Root id='integrated' invalid={error.hasError}>
                                <Field.ErrorText>{error.errorMessage}</Field.ErrorText>
                            </Field.Root>
                        </Tabs.Content>
                    </Flex>
                </Tabs.Root>
                {isIntegratedLoginTabSelected() ? (
                    <Button
                        {...ButtonStyle}
                        disabled={!canSubmit()}
                        isLoading={loading}
                        onClick={() => handleSubmit({ originatingVaultDNS: originatingUrl, originatingVaultSession })}
                        ref={loginButtonRef}
                    >
                        Log In With Existing Vault Session
                    </Button>
                ) : (
                    <Button
                        {...ButtonStyle}
                        disabled={!canSubmit()}
                        isLoading={loading}
                        onClick={handleSubmit}
                        ref={loginButtonRef}
                    >
                        Log In
                    </Button>
                )}
            </Stack>
        </Box>
    );
}

const TabStyle = {
    _selected: {
        backgroundColor: 'gray_background_color_mode',
        fontWeight: 'bold',
    },
};

const LoginCardBoxStyle = {
    width: 600,
    borderRadius: '8px',
    backgroundColor: 'white_color_mode',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    padding: 8,
};

const ButtonStyle = {
    backgroundColor: 'blue.400',
    color: 'white',
    _hover: { bg: 'blue.500' },
    loadingText: 'Authenticating',
    fontSize: '20px',
    borderRadius: '8px',
};

const ToggleSwitchFlexStyle = {
    fontSize: 'md',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 0,
};
