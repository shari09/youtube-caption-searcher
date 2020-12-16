/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';


export const Features: React.FC = () => {

  const wrapperStyle: SxStyleProp = {
    variant: 'bodyWrapper',
    textAlign: 'left',
    color: 'text.primary',
    overflowY: 'scroll',
    fontSize: 'small',
  };

  return (
    <div sx={wrapperStyle}>
      Under construction... 
      <br/>
      (I promise it'll look better after I actually make it)
      <br/>
      HOW TO USE/FEATURES:
      <br/>
      <br/>
      - Choose a language track to search through (yes, some videos support captions in multiple languages)
      <br/>
      - Press 'Enter' to navigate to the next result, and 'Shift' + 'Enter' to navigate to the previous result
      <br/>
      - Click on the time shown in the left column to jump to that time in the video
      <br/>
      - No need to refresh or click on the CC button or whatever, it just works by itself
      
    </div>
  );
};