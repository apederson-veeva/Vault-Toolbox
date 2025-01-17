import { getAuthorizationHeader } from '../ApiService.js';
import {
    getAPIEndpoint,
    getPaginationEndpoint,
    HTTP_CONTENT_TYPE_JSON,
    HTTP_HEADER_ACCEPT,
    HTTP_HEADER_CONTENT_TYPE,
    request,
    RequestMethod,
} from './VaultRequest.js';

const URL_FILE_STAGING_LIST_ITEMS_IN_PATH = '/services/file_staging/items/';
const URL_FILE_STAGING_GET_ITEM_CONTENT = '/services/file_staging/items/content/';
const URL_FILE_STAGING_CREATE_FILE_OR_FOLDER = '/services/file_staging/items';

/**
 * Return a list of files and folders for the specified path.
 * Paths are different for Admin users (Vault Owners and System Admins) and non-Admin users.
 * @param {String} item - the file path of the item
 * @param {Boolean} recursive - If true, the response will contain the contents of all subfolders. If not specified, the default value is false.
 * @returns FileStagingItemBulkResponse, ResponseHeaders
 */
export async function listItemsAtAPath(item, recursive = false) {
    let url = getAPIEndpoint(`${URL_FILE_STAGING_LIST_ITEMS_IN_PATH}${item}`);

    if (recursive) {
        url += `?recursive=${recursive}`;
    }

    const headers = await getAuthorizationHeader();
    const method = RequestMethod.GET;

    const requestOptions = {
        headers,
        method,
    };

    const listItemsAtAPathResponse = await request(url, requestOptions);
    const responseHeaders = listItemsAtAPathResponse?.headers;
    const response = await listItemsAtAPathResponse.json();

    return { response, responseHeaders };
}

/**
 * Return a list of files and folders for the specified page url.* Paths are different for Admin users (Vault Owners and System Admins) and non-Admin users.
 * @param {String} pageUrl - full path to the page (including https://{vaultDNS}/api/{version}/)
 * @returns FileStagingItemBulkResponse, ResponseHeaders
 */
export async function listItemsAtAPathByPage(pageUrl) {
    let url = getPaginationEndpoint(pageUrl);

    const headers = await getAuthorizationHeader();
    const method = RequestMethod.GET;

    const requestOptions = {
        headers,
        method,
    };

    const listItemsAtAPathByPageResponse = await request(url, requestOptions);
    const responseHeaders = listItemsAtAPathByPageResponse?.headers;
    const response = await listItemsAtAPathByPageResponse.json();

    return { response, responseHeaders };
}

/**
 * Retrieve the content of a specified file from the file staging server.
 * Use the Range header to create resumable downloads for large files, or to continue downloading a file if your session is interrupted.
 * @param {String} item - the file path of the item
 * @returns VaultResponse, ResponseHeaders
 */
export async function downloadItemContent(item) {
    const url = getAPIEndpoint(`${URL_FILE_STAGING_GET_ITEM_CONTENT}${item}`);

    const headers = await getAuthorizationHeader();
    const method = RequestMethod.GET;

    const requestOptions = {
        headers,
        method,
    };

    const downloadItemContentResponse = await request(url, requestOptions);
    const responseHeaders = downloadItemContentResponse?.headers;

    let response;
    if (responseHeaders.get(HTTP_HEADER_CONTENT_TYPE).startsWith('application/octet-stream')) {
        response = await downloadItemContentResponse.blob();
    } else {
        response = await downloadItemContentResponse.json();
    }

    return { response, responseHeaders };
}

/**
 * Upload files or folders up to 50MB to the File Staging Server.
 * @param {String} kind - the type of the item, either FILE or FOLDER
 * @param {String} path - path of the item
 * @returns - FileStagingItemResponse, ResponseHeaders
 */
export async function createFolderOrFile(kind, path) {
    const url = getAPIEndpoint(URL_FILE_STAGING_CREATE_FILE_OR_FOLDER);
    const authorizationHeader = await getAuthorizationHeader();

    const headers = {
        ...authorizationHeader,
        [HTTP_HEADER_ACCEPT]: [HTTP_CONTENT_TYPE_JSON],
    };
    const method = RequestMethod.POST;

    const formdata = new FormData();
    formdata.append('kind', kind);
    formdata.append('path', path);

    const requestOptions = {
        headers,
        method,
        body: formdata,
    };

    const createFolderOrFileResponse = await request(url, requestOptions);
    const responseHeaders = createFolderOrFileResponse?.headers;
    const response = await createFolderOrFileResponse.json();

    return { response, responseHeaders };
}
