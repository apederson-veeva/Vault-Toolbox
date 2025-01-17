import { createContext, useContext, useEffect, useState } from 'react';
import { getVaultDNS } from '../services/ApiService';

const AuthContext = createContext();

/**
 * Initializes and provides AuthContext.
 * @returns AuthContext
 */
export function useAuth() {
    return useContext(AuthContext);
}

function getIsLoggedIn() {
    return JSON.parse(sessionStorage.getItem('isLoggedIn'));
}

/**
 * Reads sessionId into state and provides it to the Application.
 * @param {Object} props
 * @returns
 */
export function AuthProvider(props) {
    const [sessionId, setSessionId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(getIsLoggedIn);

    useEffect(() => {
        const vaultDNS = getVaultDNS();
        if (sessionId && vaultDNS) {
            chrome.cookies.set({
                name: 'vaultToolboxSessionId',
                value: sessionId,
                httpOnly: true,
                url: `https://${vaultDNS}`,
            });
        }
    }, [sessionId]);

    useEffect(() => {
        sessionStorage.setItem('isLoggedIn', isLoggedIn);
    }, [isLoggedIn]);

    const authInfo = {
        sessionId,
        setSessionId,
        isLoggedIn,
        setIsLoggedIn,
    };

    return <AuthContext.Provider value={authInfo}>{props.children}</AuthContext.Provider>;
}
