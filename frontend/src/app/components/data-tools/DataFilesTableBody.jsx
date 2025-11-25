import { Table, Link } from '@chakra-ui/react';
import { formatDateTime } from '../../services/SharedServices';

const OPERATIONS = {
    DELETE: 'DELETE',
    COUNT: 'COUNT',
};

export default function DataFilesTableBody({ countFiles, deleteFiles, handleClick }) {
    const files = [...countFiles, ...deleteFiles];
    files.sort((fileA, fileB) => new Date(fileB?.fileTimestamp) - new Date(fileA?.fileTimestamp));

    return (
        <Table.Body>
            {files.length !== 0 ? (
                files.map((dataFile, dataFileCount) => {
                    let operation = '';
                    if (dataFile?.filePath?.includes(OPERATIONS.DELETE.toLowerCase())) {
                        operation = OPERATIONS.DELETE;
                    } else if (dataFile?.filePath?.includes(OPERATIONS.COUNT.toLowerCase())) {
                        operation = OPERATIONS.COUNT;
                    }

                    const filePathParts = dataFile?.filePath?.split('/');
                    const fileName = filePathParts[filePathParts.length - 1];

                    return (
                        <Table.Row key={dataFileCount}>
                            <Table.Cell {...TdStyle}>{formatDateTime(dataFile.fileTimestamp)}</Table.Cell>
                            <Table.Cell {...TdStyle}>{operation}</Table.Cell>
                            <Table.Cell {...HyperlinkStyle} onClick={() => handleClick(dataFile.filePath)}>
                                <Link color='hyperlink_blue_color_mode'>{fileName}</Link>
                            </Table.Cell>
                        </Table.Row>
                    );
                })
            ) : (
                <Table.Row>
                    <Table.Cell whiteSpace='nowrap'>NO FILES FOUND</Table.Cell>
                    <Table.Cell />
                </Table.Row>
            )}
        </Table.Body>
    );
}

const TdStyle = {
    borderBottom: 'solid thin',
    borderColor: 'gray.300',
    verticalAlign: 'top',
    whiteSpace: 'nowrap',
};

const HyperlinkStyle = {
    borderBottom: 'solid thin',
    borderColor: 'gray.300',
    verticalAlign: 'top',
    textDecoration: 'underline',
};
