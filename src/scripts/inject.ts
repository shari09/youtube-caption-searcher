console.log('script successfully injected');

/**
 * getting the GET request url that returns an xml of the modified data
 * @param videoId the video that you hope to get captions for
 * @returns GET req url or null if the current href does not contain a videoId param
 */
const getReqUrl = (href: string): string | null => {
  // //this is so sketchy i'll use the url module later
  const videoIdPathMatch = /(https:\/\/www\.youtube\.com\/watch\?v=[^!]+)(&|$)/.exec(
    href,
  );
  if (!videoIdPathMatch) return null;
  return videoIdPathMatch[1] + '&pbj=1';
};

/**
 * sends the caption tracks to the extension
 * @param href the current href of the video
 */
const sendCaptionTracks = async (href: string): Promise<void> => {
  //get the newly loaded data
  //because somehow DOM doesn't update on a new video click, so this is how you're gonna get it
  //these auth fields are what the api needs otherwise it returns {reload: true}
  //@ts-ignore
  const token: string = window.yt.config_.ID_TOKEN;
  //@ts-ignore
  const clientVersion: string =
    window.yt.config_.INNERTUBE_CONTEXT_CLIENT_VERSION;
  //@ts-ignore
  const clientName: string = window.yt.config_.INNERTUBE_CONTEXT_CLIENT_NAME;

  const reqUrl = getReqUrl(href);
  if (!reqUrl) return;
  console.log(reqUrl);
  const vidRawData = await fetch(reqUrl, {
    //my time consuming testing to see which headers are required
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
    !response[2].playerResponse.captions ||
    !response[2].playerResponse.captions.playerCaptionsTracklistRenderer
      .captionTracks
  ) {
    captionTracks = null;
  } else {
    captionTracks = {
      captionTracks:
        response[2].playerResponse.captions.playerCaptionsTracklistRenderer
          .captionTracks,
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

document.addEventListener('jumpToTime', (event) => {
  const typedEvent: CustomEvent = <CustomEvent>event;
  if (typedEvent.detail === null) {
    throw new Error('no time to jump to');
  }
  const time: number = typedEvent.detail.time;
  const video: HTMLVideoElement = <HTMLVideoElement>(
    document.getElementsByClassName('video-stream html5-main-video')[0]
  );
  video.currentTime = Math.round(time);
});

let oldHref: string = window.location.href;

/**
 * Re-sends the caption tracks if the href changes (navigated to a different video)
 */
const addHrefChangeListener = (): void => {
  const body: HTMLBodyElement | null = document.querySelector('body');
  if (!body)
    throw new Error('something rlly bad broke, the body tag disappeared');

  const mo: MutationObserver = new MutationObserver(
    (mutationList, observer) => {
      const newHref: string = window.location.href;
      if (oldHref !== newHref) {
        //get the new href if the video changes to see if there new caption tracks
        console.log(newHref);
        sendCaptionTracks(newHref);
        oldHref = newHref;
      }
    },
  );
  mo.observe(body, {
    attributes: true,
    subtree: true,
  });
};

addHrefChangeListener();

sendCaptionTracks(window.location.href);
