import { Flex, Box, Text, Center, Spinner } from '@chakra-ui/react';
import useVaultData from '../../hooks/data-tools/useVaultData';
import useVaultDataSelection from '../../hooks/data-tools/useVaultDataSelection';
import ApiErrorMessageCard from '../shared/ApiErrorMessageCard';
import { RadioGroup, Radio } from '../shared/ui-components/radio';
import DataSelectionCheckboxGroup from './DataSelectionCheckboxGroup';

export default function DataSelectionPanel({ dataType, setDataType, selectedOptions, setSelectedOptions }) {
    const { vaultObjects, vaultDocumentTypes, fetchObjAndDocTypeError } = useVaultData();
    const {
        disableObjectSelection,
        disableDocTypeSelection,
        extractVaultNames,
        handleAllChecked,
        handleSingleChecked,
    } = useVaultDataSelection({
        dataType,
        selectedOptions,
        setSelectedOptions,
        vaultObjects,
        vaultDocumentTypes,
    });

    return (
        <Flex {...SelectionBoxStyle}>
            {!fetchObjAndDocTypeError.hasError ? (
                <>
                    <Box flex='0 0 auto'>
                        <RadioGroup
                            onValueChange={(e) => setDataType(e.value)}
                            value={dataType}
                            colorPalette='veeva_midnight_indigo'
                            margin='10px'
                            variant='subtle'
                        >
                            <Flex alignItems='center'>
                                <Text fontWeight='bold' fontSize='md' display='inline' marginLeft='5px'>
                                    Data Type:
                                </Text>
                                <Radio value='ALL' marginLeft='10px'>
                                    All Data
                                </Radio>
                                <Radio value='OBJECTS' marginLeft='10px'>
                                    Objects
                                </Radio>
                                <Radio value='DOCUMENTS' marginLeft='10px'>
                                    Documents
                                </Radio>
                            </Flex>
                        </RadioGroup>
                    </Box>
                    {vaultObjects.length !== 0 && vaultDocumentTypes.length !== 0 ? (
                        <Flex flex='1 1 auto' overflow='auto' marginX='10px'>
                            <DataSelectionCheckboxGroup
                                type='Objects'
                                selectedDataType={dataType}
                                dataToDisplay={vaultObjects}
                                selectedOptions={selectedOptions}
                                setSelectedOptions={setSelectedOptions}
                                handleAllChecked={handleAllChecked}
                                handleSingleChecked={handleSingleChecked}
                                disabled={disableObjectSelection}
                                extractVaultNames={extractVaultNames}
                            />
                            <DataSelectionCheckboxGroup
                                type='Document Types'
                                selectedDataType={dataType}
                                dataToDisplay={vaultDocumentTypes}
                                selectedOptions={selectedOptions}
                                setSelectedOptions={setSelectedOptions}
                                handleAllChecked={handleAllChecked}
                                handleSingleChecked={handleSingleChecked}
                                disabled={disableDocTypeSelection}
                                extractVaultNames={extractVaultNames}
                            />
                        </Flex>
                    ) : (
                        <Center>
                            <Spinner />
                        </Center>
                    )}
                </>
            ) : (
                <ApiErrorMessageCard
                    content='Vault objects and document types'
                    errorMessage={fetchObjAndDocTypeError.errorMessage}
                />
            )}
        </Flex>
    );
}

const SelectionBoxStyle = {
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'veeva_light_gray_color_mode',
};
