import { Table } from '@chakra-ui/react';
import { isSandboxVault } from '../../services/SharedServices';

export default function VqlTableHeader({
    consoleOutput,
    queryDescribe,
    hasSubqueries,
    isPicklist,
    isPrimaryFieldRichText,
    getSubqueryFieldCount,
    headerRowSpan,
    isPrimaryFieldString,
    isSubqueryObject,
}) {
    const OBJECT = 'object';

    return (
        <Table.Header
            {...ThStyle}
            backgroundColor={isSandboxVault() ? 'veeva_sandbox_green.500' : 'veeva_midnight_indigo.500'}
        >
            <Table.Row>
                {
                    // Iterate through the first data object to get the headers (in the correct order)
                    Object.keys(consoleOutput.data[0]).map((dataKey, dataKeyCount) => {
                        // Picklists and normal field headers (including dot notation)
                        if (
                            !isSubqueryObject(dataKey) ||
                            isPicklist(dataKey) ||
                            isPrimaryFieldRichText(dataKey) ||
                            dataKey.includes('.') ||
                            isPrimaryFieldString(dataKey)
                        ) {
                            return (
                                <Table.ColumnHeader
                                    key={dataKeyCount}
                                    rowSpan={headerRowSpan}
                                    {...ThStyle}
                                    backgroundColor={
                                        isSandboxVault() ? 'veeva_sandbox_green.500' : 'veeva_midnight_indigo.500'
                                    }
                                >
                                    {dataKey}
                                </Table.ColumnHeader>
                            );
                        } // Subquery headers
                        else if (hasSubqueries) {
                            const subqueryFieldCount = getSubqueryFieldCount(dataKey);
                            return (
                                <Table.ColumnHeader
                                    key={dataKeyCount}
                                    colSpan={subqueryFieldCount}
                                    {...ThStyle}
                                    backgroundColor={
                                        isSandboxVault() ? 'veeva_sandbox_green.500' : 'veeva_midnight_indigo.500'
                                    }
                                >
                                    {dataKey}
                                </Table.ColumnHeader>
                            );
                        }
                    })
                }
            </Table.Row>
            {hasSubqueries && (
                <Table.Row>
                    {Object.keys(consoleOutput.data[0]).map((dataKey, dataKeyCount) => {
                        if (typeof consoleOutput.data[0][dataKey] === OBJECT && !isPicklist(dataKey)) {
                            // Get subquery fields from query describe
                            return queryDescribe.subqueries
                                .find((subquery) => subquery.relationship === dataKey || subquery.alias === dataKey)
                                ?.fields.map((field, fieldCount) => {
                                    return (
                                        <Table.ColumnHeader
                                            key={`${dataKeyCount}-${fieldCount}`}
                                            {...ThStyle}
                                            backgroundColor={
                                                sessionStorage.getItem('domainType') === 'Sandbox'
                                                    ? 'veeva_sandbox_green.500'
                                                    : 'veeva_midnight_indigo.500'
                                            }
                                        >
                                            {field.name}
                                        </Table.ColumnHeader>
                                    );
                                });
                        }
                    })}
                </Table.Row>
            )}
        </Table.Header>
    );
}

const ThStyle = {
    color: 'white',
    textAlign: 'left',
    textTransform: 'lowercase',
    width: '1%',
    whiteSpace: 'nowrap',
    _last: {
        width: '100%',
    },
    position: 'sticky',
    top: 0,
    border: 'none',
    zIndex: 10,
};
