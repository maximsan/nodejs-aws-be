import {BadRequest} from "../../../shared/error/BadRequest";

export const validate = (schema, data) => {
    const {error} = schema.validate(data);
    console.log('error', error);

    if (error) {
        const {details} = error;
        console.log('error.details', details)
        const message = details.map(i => i.message).join(',');

        throw new BadRequest(message);
    }
}
