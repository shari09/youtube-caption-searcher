import React, {useContext} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native-web';

interface Props {
  navigation: any;
  trackId: number;
  name: string;
}


export const Option: React.FC<Props> = ({navigation, trackId, name}) => {
  const styles = getStyles();
  
  return (
    <View>
      <TouchableOpacity
        style={styles.option}
        onPress={() => {
          navigation.navigate('TrackPage', {
            trackId: trackId,
          });
          console.log('lskdjfls');
        }}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
    </View>
  );
};

const getStyles = () => {
  return StyleSheet.create({
    option: {}
  });
};


export default Option;
