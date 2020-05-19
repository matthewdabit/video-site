import 'source-map-support/register'

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

import {UpdateVideoRequest} from '../../requests/UpdateVideoRequest'
import * as middy from 'middy';
import {cors} from 'middy/middlewares';
import {updateVideo} from "../service/videoService";


export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const videoId = event.pathParameters.videoId;
      const updatedVideo: UpdateVideoRequest = JSON.parse(event.body);

      try {
          await updateVideo(videoId, updatedVideo);
          return {
            statusCode: 200,
            headers: {
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Credentials': true
            },
            body: JSON.stringify({
              item: updatedVideo
            })
          }
        } catch (error) {
          return {
            statusCode: 404,
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: ''
          }
        }
    }
);

handler.use(
  cors({
    credentials: true
  })
);
