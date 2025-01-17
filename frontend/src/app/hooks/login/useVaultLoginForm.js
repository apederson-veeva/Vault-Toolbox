import { useEffect, useRef, useState } from 'react';
import { login } from '../../services/ApiService';

export default function useVaultLoginForm({
    setSessionId,
    setIsLoggedIn,
    originatingUrl,
    originatingVaultSession,
    integratedLoginIsEnabled,
}) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [vaultDNS, setVaultDNS] = useState('');
    const [loginSessionId, setLoginSessionId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState({ hasError: false, errorMessage: '' });
    const [loginFormTabIndex, setLoginFormTabIndex] = useState(0);

    const passwordRef = useRef(null);
    const usernameRef = useRef(null);
    const sessionIdRef = useRef(null);
    const loginButtonRef = useRef(null);

    /**
     * Determines if current inputs are valid for authentication.
     * Must have VaultDNS and either (username + password) or sessionId.
     * @returns true if inputs are valid, otherwise false
     */
    const canSubmit = () => {
        // For Integrated login, must have originating DNS and session
        if (loginFormTabIndex === 2) {
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
    const handleSubmit = async ({ originatingVaultDNS = '', originatingVaultSession = '' }) => {
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
    };

    /**
     * Handles clearing previous inputs when user switches auth types
     * @param {Number} tabIndex : 0 = Basic Auth, 1 = Session, 2 = Integrated Login
     */
    const handleAuthTypeChange = (tabIndex) => {
        if (tabIndex === 0) {
            // Switched to basic auth : clear session input
            setLoginSessionId('');
        } else if (tabIndex === 1) {
            // Switched to session auth : clear username/password inputs
            setUserName('');
            setPassword('');

            // After slight delay, move the focus to the session input field
            setTimeout(setFocusToSessionInput, 100);
        }

        setLoginFormTabIndex(tabIndex);
        setError({ hasError: false, errorMessage: '' });
    };

    /**
     * Sets the input focus on the password field.
     */
    const setFocusToPasswordInput = () => {
        if (passwordRef.current) {
            passwordRef.current.focus();
        }
    };

    /**
     * Sets the input focus on the username field.
     */
    const setFocusToUsernameInput = () => {
        if (usernameRef.current) {
            usernameRef.current.focus();
        }
    };

    /**
     * Sets the input focus on the sessionId field.
     */
    const setFocusToSessionInput = () => {
        if (sessionIdRef.current) {
            sessionIdRef.current.focus();
        }
    };

    /**
     * Attempt login if user can submit and presses enter
     * @param {object} event
     */
    const handleKeyDown = (event) => {
        if (canSubmit && event?.key === 'Enter') {
            event.preventDefault();
            loginButtonRef.current.click();
        }
    };

    /**
     * Determines if the Integrated login tab of the login form is selected.
     * (loginFormTabIndex: 0 = Basic Auth, 1 = Session, 2 = Integrated Login)
     * @returns {boolean} true if the Integrated tab is selected, otherwise false
     */
    const isIntegratedLoginTabSelected = () => {
        return loginFormTabIndex === 2;
    };

    /*
        If Toolbox was launched from a Vault with an existing session, login and/or default to Integrated login tab
     */
    useEffect(() => {
        if (originatingUrl && originatingVaultSession) {
            if (integratedLoginIsEnabled) {
                handleSubmit({ originatingVaultDNS: originatingUrl, originatingVaultSession });
            }

            // Integrated login = tabIndex 2
            handleAuthTypeChange(2);
        }
    }, [originatingVaultSession]);

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
    };
}
