export const createResponse = (statusCode, data) => {
    let body = data;
    if(typeof data !== "string") {
        body = JSON.stringify(body);
    }

    return {
        statusCode,
        body,
    }
}
