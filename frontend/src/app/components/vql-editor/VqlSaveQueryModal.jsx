import { Button } from '@chakra-ui/react';
import { CreatableSelect } from 'chakra-react-select';
import { useRef } from 'react';
import { PiFloppyDisk } from 'react-icons/pi';
import { Checkbox } from '../shared/ui-components/checkbox';
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogCloseTrigger,
    DialogBody,
    DialogFooter,
} from '../shared/ui-components/dialog';

export default function VqlSaveQueryModal({
    code,
    open,
    handleModalClose,
    savedQueryOptions,
    selectedQueryName,
    setSelectedQueryName,
    isDefaultQuery,
    setIsDefaultQuery,
    handleSave,
}) {
    const saveQueryInputRef = useRef(null);

    return (
        <DialogRoot open={open} onOpenChange={handleModalClose} initialFocusEl={saveQueryInputRef} size='sm'>
            <DialogContent backgroundColor='white_color_mode'>
                <DialogHeader paddingY='20px' fontSize='lg' fontWeight='bold'>
                    Save Query
                </DialogHeader>
                <DialogCloseTrigger {...ModalCloseButtonStyle} />
                <DialogBody paddingY='0px'>
                    <CreatableSelect
                        size='sm'
                        isClearable
                        placeholder='Save query as...'
                        options={savedQueryOptions}
                        value={selectedQueryName}
                        onChange={(newValue) => setSelectedQueryName(newValue)}
                        formatCreateLabel={(selectedQueryName) => `Save as: ${selectedQueryName}`}
                        forwardRef={saveQueryInputRef}
                    />
                </DialogBody>
                <DialogFooter paddingY='10px'>
                    <Checkbox
                        variant='subtle'
                        size='sm'
                        marginRight='10px'
                        checked={isDefaultQuery}
                        onCheckedChange={() => setIsDefaultQuery(!isDefaultQuery)}
                    >
                        Default?
                    </Checkbox>
                    <Button onClick={() => handleSave(code)} disabled={!selectedQueryName} {...SaveButtonStyle}>
                        <PiFloppyDisk style={{ width: 24, height: 24 }} />
                        Save
                    </Button>
                </DialogFooter>
            </DialogContent>
        </DialogRoot>
    );
}

const ModalCloseButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '24px',
};

const SaveButtonStyle = {
    variant: 'solid',
    size: 'sm',
    colorPalette: 'blue',
    padding: '10px',
};
