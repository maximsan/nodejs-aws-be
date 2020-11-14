export const createResponse = (status, data) => {
    let body = data;
    if(typeof data !== "string") {
        body = JSON.stringify(body);
    }

    return {
        statusCode: status,
        body,
    }
}
