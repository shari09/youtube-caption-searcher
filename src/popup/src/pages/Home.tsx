/** @jsx jsx */
import React, { useContext } from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Link} from 'react-router-dom';
import { ITranscriptsContext, TranscriptsContext } from '../util/context';
import { LoadingScreen } from './LoadingScreen';
import { randInt } from '../util/functions';


export const Home: React.FC = () => {

  const {transcripts} = useContext<ITranscriptsContext>(TranscriptsContext);
  if (!transcripts) return <LoadingScreen/>;


  const getTrackButtons = () => {
    return transcripts.map((transcript, i) => {
      const isRed = Math.random() > 0.5;
      const words = transcript.language.trim().toUpperCase().split(' ');
      //split the words if there are multiple words
      const longestCharNum = words.reduce((largest, cur) => {
        return largest > cur.length ? largest : cur.length;
      }, 0);
      const wordsJsx = words.map(word => {
        return (
          <React.Fragment>
            {word}
            <br/>
          </React.Fragment>
        );
      });

      const ellipseStyle: SxStyleProp = {
        variant: isRed ? 'redEllipse' : 'whiteEllipse',
        display: 'flex',
        width: `${longestCharNum+3}ch`,
        height: `${longestCharNum+3}ch`,
        mt: randInt(8, 30)+'px',
        '&:hover': {
          cursor: 'pointer',
          backgroundColor: isRed ? 'secondary' : 'background',
          boxShadow: '0px 5px 4px rgba(0, 0, 0, 0.5)',
          textDecoration: 'none',
          color: isRed ? 'text.contrast' : 'text.primary',
        },
        transitionDuration: '.4s',
      };

      const textStyle: SxStyleProp = {
        margin: 'auto',
      };

      return (
        <Link 
          sx={ellipseStyle} 
          to={{
            pathname: '/search',
            state: {
              transcript: transcript,
            },
          }}
        >
          <p sx={textStyle}>{wordsJsx}</p>
        </Link>
      );

    });
    
  };


  const wrapperStyle: SxStyleProp = {
    variant: 'bodyWrapper',
    maxHeight: '90vh',
    overflowY: 'scroll',
  };

  const titleStyle: SxStyleProp = {
    fontFamily: 'body',
    fontSize: 'large',
    color: 'text.primary',
    width: '100%',
    textAlign: 'center',
    mb: '5%',
  };

  const trackButtonsStyle: SxStyleProp = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={titleStyle}>Pick a Track</div>
      <div sx={trackButtonsStyle}>{getTrackButtons()}</div>
    </div>
  );
};