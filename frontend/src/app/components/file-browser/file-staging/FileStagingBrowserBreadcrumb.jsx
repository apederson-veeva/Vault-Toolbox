import { FileUploadHiddenInput, FileUploadRootProvider, Flex, IconButton, Input } from '@chakra-ui/react';
import { PiArrowClockwise, PiUpload, PiFolderSimplePlusLight } from 'react-icons/pi';
import useFileStagingUpload from '../../../hooks/file-browser/file-staging/useFileStagingUpload';
import { BreadcrumbLink, BreadcrumbRoot } from '../../shared/ui-components/breadcrumb';
import { FileUploadTrigger } from '../../shared/ui-components/file-upload';
import { Toaster } from '../../shared/ui-components/toaster';
import { Tooltip } from '../../shared/ui-components/tooltip';

export default function FileStagingBrowserBreadcrumb({
    fileStagingTree,
    handleFileStagingFolderClick,
    selectedFileStagingFolder,
    handleReloadFileStagingTreeFolder,
}) {
    const {
        createFileStagingFolderInputRef,
        creatingFileStagingFolder,
        setCreatingFileStagingFolder,
        newFileStagingFolderName,
        setNewFileStagingFolderName,
        fileUploadRootProviderAttributes,
        handleCreateFileStagingFolderInputKeyDown,
    } = useFileStagingUpload({
        handleReloadFileStagingTreeFolder,
        selectedFileStagingFolder,
    });

    return (
        <Flex width='100%' alignItems='center' justifyContent='space-between'>
            <BreadcrumbRoot {...BreadcrumbRootStyle}>
                <BreadcrumbLink
                    onClick={() => handleFileStagingFolderClick(fileStagingTree['/'])}
                    {...BreadcrumbLinkStyle}
                >
                    /
                </BreadcrumbLink>
                {renderBreadcrumbItems({ fileStagingTree, handleFileStagingFolderClick, selectedFileStagingFolder })}
                {creatingFileStagingFolder ? (
                    <Input
                        ref={createFileStagingFolderInputRef}
                        value={newFileStagingFolderName}
                        onChange={(e) => setNewFileStagingFolderName(e.target.value)}
                        onKeyDown={handleCreateFileStagingFolderInputKeyDown}
                        onBlur={() => setCreatingFileStagingFolder(false)} // Hide on blur
                        placeholder='Enter new folder name here'
                        size='sm'
                        width='200px'
                        marginLeft='10px'
                        borderColor='veeva_orange_color_mode'
                        boxShadow='none'
                    />
                ) : null}
            </BreadcrumbRoot>
            <Toaster />
            <Flex alignItems='center' marginRight='16px'>
                <Tooltip content='Create folder at current location' openDelay={0} positioning={{ placement: 'top' }}>
                    <IconButton {...IconButtonStyle} onClick={() => setCreatingFileStagingFolder(true)}>
                        <PiFolderSimplePlusLight size={20} style={{ margin: '4px' }} />
                    </IconButton>
                </Tooltip>
                <Tooltip content='Reload current directory' openDelay={0} positioning={{ placement: 'top' }}>
                    <IconButton
                        onClick={() => {
                            handleReloadFileStagingTreeFolder(selectedFileStagingFolder?.data?.path?.slice(1));
                        }}
                        {...IconButtonStyle}
                    >
                        <PiArrowClockwise size={20} style={{ margin: '4px' }} />
                    </IconButton>
                </Tooltip>
                <FileUploadRootProvider value={fileUploadRootProviderAttributes}>
                    <FileUploadHiddenInput />
                    <Tooltip
                        content='Upload file to current directory'
                        openDelay={0}
                        positioning={{ placement: 'top' }}
                    >
                        <FileUploadTrigger asChild>
                            <IconButton {...IconButtonStyle}>
                                <PiUpload size={20} style={{ margin: '4px' }} />
                            </IconButton>
                        </FileUploadTrigger>
                    </Tooltip>
                </FileUploadRootProvider>
            </Flex>
        </Flex>
    );
}

const renderBreadcrumbItems = ({ fileStagingTree, handleFileStagingFolderClick, selectedFileStagingFolder }) => {
    const path = selectedFileStagingFolder?.data?.path;

    if (!path) {
        return null;
    }

    return path
        .split('/')
        .filter(Boolean)
        .map((folder, index, arr) => {
            const folderPath = `/${arr.slice(0, index + 1).join('/')}`;
            const folderData = fileStagingTree[folderPath];

            return (
                <BreadcrumbLink
                    key={folderPath}
                    onClick={() => handleFileStagingFolderClick(folderData)}
                    {...BreadcrumbLinkStyle}
                >
                    {folderData ? folderData.data.name : folder}
                </BreadcrumbLink>
            );
        });
};

const IconButtonStyle = {
    variant: 'subtle',
    colorPalette: 'gray',
    size: 'auto',
    borderRadius: '6px',
    margin: '5px',
};

const BreadcrumbRootStyle = {
    separator: '>',
    padding: '10px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
};

const BreadcrumbLinkStyle = {
    fontWeight: 'bold',
    fontSize: 'lg',
    _hover: {
        color: 'yellow.300',
        textDecoration: 'underline',
        cursor: 'pointer',
    },
};
