import { Table } from '@chakra-ui/react';
import { isSandboxVault } from '../../services/SharedServices';

export default function DataFilesTableHeader() {
    const headerData = ['Modified Date', 'Operation', 'File'];

    return (
        <Table.Header {...ThStyle}>
            <Table.Row>
                {headerData.map((headerValue, headerCount) => (
                    <Table.ColumnHeader
                        key={headerCount}
                        {...ThStyle}
                        backgroundColor={isSandboxVault() ? 'veeva_sandbox_green.500' : 'veeva_midnight_indigo.500'}
                    >
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
    position: 'sticky',
    top: 0,
    border: 'none',
    zIndex: 10,
};
