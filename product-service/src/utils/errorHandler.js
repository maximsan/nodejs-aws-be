import {NotFoundError} from "../NotFoundError";


export const errorHandler = (error) => {
    if (error instanceof NotFoundError) {
        return {
            statusCode: 404,
            message: error.message,
        }
    }
    return {
        statusCode: 500,
        message: error.message
    }
}
