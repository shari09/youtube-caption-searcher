import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native-web';

interface Props {
  start: number;
  text: string;
}

export const CaptionLine: React.FC<Props> = ({start, text}) => {
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

  return (
    <View style={styles.container}>
      <View style={styles.start}>
        <Text>{getTime()}</Text>
      </View>
      <View style={styles.text}>
        <Text>{text}</Text>
      </View>
    </View>
  );
};

const getStyles = () => {
  return StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: 'white',
      paddingBottom: 5,
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
  });
};

export default CaptionLine;
