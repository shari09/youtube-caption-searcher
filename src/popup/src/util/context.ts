import React from 'react';
import {Transcript} from '../../../common/types';

export interface ITranscriptsContext {
  transcripts: Transcript[];
}

export const TranscriptsContext = React.createContext<ITranscriptsContext>({
  transcripts: [],
});
