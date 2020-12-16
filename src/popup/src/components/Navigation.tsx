/** @jsx jsx */
import React, {useState, useMemo} from 'react';
import {jsx, SxStyleProp} from 'theme-ui';
import {Link} from 'react-router-dom';
import {GoThreeBars} from 'react-icons/go';
import {FaTimes} from 'react-icons/fa';
const logo = require('../assets/logo.png');


interface SidePanelProps {
  setToggle: React.Dispatch<React.SetStateAction<boolean>>;
  toggle: boolean;
}

const barHeight = '12vh';

const SidePanel: React.FC<SidePanelProps> = ({toggle, setToggle}) => {



  const navLinks = useMemo(() => {
    //key is path name, value is display text
    const links = {
      '/': 'HOME',
      '/preference': 'PREFERENCE',
      '/features': 'FEATURES',
      '/about': 'ABOUT', 
    };

    const style: SxStyleProp = {
      color: 'text.primary',
      py: '10px',
      '&:hover': {
        textDecoration: 'none',
        color: 'text.primary',
        cursor: 'pointer',
        opacity: 0.8,
      },
    };

    return Object.keys(links).map(key => {
      return (
        <Link sx={style} to={key} onClick={() => setToggle(false)} key={key}>
          {links[key]}
        </Link>
      );
    });

  }, []);


  const wrapperStyle: SxStyleProp = {
    position: 'absolute',
    zIndex: 20,
    width: '63vw',
    height: '100vh',
    left: 0,
    top: 0,
    transform: toggle ? 'translate(0)' : 'translateX(-100%)',
    transitionDuration: '.5s',
  };

  const overlay: SxStyleProp = {
    position: 'absolute',
    zIndex: 2,
    top: 0,
    left: 0,
    width: '100vw',
    height: '100vh',
    backgroundColor: 'grayOverlay',
    display: toggle ? 'block' : 'none',
  };

  const panelStyle: SxStyleProp = {
    zIndex: 2,
    width: '60vw',
    height: '100%',
    backgroundColor: 'background',
    borderRadius: '0px 15px 15px 0px',
    boxShadow: '3px 5px 3px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    flexDirection: 'column',
  };

  const iconStyle: SxStyleProp = {
    color: 'text.secondary',
    fontSize: 'largest',
    ml: 2,
    '&:hover': {
      cursor: 'pointer',
    }
  };

  const topBarStyle: SxStyleProp = {
    height: barHeight,
    padding: '2.5vh',
    width: '100%',
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
    textAlign: 'left',
  };

  const navLinksStyle: SxStyleProp = {
    mt: '20%',
    display: 'flex',
    flexDirection: 'column',
    justifyItems: 'flex-start',
  };
  
  return (
    <React.Fragment>
      <div sx={overlay} onClick={() => setToggle(false)}/>
      <div sx={wrapperStyle}>
        <div sx={panelStyle}>
          <div sx={topBarStyle}>
            <FaTimes
                sx={iconStyle}
                onClick={() => setToggle((toggle) => !toggle)}
            />
          </div>

          <div sx={navLinksStyle}>{navLinks}</div>
          
        </div>
      </div>
    </React.Fragment>
  );
};

export const Navigation: React.FC = () => {
  const [toggle, setToggle] = useState<boolean>(false);

  const wrapperStyle: SxStyleProp = {
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'row',
    padding: '2.5vh',
    width: '100%',
    height: barHeight,
    boxShadow: '0px 1px 1px rgba(0, 0, 0, 0.1)',
    position: 'fixed',
    zIndex: 10,
    backgroundColor: 'background',
  };

  const imgStyle: SxStyleProp = {
    height: '1.5em',
    ml: 'auto',
    my: 'auto',
  };

  const textStyle: SxStyleProp = {
    color: 'text.secondary',
    mr: 'auto',
    fontSize: 'small',
    my: 'auto',
    fontFamily: 'body',
  };

  const iconStyle: SxStyleProp = {
    color: 'text.secondary',
    fontSize: 'largest',
    ml: 2,
    my: 'auto',
    '&:hover': {
      cursor: 'pointer',
    }
  };

  const title: string = 'YouTube Caption Searcher';
  

  return (
    <div sx={wrapperStyle}>
      <SidePanel toggle={toggle} setToggle={setToggle}/>
      <GoThreeBars
        sx={iconStyle}
        onClick={() => setToggle((toggle) => !toggle)}
      />
      <img src={logo} sx={imgStyle} />
      <p sx={textStyle}>{title}</p>
    </div>
  );
};
