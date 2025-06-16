import { Box, Center, Flex, Heading, Spacer, Spinner, Text } from '@chakra-ui/react';
import ApiErrorMessageCard from '../../shared/ApiErrorMessageCard';
import CustomSelect from '../../shared/CustomSelect';

export default function QueryFieldsSelector({
    selectedFields,
    setSelectedFields,
    fieldOptions,
    fieldOptionsError,
    loadingObjectMetadata,
}) {
    return (
        <Flex {...FlexStyle}>
            <Box minWidth='75px' marginRight='5px'>
                <Heading size='sm'>Fields:</Heading>
            </Box>
            {loadingObjectMetadata ? (
                <Center>
                    <Spinner />
                </Center>
            ) : (
                <Box width='100%'>
                    {fieldOptionsError ? (
                        <ApiErrorMessageCard errorMessage={fieldOptionsError} />
                    ) : (
                        <CustomSelect
                            options={fieldOptions}
                            placeholder='Select fields...'
                            size='sm'
                            isClearable
                            isMulti
                            closeMenuOnSelect={false}
                            value={selectedFields}
                            onChange={(newValue) => setSelectedFields(newValue)}
                            formatGroupLabel={formatGroupLabel}
                        />
                    )}
                </Box>
            )}
        </Flex>
    );
}

const formatGroupLabel = (data) => (
    <Flex align='center'>
        <Text>{data.label}</Text>
        <Spacer />
        <Text>{data.options.length}</Text>
    </Flex>
);

const FlexStyle = {
    align: 'center',
    marginX: '5px',
    marginTop: '10px',
};
