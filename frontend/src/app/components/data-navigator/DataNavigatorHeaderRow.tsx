import { Flex, Heading, Button, Input, HeadingProps, ButtonProps, InputProps } from '@chakra-ui/react';
import { PiMagnifyingGlass } from 'react-icons/pi';
import { InputGroup } from '../shared/ui-components/input-group';
import useDataNavigatorInput from '../../hooks/data-navigator/useDataNavigatorInput';
import DataLookupInfoPopover from './DataLookupInfoPopover';

export default function DataNavigatorHeaderRow({
    userInput,
    setUserInput,
    getRecordData,
    loadingRecord,
}: {
    userInput: string;
    setUserInput: (userInput: string) => void;
    getRecordData: ({ recordId, objectName }: { recordId?: string; objectName?: string }) => void;
    loadingRecord: boolean;
}) {
    const { inputRef, handleEnterKeyDown } = useDataNavigatorInput({ userInput, getRecordData });
    return (
        <Flex width='100%' margin='10px' alignItems='center'>
            <Heading {...HeadingStyle}>Data Navigator</Heading>
            <InputGroup {...InputGroupStyle} startElement={<PiMagnifyingGlass size={24} />}>
                <Input
                    {...InputStyle}
                    value={userInput}
                    onChange={(event) => setUserInput(event.currentTarget.value)}
                    onKeyDown={handleEnterKeyDown}
                    ref={inputRef}
                />
            </InputGroup>
            <DataLookupInfoPopover />
            <Button
                disabled={!userInput}
                loading={loadingRecord}
                onClick={() => getRecordData({})}
                {...GetRecordButtonStyle}
            >
                Get Data
            </Button>
        </Flex>
    );
}

const HeadingStyle: HeadingProps = {
    color: 'veeva_orange_color_mode',
    minWidth: 'max-content',
    marginLeft: '25px',
    marginRight: '5px',
    fontSize: '2rem',
};

const InputGroupStyle = {
    borderColor: 'transparent',
    backgroundColor: 'veeva_light_gray_color_mode',
    marginX: '5px',
    flexGrow: 1,
};

const InputStyle: InputProps = {
    boxShadow: '0 0 5px rgba(0,0,0,0.25)',
    backgroundColor: 'white_color_mode',
    color: 'text_color_mode',
    border: 'transparent',
    borderRadius: 'md',
    marginLeft: '5px',
    fontSize: 'md',
    placeholder: 'Enter record ID or URL...',
};

const GetRecordButtonStyle: ButtonProps = {
    backgroundColor: 'veeva_twilight_blue.500',
    color: 'white',
    _hover: {
        backgroundColor: 'veeva_twilight_blue.fifty_percent_opacity',
    },
    fontSize: 'lg',
    borderRadius: '8px',
    marginRight: '10px',
    minWidth: '180px',
    boxShadow: '0 0 5px rgba(0,0,0,0.25)',
};
