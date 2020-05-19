import 'source-map-support/register'
import * as AWS from 'aws-sdk'


const bucketName = process.env.VIDEOS_ATTACHMENT_S3_BUCKET;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3 = new AWS.S3({
  signatureVersion: 'v4'
});

export function createVideoUrl(videoId: string) {
  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: videoId,
    Expires: urlExpiration
  });

  const s3Url = `https://${bucketName}.s3.amazonaws.com/${videoId}`;

  return {
    uploadUrl,
    s3Url
  }
}
