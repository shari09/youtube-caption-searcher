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

interface Line {
  start: number;
  text: string;
  markedTexts: {
    index: number;
    length: number;
  }[];
}

export const TrackPage: React.FC<Props> = ({route, navigation}) => {
  const {transcripts} = useContext<ITranscriptsContext>(TranscriptsContext);
  const {trackId} = route.params;
  const timedText = transcripts[trackId].timedText;
  const collapsedText = timedText.reduce(
    (total, cur) => total + cur.text + ' ',
    '',
  );

  const [query, setQuery] = useState<string>('');
  const [matchIdx, setMatchIdx] = useState<number>(-1);
  const [numMatches, setNumMatches] = useState<number>(0);
  const [queryMatches, setQueryMatches] = useState<RegExpMatchArray[]>([]);
  const [highlightedLines, setHighlightedLines] = useState<Line[]>([]);

  const styles = getStyles();

  const getLines = () => {
    return highlightedLines.map((line) => {
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
    if (query === '') {
      setMatchIdx(-1);
      setNumMatches(0);
      reset();
      return;
    };
    const searchRegex = new RegExp(query, 'gi');
    const matchArr = [...collapsedText.matchAll(searchRegex)];
    setQueryMatches(matchArr);
    setNumMatches(matchArr.length);
    setMatchIdx(matchArr.length - 1);
  }, [query]);

  const getHighLightedLines = (): Line[] => {
    const lines: Line[] = Array.from(highlightedLines);
    let queryIdx = 0;
    let totalLength = 0; //length of the characters up to this point
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      let matchCharIdx = queryMatches[queryIdx].index;
      if (!matchCharIdx) throw new Error('no index found for query match');

      while (matchCharIdx - totalLength < line.text.length - 1) {
        console.log(queryMatches[queryIdx]);
        lines[i].markedTexts.push({
          index: matchCharIdx - totalLength,
          length: queryMatches[queryIdx][0].length,
        });
        queryIdx++;

        if (queryIdx === queryMatches.length) return lines;

        matchCharIdx = queryMatches[queryIdx].index;
        if (!matchCharIdx) throw new Error('no index found for query match');
      }
      //plus one because of the space i added to collapsed msgs
      totalLength += line.text.length + 1;
      console.log(lines);
    }
    return lines;
  };

  const reset = () => {
    const lines: Line[] = Array.from(timedText).map((text) => {
      const line = (text as unknown) as Line;
      line.markedTexts = [];
      return line;
    });
    setHighlightedLines(lines);
  };

  useEffect(() => {
    reset();
    if (!queryMatches || queryMatches.length === 0) {
      return;
    }
    setHighlightedLines(getHighLightedLines());
  }, [queryMatches]);

  const getNextMatch = () => {};

  return (
    <View style={styles.container}>
      <SearchBar
        query={query}
        navigation={navigation}
        setQuery={setQuery}
        matchIdx={matchIdx + 1}
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
