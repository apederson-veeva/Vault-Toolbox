import { Card, Alert, Box } from '@chakra-ui/react';

export default function ApiErrorMessageCard({ content, errorMessage }: { content: string; errorMessage: string }) {
    const alertTitleText = content ? `retrieving ${content}` : 'processing your request';

    return (
        <Card.Root backgroundColor='white_color_mode'>
            <Card.Body>
                <Alert.Root status='error' variant='subtle'>
                    <Alert.Indicator />
                    <Alert.Content>
                        <Box>
                            <Alert.Title>Error {alertTitleText}: </Alert.Title>
                            <Alert.Description>{errorMessage}</Alert.Description>
                        </Box>
                    </Alert.Content>
                </Alert.Root>
            </Card.Body>
        </Card.Root>
    );
}
