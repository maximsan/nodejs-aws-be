import {setHeaders} from "./setHeaders";

export const createResponse = (status, body) => {
    return {
        statusCode: status,
        body: JSON.stringify(body),
        headers: setHeaders(),
    }
}
