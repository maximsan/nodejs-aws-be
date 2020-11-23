export const validate = (schema, data) => {
    const {error, value} = schema.validate(data);

    if (error) {
        const {details} = error;
        const message = details.map(i => i.message).join(',');

        console.log(`full error message: ${JSON.stringify(message)}`);
    } else {
        console.log(`return validated value: ${JSON.stringify(value)}`);
        return value
    }
}
