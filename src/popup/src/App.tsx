import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native-web';
import {createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import {Transcript} from '../../common/types';
import {getActiveTabId} from './util/functions';
import {TranscriptsContext, ITranscriptsContext} from './util/context';
import {SelectTrackPage} from './pages/SelectTrackPage';
import {TrackPage} from './pages/TrackPage';

const Stack = createStackNavigator();
const App: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[] | undefined>();

  const styles = getStyles();

  const loadTranscripts = async () => {
    chrome.tabs.sendMessage(
      await getActiveTabId(),
      {action: 'load'},
      (response) => {
        console.log('res', response);
        setTranscripts(response);
      },
    );
    console.log('load script async function');
  };
  useEffect(() => {
    loadTranscripts();
  }, []);

  if (transcripts === undefined) {
    return <Text>loading</Text>;
  }
  if (transcripts.length === 0) {
    return <Text>no transcripts found</Text>;
  }

  const transcriptsContext: ITranscriptsContext = {
    transcripts: transcripts,
  };

  return (
    <TranscriptsContext.Provider value={transcriptsContext}>
      <NavigationContainer>
        <View style={styles.container}>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
            }}
          >
            {transcripts.length > 1 ? (
              <Stack.Screen
                name="SelectTrackPage"
                component={SelectTrackPage}
              />
            ) : undefined }
            <Stack.Screen
              name="TrackPage"
              component={TrackPage}
              initialParams={{trackId: 0}}
            />
          </Stack.Navigator>
        </View>
      </NavigationContainer>
    </TranscriptsContext.Provider>
  );
};

const getStyles = () => {
  return StyleSheet.create({
    container: {
      width: 350,
    },
  });
};

export default App;
