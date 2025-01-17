import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Tabs,
    Tab,
    TabList,
    TabPanels,
    TabPanel,
    FormErrorMessage,
    ButtonGroup,
    Switch,
    AlertDescription,
    AlertTitle,
    Alert,
    Text,
} from '@chakra-ui/react';
import { useAuth } from '../../context/AuthContext';
import useIntegratedLogin from '../../hooks/login/useIntegratedLogin';
import useVaultSession from '../../hooks/shared/useVaultSession';
import IntegratedLoginAlert from './IntegratedLoginAlert';
import SavedVaultsPopover from './SavedVaultsPopover';
import useVaultLoginForm from '../../hooks/login/useVaultLoginForm';
import useSavedVaultData from '../../hooks/login/useSavedVaultData';

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
        loginFormTabIndex,
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
    }, [isLoggedIn]);

    return (
        <Box {...LoginCardBoxStyle}>
            <Stack spacing={0}>
                <FormControl id='dns' isRequired marginBottom={4}>
                    <FormLabel>Vault DNS</FormLabel>
                    <Flex>
                        <ButtonGroup
                            isAttached
                            colorScheme='gray'
                            width='100%'
                            isDisabled={isIntegratedLoginTabSelected()}
                        >
                            <Input
                                type='dns'
                                value={isIntegratedLoginTabSelected() && originatingUrl ? originatingUrl : vaultDNS}
                                onChange={(event) => setVaultDNS(event.currentTarget.value.trim())}
                                disabled={isIntegratedLoginTabSelected()}
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
                </FormControl>
                <Tabs
                    isFitted
                    variant='enclosed'
                    index={loginFormTabIndex}
                    onChange={(index) => handleAuthTypeChange(index)}
                >
                    <TabList>
                        <Tab {...TabStyle}>Basic</Tab>
                        <Tab {...TabStyle}>Session</Tab>
                        <Tab {...TabStyle}>Integrated</Tab>
                    </TabList>
                    <Flex minH='14vh'>
                        <TabPanels>
                            <TabPanel>
                                <FormControl id='username' isRequired isInvalid={error.hasError}>
                                    <FormLabel>User Name</FormLabel>
                                    <Input
                                        type='email'
                                        value={userName}
                                        onChange={(event) => setUserName(event.currentTarget.value.trim())}
                                        ref={usernameRef}
                                        onKeyDown={handleKeyDown}
                                    />
                                </FormControl>
                                <FormControl id='password' isRequired isInvalid={error.hasError} marginTop='8px'>
                                    <FormLabel>Password</FormLabel>
                                    <Input
                                        type='password'
                                        value={password}
                                        onChange={(event) => setPassword(event.currentTarget.value)}
                                        ref={passwordRef}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <FormErrorMessage>{error.errorMessage}</FormErrorMessage>
                                </FormControl>
                            </TabPanel>
                            <TabPanel>
                                <FormControl id='session' isRequired isInvalid={error.hasError}>
                                    <FormLabel>Session Id</FormLabel>
                                    <Input
                                        type='session'
                                        value={loginSessionId}
                                        onChange={(event) => setLoginSessionId(event.currentTarget.value)}
                                        ref={sessionIdRef}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <FormErrorMessage>{error.errorMessage}</FormErrorMessage>
                                </FormControl>
                            </TabPanel>
                            <TabPanel marginBottom={4} paddingBottom={0}>
                                <IntegratedLoginAlert />
                                <Flex {...ToggleSwitchFlexStyle}>
                                    <Switch
                                        isChecked={integratedLoginIsEnabled}
                                        onChange={() => toggleIntegratedLogin()}
                                    />
                                    <Text marginX='10px'>Enable Auto-Integrated Login (All Vaults)</Text>
                                </Flex>
                                <FormControl id='integrated' isInvalid={error.hasError}>
                                    <FormErrorMessage>{error.errorMessage}</FormErrorMessage>
                                </FormControl>
                            </TabPanel>
                        </TabPanels>
                    </Flex>
                </Tabs>
                <Stack spacing={10}>
                    {isIntegratedLoginTabSelected() ? (
                        <Button
                            {...ButtonStyle}
                            isDisabled={!canSubmit()}
                            isLoading={loading}
                            onClick={() =>
                                handleSubmit({ originatingVaultDNS: originatingUrl, originatingVaultSession })
                            }
                            ref={loginButtonRef}
                        >
                            Log In With Existing Vault Session
                        </Button>
                    ) : (
                        <Button
                            {...ButtonStyle}
                            isDisabled={!canSubmit()}
                            isLoading={loading}
                            onClick={handleSubmit}
                            ref={loginButtonRef}
                        >
                            Log In
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Box>
    );
}

const TabStyle = {
    _selected: {
        backgroundColor: 'gray.background.color_mode',
        fontWeight: 'bold',
    },
};

const LoginCardBoxStyle = {
    width: 600,
    borderRadius: '8px',
    backgroundColor: 'white.color_mode',
    boxShadow: '0 0 5px rgba(0,0,0,0.2)',
    padding: 8,
};

const ButtonStyle = {
    backgroundColor: 'blue.400',
    color: 'white',
    _hover: { bg: 'blue.500' },
    loadingText: 'Authenticating',
};

const ToggleSwitchFlexStyle = {
    fontSize: 'md',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    marginBottom: 0,
};
