import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native-web';
import {TranscriptsContext, ITranscriptsContext} from '../util/context';
import {Option} from '../components/Option';

interface Props {
  navigation: any;
}

export const SelectTrackPage: React.FC<Props> = ({navigation}) => {
  const {transcripts} = useContext<ITranscriptsContext>(TranscriptsContext);
  const styles = getStyles();

  const getSelections = () => {
    return transcripts.map((transcript, index) => {
      return (
        <Option
          trackId={index}
          name={transcript.language}
          navigation={navigation}
        />
      );
    });
  };

  return <View>{getSelections()}</View>;
};

const getStyles = () => {
  return StyleSheet.create({
    container: {},
    selection: {},
  });
};

export default SelectTrackPage;
