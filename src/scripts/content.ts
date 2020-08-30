import {Transcript, CaptionTrack} from '../common/types';

const test = 'fasdf'; //ignoreline
console.log(test);
console.log('content script loaded');

let transcripts: undefined | Transcript[];

//inject the getting caption tracks script
const script = document.createElement('script');
script.src = chrome.runtime.getURL('scripts/inject.js');
(document.head || document.documentElement).appendChild(script);


//return true indicates async
chrome.runtime.onMessage.addListener(async (msg, sender, res) => {
  switch (msg.action) {
    case 'load':
      res(transcripts);
      return true;
    case 'jumpToTime':
      document.dispatchEvent(
        new CustomEvent('jumpToTime', {
          detail: {time: msg.data.time}, //the time to jump to
        }),
      );
      res({message: 'success'});
      break;
    default:
      res({message: `action not found ${msg.action}`});
      break;
  }
  return false;
});

document.addEventListener('captionTracks', async (event) => {
  const typedEvent: CustomEvent = <CustomEvent>event;
  if (typedEvent.detail === null) {
    transcripts = [];
    return;
  }
  transcripts = await getTranscripts(typedEvent.detail.captionTracks);
  console.log('content', transcripts);
});

const getTranscripts = async (
  captionTracks: CaptionTrack[],
): Promise<Transcript[]> => {
  const transcripts = await Promise.all(
    captionTracks.map(
      async (track: CaptionTrack): Promise<Transcript> => {
        const xmlTrack = await fetch(track.baseUrl, {
          method: 'GET',
          headers: {
            Accept: 'text/xml',
          },
        });
        let xmlText = filterSpecialSymbols(await xmlTrack.text());
        const transcript: Transcript = {
          language: track.name.simpleText,
          timedText: [],
        };

        const captionRegex = /<text start="(.*?)" dur=".*?">(.*?)<\/text>/g;
        let captionMatch = captionRegex.exec(xmlText);
        while (captionMatch) {
          transcript.timedText.push({
            start: Number(captionMatch[1]),
            text: captionMatch[2],
          });
          captionMatch = captionRegex.exec(xmlText);
        }
        return transcript;
      },
    ),
  );
  return transcripts;
};

const filterSpecialSymbols = (text: string) => {
  const specialSymbols = ['&amp;quot;', '&amp;#39;'];
  const filtered = ['"', "'"];
  specialSymbols.forEach((symbol, index) => {
    text = text.replace(new RegExp(symbol, 'g'), filtered[index]);
  });
  return text;
};
