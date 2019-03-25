const AWS = require('aws-sdk');
const region = process.argv[3] || 'us-west-2';
AWS.config.update({region: region});
const s3 = new AWS.S3();
const cf = new AWS.CloudFront();

function createBucket(bucketName, region) {
  let params = {
    Bucket: bucketName,
    ACL: 'public-read',
    CreateBucketConfiguration: {
      LocationConstraint: region,
    }
  };

  return s3
    .createBucket(params)
    .promise()
    .then(({ Location: bucketLocation }) => {
      return bucketName; // Lose extra object wrapper.
    });
}

function setCors(bucketName) {
  let params = {
    Bucket: bucketName,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedHeaders: ['Authorization'],
          AllowedMethods: ['GET'],
          AllowedOrigins: ['*'],
          MaxAgeSeconds: 3000,
        },
      ],
    },
  };
  return s3.putBucketCors(params).promise();
}

function setBucketPolicy(bucketName) {
  let params = {
    Bucket: bucketName,
    Policy: JSON.stringify({
      Version: '2012-10-17',
      Statement: [
        {
          Sid: 'AddPerm',
          Effect: 'Allow',
          Principal: '*',
          Action: 's3:GetObject',
          Resource: `arn:aws:s3:::${bucketName}/*`,
        },
      ],
    }),
  };
  return s3.putBucketPolicy(params).promise();
}

function configureWebsite(bucketName) {
  let params = {
    Bucket: bucketName,
    WebsiteConfiguration: {
      ErrorDocument: {
        Key: 'index.html',
      },
      IndexDocument: {
        Suffix: 'index.html',
      },
    },
  };
  return s3.putBucketWebsite(params).promise();
}

if (!process.argv[2]) {
  console.error('Bucket name is a required argument.');
  process.exit(-1);
}


const bucket = process.argv[2];

createBucket(bucket, region)
  .then(() => {
    return setCors(bucket).catch(err => {
      console.error('Unable to create bucket.');
      console.error(err);
      process.exit(-1);
    });
  })
  .then(() => {
    return setBucketPolicy(bucket).catch(err => {
      console.error('Unable to set bucket policy.');
      console.error(err);
      process.exit(-1);
    });
  })
  .then(() => {
    return configureWebsite(bucket).catch(err => {
      console.error('Unable to configure website settings.');
      console.error(err);
      process.exit(-1);
    });
  })
  .then(() => {
    console.log(
      `Created bucket ${bucket}, and configured it for static website hosting.`,
    );
    console.log(`url: http://${bucket}.s3-website-${region}.amazonaws.com`);
    return true;
  })
  .catch(err => {
    console.error(`Unable to create ${bucket}.`);
    console.error(err);
    process.exit(-1);
  });
