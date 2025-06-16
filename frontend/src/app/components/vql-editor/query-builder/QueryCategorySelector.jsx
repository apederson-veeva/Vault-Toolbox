import { Box, Flex, Heading, Spacer } from '@chakra-ui/react';
import CustomSelect from '../../shared/CustomSelect';

export default function QueryCategorySelector({
    queryCategoryOptions,
    selectedQueryCategory,
    setSelectedQueryCategory,
}) {
    return (
        <Flex align='center' marginX='5px'>
            <Box minWidth='75px' marginRight='5px'>
                <Heading size='sm'>Category:</Heading>
            </Box>
            <Box width='100%'>
                <CustomSelect
                    options={queryCategoryOptions}
                    value={selectedQueryCategory}
                    onChange={(newValue) => setSelectedQueryCategory(newValue)}
                />
            </Box>
            <Spacer />
        </Flex>
    );
}
