import { Button, Card, Flex, Heading, Table, Spinner, Box, Spacer } from '@chakra-ui/react';
import { PiCheckCircleFill, PiWarningCircleFill } from 'react-icons/pi';
import { SUCCESS, FAILURE, IN_PROGRESS, CANCELLED } from '../../hooks/file-browser/useFileDownloadModal';
import { DialogBody, DialogContent, DialogFooter, DialogRoot } from '../shared/ui-components/dialog';

function DownloadProgressModal({ isModalOpen, downloadingFileName, downloadStatus, setDownloadStatus, closeModal }) {
    const isSuccess = downloadStatus === SUCCESS;
    const isFailure = downloadStatus === FAILURE;
    const isInProgress = downloadStatus === IN_PROGRESS;

    const alertTitle = isSuccess ? 'Download Complete' : isFailure ? 'Download Failed' : 'Downloading File...';

    const handleButtonClose = () => {
        setDownloadStatus(CANCELLED);
        closeModal();
    };

    return (
        <DialogRoot open={isModalOpen} closeOnInteractOutside={false}>
            <DialogContent {...ModalStyle}>
                {' '}
                <Flex flexDirection='column'>
                    <DialogBody flex='0 0 90%'>
                        <Card.Root {...CardStyle}>
                            <Card.Body>
                                <Heading {...TableHeaderStyle}>Transfer Details:</Heading>
                                <Flex {...TableContainerStyle}>
                                    <Table.Root {...TableStyle}>
                                        <Table.Body>
                                            <Table.Row>
                                                <Table.Cell {...TableColumnStyle}>File Name: </Table.Cell>
                                                <Table.Cell>{downloadingFileName}</Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell {...TableColumnStyle}>Status: </Table.Cell>
                                                <Table.Cell>
                                                    <Flex alignItems='center'>
                                                        {isInProgress ? (
                                                            <Spinner size='sm' marginRight='8px' />
                                                        ) : isSuccess ? (
                                                            <PiCheckCircleFill
                                                                style={{ color: 'green', marginRight: '8px' }}
                                                                size={20}
                                                            />
                                                        ) : isFailure ? (
                                                            <PiWarningCircleFill
                                                                style={{ color: 'red', marginRight: '8px' }}
                                                                size={20}
                                                            />
                                                        ) : null}

                                                        {alertTitle}
                                                    </Flex>
                                                </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table.Root>
                                </Flex>
                            </Card.Body>
                        </Card.Root>
                    </DialogBody>
                    <DialogFooter minHeight='min-content'>
                        <Flex width='100%' alignItems='flex-end' justifyContent='flex-end'>
                            <Spacer />
                            <Box>
                                {isInProgress && (
                                    <Button
                                        variant='subtle'
                                        onClick={handleButtonClose}
                                        marginRight='8px'
                                        colorPalette='red'
                                    >
                                        Cancel Download
                                    </Button>
                                )}
                            </Box>
                        </Flex>
                    </DialogFooter>
                </Flex>
            </DialogContent>
        </DialogRoot>
    );
}

const ModalStyle = {
    minWidth: '50vw',
    minHeight: 'min-content',
    fontSize: 'md',
    backgroundColor: 'veeva_light_gray_color_mode',
};

const CardStyle = {
    marginTop: '10px',
    maxHeight: '30vh',
    overflowY: 'auto',
    backgroundColor: 'white_color_mode',
};

const TableContainerStyle = {
    maxHeight: '35vh',
    overflowX: 'unset',
    overflowY: 'unset',
};

const TableStyle = {
    variant: 'simple',
    size: 'sm',
    overflowY: 'auto',
};

const TableHeaderStyle = {
    size: 'md',
    textTransform: 'capitalize',
    fontWeight: 'normal',
    padding: '5px',
};

const TableColumnStyle = {
    fontWeight: 'bold',
    textAlign: 'left',
    verticalAlign: 'top',
    width: '1%',
    whiteSpace: 'nowrap',
    _last: { width: '100%' },
};

export default DownloadProgressModal;
