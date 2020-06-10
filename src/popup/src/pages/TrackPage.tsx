import React, {useContext} from 'react';
import {View, StyleSheet, Text} from 'react-native-web';
import {TranscriptsContext, ITranscriptsContext} from '../util/context';
import {CaptionLine} from '../components/CaptionLine';

interface Props {
  route: any;
  navigation: any;
}

export const TrackPage: React.FC<Props> = ({route, navigation}) => {
  const {transcripts} = useContext<ITranscriptsContext>(TranscriptsContext);
  const {trackId} = route.params;
  const timedText = transcripts[trackId].timedText;

  const styles = getStyles();

  const getLines = () => {
    return timedText.map((line) => {
      return <CaptionLine start={Number(line.start)} text={line.text} />;
    });
  };

  return <View style={styles.container}>{getLines()}</View>;
};

const getStyles = () => {
  return StyleSheet.create({
    container: {
    },
  });
};

export default TrackPage;
