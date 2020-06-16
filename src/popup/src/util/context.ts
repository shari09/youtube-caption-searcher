import React from 'react';
import {Transcript} from '../../../common/types';

export interface ITranscriptsContext {
  transcripts: Transcript[];
}

export interface IThemeContext {
  background: string;
}

export const TranscriptsContext = React.createContext<ITranscriptsContext>({
  transcripts: [],
});

export const defaultTheme: IThemeContext = {
  background: 'white'
};

export const ThemeContext = React.createContext<IThemeContext>(defaultTheme);