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
                <Heading size='xs'>Target:</Heading>
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
                            // defaultValue={test}
                            options={queryTargetOptions}
                            placeholder='Select a query target...'
                            isClearable={true}
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
