import {Client} from 'pg';

const {DB_DATABASE, DB_HOST, DB_PASSWORD, DB_PORT, DB_USERNAME} = process.env;

const options = {
    database: DB_DATABASE,
    host: DB_HOST,
    port: DB_PORT,
    password: DB_PASSWORD,
    username: DB_USERNAME
}

export const runDB = async () => {
    const client = new Client(options);
    try {
        await client.connect();
    } catch (e) {
        console.error(`Error during db connection establishing - ${e}`)
    } finally {
        client.end();
    }

    return client;
}
