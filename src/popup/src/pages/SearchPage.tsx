/** @jsx jsx */
import React, {useState, useMemo, useRef, useEffect} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {BsSearch} from 'react-icons/bs';
import {FaTimes} from 'react-icons/fa';
import {Transcript} from '../../../common/types';
import {CaptionLine} from '../components/CaptionLine';

interface Props {
  location: {
    state: {
      transcript: Transcript;
    };
  };
}

export const SearchPage: React.FC<Props> = ({location}) => {
  const transcript = location.state.transcript;
  //offer multiline search support, using a space to seperate the lines
  const transcriptLengths = transcript.timedText.map(line => line.text.length+1);
  const flattenedTranscript = transcript.timedText.reduce((acc, cur) => {
    return acc+' '+cur.text;
  }, '');

  const [query, setQuery] = useState<string>('');
  const captionLineRefs = useRef<HTMLDivElement[]>([]);

  const captionLines = useMemo(() => {
    return transcript.timedText.map((line, i) => {
      return (
        <CaptionLine
          start={line.start}
          text={line.text}
          isGrayBackground={i % 2 === 0}
          ref={(ref) => captionLineRefs.current.push(ref)}
        />
      );
    });
  }, []);

  useEffect(() => {
    console.log(flattenedTranscript);
  }, []);

  const search = () => {

  };

  const wrapperStyle: SxStyleProp = {
    variant: 'bodyWrapper',
    width: '100%',
    textAlign: 'center',
    mx: 'auto',
  };

  const searchBarWrapperStyle: SxStyleProp = {
    position: 'relative',
  };

  const searchBarStyle: SxStyleProp = {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'secondary',
    borderStyle: 'solid',
    width: '100%',
    height: '2em',
    color: 'text.primary',
    px: '1em',
    '&:focus': {
      outline: 'none',
      borderWidth: 2,
    },
  };

  const iconStyle: SxStyleProp = {
    position: 'absolute',
    right: '1em',
    top: '0.5em',
    color: 'text.primary',
    '&:hover': {
      cursor: 'pointer',
    },
  };

  const languageTextStyle: SxStyleProp = {
    fontFamily: 'body',
    fontSize: 'mini',
    color: 'text.primary',
  };

  const boardStyle: SxStyleProp = {
    boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.25)',
    borderRadius: '5%',
    width: '100%',
    height: '70vh',
    overflowY: 'scroll',
  };

  return (
    <div sx={wrapperStyle}>
      <div sx={searchBarWrapperStyle}>
        <input
          sx={searchBarStyle}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search"
          onSubmit={search}
        />
        {query === '' ? (
          <BsSearch sx={iconStyle} />
        ) : (
          <FaTimes sx={iconStyle} onClick={() => setQuery('')} />
        )}
      </div>
      <p sx={languageTextStyle}>{transcript.language}</p>

      <div sx={boardStyle}>{captionLines}</div>
    </div>
  );
};
