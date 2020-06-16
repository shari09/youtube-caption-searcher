import React, {useContext, useRef, useState} from 'react';
import {RiArrowGoBackLine} from 'react-icons/ri';
import {AiOutlineSearch} from 'react-icons/ai';
import {
  ThemeContext,
  IThemeContext,
  TranscriptsContext,
  ITranscriptsContext,
} from '../util/context';

interface Props {
  query: string;
  navigation?: any;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  matchIdx: number;
  numMatches: number;
  getNextMatch: () => void;
}

export const SearchBar: React.FC<Props> = ({
  query,
  setQuery,
  navigation,
  matchIdx,
  numMatches,
  getNextMatch,
}) => {
  const {transcripts} = useContext<ITranscriptsContext>(TranscriptsContext);
  const colours = useContext<IThemeContext>(ThemeContext);
  const searchBarRef = useRef<HTMLInputElement>(null);
  const [backHover, setBackHover] = useState<boolean>(false);
  const [searchHover, setSearchHover] = useState<boolean>(false);
  const styles = getStyles(colours);

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!searchBarRef.current) {
      throw new Error('search bar ref is null');
    }
    if (event.key === 'Enter') {
      getNextMatch();
      // searchBarRef.current.blur();
    }
  };

  const handleSearchClick = () => {
    if (!searchBarRef.current) {
      throw new Error('search bar ref is null');
    }
    // searchBarRef.current.blur();
  };

  const getHoverStyle = (onHover: boolean) => {
    return {cursor: onHover ? 'pointer' : 'default'};
  };

  return (
    <div style={styles.container}>
      <span style={styles.backWrapper}>
        {transcripts.length > 1 ? (
          <RiArrowGoBackLine
            onClick={() => navigation.goBack()}
            style={{...styles.backIcon, ...getHoverStyle(backHover)}}
            onMouseEnter={() => {
              setBackHover(true);
            }}
            onMouseLeave={() => {
              setBackHover(false);
            }}
          />
        ) : undefined}
      </span>
      <input
        style={styles.searchBar}
        placeholder="Search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
        type="text"
        onKeyPress={handleKeyPress}
        ref={searchBarRef}
      />
      {matchIdx}/{numMatches}
      <AiOutlineSearch
        style={{...styles.searchIcon, ...getHoverStyle(searchHover)}}
        onClick={handleSearchClick}
        onMouseEnter={() => {
          setSearchHover(true);
        }}
        onMouseLeave={() => {
          setSearchHover(false);
        }}
      />
    </div>
  );
};

const getStyles = (colours: IThemeContext) => {
  return {
    container: {
      display: 'flex',
      flexDirection: 'row' as 'row',
      backgroundColor: 'white',
      height: 50,
      position: 'fixed' as 'fixed',
      alignItems: 'center',
      top: 0,
      zIndex: 1,
      width: '100%',
      boxShadow: '0px 1px 3px 0px gray',
    },
    searchBar: {
      flex: 5,
      marginRight: 10,
    },
    backWrapper: {
      flex: 3,
    },
    backIcon: {
      flex: 1,
      fontSize: 18,
      marginLeft: 10,
    },
    searchIcon: {
      flex: 1,
      fontSize: 20,
    },
  };
};
