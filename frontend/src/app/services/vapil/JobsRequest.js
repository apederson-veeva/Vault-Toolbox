import { getAuthorizationHeader } from '../ApiService.js';
import { getAPIEndpoint, HTTP_CONTENT_TYPE_JSON, HTTP_HEADER_ACCEPT, request, RequestMethod } from './VaultRequest.js';

const URL_RETRIEVE_JOB_STATUS = '/services/jobs/{JOB_ID}';

/**
 * Retrieve Job Status
 *
 * After submitting a request, you can query your vault to determine the status of the request. To do this, you must
 * have a valid job_id for a job previously requested through the API.
 *
 * The Job Status endpoint can only be requested once every 10 seconds. When this limit is reached, Vault returns
 * API_LIMIT_EXCEEDED.
 *
 * @returns - JobStatusResponse, ResponseHeaders
 * @param jobId
 */
export async function retrieveJobStatus(jobId) {
    let url = getAPIEndpoint(URL_RETRIEVE_JOB_STATUS.replace('{JOB_ID}', jobId), true);
    const authorizationHeader = await getAuthorizationHeader();

    const headers = {
        ...authorizationHeader,
        [HTTP_HEADER_ACCEPT]: [HTTP_CONTENT_TYPE_JSON],
    };
    const method = RequestMethod.GET;

    const requestOptions = {
        headers,
        method,
    };

    const retrieveJobStatusResponse = await request(url, requestOptions);
    const responseHeaders = retrieveJobStatusResponse?.headers;
    const response = await retrieveJobStatusResponse.json();

    return { response, responseHeaders };
}
