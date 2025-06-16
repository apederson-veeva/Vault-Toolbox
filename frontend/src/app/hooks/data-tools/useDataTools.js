import { useState } from 'react';
import { toaster } from '../../components/shared/ui-components/toaster';
import { useAuth } from '../../context/AuthContext';
import { invokeAwsLambdaFunction } from '../../services/ApiService';

export default function useDataTools() {
    const [dataType, setDataType] = useState('ALL');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [submittingCountJob, setSubmittingCountJob] = useState(false);
    const [submittingDeleteJob, setSubmittingDeleteJob] = useState(false);

    const { sessionId } = useAuth();

    /**
     * Initiates a Count Data job via the AWS Lambda backend
     */
    const countData = async () => {
        const params = {
            dataType,
            dataTypeSelections: selectedOptions.toString(),
            isAsync: true,
            tool: 'VAULT_DATA_TOOLS',
            action: 'COUNT_DATA',
            sessionId,
        };

        setSubmittingCountJob(true);
        const response = await invokeAwsLambdaFunction(params);
        setSubmittingCountJob(false);

        if (response?.responseStatus === 'SUCCESS') {
            toaster.create({
                title: 'Count Data Job Submitted',
                description: 'Upon completion, results will appear in the table.',
                type: 'success',
                duration: 3000,
            });
        } else {
            toaster.create({
                title: 'Count Data Job Submission Failed',
                description: response?.errors[0]?.message,
                type: 'error',
                duration: 10000,
            });
        }
    };

    /**
     * Initiates a Delete Data job via the AWS Lambda backend
     */
    const deleteData = async () => {
        const params = {
            dataType,
            dataTypeSelections: selectedOptions.toString(),
            isAsync: true,
            tool: 'VAULT_DATA_TOOLS',
            action: 'DELETE_DATA',
            sessionId,
        };

        setSubmittingDeleteJob(true);
        const response = await invokeAwsLambdaFunction(params);
        setSubmittingDeleteJob(false);

        if (response?.responseStatus === 'SUCCESS') {
            toaster.create({
                title: 'Delete Data Job Submitted',
                description: 'Upon completion, results will appear in the table.',
                type: 'success',
                duration: 3000,
            });
        } else {
            toaster.create({
                title: 'Delete Data Job Submission Failed',
                description: response?.errors[0]?.message,
                type: 'error',
                duration: 10000,
            });
        }
    };

    return {
        countData,
        deleteData,
        dataType,
        setDataType,
        selectedOptions,
        setSelectedOptions,
        submittingCountJob,
        setSubmittingCountJob,
        submittingDeleteJob,
        setSubmittingDeleteJob,
    };
}
