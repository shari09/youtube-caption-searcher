/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';


export const About: React.FC = () => {

  const wrapperStyle: SxStyleProp = {
    variant: 'bodyWrapper',
    textAlign: 'center',
    color: 'text.primary',
  };

  return (
    <div sx={wrapperStyle}>
      Under construction... If you found a bug, please open an issue 
      at https://github.com/shari09/youtube-caption-searcher
    </div>
  );
};