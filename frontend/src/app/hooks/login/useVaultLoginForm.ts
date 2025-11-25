import { useEffect, useRef, useState, useCallback, Dispatch, SetStateAction, KeyboardEvent } from 'react';
import { login } from '../../services/ApiService';

const LOGIN_TYPE_VALUES = {
    BASIC: 'basic',
    SESSION: 'session',
    INTEGRATED: 'integrated',
};

interface UseVaultLoginFormProps {
    setSessionId: Dispatch<SetStateAction<string | null>>;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
    originatingUrl: string | undefined;
    originatingVaultSession: string | undefined;
    integratedLoginIsEnabled: boolean;
}

export default function useVaultLoginForm({
    setSessionId,
    setIsLoggedIn,
    originatingUrl,
    originatingVaultSession,
    integratedLoginIsEnabled,
}: UseVaultLoginFormProps) {
    const [userName, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [vaultDNS, setVaultDNS] = useState<string>('');
    const [loginSessionId, setLoginSessionId] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState({ hasError: false, errorMessage: '' });
    const [loginFormTabValue, setLoginFormTabValue] = useState<string>(LOGIN_TYPE_VALUES.BASIC);

    const passwordRef = useRef<HTMLInputElement>(null);
    const usernameRef = useRef<HTMLInputElement>(null);
    const sessionIdRef = useRef<HTMLInputElement>(null);
    const loginButtonRef = useRef<HTMLButtonElement>(null);

    /**
     * Determines if current inputs are valid for authentication.
     * Must have VaultDNS and either (username + password) or sessionId.
     * @returns true if inputs are valid, otherwise false
     */
    const canSubmit: () => boolean = () => {
        // For Integrated login, must have originating DNS and session
        if (loginFormTabValue === LOGIN_TYPE_VALUES.INTEGRATED) {
            if (!originatingUrl || !originatingVaultSession) {
                return false;
            }
            return true;
        }

        if (!vaultDNS) {
            return false;
        }
        if (!loginSessionId && (!userName || !password)) {
            return false;
        }
        if (!userName && !password && !loginSessionId) {
            return false;
        }
        return true;
    };

    /**
     * Authenticates with Vault when the login form is submitted.
     * @param originatingVaultDNS - (optional) DNS of the Vault which Toolbox was launched from
     * @param originatingVaultSession - (optional) session ID of the Vault which Toolbox was launched from
     * @returns {Promise<void>}
     */
    const handleSubmit = useCallback(
        async ({
            originatingVaultDNS = '',
            originatingVaultSession = '',
        }: {
            originatingVaultDNS?: string;
            originatingVaultSession?: string;
        }): Promise<void> => {
            setError({ hasError: false, errorMessage: '' });
            const cleanVaultDNS = vaultDNS?.replace(/^https?:\/\//, ''); // Remove http(s)://

            const vaultAuthenticatingDNS = originatingVaultDNS || cleanVaultDNS;
            const vaultAuthenticatingSessionId = originatingVaultSession || loginSessionId;

            const params = {
                userName,
                password,
                vaultDNS: vaultAuthenticatingDNS,
                sessionId: vaultAuthenticatingSessionId,
            };

            setLoading(true);
            const authResponse = await login(params);

            if (authResponse?.responseStatus === 'SUCCESS') {
                sessionStorage.setItem('vaultDNS', vaultAuthenticatingDNS);
                setIsLoggedIn(true);

                // Basic auth
                if (authResponse?.sessionId) {
                    setSessionId(authResponse.sessionId);
                    sessionStorage.setItem('vaultId', authResponse?.vaultId);
                    sessionStorage.setItem('userId', authResponse?.userId);
                } else {
                    // Session auth
                    setSessionId(vaultAuthenticatingSessionId);
                }
            } else {
                let errMessage = '';
                // Vault errors
                if (authResponse?.errors?.length > 0) {
                    errMessage = authResponse?.errors[0]?.type + ' : ' + authResponse?.errors[0]?.message;
                }
                setError({ hasError: true, errorMessage: errMessage });
            }
            setLoading(false);
        }, // eslint-disable-next-line react-hooks/exhaustive-deps -- setIsLoggedIn & setSessionId are stable setState functions
        [password, userName, vaultDNS, loginSessionId],
    );

    /**
     * Sets the input focus on the password field.
     */
    const setFocusToPasswordInput: () => void = useCallback(() => {
        if (passwordRef.current) {
            passwordRef.current.focus();
        }
    }, []);

    /**
     * Sets the input focus on the username field.
     */
    const setFocusToUsernameInput: () => void = useCallback(() => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    }, []);

    /**
     * Sets the input focus on the sessionId field.
     */
    const setFocusToSessionInput: () => void = () => {
        if (sessionIdRef.current) {
            sessionIdRef.current.focus();
        }
    };

    /**
     * Attempt login if user can submit and presses enter
     * @param {object} event
     */
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (canSubmit() && event?.key === 'Enter') {
            event.preventDefault();
            loginButtonRef?.current?.click();
        }
    };

    /**
     * Handles clearing previous inputs when user switches auth types
     * @param {String} tabValue : basic, session, integrated
     */
    const handleAuthTypeChange = useCallback(
        (tabValue: string) => {
            if (tabValue === LOGIN_TYPE_VALUES.BASIC) {
                // Switched to basic auth : clear session input
                setLoginSessionId('');

                // After slight delay, move the focus to the session input field
                setTimeout(setFocusToUsernameInput, 100);
            } else if (tabValue === LOGIN_TYPE_VALUES.SESSION) {
                // Switched to session auth : clear username/password inputs
                setUserName('');
                setPassword('');

                // After slight delay, move the focus to the session input field
                setTimeout(setFocusToSessionInput, 100);
            }

            setLoginFormTabValue(tabValue);
            setError({ hasError: false, errorMessage: '' });
        },
        [setFocusToUsernameInput],
    );

    /**
     * Determines if the Integrated login tab of the login form is selected.
     * (loginFormTabValue: basic, session, integrated)
     * @returns {boolean} true if the Integrated tab is selected, otherwise false
     */
    const isIntegratedLoginTabSelected = () => {
        return loginFormTabValue === LOGIN_TYPE_VALUES.INTEGRATED;
    };

    /*
        If Toolbox was launched from a Vault with an existing session, login and/or default to Integrated login tab
     */
    useEffect(() => {
        if (originatingUrl && originatingVaultSession) {
            if (integratedLoginIsEnabled) {
                handleSubmit({ originatingVaultDNS: originatingUrl, originatingVaultSession });
            }

            // Integrated login = tabValue 'integrated'
            handleAuthTypeChange(LOGIN_TYPE_VALUES.INTEGRATED);
        }
    }, [originatingVaultSession, originatingUrl, integratedLoginIsEnabled, handleAuthTypeChange]);

    return {
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
    };
}
