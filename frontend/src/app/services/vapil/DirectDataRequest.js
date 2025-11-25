import { getAuthorizationHeader } from '../ApiService.js';
import {
    getAPIEndpoint,
    HTTP_CONTENT_TYPE_JSON,
    HTTP_CONTENT_TYPE_OCTET_STREAM,
    HTTP_HEADER_ACCEPT,
    HTTP_HEADER_CONTENT_TYPE,
    request,
    RequestMethod,
} from './VaultRequest.js';

const URL_LIST_ITEMS = '/services/directdata/files';
const URL_DOWNLOAD_ITEM = '/services/directdata/files/{FILE_NAME}';

const EXTRACT_TYPE = 'extract_type';
const START_TIME = 'start_time';
const STOP_TIME = 'stop_time';

/**
 * Retrieve a list of all Direct Data files available for download.
 * @param extractType
 * @param startTime
 * @param stopTime
 * @returns DirectDataResponse, ResponseHeaders
 */
export async function retrieveAvailableDirectDataFiles(extractType, startTime, stopTime) {
    const url = new URL(getAPIEndpoint(URL_LIST_ITEMS));

    if (extractType) {
        url.searchParams.append(EXTRACT_TYPE, extractType);
    }
    if (startTime) {
        url.searchParams.append(START_TIME, startTime);
    }
    if (stopTime) {
        url.searchParams.append(STOP_TIME, stopTime);
    }

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

    const directDataFileListingResponse = await request(url.toString(), requestOptions);
    const responseHeaders = directDataFileListingResponse?.headers;
    const response = await directDataFileListingResponse.json();

    return { response, responseHeaders };
}

/**
 * Download a Direct Data file.
 * @param name
 * @returns VaultResponse, ResponseHeaders
 */
export async function downloadDirectDataFile(name) {
    const url = getAPIEndpoint(URL_DOWNLOAD_ITEM.replace('{FILE_NAME}', name));
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

    const downloadDirectDataFileResponse = await request(url, requestOptions);
    const responseHeaders = downloadDirectDataFileResponse?.headers;

    let response = null;
    if (responseHeaders.get(HTTP_HEADER_CONTENT_TYPE)?.startsWith(HTTP_CONTENT_TYPE_OCTET_STREAM)) {
        response = await downloadDirectDataFileResponse.blob();
    } else {
        response = await downloadDirectDataFileResponse.json();
    }

    return { response, responseHeaders };
}
