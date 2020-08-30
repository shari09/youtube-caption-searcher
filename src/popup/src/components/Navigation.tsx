/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
const logo = require('../assets/logo.png');

export const Navigation: React.FC = () => {

  const wrapperStyle: SxStyleProp = {
    textAlign: 'center',  
    display: 'flex',
    flexDirection: 'row',
    padding: '2.5vh',
    width: '100%',
    height: '10vh',
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    zIndex: 10,
    backgroundColor: 'background',
  };

  const imgStyle: SxStyleProp = {
    height: '1.5em',
    ml: 'auto',
    my: 'auto',
  };

  const textStyle: SxStyleProp = {
    color: 'text.secondary',
    mr: 'auto',
    fontSize: 'small',
    my: 'auto',
    fontFamily: 'body',
  };

  const title: string = 'YouTube Caption Searcher';

  return (
    <div sx={wrapperStyle}>
      <img src={logo} sx={imgStyle}/>
      <p sx={textStyle}>{title}</p>
    </div>
  );
};