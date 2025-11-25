'use client';

import { ChakraProvider } from '@chakra-ui/react';
import veevaTheme from '../../../utils/shared/VeevaTheme';
import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

export function Provider(props: ColorModeProviderProps) {
    return (
        <ChakraProvider value={veevaTheme}>
            <ColorModeProvider {...props} />
        </ChakraProvider>
    );
}
