import { useEffect, useState } from 'react';

export default function useIntegratedLogin(): {
    integratedLoginIsEnabled: boolean;
    toggleIntegratedLogin: () => void;
} {
    const [integratedLoginIsEnabled, setIntegratedLoginIsEnabled] = useState<boolean>(
        getIntegratedLoginIsEnabledFromStorage,
    );

    /**
     * Retrieves value of integratedLoginIsEnabled from local storage
     * @returns {boolean} - value of integratedLoginIsEnabled
     */
    function getIntegratedLoginIsEnabledFromStorage(): boolean {
        const storedValue = localStorage.getItem('integratedLoginIsEnabled');
        // If value not found in localStorage, default to false (disabled)
        if (storedValue === null) {
            return false;
        }
        return JSON.parse(storedValue);
    }

    /**
     * Enables/disables Toolbox Integrated Login setting
     */
    const toggleIntegratedLogin: () => void = (): void => {
        setIntegratedLoginIsEnabled(!integratedLoginIsEnabled);
    };

    /**
     * Update local storage value whenever integratedLoginIsEnabled updates
     */
    useEffect(() => {
        localStorage.setItem('integratedLoginIsEnabled', JSON.stringify(integratedLoginIsEnabled));
    }, [integratedLoginIsEnabled]);

    return {
        integratedLoginIsEnabled,
        toggleIntegratedLogin,
    };
}
