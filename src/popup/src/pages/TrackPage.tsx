import React, {useContext, useState, useEffect} from 'react';
import {View, StyleSheet, Text} from 'react-native-web';
import {TranscriptsContext, ITranscriptsContext} from '../util/context';
import {CaptionLine} from '../components/CaptionLine';
import {SearchBar} from '../components/SearchBar';
import {Transcript} from '../../../common/types';

interface Props {
  route: any;
  navigation: any;
}

export interface Line {
  start: number;
  text: string;
  markedTexts: {
    index: number;
    length: number;
    focused: boolean;
  }[];
}

export interface MatchIterator {
  matchIdx: number;
  lineNum: number;
  markedTextNum: number;
}

export const TrackPage: React.FC<Props> = ({route, navigation}) => {
  const {transcripts} = useContext<ITranscriptsContext>(TranscriptsContext);
  const {trackId} = route.params;
  const timedText = transcripts[trackId].timedText;
  const collapsedText = timedText.reduce(
    (total, cur) => total + cur.text + '\n',
    '',
  );
  console.log(collapsedText);

  const [query, setQuery] = useState<string>('');
  const [curMatch, setCurMatch] = useState<MatchIterator|undefined>();
  const [numMatches, setNumMatches] = useState<number>(0);
  const [queryMatches, setQueryMatches] = useState<RegExpMatchArray[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<Line[]>([]);
  const [matchItr, setMatchItr] = useState<
    Generator<MatchIterator> | undefined
  >();

  const [activeLineRef, setActiveLineRef] = useState<HTMLDivElement|null>(null);

  const styles = getStyles();

  const getLines = () => {
    return highlightedLines.map((line, index) => {
      if (curMatch?.lineNum === index) {
        return <CaptionLine
          setRef={setActiveLineRef}
          start={Number(line.start)}
          text={line.text}
          markedTexts={line.markedTexts}
        />
      }
      return (
        <CaptionLine
          start={Number(line.start)}
          text={line.text}
          markedTexts={line.markedTexts}
        />
      );
    });
  };

  useEffect(() => {
    if (activeLineRef) {
      window.scroll(0, activeLineRef.offsetTop);
    }
  }, [activeLineRef]);

  useEffect(() => {
    reset();
    if (query === '') {
      return;
    }

    let matchArr: RegExpMatchArray[] = [];
    //TODO: make this less sketchy and have checks maybe for invalid regex
    try {
      const searchRegex = new RegExp(query, 'gi');
      matchArr = [...collapsedText.matchAll(searchRegex)];
    } catch (e) {
      reset();
      return;
    }

    setQueryMatches(matchArr);
    setNumMatches(matchArr.length);
  }, [query]);

  const getHighLightedLines = (): Line[] => {
    const lines: Line[] = Array.from(highlightedLines);
    let queryIdx = 0;
    let totalLength = 0; //length of the characters up to this point
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let matchCharIdx = queryMatches[queryIdx].index;
      console.log(queryMatches[queryIdx]);
      if (matchCharIdx === undefined)
        throw new Error('no index found for query match');

      while (matchCharIdx - totalLength < line.text.length) {
        console.log(queryMatches[queryIdx]);
        lines[i].markedTexts.push({
          index: matchCharIdx - totalLength,
          length: queryMatches[queryIdx][0].length,
          focused: false,
        });
        queryIdx++;

        if (queryIdx === queryMatches.length) return lines;

        matchCharIdx = queryMatches[queryIdx].index;
        if (matchCharIdx === undefined)
          throw new Error('no index found for query match');
      }
      //plus one because of the \n I added to collapsedTexts
      totalLength += line.text.length + 1;
      console.log(lines);
    }
    return lines;
  };

  const resetHighlightedLines = () => {
    const lines: Line[] = Array.from(timedText).map((text) => {
      const line = (text as unknown) as Line;
      line.markedTexts = [];
      return line;
    });
    setHighlightedLines(lines);
  };

  const reset = () => {
    setCurMatch(undefined);
    setNumMatches(0);
    resetHighlightedLines();
  };

  useEffect(() => {
    if (!queryMatches || queryMatches.length === 0) {
      return;
    }
    const lines = getHighLightedLines();
    setHighlightedLines(lines);
    setMatchItr(getNextMatchPos(lines));
  }, [queryMatches]);

  //gets the first match after the match iterator has been updated
  useEffect(() => {
    //no match found
    if (!matchItr) {
      setCurMatch(undefined);
      return;
    };
    getNextMatch();
  }, [matchItr]);

  function* getNextMatchPos(lines: Line[]): Generator<MatchIterator> {
    let matchIdx = 0;
    while (true) {
      for (let i = 0; i < lines.length; i++) {
        for (let j = 0; j < lines[i].markedTexts.length; j++) {
          matchIdx = matchIdx === numMatches ? 0 : matchIdx;
          const match: MatchIterator = {
            matchIdx: matchIdx++,
            lineNum: i,
            markedTextNum: j,
          };
          yield match;
        }
      }
    }
  }

  const getNextMatch = () => {
    if (!matchItr) throw new Error('no iterator');
    
    let lines = Array.from(highlightedLines);
    if (curMatch) {
      lines[curMatch.lineNum].markedTexts[curMatch.markedTextNum].focused = false;
    }
    const match: MatchIterator = matchItr.next().value;
    setCurMatch(match);
    lines[match.lineNum].markedTexts[match.markedTextNum].focused = true;
    setHighlightedLines(lines);
  };

  return (
    <View style={styles.container}>
      <SearchBar
        query={query}
        navigation={navigation}
        setQuery={setQuery}
        matchIdx={curMatch ? curMatch.matchIdx+1 : 0}
        numMatches={numMatches}
        getNextMatch={getNextMatch}
      />
      <View style={styles.transcript}>{getLines()}</View>
    </View>
  );
};

const getStyles = () => {
  return {
    container: {
      backgroundColor: 'white',
    },
    transcript: {
      marginTop: 55,
    },
  };
};

export default TrackPage;
