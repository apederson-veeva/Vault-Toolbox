import { BreadcrumbLink, BreadcrumbRoot } from '../shared/ui-components/breadcrumb';
import { Toaster } from '../shared/ui-components/toaster';
import { Tooltip } from '../shared/ui-components/tooltip';
import { FileUploadHiddenInput, FileUploadRootProvider, Flex, IconButton } from '@chakra-ui/react';
import { PiArrowClockwise, PiUpload } from 'react-icons/pi';
import { FileUploadTrigger } from '../shared/ui-components/file-upload';

export default function FileStagingBrowserBreadcrumb({
    fileStagingTree,
    onSelect,
    selectedFolder,
    handleReloadFileStagingTreeFolder,
    fileUploadRootProviderAttributes,
}) {
    const breadcrumbItems = selectedFolder.data.path
        .split('/')
        .filter(Boolean)
        .map((folder, index, arr) => {
            const folderPath = `/${arr.slice(0, index + 1).join('/')}`;
            const folderData = fileStagingTree[folderPath];

            return (
                <BreadcrumbLink key={folderPath} onClick={() => onSelect(folderData)} {...BreadcrumbLinkStyle}>
                    {folderData ? folderData.data.name : folder}
                </BreadcrumbLink>
            );
        });

    return (
        <Flex width='100%' alignItems='center' justifyContent='space-between'>
            <BreadcrumbRoot {...BreadcrumbRootStyle}>
                <BreadcrumbLink onClick={() => onSelect(fileStagingTree['/'])} {...BreadcrumbLinkStyle}>
                    /
                </BreadcrumbLink>
                {breadcrumbItems}
            </BreadcrumbRoot>
            <Toaster />
            <Flex alignItems='center' marginRight='16px'>
                <Tooltip content='Reload current directory' openDelay={0} positioning={{ placement: 'top' }}>
                    <IconButton
                        // onClick={() => handleReloadFileStagingTree(() => selectedFolder && onSelect?.(selectedFolder))}
                        onClick={() => handleReloadFileStagingTreeFolder(selectedFolder.data.path.slice(1))}
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
