const test = 'fasdf'; //ignoreline

console.log('lkasdjfljflsdjf');

interface CaptionTrack {
  baseUrl: string;
}

type Transcript = {
  start: string;
  text: string;
}[];

let transcripts: undefined | Transcript[];

//inject the getting caption tracks script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('get_caption_tracks.js');
(document.head || document.documentElement).appendChild(script);

chrome.runtime.onMessage.addListener(async (msg, sender, res) => {
  if (msg.action !== 'load') {
    res({message: `action not found ${msg.action}`});
    return;
  }
  res(transcripts);
});

document.addEventListener('captionTracks', async (event) => {
  const typedEvent: CustomEvent = <CustomEvent>event;
  transcripts = await getTranscripts(typedEvent.detail.captionTracks);
  console.log(transcripts);
});

const getTranscripts = async (captionTracks: CaptionTrack[]) => {
  const allTracks = await Promise.all(
    captionTracks.map(async (track) => {
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

const filterSpecialSymbols = (text: string) => {
  const specialSymbols = ['&amp;quot;', '&amp;#39;'];
  const filtered = ['"', "'"];
  specialSymbols.forEach((symbol, index) => {
    text = text.replace(new RegExp(symbol, 'g'), filtered[index]);
  });
  return text;
};
