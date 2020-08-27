import 'chrome-extension-async';

//gets the ID of the current youtube tab
export const getActiveTabId = async (): Promise<number> => {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  console.log(tabs);
  if (!tabs) throw new Error('invalid active tab');
  if (!tabs[0].id) throw new Error('active tab id not found');
  return tabs[0].id;
};

// const urlDecode = (encoded: string) => {
//   return '{' + decodeURIComponent(encoded.replace(/\+/g, ' ')) + '}';
// };

//sends the caption tracks so the content script can access it
const sendCaptionTracks = () => {
  // const captionTrackRegex = /"captionTracks":\[.*?\]/g;
  // const captionTrackMatch = captionTrackRegex.exec(
  //   //@ts-ignore
  //   ytplayer.config.args.player_response,
  // );
  // const captionTracks = captionTrackMatch
  //   ? JSON.parse(urlDecode(captionTrackMatch[0]))
  //   : null;
  
  const captionTracks = {
    captionTracks:
      //@ts-ignore
      window.ytInitialPlayerResponse.captions.playerCaptionsTracklistRenderer
        .captionTracks, //the variable that youtube use to store the tracks
  };

  document.dispatchEvent(
    new CustomEvent('captionTracks', {
      detail: captionTracks,
    }),
  );
  console.log('sent new caption track');
  console.log(captionTracks);
};

let videoLinks: Element[] = [];

const removeListeners = () => {
  videoLinks.forEach((element) => {
    element.removeEventListener('click', clickEvent);
  });
  videoLinks = [];
};

//add listeners to listen to a new video click, and if so, re-retrieve the caption tracks
const addListeners = () => {
  const clickableElements = Array.from(
    document.getElementsByClassName('yt-simple-endpoint'),
  );

  videoLinks = clickableElements.filter((element) => {
    const href = element.getAttribute('href');
    if (!href) return false;
    if (!href.includes('/watch?v')) return false;
    return true;
  });

  videoLinks.forEach((element) => {
    element.addEventListener('click', clickEvent);
  });
};

const clickEvent = () => {
  removeListeners();
  addListeners();
  sendCaptionTracks();
};

clickEvent();
