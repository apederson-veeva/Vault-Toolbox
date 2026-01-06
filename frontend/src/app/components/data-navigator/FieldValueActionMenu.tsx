import {
    IconButton,
    Portal,
    Menu,
    Box,
    Link,
    LinkProps,
    Flex,
    MenuContentProps,
    IconButtonProps,
} from '@chakra-ui/react';
import {
    PiArrowSquareOutLight,
    PiCodesandboxLogo,
    PiDotsThree,
    PiDotsThreeOutline,
    PiDotsThreeOutlineFill,
    PiGear,
} from 'react-icons/pi';
import ReadOnlyComponentEditorDialog from './ReadOnlyComponentEditorDialog';
import { useState } from 'react';
import { useSettings } from '../../context/SettingsContext';

interface FieldValueActionMenuProps {
    isHovered: boolean;
    openFieldInVaultAdminHref: string;
    openDocumentInVaultHref?: string;
    openObjectLifecycleInVaultAdminHref?: string;
    viewMdlComponent?: string;
}

export default function FieldValueActionMenu({
    isHovered,
    openFieldInVaultAdminHref,
    openDocumentInVaultHref,
    openObjectLifecycleInVaultAdminHref,
    viewMdlComponent,
}: FieldValueActionMenuProps) {
    const { settings } = useSettings();
    const showVaultAdminLinks = settings?.dataNavigator?.featureSettings?.showVaultAdminLinks !== false;

    if (!showVaultAdminLinks && !openDocumentInVaultHref && !viewMdlComponent) {
        return null;
    }

    const [isComponentEditorDialogOpen, setIsComponentEditorDialogOpen] = useState(false);

    return (
        <>
            <Menu.Root lazyMount>
                <Menu.Trigger asChild>
                    <IconButton
                        {...IconButtonStyle}
                        style={{
                            visibility: isHovered ? 'visible' : 'hidden',
                            opacity: isHovered ? 1 : 0,
                            transition: 'opacity 0.2s ease-in-out, visibility 0.2s',
                        }}
                    >
                        <PiDotsThreeOutlineFill style={{ width: 20, height: 20 }} />
                    </IconButton>
                </Menu.Trigger>
                <Portal>
                    <Menu.Positioner>
                        <Menu.Content {...MenuContentStyle}>
                            {showVaultAdminLinks ? (
                                <Menu.Item value='Open Field in Vault Admin UI'>
                                    <Flex justifyContent='left' width='100%'>
                                        <Link href={openFieldInVaultAdminHref} {...OpenInVaultLinkStyle}>
                                            <Box
                                                as={PiGear}
                                                display='inline'
                                                marginRight='5px'
                                                style={{ width: 16, height: 16, transform: 'rotate(20deg)' }}
                                            />
                                            Open Field in Vault Admin UI
                                        </Link>
                                    </Flex>
                                </Menu.Item>
                            ) : null}
                            {openObjectLifecycleInVaultAdminHref && showVaultAdminLinks ? (
                                <Menu.Item value='Open Lifecycle in Vault Admin UI'>
                                    <Flex justifyContent='left' width='100%'>
                                        <Link href={openObjectLifecycleInVaultAdminHref} {...OpenInVaultLinkStyle}>
                                            <Box
                                                as={PiGear}
                                                display='inline'
                                                marginRight='5px'
                                                style={{ width: 16, height: 16, transform: 'rotate(20deg)' }}
                                            />
                                            Open Lifecycle in Vault Admin UI
                                        </Link>
                                    </Flex>
                                </Menu.Item>
                            ) : null}
                            {openDocumentInVaultHref ? (
                                <Menu.Item value='Open Document in Vault'>
                                    <Flex justifyContent='left' width='100%'>
                                        <Link href={openDocumentInVaultHref} {...OpenInVaultLinkStyle}>
                                            <Box
                                                as={PiArrowSquareOutLight}
                                                display='inline'
                                                marginRight='5px'
                                                style={{ width: 16, height: 16 }}
                                            />
                                            Open Document in Vault
                                        </Link>
                                    </Flex>
                                </Menu.Item>
                            ) : null}
                            {viewMdlComponent ? (
                                <Menu.Item value='View MDL' {...ViewMdlLinkStyle}>
                                    <Flex
                                        justifyContent='left'
                                        alignItems='center'
                                        width='100%'
                                        onClick={() => setIsComponentEditorDialogOpen(true)}
                                    >
                                        <Box
                                            as={PiCodesandboxLogo}
                                            display='inline'
                                            marginRight='5px'
                                            style={{ width: 16, height: 16 }}
                                        />
                                        View Component MDL
                                    </Flex>
                                </Menu.Item>
                            ) : null}
                        </Menu.Content>
                    </Menu.Positioner>
                </Portal>
            </Menu.Root>
            {viewMdlComponent && isComponentEditorDialogOpen ? (
                <ReadOnlyComponentEditorDialog
                    component={viewMdlComponent}
                    isComponentEditorDialogOpen={isComponentEditorDialogOpen}
                    setIsComponentEditorDialogOpen={setIsComponentEditorDialogOpen}
                />
            ) : null}
        </>
    );
}

const MenuContentStyle: MenuContentProps = {
    backgroundColor: 'white_color_mode',
};

const OpenInVaultLinkStyle: LinkProps = {
    gap: 0,
    target: '_blank',
    rel: 'noopener noreferrer',
    _hover: { textDecoration: 'none' },
    tabIndex: -1, // So the link isn't selected/focused when the Menu opens
};

const ViewMdlLinkStyle = {
    _hover: { cursor: 'pointer' },
};

const IconButtonStyle: IconButtonProps = {
    _hover: {
        backgroundColor: 'yellow_color_mode',
    },
    size: 'xs',
    variant: 'ghost',
    padding: 0,
};
