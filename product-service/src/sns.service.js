import {CATALOG_ITEMS_ADD_SUBSCRIPTION} from "./config";
import {SNS} from "aws-sdk";


export class SnsService {
    async send(messages) {
        const sns = new SNS({region: 'eu-west-1'});

        try {
            const snsParams = {
                Subject: `Product was added`,
                Message: JSON.stringify(messages),
                TopicArn: CATALOG_ITEMS_ADD_SUBSCRIPTION,
                MessageAttributes: {
                    guitarPrice: {
                        DataType: "Number",
                        StringValue: messages[0].price
                    }
                }
            };

            await sns.publish(snsParams).promise();
        } catch (error) {
            return Promise.reject(error);
        }
    }
}
