import 'chrome-extension-async';
export const getActiveTabId = async (): Promise<number> => {
  const tabs = await chrome.tabs.query({active: true, currentWindow: true});
  console.log(tabs);
  if (!tabs) throw new Error('invalid active tab');
  if (!tabs[0].id) throw new Error('active tab id not found');
  return tabs[0].id;
};

const urlDecode = (encoded: string) => {
  return '{' + decodeURIComponent(encoded.replace(/\+/g, ' ')) + '}';
};

const sendCaptionTracks = () => {
  const captionTrackRegex = /"captionTracks":\[.*?\]/g;
  const captionTrackMatch = captionTrackRegex.exec(
    //@ts-ignore
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
