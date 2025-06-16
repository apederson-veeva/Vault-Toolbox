import { Link, IconButton } from '@chakra-ui/react';
import { PiQuestion } from 'react-icons/pi';
import { Tooltip } from './ui-components/tooltip';

export default function ContextualHelpButton({ tooltip, url }) {
    return (
        <Tooltip content={tooltip} openDelay={0} positioning={{ placement: 'left' }}>
            <Link href={url} target='_blank' rel='noopener noreferrer'>
                <IconButton borderRadius='full' aria-label='Help button' {...IconButtonStyle}>
                    <PiQuestion style={{ width: 24, height: 24 }} />
                </IconButton>
            </Link>
        </Tooltip>
    );
}

const IconButtonStyle = {
    marginBottom: '10px',
    variant: 'ghost',
};
