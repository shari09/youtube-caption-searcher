import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native-web';
import {TranscriptsContext, ITranscriptsContext, ThemeContext, IThemeContext} from '../util/context';
import {Option} from '../components/Option';

interface Props {
  navigation: any;
}

export const SelectTrackPage: React.FC<Props> = ({navigation}) => {
  const {transcripts} = useContext<ITranscriptsContext>(TranscriptsContext);
  const colours = useContext<IThemeContext>(ThemeContext);
  const styles = getStyles(colours);

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

  return (
    <View style={styles.container}>
      {getSelections()}
    </View>
  );
};

const getStyles = (colours: IThemeContext) => {
  return StyleSheet.create({
    container: {
      backgroundColor: colours.background,
    },
  });
};

export default SelectTrackPage;
