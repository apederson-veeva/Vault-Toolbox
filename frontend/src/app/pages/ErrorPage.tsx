import { Flex, FlexProps } from '@chakra-ui/react';
import ErrorBoundaryCard from '../components/shared/ErrorBoundaryCard';
import { FallbackProps } from 'react-error-boundary';

export default function ErrorPage({ error, resetErrorBoundary }: FallbackProps) {
    return (
        <Flex {...PageFlexStyle}>
            <ErrorBoundaryCard error={error} resetErrorBoundary={resetErrorBoundary} />
        </Flex>
    );
}

const PageFlexStyle: FlexProps = {
    minHeight: '100vh',
    align: 'center',
    justify: 'center',
    backgroundColor: 'veeva_light_gray_color_mode',
    boxShadow: 'inset -5px 0 8px -8px gray, inset 5px 0 8px -8px gray',
};
