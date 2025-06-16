import { IconButton, useDisclosure } from '@chakra-ui/react';
import { PiFloppyDisk } from 'react-icons/pi';
import useSavedQueries from '../../hooks/vql-editor/useSavedQueries';
import { Tooltip } from '../shared/ui-components/tooltip';
import VqlActionsMenu from './VqlActionsMenu';
import VqlSaveQueryModal from './VqlSaveQueryModal';

export default function VqlSavedQueriesContainer({ code, setCode }) {
    const { open, onOpen, onClose } = useDisclosure();
    const {
        selectedQueryName,
        setSelectedQueryName,
        isDefaultQuery,
        setIsDefaultQuery,
        savedQueries,
        savedQueryOptions,
        handleSave,
        handleModalClose,
        insertSavedQuery,
        deleteSavedQuery,
    } = useSavedQueries({ onClose, setCode });

    return (
        <>
            <Tooltip
                content={savedQueries?.length < 20 ? 'Save Query' : 'Max saved queries reached (20)'}
                openDelay={0}
                positioning={{ placement: 'left' }}
            >
                <IconButton onClick={onOpen} disabled={savedQueries?.length >= 20} {...SaveQueryButtonStyle}>
                    <PiFloppyDisk style={{ width: 24, height: 24 }} />
                </IconButton>
            </Tooltip>
            <VqlActionsMenu
                savedQueryOptions={savedQueryOptions}
                insertSavedQuery={insertSavedQuery}
                deleteSavedQuery={deleteSavedQuery}
                selectedQueryName={selectedQueryName}
                setSelectedQueryName={setSelectedQueryName}
            />
            {open ? (
                <VqlSaveQueryModal
                    code={code}
                    open={open}
                    handleModalClose={handleModalClose}
                    handleSave={handleSave}
                    selectedQueryName={selectedQueryName}
                    setSelectedQueryName={setSelectedQueryName}
                    savedQueryOptions={savedQueryOptions}
                    savedQueries={savedQueries}
                    isDefaultQuery={isDefaultQuery}
                    setIsDefaultQuery={setIsDefaultQuery}
                />
            ) : null}
        </>
    );
}

const SaveQueryButtonStyle = {
    variant: 'ghost',
    size: 'sm',
    colorPalette: 'blue',
    _hover: {
        backgroundColor: 'blue.400',
        color: 'white',
    },
    margin: '10px',
    padding: '5px',
    borderRadius: '8px',
};
