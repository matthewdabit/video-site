# Serverless Video Site

# Functionality of the application

This application will allow creating/removing/updating/fetching Videos. Each Video item can optionally have an attachment video. Each user only has access to Videos that he/she has created.

# Video items

The application should store Videos, and each Video contains the following fields:

* `videoId` (string) - a unique id for an item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - name of a video (e.g. "How to change a light bulb")
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a video


# Functions to be implemented

To implement this project, you need to implement the following functions and configure them in the `serverless.yml` file:

* `Auth` - this function should implement a custom authorizer for API Gateway that should be added to all other functions.

* `GetVideos` - should return all videos for a current user. A user id can be extracted from a JWT token that is sent by the frontend

It should return data that looks like this:

```json
{
  "items": [
    {
      "videoId": "123",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "vid 1",
      "attachmentUrl": "http://example.com/image.png"
    },
    {
      "videoId": "456",
      "createdAt": "2019-07-27T20:01:45.424Z",
      "name": "vid 2",
      "attachmentUrl": "http://example.com/image.png"
    }
  ]
}
```

* `CreateVideo` - should create a new Video for a current user. A shape of data send by a client application to this function can be found in the `CreateVideoRequest.ts` file

It receives a new Video to be created in JSON format that looks like this:

```json
{
  "createdAt": "2019-07-27T20:01:45.424Z",
  "name": "vid 1",
  "attachmentUrl": "http://example.com/image.png"
}
```

It should return a new video that looks like this:

```json
{
  "item": {
    "videoId": "123",
    "createdAt": "2019-07-27T20:01:45.424Z",
    "name": "vid 1",
    "attachmentUrl": "http://example.com/image.png"
  }
}
```

* `UpdateVideo` - should update a video created by a current user. A shape of data send by a client application to this function can be found in the `UpdateVideoRequest.ts` file

It receives an object that contains three fields that can be updated in a video:

```json
{
  "name": "Video 1"
}
```

The id of an item that should be updated is passed as a URL parameter.

It should return an empty body.

* `DeleteVideo` - should delete a video created by a current user. Expects an id of a video to remove.

It should return an empty body.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a video.

It should return a JSON object that looks like this:

```json
{
  "uploadUrl": "https://s3-bucket-name.s3.eu-west-2.amazonaws.com/image.png"
}
```

All functions are already connected to appropriate events from API Gateway.

An id of a user can be extracted from a JWT token passed by a client.

You also need to add any necessary resources to the `resources` section of the `serverless.yml` file such as DynamoDB table and S3 bucket.


# Frontend

The `client` folder contains a web application that can use the API that should be developed in the project.

This frontend should work with your serverless application once it is developed, you don't need to make any changes to the code. The only file that you need to edit is the `config.ts` file in the `client` folder. This file configures your client application just as it was done in the course and contains an API endpoint and Auth0 configuration:

```ts
const apiId = '...' API Gateway id
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  domain: '...',    // Domain from Auth0
  clientId: '...',  // Client id from an Auth0 application
  callbackUrl: 'http://localhost:3000/callback'
}
```

## Authentication

To implement authentication in your application, you would have to create an Auth0 application and copy "domain" and "client id" to the `config.ts` file in the `client` folder. We recommend using asymmetrically encrypted JWT tokens.

## Logging

The starter code comes with a configured [Winston](https://github.com/winstonjs/winston) logger that creates [JSON formatted](https://stackify.com/what-is-structured-logging-and-why-developers-need-it/) log statements. You can use it to write log messages like this:

```ts
import { createLogger } from '../../utils/logger'
const logger = createLogger('auth')

// You can provide additional information with every log statement
// This information can then be used to search for log statements in a log storage system
logger.info('User was authorized', {
  // Additional information stored with a log statement
  key: 'value'
})
```

# How to run the application

## Backend

To deploy an application run the following commands:

```
cd backend
npm install
sls deploy -v
```

## Frontend

To run a client application first edit the `client/src/config.ts` file to set correct parameters. And then run the following commands:

```
cd client
npm install
npm run start
```

This should start a development server with the React application that will interact with the serverless video application.
