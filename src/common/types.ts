export interface Transcript {
  language: string;
  timedText: {
    start: string;
    text: string;
  }[];
}


export interface CaptionTrack {
  baseUrl: string;
  isTranslatable: boolean;
  languageCode: string;
  name: {
    simpleText: string;
  };
  vssId: string;
}