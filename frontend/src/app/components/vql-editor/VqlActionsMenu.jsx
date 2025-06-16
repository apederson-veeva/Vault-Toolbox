import { Box, Button, Separator, Flex, IconButton, Text, useDisclosure } from '@chakra-ui/react';
import { PiCaretLeft, PiDotsThreeBold, PiTrash } from 'react-icons/pi';
import { MenuContent, MenuRoot, MenuTrigger, MenuItem } from '../shared/ui-components/menu';
import { Tooltip } from '../shared/ui-components/tooltip';
import VqlConfirmQueryDeletionModal from './VqlConfirmQueryDeletionModal';

export default function VqlActionsMenu({
    savedQueryOptions,
    insertSavedQuery,
    deleteSavedQuery,
    selectedQueryName,
    setSelectedQueryName,
}) {
    const { open, onOpen, onClose } = useDisclosure();

    return (
        <>
            <MenuRoot>
                <MenuTrigger asChild focusRing='none'>
                    <IconButton {...VqlActionsMenuButtonStyle}>
                        <PiDotsThreeBold style={{ width: 24, height: 24 }} />
                    </IconButton>
                </MenuTrigger>
                <MenuContent {...MenuListStyle} paddingY='0px'>
                    <Text {...TextStyle} fontSize='md'>
                        Insert Saved Query
                    </Text>
                    <Separator />
                    {savedQueryOptions?.length > 0 ? (
                        <>
                            <Box overflowY='auto' maxHeight='30vh'>
                                {savedQueryOptions.map((savedQuery) => {
                                    return (
                                        <MenuItem
                                            {...MenuItemStyle}
                                            key={savedQuery?.label}
                                            onClick={() => insertSavedQuery(savedQuery?.label)}
                                        >
                                            <Tooltip content={savedQuery?.label} openDelay={0}>
                                                <Text truncate maxWidth='100%'>
                                                    {savedQuery?.label}
                                                </Text>
                                            </Tooltip>
                                        </MenuItem>
                                    );
                                })}
                            </Box>
                            <Separator />
                            <MenuRoot positioning={{ placement: 'left' }}>
                                <MenuTrigger asChild focusRing='none'>
                                    <Button {...DeleteQueryButtonStyle}>
                                        <PiCaretLeft style={{ width: 16, height: 16 }} />
                                        <Flex alignItems='center' justifyContent='center'>
                                            <Text fontSize='md' marginRight='5px'>
                                                Delete Saved Query
                                            </Text>
                                            <PiTrash style={{ width: 16, height: 16 }} />
                                        </Flex>
                                    </Button>
                                </MenuTrigger>
                                <MenuContent {...MenuListStyle}>
                                    <Text {...TextStyle} fontSize='md'>
                                        Delete Saved Query
                                    </Text>
                                    <Separator />
                                    <Box overflowY='auto' maxHeight='30vh'>
                                        {savedQueryOptions.map((savedQuery) => {
                                            return (
                                                <MenuItem
                                                    {...DeleteMenuItemStyle}
                                                    key={savedQuery?.label}
                                                    onClick={() => {
                                                        setSelectedQueryName(savedQuery?.label);
                                                        onOpen();
                                                    }}
                                                >
                                                    <Tooltip content={savedQuery?.label} openDelay={0}>
                                                        <Text truncate maxWidth='100%'>
                                                            {savedQuery?.label}
                                                        </Text>
                                                    </Tooltip>
                                                </MenuItem>
                                            );
                                        })}
                                    </Box>
                                </MenuContent>
                            </MenuRoot>
                        </>
                    ) : (
                        <Flex {...TextStyle} justifyContent='center'>
                            No Saved Queries
                        </Flex>
                    )}
                </MenuContent>
            </MenuRoot>
            {open ? (
                <VqlConfirmQueryDeletionModal
                    open={open}
                    onClose={onClose}
                    onSubmit={deleteSavedQuery}
                    savedQueryName={selectedQueryName}
                />
            ) : null}
        </>
    );
}

const VqlActionsMenuButtonStyle = {
    variant: 'ghost',
    size: 'sm',
    margin: '10px 10px 10px 0px',
    padding: '5px',
    borderRadius: '8px',
};

const MenuListStyle = {
    backgroundColor: 'white_color_mode',
    maxWidth: '30vw',
    paddingTop: '0px',
};

const MenuItemStyle = {
    fontSize: 'medium',
    _hover: {
        backgroundColor: 'veeva_twilight_blue.500',
        color: 'white',
    },
};

const DeleteMenuItemStyle = {
    fontSize: 'medium',
    _hover: {
        backgroundColor: 'veeva_sunset_red_color_mode',
        color: 'white',
    },
};

const DeleteQueryButtonStyle = {
    variant: 'ghost',
    size: 'sm',
    margin: '10px',
    padding: '5px',
    maxWidth: '100%',
    focusRing: 'none',
};

const TextStyle = {
    margin: '10px',
    color: 'gray.500',
};
