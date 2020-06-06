const YOUTUBE_API_KEY = 'ignoreljljl'; //ignoreline

console.log('lkasdjfljflsdjf');

chrome.runtime.onMessage.addListener((msg, sender, res) => {
  if (msg.action === 'search') {
    const videoId = getVideoId(msg.url);
    getCaption(videoId);
  } else {
    res({message: `action not found ${msg.action}`});
  }
  res({message: 'done'});
});

const getVideoId = (url) => {
  const matcher = /www\.youtube\.com\/watch\?v=(.*?)(&|$)/;
  const matches = matcher.exec(url);
  return matches[1];
};

const getCaption = async (videoId) => {
  const url = new URL('https://www.googleapis.com/youtube/v3/captions');
  const params = {
    videoId: videoId,
    part: 'id',
    key: YOUTUBE_API_KEY,
  };
  url.search = new URLSearchParams(params).toString();

  try {
    const captionTracks = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });
    console.log(captionTracks);
  } catch (e) {
    console.log(e);
  }
};
