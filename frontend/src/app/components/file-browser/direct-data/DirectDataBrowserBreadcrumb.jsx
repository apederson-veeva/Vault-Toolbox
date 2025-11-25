import { Flex } from '@chakra-ui/react';
import { BreadcrumbLink, BreadcrumbRoot } from '../../shared/ui-components/breadcrumb';

export default function DirectDataBrowserBreadcrumb({ selectedDirectDataFolder }) {
    const breadcrumbLabel = selectedDirectDataFolder?.data?.name || 'Full';

    return (
        <Flex width='100%' alignItems='center' justifyContent='space-between'>
            <BreadcrumbRoot {...BreadcrumbRootStyle}>
                <BreadcrumbLink {...BreadcrumbLinkStyle}>{breadcrumbLabel}</BreadcrumbLink>
            </BreadcrumbRoot>
        </Flex>
    );
}

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
