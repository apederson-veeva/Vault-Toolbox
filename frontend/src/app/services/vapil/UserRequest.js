import { getAuthorizationHeader } from '../ApiService.js';
import { getAPIEndpoint, request, RequestMethod } from './VaultRequest.js';

const URL_METADATA = '/metadata/objects/users';

/**
 * Retrieve User Metadata
 * Gets a full list of fields for users
 * @returns MetaDataUserResponse, ResponseHeaders
 */
export async function retrieveUserMetadata() {
    const url = getAPIEndpoint(URL_METADATA, true);

    const headers = await getAuthorizationHeader();
    const method = RequestMethod.GET;

    const requestOptions = {
        headers,
        method,
    };

    const retrieveUserMetadataResponse = await request(url, requestOptions);
    const responseHeaders = retrieveUserMetadataResponse?.headers;
    const responseStatus = retrieveUserMetadataResponse?.status;

    const response = await retrieveUserMetadataResponse.json();

    return { response, responseHeaders, responseStatus };
}
