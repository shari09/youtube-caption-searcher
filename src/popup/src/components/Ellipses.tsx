/** @jsx jsx */
import React from 'react';
import {jsx, SxStyleProp} from 'theme-ui';

interface Props {
  text: string;
  ellipseStyle?: SxStyleProp;
  textStyle?: SxStyleProp;
}

export const RedEllipse: React.FC<Props> = ({
  text,
  ellipseStyle,
  textStyle: extraTextStyle,
}) => {
  const redEllipseStyle: SxStyleProp = {
    variant: 'redEllipse',
    fontSize: 'medium',
    width: '50%',
    height: '50%',
    fontFamily: 'body',
    lineHeight: '1.2em',
    my: '3%',
    display: 'flex',
    ...ellipseStyle,
  };

  const textStyle: SxStyleProp = {
    margin: 'auto',
    ...extraTextStyle,
  };

  return (
    <div sx={redEllipseStyle}>
      <p sx={textStyle}>{text}</p>
    </div>
  );
};

export const WhiteEllipse: React.FC<Props> = ({
  text,
  ellipseStyle,
  textStyle: extraTextStyle,
}) => {
  const whiteEllipseStyle: SxStyleProp = {
    variant: 'whiteEllipse',
    fontSize: 'medium',
    width: '50%',
    height: '50%',
    fontFamily: 'body',
    mx: 'auto',
    my: '10%',
    display: 'flex',
    ...ellipseStyle,
  };

  const textStyle: SxStyleProp = {
    margin: 'auto',
    ...extraTextStyle,
  };

  return (
    <div sx={whiteEllipseStyle}>
      <p sx={textStyle}>{text}</p>
    </div>
  );
};
