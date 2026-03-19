import { useEffect, useState } from 'react';
import { toaster } from '../../components/shared/ui-components/toaster';
import { useAuth } from '../../context/AuthContext';
import { invokeAwsLambdaFunction, query } from '../../services/ApiService';

export default function useDataTools() {
    const [dataType, setDataType] = useState('ALL');
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [submittingCountJob, setSubmittingCountJob] = useState(false);
    const [submittingDeleteJob, setSubmittingDeleteJob] = useState(false);
    const [vaultToolboxPath, setVaultToolboxPath] = useState(null);

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

    /**
     * Determines the path to the Vault Toolbox - Unhinged Edition folder on File Staging. For admin users this is under their user folder
     * (e.g. u123456/VaultToolbox); for non-admin users this is at the root.
     * @param userId - ID of current user
     * @returns {Promise<string>}
     */
    const getVaultToolboxPath = async () => {
        const userId = sessionStorage.getItem('userId');

        // If we can't determine it or get an error, default to using the admin-based file path
        let toolboxFolderPath = `u${userId}/VaultToolbox`;

        const { queryResponse } = await query(`SELECT security_profile__v
                                               FROM users
                                               WHERE id = '${userId}'`);

        if (queryResponse?.responseStatus !== 'FAILURE' && queryResponse?.data?.length > 0) {
            const securityProfile = queryResponse?.data[0]?.security_profile__v;
            const adminProfiles = ['vault_owner__v', 'system_admin__v'];
            if (!adminProfiles.includes(securityProfile)) {
                toolboxFolderPath = `VaultToolbox`;
            }
        }

        setVaultToolboxPath(toolboxFolderPath);
    };

    /*
        On page load, determine the file staging path that we'll read/write from
     */
    useEffect(() => {
        getVaultToolboxPath();
    }, []);

    return {
        countData,
        deleteData,
        vaultToolboxPath,
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
