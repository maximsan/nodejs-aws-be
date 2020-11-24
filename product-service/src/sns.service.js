import {CATALOG_ITEMS_ADD_SUBSCRIPTION} from "./config";
import {SNS} from "aws-sdk";

const snsParams = {region: 'eu-west-1'}

export class SnsService {
    constructor() {
        this.sns = new SNS(snsParams);
    }

    async send(message) {
        console.log('sns service message', message);

        try {
            const snsParams = {
                Subject: `Product was added`,
                Message: JSON.stringify(message),
                TopicArn: CATALOG_ITEMS_ADD_SUBSCRIPTION,
                MessageAttributes: {
                    guitarPrice: {
                        DataType: "Number",
                        StringValue: message?.price.toString()
                    }
                }
            };

            return this.sns.publish(snsParams).promise();
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
