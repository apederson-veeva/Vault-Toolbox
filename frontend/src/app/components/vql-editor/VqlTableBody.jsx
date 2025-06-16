import { Table, Box } from '@chakra-ui/react';
import { Fragment } from 'react';

export default function VqlTableBody({ consoleOutput, queryDescribe, getMaxRowSize }) {
    const OBJECT = 'object';

    return (
        <Table.Body>
            {consoleOutput?.data &&
                consoleOutput.data.map((row, i) => {
                    const maxRowSize = getMaxRowSize(row);
                    return (
                        <Fragment key={`fragment-${i}`}>
                            <Table.Row key={i}>
                                {Object.keys(row).map((dataRowKey, dataRowKeyCount) => {
                                    const dataRowValue = row[dataRowKey];
                                    if (typeof dataRowValue === OBJECT && dataRowValue !== null) {
                                        // We either have subqueries or picklist results
                                        if (dataRowValue?.data?.length > 0) {
                                            return dataRowValue?.data.map((subqueryDataRow, subqueryDataRowCount) => {
                                                if (subqueryDataRowCount === 0) {
                                                    // Only print the first row of subquery data in this Tr

                                                    return Object.values(subqueryDataRow).map(
                                                        (subqueryDataField, subqueryDataFieldCount) => {
                                                            // Join picklist values with a comma
                                                            if (Array.isArray(subqueryDataField)) {
                                                                return (
                                                                    <Table.Cell
                                                                        key={subqueryDataFieldCount}
                                                                        {...TdStyle}
                                                                    >
                                                                        {subqueryDataField.join(', ')}
                                                                    </Table.Cell>
                                                                );
                                                            }
                                                            return (
                                                                <Table.Cell key={subqueryDataFieldCount} {...TdStyle}>
                                                                    {String(subqueryDataField)}
                                                                </Table.Cell>
                                                            );
                                                        },
                                                    );
                                                }
                                            });
                                        } else if (dataRowValue?.length > 0) {
                                            // Join picklist values with a comma
                                            return (
                                                <Table.Cell key={dataRowKeyCount} {...TdStyle}>
                                                    {dataRowValue.join(', ')}
                                                </Table.Cell>
                                            );
                                        } else {
                                            const subqueryFieldCount = queryDescribe?.subqueries?.find(
                                                (currentSubquery) => currentSubquery.relationship === dataRowKey,
                                            )?.fields?.length;

                                            return Array.from({ length: subqueryFieldCount }, (_, index) => (
                                                <Table.Cell key={`${dataRowKeyCount}-${index}`} {...TdStyle} />
                                            ));
                                        }
                                    } else {
                                        // Convert dataRowValue to a String before displaying, so booleans are displayed properly
                                        return (
                                            <Table.Cell key={dataRowKeyCount} rowSpan={maxRowSize} {...TdStyle}>
                                                <Box {...FloatingCellBoxStyle}>{String(dataRowValue)}</Box>
                                            </Table.Cell>
                                        );
                                    }
                                })}
                            </Table.Row>
                            {maxRowSize > 1 &&
                                [...Array(maxRowSize - 1)].map((_, index) => {
                                    // Loop over the number of subquery rows remaining in this overall row
                                    return (
                                        <Table.Row key={`${i}-${index}`}>
                                            {Object.keys(row).map((dataRowKey, dataRowKeyCount) => {
                                                const dataRowValue = row[dataRowKey];

                                                if (typeof dataRowValue === OBJECT && dataRowValue !== null) {
                                                    const subqueryDataRow =
                                                        dataRowValue?.data?.length > 1
                                                            ? dataRowValue.data[index + 1]
                                                            : null;

                                                    if (subqueryDataRow) {
                                                        return Object.values(subqueryDataRow).map(
                                                            (subqueryDataField, subqueryDataFieldCount) => {
                                                                // Join picklist values with a comma
                                                                if (Array.isArray(subqueryDataField)) {
                                                                    return (
                                                                        <Table.Cell
                                                                            key={subqueryDataFieldCount}
                                                                            {...TdStyle}
                                                                        >
                                                                            {subqueryDataField.join(', ')}
                                                                        </Table.Cell>
                                                                    );
                                                                }
                                                                return (
                                                                    <Table.Cell
                                                                        key={subqueryDataFieldCount}
                                                                        {...TdStyle}
                                                                    >
                                                                        {String(subqueryDataField)}
                                                                    </Table.Cell>
                                                                );
                                                            },
                                                        );
                                                    } else if (dataRowValue?.length > 0) {
                                                        // Create empty cells for picklists we've finished displaying
                                                        return (
                                                            <Table.Cell key={index} {...TdStyle}>
                                                                {}
                                                            </Table.Cell>
                                                        );
                                                    } else {
                                                        const subqueryFieldCount = queryDescribe?.subqueries?.find(
                                                            (currentSubquery) =>
                                                                currentSubquery.relationship === dataRowKey,
                                                        )?.fields?.length;
                                                        return Array.from(
                                                            { length: subqueryFieldCount },
                                                            (_, index) => (
                                                                <Table.Cell
                                                                    key={`${dataRowKeyCount}-${index}`}
                                                                    {...TdStyle}
                                                                />
                                                            ),
                                                        );
                                                    }
                                                }
                                            })}
                                        </Table.Row>
                                    );
                                })}
                        </Fragment>
                    );
                })}
        </Table.Body>
    );
}

const TdStyle = {
    borderBottom: 'solid thin',
    borderColor: 'gray.300',
    verticalAlign: 'top',
    backgroundColor: 'veeva_sunset_yellow.five_percent_opacity',
    whiteSpace: 'nowrap',
};

const FloatingCellBoxStyle = {
    verticalAlign: 'top',
    position: 'sticky',
    top: '100px',
};
