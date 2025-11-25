import { Card, Alert, Box, Flex, Spacer, Button, Heading, Text, Separator, Link, LinkProps } from '@chakra-ui/react';
import { PiArrowSquareOutLight, PiArrowClockwise } from 'react-icons/pi';
import { FallbackProps } from 'react-error-boundary';

export default function ErrorBoundaryCard({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <Card.Root maxWidth='800px' overflow='auto'>
            <Card.Body>
                <Flex flexDirection='column' minHeight='100px' flex={1}>
                    <Box>
                        <Alert.Root status='error' variant='subtle'>
                            <Flex alignItems='center' flex={1}>
                                <Alert.Indicator />
                                <Alert.Title fontSize='xl'>Unexpected Error</Alert.Title>
                                <Spacer />
                                <Button onClick={resetErrorBoundary}>
                                    Retry <PiArrowClockwise />
                                </Button>
                            </Flex>
                        </Alert.Root>
                        <Flex alignItems='center'>
                            <Heading size='sm' margin='10px'>
                                Error Message:
                            </Heading>
                            <Text fontSize='md'>{error?.message}</Text>
                        </Flex>
                        <Flex alignItems='flex-start'>
                            <Heading size='sm' margin='10px' marginTop={0} minWidth='max-content'>
                                Error Stack:
                            </Heading>
                            <Text overflow='auto' fontSize='md'>
                                {error?.stack}
                            </Text>
                        </Flex>
                    </Box>
                    <Spacer />
                    <Box paddingTop='10px'>
                        <Separator borderColor='gray.500' />
                        <Text margin='10px' marginBottom={0} fontSize='md'>
                            If the issue persists, please report it via the{' '}
                            <Link
                                href='https://veevaconnect.com/communities/ATeJ3k8lgAA/about'
                                target='_blank'
                                rel='noopener noreferrer'
                                {...HyperlinkStyle}
                            >
                                Vault for Developers community
                                <Box as={PiArrowSquareOutLight} display='inline' />
                            </Link>{' '}
                            on Veeva Connect.
                        </Text>
                    </Box>
                </Flex>
            </Card.Body>
        </Card.Root>
    );
}

const HyperlinkStyle: LinkProps = {
    textDecoration: 'underline',
    color: 'hyperlink_blue_color_mode',
};
