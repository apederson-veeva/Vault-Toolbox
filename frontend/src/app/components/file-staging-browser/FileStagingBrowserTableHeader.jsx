import { Table } from '@chakra-ui/react';
import { isSandboxVault } from '../../services/SharedServices';

export default function FileStagingBrowserTableHeader() {
    const headerData = ['kind', 'name', 'size', 'modified_date', ''];

    return (
        <Table.Header
            {...ThStyle}
            backgroundColor={isSandboxVault() ? 'veeva_sandbox_green.500' : 'veeva_midnight_indigo.500'}
        >
            <Table.Row>
                {headerData.map((headerValue, headerCount) => (
                    <Table.ColumnHeader key={headerCount} {...ThStyle}>
                        {headerValue}
                    </Table.ColumnHeader>
                ))}
            </Table.Row>
        </Table.Header>
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
