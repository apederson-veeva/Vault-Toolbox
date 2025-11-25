import { Flex, Box } from '@chakra-ui/react';
import { VaultRecordField } from '../../hooks/data-navigator/useDataReducer';
import { memo } from 'react';

interface FieldNameCellProps {
    cellData: VaultRecordField;
}

export default memo(({ cellData }: FieldNameCellProps) => {
    return (
        <Flex marginX='2px' align='center'>
            <Box textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>
                {cellData.name}
            </Box>
        </Flex>
    );
});
