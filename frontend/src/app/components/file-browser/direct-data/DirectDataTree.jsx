import { Box, Flex, List, Text } from '@chakra-ui/react';
import { useMemo } from 'react';
import { InteractionMode, Tree, ControlledTreeEnvironment } from 'react-complex-tree';
import 'react-complex-tree/lib/style-modern.css';
import { PiFolder } from 'react-icons/pi';

export default function DirectDataTree({
    directDataTree,
    selectedDirectDataTreeItems,
    setSelectedDirectDataTreeItems,
    handleDirectDataFolderClick,
}) {
    const items = useMemo(() => directDataTree, [directDataTree]);

    /**
     * Provides custom styling and dynamically sets the appropriate icon for each item.
     */
    const itemRenderer = ({ item, title, context, children, depth }) => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                handleDirectDataFolderClick(item);
            }
        };

        return (
            <>
                {item.isFolder ? (
                    <List.Item onClick={() => handleDirectDataFolderClick(item)} onKeyDown={handleKeyDown}>
                        <Flex
                            alignItems='center'
                            justifyContent='left'
                            width='100%'
                            borderRadius='6px'
                            paddingLeft={`${depth * 28}px`} // Adjust padding for folder depth
                            backgroundColor={context.isSelected ? 'veeva_orange_color_mode' : undefined}
                            color={context.isSelected ? 'white' : 'inherit'} // Set font color based on selection
                            _hover={{
                                cursor: 'pointer',
                                backgroundColor: context.isSelected ? undefined : 'light_gray_color_mode',
                            }}
                            {...context.itemContainerWithChildrenProps}
                            {...context.itemContainerWithoutChildrenProps}
                            {...context.interactiveElementProps}
                        >
                            <List.Indicator>
                                <PiFolder style={{ width: 28, height: 20 }} />
                            </List.Indicator>
                            <Text {...TextStyle}>{title}</Text>
                        </Flex>
                    </List.Item>
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
                <ControlledTreeEnvironment
                    viewState={{
                        ['direct-data-tree']: {
                            selectedItems: selectedDirectDataTreeItems,
                        },
                    }}
                    onSelectItems={(items) => {
                        setSelectedDirectDataTreeItems(items);
                    }}
                    getItemTitle={(item) => item.data.name}
                    items={items}
                    canSearch={false}
                    canDragAndDrop={false}
                    canReorderItems={false}
                    canRename={false}
                    defaultInteractionMode={InteractionMode.ClickArrowToExpand}
                    renderItem={itemRenderer}
                    renderTreeContainer={({ children, containerProps }) => <Box {...containerProps}>{children}</Box>}
                    renderItemsContainer={({ children, containerProps }) => (
                        <List.Root variant='plain' whiteSpace='nowrap' {...containerProps}>
                            {children}
                        </List.Root>
                    )}
                >
                    <Tree treeId='direct-data-tree' rootItem='root' treeLabel='Direct Data Tree' />
                </ControlledTreeEnvironment>
            </Box>
        </>
    );
}

const TextStyle = {
    flex: '1', // Take up the remaining space in the Flex
    truncate: true, // Truncate text with ellipsis if it overflows
    marginY: 2,
    marginX: '5px',
    fontSize: '15px',
};
