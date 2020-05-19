import * as AWS from 'aws-sdk'
import {VideoItem} from "../../models/VideoItem";


export class VideosDB {
  constructor(
    private readonly docClient = new AWS.DynamoDB.DocumentClient(),
    public readonly videosTable = process.env.VIDEOS_TABLE,
    public readonly userIdIndex = process.env.USER_ID_INDEX
  ) {}

  async getUserVideos(userId: string): Promise<VideoItem[]> {
    const result = await this.docClient
      .query({
        TableName: this.videosTable,
        IndexName: this.userIdIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        },
        ScanIndexForward: false
      })
      .promise();

    return result.Items as VideoItem[]
  }

  async createVideo(newVideoItem: VideoItem) {
    return await this.docClient
      .put({
        TableName: this.videosTable,
        Item: newVideoItem
      })
      .promise()
  }

  async deleteVideo(videoId: string) {
    await this.docClient
      .delete({
        Key: {
          videoId: videoId
        },
        TableName: this.videosTable
      })
      .promise()
  }

  async updateVideoItem(updatedVideoItem) {
    return this.docClient.update(updatedVideoItem).promise()
  }
}

