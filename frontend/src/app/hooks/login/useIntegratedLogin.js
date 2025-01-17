import { useEffect, useState } from 'react';

export default function useIntegratedLogin() {
    const [integratedLoginIsEnabled, setIntegratedLoginIsEnabled] = useState(getIntegratedLoginIsEnabledFromStorage);

    /**
     * Retrieves value of integratedLoginIsEnabled from local storage
     * @returns {any} - value of integratedLoginIsEnabled
     */
    function getIntegratedLoginIsEnabledFromStorage() {
        return JSON.parse(localStorage.getItem('integratedLoginIsEnabled'));
    }

    /**
     * Enables/disables Toolbox Integrated Login setting
     */
    const toggleIntegratedLogin = () => {
        setIntegratedLoginIsEnabled(!integratedLoginIsEnabled);
    };

    /**
     * Update local storage value whenever integratedLoginIsEnabled updates
     */
    useEffect(() => {
        localStorage.setItem('integratedLoginIsEnabled', integratedLoginIsEnabled);
    }, [integratedLoginIsEnabled]);

    return {
        integratedLoginIsEnabled,
        toggleIntegratedLogin,
    };
}
