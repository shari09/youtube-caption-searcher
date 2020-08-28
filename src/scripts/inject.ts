console.log('whaaaaaaaa');

/**
 * getting the request url
 * @param videoId the video that you hope to get captions for
 */
const getReqUrl = (href: string): string|null => {
  // //this is so sketchy i'll use the url module later
  const videoIdPathMatch = /(https:\/\/www\.youtube\.com\/watch\?v=[^!]+)(&|$)/.exec(href);
  if (!videoIdPathMatch) return null;
  return videoIdPathMatch[1]+'&pbj=1';
};

const sendCaptionTracks = async(href: string) => {
  
  //get the newly loaded data
  //because somehow DOM doesn't update on a new video click, so this is how you're gonna get it
  //these auth fields are what the api needs otherwise it returns {reload: true}
  //@ts-ignore
  const token = window.yt.config_.ID_TOKEN;
  //@ts-ignore
  const clientVersion = window.yt.config_.INNERTUBE_CONTEXT_CLIENT_VERSION;
  //@ts-ignore
  const clientName = window.yt.config_.INNERTUBE_CONTEXT_CLIENT_NAME;

  const reqUrl = getReqUrl(href);
  if (!reqUrl) return;
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
  let captionTracks;
  if (
    !response[2].playerResponse.captions 
    || !response[2]
       .playerResponse
       .captions
       .playerCaptionsTracklistRenderer
       .captionTracks) {
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


let oldHref = window.location.href;

const addHrefChangeListener = () => {
  const body = document.querySelector('body');
  if (!body) throw new Error('something rlly bad broke, the body tag disappeared');
  
  const mo = new MutationObserver((mutationList, observer) => {
    const newHref = window.location.href;
    if (oldHref !== newHref) {
      //get the new href if the video changes to see if there new caption tracks
      console.log(newHref);
      sendCaptionTracks(newHref);
      oldHref = newHref;
    }
  });
  mo.observe(body, {
    attributes: true,
    subtree: true,
  });
};

addHrefChangeListener();

sendCaptionTracks(window.location.href);
