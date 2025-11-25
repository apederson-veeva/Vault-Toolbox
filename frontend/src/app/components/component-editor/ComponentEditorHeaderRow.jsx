import { Flex, Heading, Button, ButtonGroup, Input, IconButton, Tooltip, Portal } from '@chakra-ui/react';
import { useState } from 'react';
import { PiMagnifyingGlass, PiCaretDownBold } from 'react-icons/pi';
import { isProductionVault } from '../../services/SharedServices';
import { InputGroup } from '../shared/ui-components/input-group';
import { MenuContent, MenuRoot, MenuTrigger, MenuItem } from '../shared/ui-components/menu';

export default function ComponentEditorHeaderRow({
    getComponentMdlHandler,
    executeMdl,
    executeMdlAsync,
    retrieveMdlAsyncResults,
    asyncJobId,
    isExecutingMdl,
}) {
    const [userInputComponent, setUserInputComponent] = useState('');

    return (
        <Flex width='100%' margin='10px' alignItems='center'>
            <Heading {...HeadingStyle}>Component Editor</Heading>
            <InputGroup {...InputGroupStyle} startElement={<PiMagnifyingGlass size={24} />}>
                <Input
                    boxShadow='0 0 5px rgba(0,0,0,0.25)'
                    backgroundColor='white_color_mode'
                    color='text_color_mode'
                    border='transparent'
                    borderRadius='md'
                    marginLeft='5px'
                    fontSize='md'
                    value={userInputComponent}
                    onChange={(event) => setUserInputComponent(event.currentTarget.value)}
                    placeholder='Componenttype.component_name__c'
                />
            </InputGroup>
            <Button
                disabled={!userInputComponent}
                onClick={() => {
                    getComponentMdlHandler(userInputComponent);
                }}
                {...GetComponentButtonStyle}
            >
                Get
            </Button>
            <Tooltip.Root openDelay={0} positioning={{ placement: 'bottom-end' }}>
                <Tooltip.Trigger asChild>
                    <ButtonGroup attached disabled={isProductionVault()} {...ButtonGroupStyle}>
                        <Button
                            onClick={executeMdl}
                            isLoading={isExecutingMdl}
                            disabled={isProductionVault()}
                            {...ExecuteMdlButtonStyle}
                        >
                            Send
                        </Button>
                        <MenuRoot>
                            <MenuTrigger asChild disabled={isProductionVault()}>
                                <IconButton {...ExecuteMdlMenuButtonStyle}>
                                    <PiCaretDownBold />
                                </IconButton>
                            </MenuTrigger>
                            <MenuContent disabled={isProductionVault()}>
                                <MenuItem {...AsyncMdlButtonStyle} onClick={executeMdlAsync}>
                                    Send MDL Script Asynchronously
                                </MenuItem>
                                <MenuItem
                                    {...AsyncMdlButtonStyle}
                                    onClick={retrieveMdlAsyncResults}
                                    disabled={!asyncJobId}
                                >
                                    Retrieve Asynchronous MDL Script Results
                                </MenuItem>
                            </MenuContent>
                        </MenuRoot>
                    </ButtonGroup>
                </Tooltip.Trigger>
                {isProductionVault() && (
                    <Portal>
                        <Tooltip.Positioner>
                            <Tooltip.Content>Read-only in Production</Tooltip.Content>
                        </Tooltip.Positioner>
                    </Portal>
                )}
            </Tooltip.Root>
        </Flex>
    );
}

const HeadingStyle = {
    color: 'veeva_orange_color_mode',
    minWidth: 'max-content',
    marginLeft: '25px',
    marginRight: '5px',
    fontSize: '2rem',
};

const InputGroupStyle = {
    borderColor: 'transparent',
    backgroundColor: 'veeva_light_gray_color_mode',
    marginX: '5px',
    flexGrow: 1,
};

const GetComponentButtonStyle = {
    backgroundColor: 'veeva_twilight_blue.500',
    color: 'white',
    _hover: {
        backgroundColor: 'veeva_twilight_blue.fifty_percent_opacity',
    },
    fontSize: 'lg',
    borderRadius: '8px',
    marginRight: '5px',
    minWidth: '120px',
    boxShadow: '0 0 5px rgba(0,0,0,0.25)',
};

const ButtonGroupStyle = {
    variant: 'solid',
    colorPalette: 'veeva_sunset_red',
    borderRadius: '8px',
    marginRight: '10px',
    minWidth: '120px',
    boxShadow: '0 0 5px rgba(0,0,0,0.25)',
};

const ExecuteMdlButtonStyle = {
    backgroundColor: 'veeva_sunset_red_color_mode',
    color: 'white',
    _hover: {
        backgroundColor: 'veeva_sunset_red.fifty_percent_opacity',
    },
    _active: {
        backgroundColor: 'veeva_sunset_red.eighty_percent_opacity',
    },
    borderRightColor: 'white_color_mode',
    fontSize: 'lg',
    borderRadius: '8px',
    borderRight: 'solid',
    borderRightWidth: 'thin',
    flex: 1,
};

const ExecuteMdlMenuButtonStyle = {
    backgroundColor: 'veeva_sunset_red_color_mode',
    color: 'white',
    _hover: {
        backgroundColor: 'veeva_sunset_red.fifty_percent_opacity',
    },
    _active: {
        backgroundColor: 'veeva_sunset_red.eighty_percent_opacity',
    },
    minWidth: 8,
    borderRadius: '8px',
    borderTopLeftRadius: '0px',
    borderBottomLeftRadius: '0px',
};

const AsyncMdlButtonStyle = {
    fontSize: 'medium',
    _hover: {
        backgroundColor: 'veeva_sunset_red_color_mode',
        color: 'white',
    },
};
