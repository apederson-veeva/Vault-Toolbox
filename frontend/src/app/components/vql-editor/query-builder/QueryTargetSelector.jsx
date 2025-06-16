import { Box, Center, Flex, Heading, Spinner } from '@chakra-ui/react';
import ApiErrorMessageCard from '../../shared/ApiErrorMessageCard';
import CustomSelect from '../../shared/CustomSelect';

export default function QueryTargetSelector({
    queryTargetOptions,
    queryTargetsError,
    selectedQueryTarget,
    setSelectedQueryTarget,
    loadingQueryTargets,
}) {
    // const queryTargetOptions = [{ value: 'Objects', label: 'Objects' }];

    return (
        <Flex {...FlexStyle}>
            <Box minWidth='75px' marginRight='5px'>
                <Heading size='sm'>Target:</Heading>
            </Box>
            {loadingQueryTargets ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <Box width='100%'>
                    {queryTargetsError ? (
                        <ApiErrorMessageCard errorMessage={queryTargetsError} />
                    ) : (
                        <CustomSelect
                            options={queryTargetOptions}
                            placeholder='Select a query target...'
                            isClearable
                            value={selectedQueryTarget}
                            onChange={(newValue) => setSelectedQueryTarget(newValue)}
                        />
                    )}
                </Box>
            )}
        </Flex>
    );
}

const FlexStyle = {
    align: 'center',
    marginX: '5px',
    marginTop: '10px',
};
