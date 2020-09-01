/** @jsx jsx */
import React, {useState, useMemo, useRef} from 'react';
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
  const [query, setQuery] = useState<string>('');
  const [captionLineMatches, setCaptionLineMatches] = useState<HTMLDivElement[]>([]);
  const [curMatch, setCurMatch] = useState<number>(0);
  const [shiftKeyPressed, setShiftKeyPressed] = useState<boolean>(false);
  const captionLineRefs = useRef<HTMLDivElement[]>([]);

  const transcript = location.state.transcript;
  //offer multiline search support, using a space to seperate the lines
  const transcriptLengths = useMemo(() => {
    return transcript.timedText.map((line) => line.text.length + 1);
  }, [transcript]);

  const flattenedTranscript = useMemo(() => {
    return transcript.timedText.reduce((acc, cur) => {
      // console.log('ran ');
      return acc + ' ' + cur.text.toLowerCase();
    }, '');
  }, [transcript]);

  const captionLines = useMemo(() => {
    return transcript.timedText.map((line, i) => {
      return (
        <CaptionLine
          start={line.start}
          text={line.text}
          isGrayBackground={i % 2 === 0}
          ref={(ref) => captionLineRefs.current.push(ref)}
          key={i}
        />
      );
    });
  }, []);

  //============================================================
  const getMatchPosition = (index: number) => {
    //indexed at 0
    let lineNum = 0;

    for (let i = 0; i < transcriptLengths.length; i++) {
      if (index - transcriptLengths[i] < 0) {
        return [lineNum, index];
      }
      lineNum++;
      index -= transcriptLengths[i];
    }
    console.log('index', index);
    throw new Error('index out of transcript range');
  };

  const getMatch = (direction: 'prev' | 'next') => {
    setCurMatch((curMatch) => {
      if (captionLineMatches.length === 0) return 0;
      let newMatch: number;
      if (direction === 'prev') {
        newMatch = (curMatch - 1) % captionLineMatches.length;
        newMatch =
          newMatch >= 0 ? newMatch : captionLineMatches.length + newMatch;
      } else {
        newMatch = (curMatch + 1) % captionLineMatches.length;
      }

      captionLineMatches[curMatch].style.backgroundColor = 'yellow';
      captionLineMatches[newMatch].scrollIntoView();
      captionLineMatches[newMatch].style.backgroundColor = 'orange';
      return newMatch;
    });
  };

  const highlightAllMatches = (matches: HTMLDivElement[]) => {
    matches.forEach((match, i) => {
      match.style.backgroundColor = 'yellow';
      if (i === 0) {
        match.style.backgroundColor = 'orange';
      }
    });
  };

  const resetOldMatchBg = () => {
    captionLineMatches.forEach((match) => {
      match.style.backgroundColor = '';
    });
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (shiftKeyPressed) {
        getMatch('prev');
        return;
      }
      getMatch('next');
    } else if (event.key === 'Shift') {
      setShiftKeyPressed(true);
    }
  };

  const resetKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Shift') {
      setShiftKeyPressed(false);
    }
  };

  const search = (text: string, pattern: string): HTMLDivElement[] => {
    const matches: number[] = [];
    text = text.toLowerCase();
    pattern = pattern.toLowerCase();
    let matchIdx = -1;
    while (matchIdx < text.length) {
      matchIdx = text.indexOf(pattern, matchIdx + 1);
      if (matchIdx === -1) break;
      matches.push(matchIdx);
    }

    //the refs of the matched elements (caption lines)
    const elements: HTMLDivElement[] = [];
    matches.forEach((match) => {
      const [lineNum, charNum] = getMatchPosition(match);
      elements.push(captionLineRefs.current[lineNum]);
    });
    return elements;
  };

  const resetQuery = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setCurMatch(0);
    setQuery(query);
    resetOldMatchBg();
    if (query === '') return;

    const matches = search(flattenedTranscript, query);
    matches[0].scrollIntoView();
    setCaptionLineMatches(matches);
    highlightAllMatches(matches);
  };

  //=====================================================
  //styles

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
    height: query === '' ? '70vh' : '65vh',
    overflowY: 'scroll',
    zIndex: 2,
  };

  const matchTextStyle: SxStyleProp = {
    display: query === '' ? 'none' : 'inline',
  };

  //=======================================

  const getSearchBarIcon = () => {
    if (query === '') {
      return <BsSearch sx={iconStyle} />;
    }
    return (
      <FaTimes
        sx={iconStyle}
        onClick={() => {
          resetOldMatchBg();
          setQuery('');
        }}
      />
    );
  };
  
  const getBgRects = () => {
    
    return Array.from(new Array(2).keys()).map((_, i) => {
      const isEven = i % 2 === 0;
      const style: SxStyleProp = {
        backgroundColor: 'overlay',
        position: 'absolute',
        width: '50%',
        height: '30vh',
        top: i*150+100,
        zIndex: -1,
        right: isEven ? 0 : undefined,
        left: isEven ? undefined : 0,
      };
      return <div sx={style}/>;
    });

  };

  return (
    <div sx={wrapperStyle}>
      <div sx={searchBarWrapperStyle}>
        <input
          sx={searchBarStyle}
          type="text"
          value={query}
          onChange={resetQuery}
          onKeyDown={handleKeyDown}
          onKeyUp={resetKeyPress}
          placeholder="Search"
        />
        {getSearchBarIcon()}
      </div>
      <p sx={matchTextStyle}>
        {captionLineMatches.length > 0 ? curMatch + 1 : 0}/
        {captionLineMatches.length}
      </p>
      <p sx={languageTextStyle}>{transcript.language}</p>
      {/* {getBgRects()} */}
      <div sx={boardStyle}>{captionLines}</div>
    </div>
  );
};
