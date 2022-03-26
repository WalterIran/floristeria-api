const fs = require('fs');
const crypto = require('crypto');
const S3 = require('aws-sdk/clients/s3');
const { Readable } = require('stream');

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey
});

// uploads a file to s3
exports.uploadFile = (file) => {
    //const fileStream = fs.createReadStream(file.path)
    //const fileStream = fs.createReadStream(Readable.from(file.buffer.toString()));
    const fileType = file.mimetype.split('/')[1];
    const uploadParams = {
        Bucket: bucketName,
        Body: file.buffer,
        Key: `${crypto.randomBytes(12).toString("hex")}.${fileType}`
    }

    return s3.upload(uploadParams).promise();
}
