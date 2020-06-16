import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native-web';

interface Props {
  start: number;
  text: string;
  markedTexts: {
    index: number;
    length: number;
  }[];
}

export const CaptionLine: React.FC<Props> = ({start, text, markedTexts}) => {
  const styles = getStyles();

  const getTime = () => {
    let time = start;
    const numHour = Math.floor(time / (60 * 60));
    time = time % (60 * 60);
    const numMin = Math.floor(time / 60);
    time = time % 60;
    const timeStr =
      (numHour > 0 ? numHour.toString() + 'h' : '') +
      numMin.toString() +
      'm' +
      time.toFixed(0) +
      's';
    return timeStr;
  };

  //TODO: pls make this a tolerable block of code cuz i don't really wanna do it rn functioing on lack of sleep
  const getText = () => {
    if (markedTexts.length === 0) return text;
    const markStyle = {
      paddingLeft: 0,
      paddingRight: 0,
    };

    const subStrings = markedTexts.reduce((acc, pos) => {
      //[normal text, marked text, lastIndex]
      //find the index where the string slicing ended at
      const lastIndex = acc.length > 0 ? acc[acc.length - 1][2] : 0;
      acc.push([
        text.slice(lastIndex, pos.index),
        <mark style={markStyle}>
          {text.slice(
            pos.index,
            pos.index + pos.length,
          )}
        </mark>,
        pos.index + pos.length,
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
    <div style={styles.container}>
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
