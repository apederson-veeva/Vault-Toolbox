import { Flex, FlexProps, Text, TextProps } from '@chakra-ui/react';
import { VaultRecordField } from '../../hooks/data-navigator/useDataReducer';
import { memo } from 'react';
import { getVaultDns } from '../../services/SharedServices';
import FullTextDisplayDialog from './FullTextDisplayDialog';
import FieldValueActionMenu from './FieldValueActionMenu';
import { useSettings } from '../../context/SettingsContext';
import useOverflowResizer from '../../hooks/data-navigator/useOverflowResizer';

interface FieldValueCellProps {
    cellData: VaultRecordField;
    componentTypes: string[];
    getRecordData: ({ recordId, objectName }: { recordId?: string; objectName?: string }) => void;
    objectName: string | undefined;
    isHovered: boolean;
}

export default memo(({ cellData, componentTypes, getRecordData, objectName, isHovered }: FieldValueCellProps) => {
    const { value, type, name, objectReferenceRecordName, objectReferenceApiName, componentType, picklist } = cellData;

    const { settings } = useSettings();
    const { overflowElementRef, isOverflown } = useOverflowResizer({ elementContent: String(value) });

    const openFieldInVaultAdminUiHref = `https://${getVaultDns()}/ui/#admin/content_setup/object_schema/fields?t=${objectName}&d=${name}`;

    /*
        If the field is an object reference:
            - Display referenced record's name__v & record ID (e.g. "Parent 1 (V5200000000P001)")
            - If clicked, open the record in a new tab
            - If it's a document reference, an action menu will allow opening the doc in Vault
     */
    if (objectReferenceRecordName) {
        return (
            <Flex marginX='2px' {...ParentFlexStyle}>
                <Flex alignItems='center'>
                    {objectReferenceApiName === 'documents' ? (
                        <Text marginX='2px' {...TextOverflowStyle}>
                            {objectReferenceRecordName} ({String(value)})
                        </Text>
                    ) : (
                        <>
                            <Flex
                                {...LinkTextStyle}
                                onClick={() => {
                                    const isUserSysRecord: boolean =
                                        objectReferenceApiName === 'user__sys' || objectReferenceApiName === 'users';
                                    getRecordData({
                                        recordId: isUserSysRecord ? `user__sys:${value}` : value,
                                    });
                                }}
                            >
                                {objectReferenceRecordName}
                            </Flex>
                            <Text marginX='2px' {...TextOverflowStyle}>
                                ({String(value)})
                            </Text>
                        </>
                    )}
                </Flex>
                <FieldValueActionMenu
                    isHovered={isHovered}
                    openDocumentInVaultHref={
                        objectReferenceApiName === 'documents'
                            ? `https://${getVaultDns()}/ui/#doc_info/${String(value)}`
                            : ''
                    }
                    openFieldInVaultAdminHref={openFieldInVaultAdminUiHref}
                />
            </Flex>
        );
    }

    /*
        If the field is a component reference:
            - Display component's name and component type (e.g. "rl_test_lifecycle_lifecycle__c (Objectlifecycle)")
            - If it's not a subcomponent, when clicked, open the MDL (read-only) in Dialog
     */
    if (componentType) {
        return (
            <Flex marginX='2px' {...ParentFlexStyle}>
                <Text marginX='2px' {...TextOverflowStyle}>
                    {value} ({String(componentType)})
                </Text>
                {componentTypes.includes(componentType) ? (
                    <FieldValueActionMenu
                        isHovered={isHovered}
                        openObjectLifecycleInVaultAdminHref={
                            componentType === 'Objectlifecycle' &&
                            settings?.dataNavigator?.featureSettings?.showVaultAdminLinks
                                ? `https://${getVaultDns()}/#admin/content_setup/object_lifecycles=&lc=${value}`
                                : ''
                        }
                        viewMdlComponent={settings?.componentEditor?.enabled ? `${componentType}.${value}` : ''}
                        openFieldInVaultAdminHref={openFieldInVaultAdminUiHref}
                    />
                ) : (
                    <FieldValueActionMenu
                        isHovered={isHovered}
                        openFieldInVaultAdminHref={openFieldInVaultAdminUiHref}
                    />
                )}
            </Flex>
        );
    }

    if (type === 'Picklist') {
        return (
            <Flex marginX='2px' {...ParentFlexStyle}>
                <Text marginRight='5px' {...TextOverflowStyle}>
                    {String(value)}
                </Text>
                <FieldValueActionMenu
                    isHovered={isHovered}
                    viewMdlComponent={settings?.componentEditor?.enabled ? `${type}.${picklist}` : ''} // e.g. Picklist.multivalue_picklist_field__c
                    openFieldInVaultAdminHref={openFieldInVaultAdminUiHref}
                />
            </Flex>
        );
    }

    if (type === 'RichText' || type === 'LongText') {
        return (
            <Flex {...ParentFlexStyle}>
                <Flex flexDirection='column' justifyContent='flex-start'>
                    <Text
                        as='div'
                        textAlign='left'
                        textOverflow='ellipsis'
                        overflow='hidden'
                        lineClamp={2}
                        ref={overflowElementRef}
                    >
                        {String(value)}
                    </Text>
                    <FullTextDisplayDialog fieldType={String(type)} isOverflown={isOverflown} value={value} />
                </Flex>
                <FieldValueActionMenu isHovered={isHovered} openFieldInVaultAdminHref={openFieldInVaultAdminUiHref} />
            </Flex>
        );
    }

    return (
        <Flex {...ParentFlexStyle}>
            <Text textAlign='left' {...TextOverflowStyle}>
                {String(value)}
            </Text>
            <FieldValueActionMenu isHovered={isHovered} openFieldInVaultAdminHref={openFieldInVaultAdminUiHref} />
        </Flex>
    );
});

const ParentFlexStyle: FlexProps = {
    justifyContent: 'space-between',
    alignItems: 'center',
};

const LinkTextStyle: FlexProps = {
    textDecoration: 'underline',
    _hover: { cursor: 'pointer' },
    color: 'veeva_orange_color_mode',
};

const TextOverflowStyle: TextProps = {
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
};
