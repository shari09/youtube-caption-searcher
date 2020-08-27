import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native-web';

interface Props {
  start: number;
  text: string;
  markedTexts: {
    index: number;
    length: number;
    focused: boolean;
  }[];
  setRef?: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
}

type Ref = HTMLDivElement;

export const CaptionLine: React.FC<Props> = ({
  start,
  text,
  markedTexts,
  setRef,
}) => {
  const styles = getStyles();

  const getTime = () => {
    let time = start;
    const numHour = Math.floor(time / (60 * 60));
    time = time % (60 * 60);
    const numMin = Math.floor(time / 60);
    time = time % 60;
    const timeStr =
      (numHour > 0 ? numHour.toString() + ':' : '') +
      numMin.toString().padStart(2, '0') +
      ':' +
      time.toFixed(0).padStart(2, '0');
    return timeStr;
  };

  //TODO: pls make this a tolerable block of code cuz i don't really wanna do it rn functioing on lack of sleep
  const getText = () => {
    if (markedTexts.length === 0) return text;
    const markStyle = {
      paddingLeft: 0,
      paddingRight: 0,
    };

    const subStrings = markedTexts.reduce((acc, cur) => {
      const highlightColour = {
        backgroundColor: cur.focused ? 'orange' : undefined,
      };
      //[normal text, marked text, lastIndex]
      //find the index where the string slicing ended at
      const lastIndex = acc.length > 0 ? acc[acc.length - 1][2] : 0;
      acc.push([
        text.slice(lastIndex, cur.index),
        <mark style={{...markStyle, ...highlightColour}}>
          {text.slice(cur.index, cur.index + cur.length)}
        </mark>,
        cur.index + cur.length,
      ]);
      return acc;
    }, [] as any[][]);
    const lastElement = text.slice(subStrings[subStrings.length - 1][2]);
    const elements = subStrings.reduce((acc, group) => {
      acc.push(group[0]);
      acc.push(group[1]);
      return acc;
    }, [] as any[]);
    elements.push(lastElement);
    return elements;
  };

  return (
    <div
      style={styles.container}
      ref={(ref) => {
        if (setRef) setRef(ref);
      }}
    >
      <span style={styles.start}>
        <Text>{getTime()}</Text>
      </span>
      <span style={styles.text}>{getText()}</span>
    </div>
  );
};

const getStyles = () => {
  return {
    container: {
      flexDirection: 'row' as 'row',
      backgroundColor: 'white',
      paddingBottom: 5,
      display: 'flex' as 'flex',
    },
    start: {
      flex: 1,
      paddingLeft: 5,
      paddingRight: 5,
      fontSize: 10,
    },
    text: {
      flex: 5,
      paddingLeft: 5,
    },
  };
};

export default CaptionLine;
