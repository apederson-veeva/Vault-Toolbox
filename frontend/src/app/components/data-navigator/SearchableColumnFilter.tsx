import { Input, InputProps } from '@chakra-ui/react';
import { Column } from '@tanstack/react-table';
import { CloseButton } from '../shared/ui-components/close-button';
import { InputGroup } from '../shared/ui-components/input-group';
import { useState } from 'react';

interface SearchableColumnFilterProps {
    column: Column<any, unknown>;
}

export default function SearchableColumnFilter({ column }: SearchableColumnFilterProps) {
    const [userInputFilterValue, setUserInputFilterValue] = useState('');

    return (
        <InputGroup
            endElement={
                userInputFilterValue ? (
                    <CloseButton
                        size='2xs'
                        onClick={() => {
                            column.setFilterValue(undefined);
                            setUserInputFilterValue('');
                        }}
                    />
                ) : undefined
            }
        >
            <Input
                {...InputStyle}
                value={userInputFilterValue}
                onChange={(event) => {
                    column.setFilterValue(event.currentTarget.value.trim());
                    setUserInputFilterValue(event.currentTarget.value.trim());
                }}
            />
        </InputGroup>
    );
}

const InputStyle: InputProps = {
    size: 'xs',
    boxShadow: '0 0 5px rgba(0,0,0,0.25)',
    backgroundColor: 'white_color_mode',
    color: 'fg',
    border: 'transparent',
    borderRadius: 'md',
    marginLeft: '5px',
    fontSize: 'xs',
    placeholder: 'Search...',
};
