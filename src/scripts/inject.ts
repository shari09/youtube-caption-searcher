
// export const getActiveTabId = async (): Promise<number> => {
//   const tabs = await chrome.tabs.query({active: true, currentWindow: true});
//   console.log(tabs);
//   if (!tabs) throw new Error('invalid active tab');
//   if (!tabs[0].id) throw new Error('active tab id not found');
//   return tabs[0].id;
// };

// const getCurUrl = async (): Promise<string> => {
//   const tabs = await chrome.tabs.query({active: true, currentWindow: true});
//   if (!tabs[0] || !tabs[0].url) throw new Error('invalid active tab');
//   return tabs[0].url;
// };

// const getCurUrl = (): Promise<string> => {
//   return new Promise((resolve, reject) => {
//     chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
//       console.log(tabs);
//       if (!tabs[0] || !tabs[0].url) reject('invalid active tab');
//       console.log(tabs[0].url);
//       resolve(tabs[0].url);
//     });
//   });
// };

// const urlDecode = (encoded: string) => {
//   return '{' + decodeURIComponent(encoded.replace(/\+/g, ' ')) + '}';
// };

// const sendCaptionTracks = () => {
  // const captionTrackRegex = /"captionTracks":\[.*?\]/g;
  // const captionTrackMatch = captionTrackRegex.exec(
  //   //@ts-ignore
  //   ytplayer.config.args.player_response,
  // );
//   const captionTracks = captionTrackMatch
//     ? JSON.parse(urlDecode(captionTrackMatch[0]))
//     : null;

//   document.dispatchEvent(
//     new CustomEvent('captionTracks', {
//       detail: captionTracks,
//     }),
//   );
//   console.log('sent new caption track');
//   console.log(captionTracks);
// };
console.log('whaaaaaaaa');

/**
 * getting the request url
 * @param videoId the video that you hope to get captions for
 */
const getReqUrl = (videoId: string) => {
  const origin = window.location.origin;
  const pathname = window.location.pathname;
  const xmhReqParam = 'pbj=1';
  //this is so sketchy i'll use the url module later
  return origin + pathname + '?'+ videoId + '&' + xmhReqParam;
};

const sendCaptionTracks = async(videoId: string) => {
  
  //get the newly loaded data
  //because somehow DOM doesn't update on a new video click, so this is how you're gonna get it
  //these auth fields are what the api needs otherwise it returns {reload: true}
  //@ts-ignore
  const token = window.yt.config_.ID_TOKEN;
  //@ts-ignore
  const clientVersion = window.yt.config_.INNERTUBE_CONTEXT_CLIENT_VERSION;
  //@ts-ignore
  const clientName = window.yt.config_.INNERTUBE_CONTEXT_CLIENT_NAME;
  const reqUrl = getReqUrl(videoId);
  console.log(reqUrl);
  const vidRawData = await fetch(reqUrl, {
    headers: {
      'x-youtube-client-name': clientName,
      'x-youtube-client-version': clientVersion,
      'x-youtube-identity-token': token,
    },
    method: 'GET',
    mode: 'cors',
    credentials: 'include',
  });
  const response = await vidRawData.json();
  //@ts-ignore
  let captionTracks;
  if (!response[2].playerResponse.captions) {
    captionTracks = null;
  } else {
    captionTracks = {
      captionTracks: response[2]
                    .playerResponse
                    .captions
                    .playerCaptionsTracklistRenderer
                    .captionTracks
    };
  }
  

  document.dispatchEvent(
    new CustomEvent('captionTracks', {
      detail: captionTracks,
    }),
  );
  console.log('sent new caption track');
  console.log(captionTracks);
};

let videoLinks: Element[] = [];
let eventListeners: (() => void)[] = [];


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

  videoLinks.forEach((element, index) => {
    const listener = () => {
      const href = videoLinks[index].getAttribute('href');
      const videoIdMatch = /(v=[^!]+)&/.exec(href);
      if (!videoIdMatch) throw new Error('cannot find video id from element');

      removeListeners();
      sendCaptionTracks(videoIdMatch[1]);
      addListeners();
    };
    //each one is a different listener corresponding to a different element
    eventListeners.push(listener);
    element.addEventListener('click', eventListeners[index]);
  });
};

const removeListeners = () => {
  videoLinks.forEach((element, index) => {
    element.removeEventListener('click', eventListeners[index]);
  });
  videoLinks = [];
  eventListeners = [];
};


const videoIdMatch = /(v=[^!]+)&/.exec(window.location.search);
if (!videoIdMatch) throw new Error('cannot find video id from path');
//initially get the videoId from url path
sendCaptionTracks(videoIdMatch[1]);
addListeners();
