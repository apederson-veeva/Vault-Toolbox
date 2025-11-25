import {
    Code,
    CodeProps,
    Flex,
    FlexProps,
    Heading,
    IconButton,
    IconButtonProps,
    List,
    PopoverContentProps,
} from '@chakra-ui/react';
import { PiInfo } from 'react-icons/pi';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '../shared/ui-components/popover';

export default function DataLookupInfoPopover() {
    return (
        <PopoverRoot positioning={{ placement: 'bottom-start' }} lazyMount>
            <PopoverTrigger asChild>
                <IconButton {...IconButtonStyle}>
                    <PiInfo style={{ width: 24, height: 24 }} />
                </IconButton>
            </PopoverTrigger>
            <PopoverContent {...PopoverContentStyle}>
                <Heading paddingBottom='5px' borderBottom='solid 1px'>
                    Supported input formats:
                </Heading>
                <PopoverBody fontSize='md'>
                    <List.Root as='ol'>
                        <Flex {...ListItemFlexStyle}>
                            <List.Item>Exact Record ID</List.Item>
                            <Code {...CodeStyle}>V5J000000006001</Code>
                        </Flex>
                        <Flex {...ListItemFlexStyle}>
                            <List.Item>Vault Record URL</List.Item>
                            <Code {...CodeStyle}>https://myvault.veevavault.com/ui/#v/V5J/V5J000000006001</Code>
                        </Flex>
                        <Flex {...ListItemFlexStyle}>
                            <List.Item>
                                Explicit Format{' '}
                                <Code fontSize='md' padding='5px' backgroundColor='white_color_mode'>
                                    ({'{object_name}:{record_id}'})
                                </Code>
                            </List.Item>
                            <Code {...CodeStyle}>user__sys:123456</Code>
                        </Flex>
                    </List.Root>
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    );
}

const IconButtonStyle: IconButtonProps = {
    marginRight: '5px',
    borderRadius: 'full',
    'aria-label': 'Search help button',
    variant: 'ghost',
};

const PopoverContentStyle: PopoverContentProps = {
    minW: 'max-content',
    margin: '5px',
    padding: '10px',
    borderRadius: 'md',
    backgroundColor: 'white_color_mode',
};

const ListItemFlexStyle: FlexProps = {
    alignItems: 'center',
    marginBottom: '10px',
};

const CodeStyle: CodeProps = {
    fontSize: 'md',
    padding: '5px',
    marginLeft: '10px',
};
