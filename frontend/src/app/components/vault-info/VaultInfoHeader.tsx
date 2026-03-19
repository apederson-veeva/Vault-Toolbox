import { Text, Heading, Flex, Image, HeadingProps, TextProps, ImageProps } from '@chakra-ui/react';
import logo from '../../../images/unhinged-logo.svg';

export default function VaultInfoHeader() {
    return (
        <>
            <Flex alignItems='center'>
                <Image src={logo} {...ToolboxIconStyle} />
                <Heading {...PageHeaderStyle}>Welcome to Vault Toolbox - Unhinged Edition</Heading>
            </Flex>
            <Text {...TextStyle}>Select a tool from the left to get started.</Text>
        </>
    );
}

const ToolboxIconStyle: ImageProps = {
    boxSize: '42px',
    alt: 'Vault Toolbox - Unhinged Edition Icon',
    marginRight: '10px',
};

const PageHeaderStyle: HeadingProps = {
    fontSize: '3xl',
    color: 'veeva_orange_color_mode',
};

const TextStyle: TextProps = {
    fontSize: 'lg',
    color: 'text_color_mode',
};
