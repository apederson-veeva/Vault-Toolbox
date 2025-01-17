import { Box, Flex, Icon, List, ListItem, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { InteractionMode, StaticTreeDataProvider, Tree, UncontrolledTreeEnvironment } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { PiCaretDownBold, PiCaretRightBold, PiFolder } from 'react-icons/pi';

export default function FileStagingTree({
    fileStagingTree,
    selectedFolder,
    fileStagingTreeEnvironmentRef,
    fileStagingTreeRef,
    onSelect,
}) {
    const dataProvider = useMemo(
        () =>
            new StaticTreeDataProvider(fileStagingTree, (item, data) => ({
                ...item,
                data: {
                    name: data.name,
                    path: data.path,
                    ...(data.size && { size: data.size }),
                    ...(data.modified_date && { modified_date: data.modified_date }),
                },
            })),
        [fileStagingTree],
    );

    const viewState = {
        'file-staging-tree': {
            expandedItems: [selectedFolder.index],
            selectedItems: [selectedFolder.index],
        },
    };

    /**
     * Provides custom styling and sets the appropriate icon for expand/collapse options.
     */
    const itemArrowRenderer = ({ item, context }) => {
        return (
            <Flex
                align='center'
                justify='center'
                onClick={(e) => {
                    context.isExpanded ? context.collapseItem() : context.expandItem();
                    e.stopPropagation();
                }}
                width='28px'
                height='28px'
                _hover={{ cursor: 'pointer' }}
            >
                <Icon as={context.isExpanded ? PiCaretDownBold : PiCaretRightBold} width='20px' height='20px' />
            </Flex>
        );
    };

    /**
     * Provides custom styling and dynamically sets the appropriate icon for each item.
     */
    const itemRenderer = ({ item, title, arrow, context, children, depth }) => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                onSelect(item);
            }
        };

        return (
            <>
                {item.isFolder ? (
                    <ListItem onClick={() => onSelect(item)} onKeyDown={handleKeyDown}>
                        <Flex
                            alignItems='center'
                            justifyContent='left'
                            width='100%'
                            borderRadius='8px'
                            paddingLeft={`${depth * 28}px`} // Adjust padding for folder depth
                            backgroundColor={context.isSelected ? 'veeva_orange.500' : undefined}
                            color={context.isSelected ? 'white' : 'inherit'} // Set font color based on selection
                            _hover={{
                                cursor: 'pointer',
                                backgroundColor: context.isSelected ? undefined : 'light_gray.color_mode',
                            }}
                            {...context.itemContainerWithChildrenProps}
                            {...context.itemContainerWithoutChildrenProps}
                            {...context.interactiveElementProps}
                        >
                            <Box>{arrow}</Box>
                            <Flex align='center' justify='center' width='28px' height='28px'>
                                <Icon as={PiFolder} width='28px' height='20px' />
                            </Flex>
                            <Text {...TextStyle}>{title}</Text>
                        </Flex>
                    </ListItem>
                ) : null}
                {children}
            </>
        );
    };

    return (
        <>
            <style>
                {`
                :root {
                    --rct-color-tree-bg: #FFFFFF;
                    --rct-item-height: 20px;
                },
                .rct-tree-root {
                    font-family: system-ui,sans-serif;
                }
            `}
            </style>
            <Box ml='5px'>
                <UncontrolledTreeEnvironment
                    ref={fileStagingTreeEnvironmentRef}
                    dataProvider={dataProvider}
                    viewState={viewState}
                    getItemTitle={(item) => item.data.name}
                    canSearch={false}
                    canDragAndDrop={false}
                    canReorderItems={false}
                    canRename={false}
                    defaultInteractionMode={InteractionMode.ClickArrowToExpand}
                    renderItem={itemRenderer}
                    renderItemArrow={itemArrowRenderer}
                    renderTreeContainer={({ children, containerProps }) => <Box {...containerProps}>{children}</Box>}
                    renderItemsContainer={({ children, containerProps }) => (
                        <List whiteSpace='nowrap' {...containerProps}>
                            {children}
                        </List>
                    )}
                >
                    {fileStagingTree && (
                        <Tree
                            ref={fileStagingTreeRef}
                            treeId='file-staging-tree'
                            rootItem='root'
                            treeLabel='File Staging Tree'
                        />
                    )}
                </UncontrolledTreeEnvironment>
            </Box>
        </>
    );
}

const TextStyle = {
    flex: '1', // Take up the remaining space in the Flex
    isTruncated: true, // Truncate text with ellipsis if it overflows
    marginY: 2,
    marginX: '5px',
    fontSize: '15px',
};
