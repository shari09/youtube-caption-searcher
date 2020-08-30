/** @jsx jsx */
import React, {useEffect, useState} from 'react';
import {HashRouter as Router, Switch, Route, Redirect} from 'react-router-dom';

import {jsx, SxStyleProp, ThemeProvider} from 'theme-ui';
import {theme} from './util/theme';

import {Transcript} from '../../common/types';
import {getActiveTabId} from './util/functions';
import {LoadingScreen} from './pages/LoadingScreen';
import {TranscriptsContext, ITranscriptsContext} from './util/context';
import {NoTranscript} from './pages/NoTranscript';
import {Navigation} from './components/Navigation';
import { Home } from './pages/Home';
import { SearchPage } from './pages/SearchPage';

export const App: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>();

  const loadTranscripts = async () => {
    chrome.tabs.sendMessage(
      await getActiveTabId(),
      {action: 'load'},
      (response) => {
        setTranscripts(response);
        console.log('res', transcripts);
      },
    );
    console.log('transcripts loaded into extension');
    
  };

  useEffect(() => {
    loadTranscripts();
  }, []);

  if (!transcripts) {
    return <LoadingScreen />;
  }

  //if there's no transcripts, it has a length of 0
  const transcriptsContext: ITranscriptsContext = {
    transcripts: transcripts,
  };

  return (
    <TranscriptsContext.Provider value={transcriptsContext}>
      <ThemeProvider theme={theme}>
        <Router>
          <Navigation />
          <Switch>
            <Route 
              exact 
              path='/' 
              component={
                transcripts.length === 0 //no transcripts
                ? NoTranscript
                : Home
            } />
            <Route path='/search' component={SearchPage} />
          </Switch>
        </Router>
      </ThemeProvider>
    </TranscriptsContext.Provider>
  );
};

export default App;
