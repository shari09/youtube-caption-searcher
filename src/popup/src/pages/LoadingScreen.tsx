/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';


export const LoadingScreen: React.FC = () => {

  const wrapperStyle: SxStyleProp = {
    variant: 'bodyWrapper',
    textAlign: 'center',
    color: 'text.primary',
  };

  return (
    <div sx={wrapperStyle}>
      Loading... You may have to close and re-open the popup. This usually happens on fresh install.
    </div>
  );
};