import 'source-map-support/register';

import {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';

import {CreateVideoRequest} from '../../requests/CreateVideoRequest';
import * as middy from 'middy';
import {cors} from 'middy/middlewares';

import {getUserId} from "../../auth/utils";
import {createVideo} from "../service/videoService";

import { createLogger } from '../../utils/logger'

const logger = createLogger('createVideo');

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
          const parsedBody: CreateVideoRequest = JSON.parse(event.body);

          try {
              const newVideo = await createVideo(getUserId(event), parsedBody);

              return {
                    statusCode: 201,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Credentials': true
                    },
                    body: JSON.stringify({
                        item: newVideo
                    })
              };
          } catch (e) {
                logger.info('Failed to update video', e);
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
