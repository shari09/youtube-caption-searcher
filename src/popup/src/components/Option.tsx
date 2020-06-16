import React, {useContext} from 'react';
import {View, Text} from 'react-native-web';
import {Button} from 'react-bootstrap';

interface Props {
  navigation: any;
  trackId: number;
  name: string;
}

export const Option: React.FC<Props> = ({navigation, trackId, name}) => {
  const styles = getStyles();

  return (
    <View style={styles.container}>
      <Button
        variant='light'
        style={styles.option}
        onClick={() => {
          navigation.navigate('TrackPage', {
            trackId: trackId,
          });
        }}
      >
        {name}
      </Button>
    </View>
  );
};

const getStyles = () => {
  return {
    container: {
    },
    option: {
      padding: 5,
    },
    text: {
      fontFamily: 'Roboto',
      textAlign: 'center',
      fontSize: 15,
    },
  };
};

export default Option;
