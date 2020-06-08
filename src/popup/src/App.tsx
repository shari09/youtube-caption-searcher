import React, {useEffect} from 'react';
import ReactDOM from 'react-dom';

const App: React.FC = () => {
  let transcripts = [];

  useEffect(() => {
    chrome.runtime.sendMessage({action: 'load'}, (res) => {
      transcripts = res;
    });
  }, []);

  return <div>helsdafsdflfdsfsdfdsfdsfsdfsdfsdf</div>;
};

export default App;
