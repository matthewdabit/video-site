import 'source-map-support/register';
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import {deleteVideo} from "../service/videoService";


export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
      const videoId = event.pathParameters.videoId;

      try {
        await deleteVideo(videoId);
        return {
          statusCode: 200,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: ''
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
      credentials: true,
    })
);
