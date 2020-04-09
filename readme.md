Backend for https://hndigest.tumblr.com. Essentially, a serverless bot that scrapes hackernews frontpage every hour, and then aggregates and publishes a list of the top stories every day. Implemented with AWS Lambda for serverless computing, MongoDB for storage, AWS CloudWatch Rules for scheduling and The Serverless Framework for provisioning.

## Prerequisites

1. Node.js and npm. Go to the [Node.js website](https://nodejs.org/en/download/) and follow the installation instructions;
2. The Serverless Framework. Install it via npm using `npm install -g serverless` command;
3. AWS credentials. Follow [these instructions](https://serverless.com/framework/docs/providers/aws/guide/credentials/) on setting up AWS credentials.
4. Up and running MongoDB server. Install it by yourself or use managed solution like [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) - it's free.

## Get started

1. Install all dependencies for the project using `npm install` command;
2. Run tests using `npm test` command;
3. Adjust `serverless.yml` file to use a connection string to your MongoDB, Tumblr credentials and other properties as described in the file.
4. Deploy the app via CloudFormation using `serverless deploy` command
