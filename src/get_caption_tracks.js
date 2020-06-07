const urlDecode = (encoded) => {
  return '{' + decodeURIComponent(encoded.replace(/\+/g, ' ')) + '}';
};

const captionTrackRegex = /"captionTracks":\[.*?\]/g;
const captionTrackMatch = captionTrackRegex.exec(
  ytplayer.config.args.player_response,
);
const captionTracks = captionTrackMatch
  ? JSON.parse(urlDecode(captionTrackMatch[0]))
  : null;

document.dispatchEvent(
  new CustomEvent('captionTracks', {
    detail: captionTracks,
  }),
);
