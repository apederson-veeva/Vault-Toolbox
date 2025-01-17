import { Th, Thead, Tr } from '@chakra-ui/react';
import { isSandboxVault } from '../../services/SharedServices';

export default function FileStagingBrowserTableHeader() {
    const headerData = ['kind', 'name', 'size', 'modified_date', ''];

    return (
        <Thead
            {...ThStyle}
            backgroundColor={isSandboxVault() ? 'veeva_sandbox_green.500' : 'veeva_midnight_indigo.500'}
        >
            <Tr>
                {headerData.map((headerValue, headerCount) => (
                    <Th key={headerCount} {...ThStyle}>
                        {headerValue}
                    </Th>
                ))}
            </Tr>
        </Thead>
    );
}

const ThStyle = {
    color: 'white',
    textAlign: 'left',
    width: '1%',
    whiteSpace: 'nowrap',
    _last: { width: '100%' },
    top: 0,
    border: 'none',
    textTransform: 'lowercase',
    fontSize: 'md',
};
