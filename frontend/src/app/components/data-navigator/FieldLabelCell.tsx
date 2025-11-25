import { Flex, Box, Text, BoxProps } from '@chakra-ui/react';
import { VaultRecordField } from '../../hooks/data-navigator/useDataReducer';
import { Tooltip } from '../shared/ui-components/tooltip';
import { memo } from 'react';

interface FieldTypeCellProps {
    cellData: VaultRecordField;
}

export default memo(({ cellData }: FieldTypeCellProps) => {
    return (
        <Flex alignItems='center'>
            <Text textOverflow='ellipsis' overflow='hidden' whiteSpace='nowrap'>
                {cellData.label}
            </Text>
            {cellData.required && (
                <Tooltip content='Required' openDelay={0} positioning={{ placement: 'right' }}>
                    <Box {...FieldRequiredStyle}>*</Box>
                </Tooltip>
            )}
        </Flex>
    );
});

const FieldRequiredStyle: BoxProps = {
    marginLeft: '2px',
    color: 'veeva_orange_color_mode',
};
