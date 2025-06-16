import { PiInfo, PiCodesandboxLogo, PiMagnifyingGlass, PiDatabase, PiFolder } from 'react-icons/pi';

const SidebarItems = [
    {
        name: 'Vault Information',
        icon: PiInfo,
        route: '/',
        alwaysShow: true, // Home page is always shown
    },
    {
        name: 'Component Editor',
        icon: PiCodesandboxLogo,
        route: 'component-editor',
        pageId: 'componentEditor',
    },
    {
        name: 'VQL Editor',
        icon: PiMagnifyingGlass,
        route: 'vql-editor',
        pageId: 'vqlEditor',
    },
    {
        name: 'Data Tools',
        icon: PiDatabase,
        route: 'data-tools',
        pageId: 'dataTools',
    },
    {
        name: 'File Staging Browser',
        icon: PiFolder,
        route: 'file-staging-browser',
        pageId: 'fileBrowser',
    },
];

export default SidebarItems;
