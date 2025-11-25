import { Box, Button, Flex, FlexProps, Link, LinkProps, Text, TextProps } from '@chakra-ui/react';
import { type ReactNode } from 'react';
import { Tooltip } from '../shared/ui-components/tooltip';
import { getVaultDns } from '../../services/SharedServices';
import { VaultRecordField, VaultRecord } from '../../hooks/data-navigator/useDataReducer';
import { PiArrowSquareOutLight } from 'react-icons/pi';
import { useSettings } from '../../context/SettingsContext';

interface DataTabTooltipProps {
    children?: ReactNode;
    recordId: string;
    recordData: VaultRecord | undefined;
}

export default function DataTabTooltip({ recordId, recordData, children }: DataTabTooltipProps) {
    return (
        <Tooltip
            content={<TooltipContent recordId={recordId} recordData={recordData} />}
            contentProps={{ backgroundColor: 'white_color_mode' }}
            interactive
            closeDelay={2000}
            positioning={{
                placement: 'bottom-start',
            }}
        >
            {children}
        </Tooltip>
    );
}

function TooltipContent({ recordId, recordData }: DataTabTooltipProps) {
    const { settings } = useSettings();

    const recordNameField = recordData?.rows?.find((row: VaultRecordField) => row.name === 'name__v')?.value;

    // Needed to create links to the object type
    const recordApiNameField = recordData?.rows?.find((row: VaultRecordField) => row.name === 'api_name__v')?.value;
    const recordObjectNameField = recordData?.rows?.find(
        (row: VaultRecordField) => row.name === 'object_name__v',
    )?.value;

    const openInVaultHref =
        recordData?.objectName === 'object_type__v'
            ? settings?.dataNavigator?.featureSettings?.showVaultAdminLinks
                ? `https://${getVaultDns()}/ui/#admin/content_setup/object_schema/types=&t=${recordObjectNameField}&d=${recordApiNameField}`
                : ''
            : `https://${getVaultDns()}/ui/#object/${recordData?.objectName}/${recordId}`;

    return (
        <Flex {...ParentFlexStyle}>
            <Text color='veeva_orange_color_mode'>
                Object: <Text {...TextStyle}>{recordData?.objectLabel}</Text>
            </Text>
            <Text color='veeva_orange_color_mode'>
                Record: <Text {...TextStyle}>{recordNameField}</Text>
            </Text>
            {openInVaultHref ? (
                <Flex width='100%' justifyContent='center'>
                    <Button size='xs' variant='ghost' margin={0} asChild>
                        <Link href={openInVaultHref} {...TabRecordLinkStyle}>
                            <Box
                                as={PiArrowSquareOutLight}
                                display='inline'
                                marginRight='5px'
                                style={{ width: 16, height: 16 }}
                            />
                            Open in Vault
                        </Link>
                    </Button>
                </Flex>
            ) : null}
        </Flex>
    );
}

const TabRecordLinkStyle: LinkProps = {
    target: '_blank',
    rel: 'noopener noreferrer',
    fontWeight: 'semibold',
    gap: 0,
    _hover: { textDecoration: 'none' },
    width: '100%',
};

const ParentFlexStyle: FlexProps = {
    direction: 'column',
    width: 'max-content',
    minWidth: '180px',
    margin: '5px',
    fontSize: 'sm',
    gap: 2,
};

const TextStyle: TextProps = {
    as: 'span',
    fontWeight: 'semibold',
    color: 'fg',
};
