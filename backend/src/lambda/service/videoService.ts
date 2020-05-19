import * as uuid from 'uuid';

import { VideosDB } from '../db/videoDB';
import {VideoItem} from "../../models/VideoItem";
import {CreateVideoRequest} from "../../requests/CreateVideoRequest";
import {UpdateVideoRequest} from "../../requests/UpdateVideoRequest";
import { createLogger } from '../../utils/logger'


const logger = createLogger('service')

const videosDB = new VideosDB();

export async function getAllVideos(userId: string): Promise<VideoItem[]> {
  return videosDB.getUserVideos(userId)
}

export async function createVideo(userId: string, newVideo: CreateVideoRequest) {
  const newVideoItem: VideoItem = {
    videoId: uuid.v4(),
    userId: userId,
    createdAt: new Date().toISOString(),
    ...newVideo
  };
  logger.info('creating new video item', newVideoItem);

  await videosDB.createVideo(newVideoItem);

  return newVideoItem
}

export async function deleteVideo(videoId: string) {
  return await videosDB.deleteVideo(videoId)
}

export async function updateVideo(
  videoId: string,
  updatedVideo: UpdateVideoRequest
) {
  const updatedVideoItem = {
    TableName: videosDB.videosTable,
    Key: {
      videoId: videoId
    },
    ExpressionAttributeNames: { '#name': 'name' },
    UpdateExpression: 'set #name = :name',
    ExpressionAttributeValues: {
        ':name': updatedVideo.name,
    },
    ReturnValues: 'UPDATED_NEW'
  };
  logger.info('updating video', updatedVideo);
  return await videosDB.updateVideoItem(updatedVideoItem)
}


export async function updateVideoUploadUrl(
  videoId: string,
  attachmentUrl: string
) {
  const updatedVideoItem = {
    TableName: videosDB.videosTable,
    Key: {
      videoId: videoId
    },
    UpdateExpression: 'set attachmentUrl=:attachmentUrl',
    ExpressionAttributeValues: {
      ':attachmentUrl': attachmentUrl
    },
    ReturnValues: 'UPDATED_NEW'
  };
    logger.info('updating VideoItem', updatedVideoItem);

  return await videosDB.updateVideoItem(updatedVideoItem)
}
