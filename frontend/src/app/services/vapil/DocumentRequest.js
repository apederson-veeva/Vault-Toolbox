import { getAuthorizationHeader } from '../ApiService.js';
import { getAPIEndpoint, request, RequestMethod } from './VaultRequest.js';

const URL_DOC_TYPES = '/metadata/objects/documents/types';
const URL_DOC_ALL_FIELDS = '/metadata/objects/documents/properties';

/**
 * Retrieve all document types. These are the top-level of the document
 * type/subtype/classification hierarchy.
 * @returns DocumentTypesResponse, ResponseHeaders
 */
export async function retrieveAllDocumentTypes() {
    const url = getAPIEndpoint(URL_DOC_TYPES);

    const headers = await getAuthorizationHeader();
    const method = RequestMethod.GET;

    const requestOptions = {
        headers,
        method,
    };

    const retrieveAllDocumentTypesResponse = await request(url, requestOptions);
    const responseHeaders = retrieveAllDocumentTypesResponse?.headers;
    const response = await retrieveAllDocumentTypesResponse.json();

    return { response, responseHeaders };
}

/**
 * Retrieve all document fields. Retrieve all standard and custom document fields and field properties.
 * @returns DocumentFieldResponse, ResponseHeaders
 */
export async function retrieveAllDocumentFields() {
    const url = getAPIEndpoint(URL_DOC_ALL_FIELDS);

    const headers = await getAuthorizationHeader();
    const method = RequestMethod.GET;

    const requestOptions = {
        headers,
        method,
    };

    const retrieveAllDocumentFieldsResponse = await request(url, requestOptions);
    const responseHeaders = retrieveAllDocumentFieldsResponse?.headers;
    const response = await retrieveAllDocumentFieldsResponse.json();

    return { response, responseHeaders };
}
