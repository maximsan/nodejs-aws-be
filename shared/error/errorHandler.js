import {NotFoundError} from "./NotFoundError";
import {createResponse} from "../createResponse";

export const errorHandler = (error) => {
    if (error instanceof NotFoundError) {
        return createResponse(404, error.message);
    }

    return createResponse(500, error.message);
}
