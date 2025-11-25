import {
    Box,
    Dialog,
    Portal,
    CloseButton,
    Button,
    DialogContentProps,
    DialogHeaderProps,
    useDisclosure,
} from '@chakra-ui/react';
import useComponentEditor from '../../hooks/component-editor/useComponentEditor';
import CodeEditor from '../shared/CodeEditor';
import { useColorMode } from '../shared/ui-components/color-mode';
import {
    setupMdlLanguage,
    mdlLanguageID,
    MdlLightModeTheme,
    MdlDarkModeTheme,
} from '../../utils/component-editor/MdlLanguageDefinition';
import { Dispatch, SetStateAction } from 'react';
import { PiPencil } from 'react-icons/pi';
import OpenComponentEditorConfirmationDialog from './OpenComponentEditorConfirmationDialog';

interface ComponentEditorDialogProps {
    component: string;
    isComponentEditorDialogOpen: boolean;
    setIsComponentEditorDialogOpen: Dispatch<SetStateAction<boolean>>;
}

export default function ReadOnlyComponentEditorDialog({
    component,
    isComponentEditorDialogOpen,
    setIsComponentEditorDialogOpen,
}: ComponentEditorDialogProps) {
    const { colorMode } = useColorMode();
    const { code, setCode } = useComponentEditor(component);

    // Setup the MDL Language
    setupMdlLanguage();

    const { open: confirmDialogIsOpen, onOpen: onOpenConfirmDialog, onClose: onCloseConfirmDialog } = useDisclosure();

    return (
        <Dialog.Root
            motionPreset='slide-in-bottom'
            open={isComponentEditorDialogOpen}
            onOpenChange={(e) => setIsComponentEditorDialogOpen(e.open)}
        >
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content {...DialogContentStyle}>
                        <Dialog.Header {...DialogHeaderStyle}>
                            <Dialog.Title>{component}</Dialog.Title>
                            <Button size='sm' variant='ghost' marginRight='20px' onClick={() => onOpenConfirmDialog()}>
                                <PiPencil /> Edit in Component Editor
                            </Button>
                            {confirmDialogIsOpen ? (
                                <OpenComponentEditorConfirmationDialog
                                    confirmDialogIsOpen={confirmDialogIsOpen}
                                    onCloseConfirmDialog={onCloseConfirmDialog}
                                    component={component}
                                />
                            ) : null}
                        </Dialog.Header>
                        <Dialog.Body overflow='auto' height='70vh'>
                            <Box flex={1} overflow='auto' height='70vh'>
                                <CodeEditor
                                    code={code}
                                    setCode={setCode}
                                    language={mdlLanguageID}
                                    theme={colorMode === 'light' ? MdlLightModeTheme : MdlDarkModeTheme}
                                    readOnly={true}
                                />
                            </Box>
                        </Dialog.Body>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size='xs' />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    );
}

const DialogContentStyle: DialogContentProps = {
    maxW: '80vw',
    maxH: '80vh',
    minW: '80vw',
    minH: '80vh',
    overflow: 'auto',
    fontSize: 'md',
    backgroundColor: 'white_color_mode',
};

const DialogHeaderStyle: DialogHeaderProps = {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    borderBottom: 'solid 3px',
    borderBottomColor: 'gray.400',
    color: 'veeva_orange_color_mode',
};
