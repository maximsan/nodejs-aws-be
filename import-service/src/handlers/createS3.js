import {S3} from "aws-sdk";

const s3params = {
    region: 'eu-west-1'
}

export const createS3 = () => {
    return new S3(s3params);
}
