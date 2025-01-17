import { BreadcrumbItem, BreadcrumbLink, Breadcrumb } from '@chakra-ui/react';

export default function FileStagingBrowserBreadcrumb({ fileStagingTree, onSelect, selectedFolder }) {
    const breadcrumbItems = selectedFolder.data.path
        .split('/')
        .filter(Boolean)
        .map((folder, index, arr) => {
            const folderPath = `/${arr.slice(0, index + 1).join('/')}`;
            const folderData = fileStagingTree[folderPath];

            return (
                <BreadcrumbItem key={folderPath}>
                    <BreadcrumbLink onClick={() => onSelect(folderData)} {...BreadcrumbLinkStyle}>
                        {folderData ? folderData.data.name : folder}
                    </BreadcrumbLink>
                </BreadcrumbItem>
            );
        });

    return (
        <Breadcrumb {...BreadcrumbStyle}>
            <BreadcrumbItem>
                <BreadcrumbLink onClick={() => onSelect(fileStagingTree['/'])} {...BreadcrumbLinkStyle}>
                    /
                </BreadcrumbLink>
            </BreadcrumbItem>
            {breadcrumbItems}
        </Breadcrumb>
    );
}

const BreadcrumbStyle = {
    separator: '>',
    padding: '10px',
};

const BreadcrumbLinkStyle = {
    fontWeight: 'bold',
    fontSize: 'lg',
    _hover: {
        color: 'yellow.300',
        textDecoration: 'underline',
    },
};
