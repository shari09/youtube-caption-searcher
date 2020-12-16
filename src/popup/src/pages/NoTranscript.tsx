/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

export const NoTranscript: React.FC = () => {
  const wrapperStyle: SxStyleProp = {
    variant: 'bodyWrapper',
  };

  const redEllipseStyle: SxStyleProp = {
    mt: '7%',
    width: '100%',
    height: '32vh',
    fontSize: 'larger',
    variant: 'redEllipse',
    fontFamily: 'body',
    lineHeight: '1.2em',
    my: '3%',
    display: 'flex',
  };

  const redEllipseTextStyle: SxStyleProp = {
    margin: 'auto',
  };

  const whiteEllipseStyle: SxStyleProp = {
    width: '80%',
    height: '26vh',
    fontSize: 'small',
    variant: 'whiteEllipse',
    fontFamily: 'body',
    mx: 'auto',
    my: '10%',
    display: 'flex',
  };

  const whiteEllipseTextStyle: SxStyleProp = {
    margin: 'auto',
    width: '75%',
  };

  const noTranscriptMsg: string = 'no transcripts were found';
  const additionalMsg: string = "Please go to a video that supports captions, even if they're auto-generated";

  return (
    <div sx={wrapperStyle}>
      <div sx={redEllipseStyle}>
        <p sx={redEllipseTextStyle}>{noTranscriptMsg.toUpperCase()}</p>
      </div>
      <div sx={whiteEllipseStyle}>
        <p sx={whiteEllipseTextStyle}>{additionalMsg}</p>
      </div>
    </div>
  );
};
