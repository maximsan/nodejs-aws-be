import {NotFoundError} from "./NotFoundError";
import {BadRequest} from "./BadRequest";
import {createResponse} from "./createResponse";

export const errorHandler = (error) => {
    console.log(`error in errorHandler ${JSON.stringify(error)}`);

    if (error instanceof NotFoundError) {
        return createResponse(404, error.message);
    }
    if (error instanceof BadRequest) {
        return createResponse(400, error.message);
    }

    return createResponse(500, error.message);
}
