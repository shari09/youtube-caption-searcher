const test = 'fasdf'; //ignoreline

console.log('lkasdjfljflsdjf');
let transcripts = [];

//inject the getting caption tracks script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('get_caption_tracks.js');
(document.head || document.documentElement).appendChild(script);

chrome.runtime.onMessage.addListener(async (msg, sender, res) => {
  if (msg.action !== 'search') {
    res({message: `action not found ${msg.action}`});
    return;
  }

  console.log('received');
  res({message: 'done'});
});

document.addEventListener('captionTracks', async (event) => {
  transcripts = await getTranscripts(event.detail.captionTracks);
  console.log(transcripts);
});

const getTranscripts = async (captionTrackInfos) => {
  const allTracks = await Promise.all(
    captionTrackInfos.map(async (track) => {
      const xmlTrack = await fetch(track.baseUrl, {
        method: 'GET',
        headers: {
          Accept: 'text/xml',
        },
      });
      let transcript = filterSpecialSymbols(await xmlTrack.text());
      const captions = [];

      const captionRegex = /<text start="(.*?)" dur=".*?">(.*?)<\/text>/g;
      let captionMatch = captionRegex.exec(transcript);
      while (captionMatch) {
        captions.push({
          start: captionMatch[1],
          text: captionMatch[2],
        });
        captionMatch = captionRegex.exec(transcript);
      }

      return captions;
    }),
  );
  return allTracks;
};

const filterSpecialSymbols = (text) => {
  const specialSymbols = ['&amp;quot;', '&amp;#39;'];
  const filtered = ['"', "'"];
  specialSymbols.forEach((symbol, index) => {
    text = text.replace(new RegExp(symbol, 'g'), filtered[index]);
  });
  return text;
};
