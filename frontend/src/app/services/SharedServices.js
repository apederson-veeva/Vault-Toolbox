import { VAULT_API_VERSION } from './vapil/VaultRequest';

export const VAULT_SUBDOMAINS = ['veevavault.com', 'veevavault.cn', 'vaultdev.com', 'vaultpvm.com'];

/**
 * Determines if user is logged into a Production Vault (excluding DEV/PVM domains). Used to protect against
 * irreversible actions in Production Vaults (e.g. Delete Jobs, MDL changes).
 * @returns true if logged into a Production Vault (excluded DEV/PVM domains), otherwise false
 */
export function isProductionVault() {
    const domainType = sessionStorage.getItem('domainType');
    if (domainType && domainType === 'Production') {
        if (!isVaultDevOrPVMDomain()) {
            return true;
        }
    }
    return false;
}

/**
 * Determines if user is logged into a Sandbox Vault
 * @returns true if logged into a Sandbox Vault, otherwise false
 */
export function isSandboxVault() {
    const domainType = sessionStorage.getItem('domainType');
    if (domainType && domainType === 'Sandbox') {
        return true;
    }
    return false;
}

/**
 * Retrieves Vault DNS from session storage
 * @returns Vault DNS
 */
export function getVaultDns() {
    return sessionStorage.getItem('vaultDNS');
}

/**
 * Retrieves Vault ID from session storage
 * @returns Vault ID
 */
export function getVaultId() {
    return sessionStorage.getItem('vaultId');
}

/**
 * Retrieves Vault Name from session storage
 * @returns Vault Name
 */
export function getVaultName() {
    return sessionStorage.getItem('vaultName');
}

/**
 * Retrieves Vault Domain Type from session storage
 * @returns Vault Domain Type
 */
export function getVaultDomainType() {
    return sessionStorage.getItem('domainType');
}

/**
 * Retrieves Vault Username from session storage
 * @returns Vault Username
 */
export function getVaultUsername() {
    return sessionStorage.getItem('userName');
}

/**
 * Retrieves the current Vault API version, either the manually updated version from session storage or the default
 * @returns Vault API version
 */
export function getVaultApiVersion() {
    const currentApiVersion = sessionStorage.getItem('vaultApiVersion');
    if (currentApiVersion) {
        return currentApiVersion;
    } else {
        return VAULT_API_VERSION;
    }
}

/**
 * Determines if Vault is on DEV/PVM domain
 * @returns {boolean}
 */
function isVaultDevOrPVMDomain() {
    const vaultDNS = sessionStorage.getItem('vaultDNS');
    const domains = ['vaultdev.com', 'vaultpvm.com'];

    return domains.some((domain) => vaultDNS.includes(domain));
}

/**
 * Formats a date/time string to a user-friendly format
 * @param {String} utcDateTimeString - Date/time string in UTC format
 * @param {String} userLocale - User locale
 * @param {String} userTimeZone - User time zone
 * @returns String value of formatted date/time
 */
export function formatDateTime(utcDateTimeString, userLocale = 'en-US', userTimeZone = 'UTC') {
    const utcDateTimeObj = new Date(utcDateTimeString);

    const formatter = new Intl.DateTimeFormat(userLocale.replace('_', '-'), {
        timeZone: userTimeZone,
        timeZoneName: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hourCycle: 'h23',
    });

    return formatter.format(utcDateTimeObj);
}

/**
 * Formats a number of bytes to a user-friendly format
 * @param {Number} bytes - Number of bytes
 * @returns String value of formatted bytes
 */
export function formatBytesToUserFriendlyFormat(bytes) {
    if (bytes < 1024) {
        return `${bytes.toLocaleString()} B`; // Less than 1 KB
    } else if (bytes < 1024 * 1024) {
        const kb = (bytes / 1024).toFixed(1); // Convert to KB with 1 decimal place
        return `${kb.toLocaleString()} KB`;
    } else if (bytes < 1024 * 1024 * 1024) {
        const mb = (bytes / (1024 * 1024)).toFixed(1); // Convert to MB with 1 decimal place
        return `${mb.toLocaleString()} MB`;
    } else {
        const gb = (bytes / (1024 * 1024 * 1024)).toFixed(1); // Convert to GB with 1 decimal place
        return `${gb.toLocaleString()} GB`;
    }
}
