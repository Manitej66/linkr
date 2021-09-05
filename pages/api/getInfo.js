import * as yt from "youtube-info-streams";

export default async function handler(req, res) {
  const { url } = req.query;

  // extract youtube video id  from url using regex
  const videoId = url.match(
    /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
  );

  const { videoDetails: video } = await yt.info(videoId[1]);

  res.status(200).json({
    thumbnail: video.thumbnail.thumbnails,
    title: video.title,
    description: video.description,
  });
}