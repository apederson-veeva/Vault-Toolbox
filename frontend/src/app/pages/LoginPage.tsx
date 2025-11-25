import { Flex, Stack, Heading, Text } from '@chakra-ui/react';
import { FlexProps, StackProps, HeadingProps, TextProps } from '@chakra-ui/react';
import LoginCard from '../components/login/LoginCard';

export default function LoginPage() {
    return (
        <Flex {...PageFlexStyle}>
            <Stack {...PageStackStyle}>
                <Stack align='center'>
                    <Heading {...PageHeaderStyle}>Welcome to Vault Toolbox</Heading>
                    <Text {...TextStyle}>To get started, log in to a Vault.</Text>
                </Stack>
                <LoginCard />
            </Stack>
        </Flex>
    );
}

const PageFlexStyle: FlexProps = {
    minHeight: '100vh',
    align: 'center',
    justify: 'center',
    backgroundColor: 'veeva_light_gray_color_mode',
    flexDirection: 'column',
};

const PageStackStyle: StackProps = {
    gap: 8,
    marginX: 'auto',
    paddingY: 12,
    paddingX: 6,
    align: 'center',
};

const PageHeaderStyle: HeadingProps = {
    fontSize: '2xl',
    color: 'veeva_orange_color_mode',
};

const TextStyle: TextProps = {
    fontSize: 'lg',
    color: 'text_color_mode',
};
