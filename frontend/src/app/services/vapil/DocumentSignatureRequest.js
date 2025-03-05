import { getAuthorizationHeader } from '../ApiService.js';
import { getAPIEndpoint, request, RequestMethod } from './VaultRequest.js';

const URL_DOCUMENT_SIGNATURE_METADATA = '/metadata/query/documents/relationships/document_signature__sysr';

/**
 * Retrieve all metadata for signatures on documents.
 * @returns DocumentSignatureMetadataResponse, ResponseHeaders
 */
export async function retrieveDocumentSignatureMetadata() {
    const url = getAPIEndpoint(URL_DOCUMENT_SIGNATURE_METADATA);

    const headers = await getAuthorizationHeader();
    const method = RequestMethod.GET;

    const requestOptions = {
        headers,
        method,
    };

    const retrieveDocumentSignatureMetadataResponse = await request(url, requestOptions);
    const responseHeaders = retrieveDocumentSignatureMetadataResponse?.headers;
    const response = await retrieveDocumentSignatureMetadataResponse.json();

    return { response, responseHeaders };
}
