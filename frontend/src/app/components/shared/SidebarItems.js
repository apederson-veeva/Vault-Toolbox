import { PiInfo, PiCodesandboxLogo, PiMagnifyingGlass, PiDatabase, PiFolder } from 'react-icons/pi';

const SidebarItems = [
    {
        name: 'Vault Information',
        icon: PiInfo,
        route: '/',
    },
    {
        name: 'Component Editor',
        icon: PiCodesandboxLogo,
        route: 'component-editor',
    },
    {
        name: 'VQL Editor',
        icon: PiMagnifyingGlass,
        route: 'vql-editor',
    },
    {
        name: 'Vault Data Tools',
        icon: PiDatabase,
        route: 'vault-data-tools',
    },
    {
        name: 'File Staging Browser',
        icon: PiFolder,
        route: 'file-staging-browser'
    },
];

export default SidebarItems;
