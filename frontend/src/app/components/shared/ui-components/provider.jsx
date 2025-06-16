'use client';

import { ChakraProvider } from '@chakra-ui/react';
import veevaTheme from '../../../utils/VeevaTheme';
import { ColorModeProvider } from './color-mode';

export function Provider(props) {
    return (
        <ChakraProvider value={veevaTheme}>
            <ColorModeProvider {...props} />
        </ChakraProvider>
    );
}
