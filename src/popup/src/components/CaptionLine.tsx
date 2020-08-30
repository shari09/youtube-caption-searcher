/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {getActiveTabId} from '../util/functions';

interface Props {
  start: number;
  text: string;
  isGrayBackground?: boolean;
}

export const CaptionLine = React.forwardRef<HTMLDivElement, Props>(({
  start,
  text,
  isGrayBackground,
}, ref) => {
  const getTime = () => {
    let time = start;
    const numHour = Math.floor(time / (60 * 60));
    time = time % (60 * 60);
    const numMin = Math.floor(time / 60);
    time = time % 60;
    const timeStr =
      (numHour > 0 ? numHour.toString() + ':' : '') +
      numMin.toString().padStart(2, '0') +
      ':' +
      time.toFixed(0).padStart(2, '0');
    return timeStr;
  };

  const jumpToTime = async () => {
    const jumpToTimePayload = {
      action: 'jumpToTime',
      data: {time: start},
    };

    chrome.tabs.sendMessage(
      await getActiveTabId(),
      jumpToTimePayload,
      console.log,
    );
  };

  const wrapperStyle: SxStyleProp = {
    display: 'flex',
    flexDirection: 'row',
    py: 2,
    backgroundColor: isGrayBackground ? 'alternateBackground' : 'background',
    color: 'text.caption',
  };

  const timeStyle: SxStyleProp = {
    display: 'flex',
    mr: 'auto',
    alignItems: 'center',
    px: '.5em',
    flex: 1.2,
    '&:hover': {
      cursor: 'pointer',
      opacity: 0.7,
    },
  };

  const textStyle: SxStyleProp = {
    overflowWrap: 'anywhere',
    flex: 5,
  };

  return (
    <div sx={wrapperStyle} ref={ref}>
      <div sx={timeStyle} onClick={jumpToTime}>
        {getTime()}
      </div>
      <div sx={textStyle}>{text}</div>
    </div>
  );
});
