import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from 'react';
import { getVaultDNS } from '../services/ApiService';

interface AuthContextType {
    sessionId: string | null;
    setSessionId: Dispatch<SetStateAction<string | null>>;
    isLoggedIn: boolean;
    setIsLoggedIn: Dispatch<SetStateAction<boolean>>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Initializes and provides AuthContext.
 * @returns AuthContext
 */
export function useAuth(): AuthContextType {
    const authContext = useContext(AuthContext);

    if (authContext === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }

    return authContext;
}

function getIsLoggedIn() {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn !== null) {
        return JSON.parse(isLoggedIn);
    }

    return false;
}

interface AuthProviderProps {
    children: ReactNode;
}

/**
 * Reads sessionId into state and provides it to the Application.
 * @param {Object} props
 * @returns
 */
export function AuthProvider(props: AuthProviderProps) {
    const [sessionId, setSessionId] = useState<string | null>(null);
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

    const authInfo: AuthContextType = {
        sessionId,
        setSessionId,
        isLoggedIn,
        setIsLoggedIn,
    };

    return <AuthContext.Provider value={authInfo}>{props.children}</AuthContext.Provider>;
}
