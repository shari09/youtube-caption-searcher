/** @jsx jsx */
import React, {useEffect, useState} from 'react';
import {HashRouter as Router, Switch, Route} from 'react-router-dom';

import {jsx, ThemeProvider} from 'theme-ui';
import {theme} from './util/theme';

import {Transcript} from '../../common/types';
import {getActiveTabId} from './util/functions';
import {LoadingScreen} from './pages/LoadingScreen';
import {TranscriptsContext, ITranscriptsContext} from './util/context';
import {NoTranscript} from './pages/NoTranscript';
import {Navigation} from './components/Navigation';
import { Home } from './pages/Home';
import { SearchPage } from './pages/SearchPage';
import { Preference } from './pages/Preference';
import { About } from './pages/About';
import { Features } from './pages/Features';

export const App: React.FC = () => {
  const [transcripts, setTranscripts] = useState<Transcript[]>();

  
  const loadTranscripts = async () => {
    chrome.tabs.sendMessage(
      await getActiveTabId(),
      {action: 'load'},
      (response) => {
        setTranscripts(response);
        // console.log('res', transcripts);
      },
    );
    // console.log('transcripts loaded into extension');
    
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
            <Route path='/preference' component={Preference} />
            <Route path='/about' component={About} />
            <Route path='/features' component={Features} />
          </Switch>
        </Router>
      </ThemeProvider>
    </TranscriptsContext.Provider>
  );
};

export default App;
