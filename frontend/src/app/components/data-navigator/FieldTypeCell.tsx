import { Flex, Box, BoxProps } from '@chakra-ui/react';
import { VaultRecordField } from '../../hooks/data-navigator/useDataReducer';
import { memo } from 'react';

interface FieldTypeCellProps {
    cellData: VaultRecordField;
}

export default memo(({ cellData }: FieldTypeCellProps) => {
    return (
        <Flex alignItems='center'>
            {cellData.type}
            {cellData.maxLength && <Box {...AdditionalInfoStyle}>({cellData.maxLength})</Box>}
            {cellData.picklist && <Box {...AdditionalInfoStyle}>({cellData.picklist})</Box>}
            {cellData.objectReferenceApiName && <Box {...AdditionalInfoStyle}>({cellData.objectReferenceApiName})</Box>}
            {cellData.formula && <Box {...AdditionalTypeInfoStyle}>Formula</Box>}
            {cellData.lookupRelationshipName && <Box {...AdditionalTypeInfoStyle}>Lookup</Box>}
            {cellData.isRollup && <Box {...AdditionalTypeInfoStyle}>Roll-up</Box>}
        </Flex>
    );
});

const AdditionalInfoStyle: BoxProps = {
    marginX: '2px',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
};

const AdditionalTypeInfoStyle: BoxProps = {
    color: 'veeva_orange_color_mode',
    marginX: '5px',
    fontStyle: 'italic',
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
};
