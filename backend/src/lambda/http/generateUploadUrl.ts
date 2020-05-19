import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda'
import * as middy from 'middy';
import {cors} from 'middy/middlewares';
import {createVideoUrl} from "../s3/createVideoUrl";
import {updateVideoUploadUrl} from "../service/videoService";


export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const videoId = event.pathParameters.videoId;
    const { uploadUrl, s3Url } = createVideoUrl(videoId);

    try {
        await updateVideoUploadUrl(videoId, s3Url);

        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
          body: JSON.stringify({
            uploadUrl
          })
        }
      } catch (error) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            error: `Unable to upload video for item ${videoId}`
          })
        }
      }
  }
);


handler.use(
  cors({
    credentials: true
  })
);
