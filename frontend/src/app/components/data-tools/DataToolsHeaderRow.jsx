import { Flex, Heading, Button, Spacer, Box, Tooltip, Portal } from '@chakra-ui/react';
import useConfirmDataDeletion from '../../hooks/data-tools/useConfirmDataDeletion';
import { isProductionVault } from '../../services/SharedServices';
import { Toaster } from '../shared/ui-components/toaster';
import ConfirmDataDeletion from './ConfirmDataDeletion';

export default function DataToolsHeaderRow({
    countData,
    deleteData,
    submittingCountJob,
    submittingDeleteJob,
    dataType,
    selectedOptions,
}) {
    const {
        isConfirmDeleteModalOpen,
        setIsConfirmDeleteModalOpen,
        closeConfirmDeleteModal,
        deleteConfirmationText,
        setDeleteConfirmationText,
    } = useConfirmDataDeletion();
    const canDelete = !isProductionVault();

    return (
        <>
            <Flex width='100%' margin='10px' alignItems='center'>
                <Heading {...HeadingStyle}>Data Tools</Heading>
                <Spacer />
                <Box>
                    <Button onClick={countData} loading={submittingCountJob} {...CountButtonStyle}>
                        Count Data
                    </Button>
                    <Tooltip.Root openDelay={0}>
                        <Tooltip.Trigger asChild>
                            <Button
                                onClick={() => setIsConfirmDeleteModalOpen(true)}
                                disabled={!canDelete}
                                loading={submittingDeleteJob}
                                {...DeleteButtonStyle}
                            >
                                Delete Data
                            </Button>
                        </Tooltip.Trigger>
                        {!canDelete && (
                            <Portal>
                                <Tooltip.Positioner>
                                    <Tooltip.Content>Read-only in Production</Tooltip.Content>
                                </Tooltip.Positioner>
                            </Portal>
                        )}
                    </Tooltip.Root>
                </Box>
            </Flex>
            <ConfirmDataDeletion
                open={isConfirmDeleteModalOpen}
                onClose={closeConfirmDeleteModal}
                onSubmit={deleteData}
                dataType={dataType}
                selectedData={selectedOptions}
                deleteConfirmationText={deleteConfirmationText}
                setDeleteConfirmationText={setDeleteConfirmationText}
            />
            <Toaster />
        </>
    );
}

const HeadingStyle = {
    color: 'veeva_orange_color_mode',
    minWidth: 'max-content',
    marginLeft: '25px',
    marginRight: '5px',
    fontSize: '2rem',
};

const CountButtonStyle = {
    backgroundColor: 'veeva_twilight_blue.500',
    color: 'white',
    _hover: {
        backgroundColor: 'veeva_twilight_blue.fifty_percent_opacity',
    },
    marginRight: '5px',
    fontSize: 'lg',
    borderRadius: '8px',
    width: '180px',
    boxShadow: '0 0 5px rgba(0,0,0,0.25)',
};

const DeleteButtonStyle = {
    backgroundColor: 'veeva_sunset_red_color_mode',
    color: 'white',
    _hover: {
        backgroundColor: 'veeva_sunset_red.fifty_percent_opacity',
    },
    marginRight: '10px',
    fontSize: 'lg',
    borderRadius: '8px',
    width: '180px',
    boxShadow: '0 0 5px rgba(0,0,0,0.25)',
};
