import {
    Flex,
    Tabs,
    Box,
    Icon,
    VStack,
    Spacer,
    useTabs,
    UseTabsReturn,
    FlexProps,
    BoxProps,
    TabsListProps,
    TabsIndicatorProps,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { PiGreaterThanBold } from 'react-icons/pi';
import { VaultRecord } from '../../hooks/data-navigator/useDataReducer';
import { CloseButton } from '../shared/ui-components/close-button';
import DataTable from './DataTable';
import { Toaster } from '../shared/ui-components/toaster';
import DataTabTooltip from './DataTabTooltip';

interface DataTabsProps {
    records: Map<string, VaultRecord>;
    selectedTab: string;
    setSelectedTab: (selectedTab: string) => void;
    getRecordData: ({ recordId, objectName }: { recordId?: string; objectName?: string }) => void;
    removeTabHandler: (id: string, tabs: UseTabsReturn) => void;
    componentTypes: string[];
}

export default function DataTabs({
    records,
    selectedTab,
    getRecordData,
    removeTabHandler,
    componentTypes,
}: DataTabsProps) {
    const tabs: UseTabsReturn = useTabs();
    const recordIds = [...records.keys()];

    useEffect(() => {
        tabs.setValue(selectedTab);
    }, [selectedTab, records]);

    return (
        <Tabs.RootProvider variant='plain' height='100%' value={tabs}>
            <Flex {...ParentFlexStyle}>
                <Flex {...TabsListFlexStyle}>
                    <Tabs.List {...TabListStyle}>
                        {recordIds.length === 0 ? (
                            <Tabs.Trigger value='defaultTab' {...TabStyle}>
                                <Flex width='180px' alignItems='center' justifyContent='center'>
                                    Select Record
                                </Flex>
                            </Tabs.Trigger>
                        ) : (
                            <>
                                {recordIds.map((recordId: string, index: number) => {
                                    const recordData = records.get(recordId);
                                    const isSelectedTab = tabs.value === recordId;

                                    return (
                                        <Flex key={recordId} borderBottom='solid 3px' borderBottomColor='gray.400'>
                                            <Tabs.Trigger value={`${recordId}`} {...TabStyle}>
                                                <Flex {...TabTriggerFlexStyle}>
                                                    <DataTabTooltip recordId={recordId} recordData={recordData}>
                                                        <VStack
                                                            flex={1}
                                                            minWidth={0}
                                                            gap={0}
                                                            alignItems='center'
                                                            color={
                                                                !isSelectedTab ? 'veeva_dark_gray_text_color_mode' : ''
                                                            }
                                                        >
                                                            <Box {...TabTitleBoxStyle}>{recordData?.objectName}</Box>
                                                            <Box>{recordId}</Box>
                                                        </VStack>
                                                    </DataTabTooltip>
                                                    <CloseButton
                                                        marginLeft='1px'
                                                        size='2xs'
                                                        as='div'
                                                        onClick={() => removeTabHandler(recordId, tabs)}
                                                    />
                                                </Flex>
                                            </Tabs.Trigger>
                                        </Flex>
                                    );
                                })}
                            </>
                        )}
                        <Tabs.Indicator {...TabIndicatorStyle} />
                        <Spacer borderBottom='solid 3px' borderBottomColor='gray.400' />
                    </Tabs.List>
                </Flex>
                <Toaster />
                <Box overflow='auto'>
                    {recordIds.map((recordId: any) => {
                        const recordData: VaultRecord | undefined = records.get(recordId);
                        return (
                            <Tabs.Content value={`${recordId}`} key={recordId} padding={0}>
                                <DataTable
                                    recordData={recordData}
                                    getRecordData={getRecordData}
                                    componentTypes={componentTypes}
                                />
                            </Tabs.Content>
                        );
                    })}
                </Box>
            </Flex>
        </Tabs.RootProvider>
    );
}

const TabListStyle: TabsListProps = {
    height: '100%',
    width: '100%',
    minWidth: '100%',
    transform: 'rotateX(180deg)',
    whiteSpace: 'nowrap',
};

const TabStyle = {
    color: 'veeva_orange_color_mode',
    fontSize: 'xl',
    width: '180px',
    height: '100%',
    paddingX: '0px',
    flexShrink: 0,
};

const TabIndicatorStyle: TabsIndicatorProps = {
    width: '180px',
    height: '3px',
    backgroundColor: 'veeva_orange_color_mode',
    zIndex: 2,
    bottom: '0',
};

const ParentFlexStyle: FlexProps = {
    flexDirection: 'column',
    height: '100%',
    backgroundColor: 'veeva_sunset_yellow.five_percent_opacity',
    borderBottomRadius: '8px',
};

const TabsListFlexStyle: FlexProps = {
    overflowX: 'auto',
    overflowY: 'hidden',
    transform: 'rotateX(180deg)',
    alignItems: 'center',
    backgroundColor: 'white_color_mode',
    minHeight: '60px',
    maxHeight: '60px',
    height: '60px',
};

const TabTitleBoxStyle: BoxProps = {
    fontSize: 'xs',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    width: '100%',
};

const TabTriggerFlexStyle: FlexProps = {
    width: '180px',
    height: '60px',
    alignItems: 'center',
    fontSize: 'sm',
    marginLeft: '8px',
};
