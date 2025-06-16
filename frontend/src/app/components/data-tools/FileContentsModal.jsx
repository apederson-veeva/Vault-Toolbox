import { Text, List } from '@chakra-ui/react';
import { useRef } from 'react';
import useRemainingHeight from '../../hooks/shared/useRemainingHeight';
import useFileContents from '../../hooks/data-tools/useFileContents';
import ApiErrorMessageCard from '../shared/ApiErrorMessageCard';
import VirtualizedTable from '../shared/VirtualizedTable';
import {
    DialogRoot,
    DialogContent,
    DialogHeader,
    DialogBody,
    DialogCloseTrigger,
} from '../shared/ui-components/dialog';

export default function FileContentsModal({ open, onClose, cellData }) {
    const { loading, headerData, fileData, error } = useFileContents({ cellData });

    const headerRef = useRef(null);
    const listRef = useRef(null);
    const modalHeight = window.innerHeight * 0.8; // 80vh
    const tableHeight = useRemainingHeight({ refs: [headerRef, listRef], totalHeight: modalHeight, padding: 40 });

    return (
        <DialogRoot open={open} onOpenChange={onClose}>
            <DialogContent {...ModalContentStyle}>
                <DialogHeader ref={headerRef} fontSize='lg' fontWeight='bold'>
                    File Contents:
                </DialogHeader>
                <DialogCloseTrigger />
                <DialogBody height='100%'>
                    <List.Root ref={listRef} paddingBottom='10px'>
                        <List.Item>
                            <Text {...ModalHeaderTextStyle}>File name: </Text>
                            {cellData.split('/')[4]}
                        </List.Item>
                        <List.Item>
                            <Text {...ModalHeaderTextStyle}>File staging path: </Text>
                            {cellData}
                        </List.Item>
                    </List.Root>
                    {!error.hasError ? (
                        <VirtualizedTable
                            chakraTableSize='sm'
                            tableHeight={`${tableHeight}px`}
                            headers={headerData}
                            data={fileData}
                            loading={loading}
                        />
                    ) : (
                        <ApiErrorMessageCard content='file content' errorMessage={error.errorMessage} />
                    )}
                </DialogBody>
            </DialogContent>
        </DialogRoot>
    );
}

const ModalContentStyle = {
    maxW: '80vw',
    maxH: '80vh',
    minW: '80vw',
    minH: '80vh',
    overflow: 'auto',
    fontSize: 'md',
    backgroundColor: 'white_color_mode',
};

const ModalHeaderTextStyle = {
    display: 'inline',
    fontWeight: 'bold',
};
