import {CATALOG_ITEMS_ADD_SUBSCRIPTION} from "./config";
import {SNS} from "aws-sdk";


export class SnsService {
    async send(message) {
        const sns = new SNS({region: 'eu-west-1'});

        try {
            const snsParams = {
                Subject: `Product was added`,
                Message: JSON.stringify(message),
                TopicArn: CATALOG_ITEMS_ADD_SUBSCRIPTION,
            };

            await sns.publish(snsParams).promise();
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
