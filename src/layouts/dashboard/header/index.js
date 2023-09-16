import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import { Box, Stack, AppBar, Toolbar, IconButton, Button } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
//
import Iconify from '../../../components/iconify';
import AccountPopover from './AccountPopover';
import NotificationsPopover from './NotificationsPopover';
import ButtonGroup from '@mui/material/ButtonGroup';
import palette from '../../../theme/palette';
import { useCookies } from 'react-cookie';
import {AppContext} from '@edx/frontend-platform/react';
import { useContext } from 'react';
import { getConfig } from '@edx/frontend-platform';

// ----------------------------------------------------------------------

const NAV_WIDTH = 280;

const HEADER_MOBILE = 64;

const HEADER_DESKTOP = 92;

const StyledRoot = styled(AppBar)(({ theme }) => ({
  ...bgBlur({ color: theme.palette.background.default }),
  boxShadow: 'none',
  [theme.breakpoints.up('lg')]: {
    width: '100%',
  },
}));

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
  [theme.breakpoints.up('lg')]: {
    minHeight: HEADER_DESKTOP,
    padding: theme.spacing(0, 5),
  },
}));
// ----------------------------------------------------------------------

Header.propTypes = {
  onOpenNav: PropTypes.func,
};

const HeaderNavigationButton = styled(Button)(({theme})=>({
  border: '0px',
  color: '#000',
  borderRadius: '0px',
  textTransform: 'none',
  '&:hover': {
    background: palette.red['darker'],
    color: '#fff',
    border: '0px',
 },
}))

const StackItem = styled(Stack)(({ theme }) => ({
  [theme.breakpoints.up('lg')]: {
    // backgroundColor: 'yellow', // Style for screens smaller than 'sm'
    marginLeft:  '150px'
  },
}));

const ButtonItem = styled(Stack)(({ Button }) => ({
  color: "#000",
  background: '#fff',
  display:'flex',
  justifyContent: 'center',
  textAlign: 'center',
  fontFamily: 'Ubuntu',
  fontSize: '16px',
  fontStyle: 'normal',
  fontWeight: '600',
  lineHeight: 'normal',
  padding: '28px',
  minHeight: HEADER_DESKTOP,
  cursor:'pointer',
}));


const ButtonGroupItem = styled(ButtonGroup)(({ theme }) => ({
  flexGrow: 10,
  [theme.breakpoints.down('lg')]: {
    // backgroundColor: 'yellow', // Style for screens smaller than 'sm'
    display:  'none'
  },


}));


export default function Header({ onOpenNav }) {
  var _useContext = useContext(AppContext),
  authenticatedUser = _useContext.authenticatedUser,
  config = _useContext.config;

  const navItems = [
    {
      title: 'Cours',
      path: config.LMS_BASE_URL,
    },
    {
      title: 'Explorer les cours',
      path: config.EXPLORE_COURSES_URL+'/explore-courses/',
    },
    {
      title: 'Article',
      path: config.BLOG_URL+'/blog/',
    }
  ]
  return (
    <StyledRoot>
      <StyledToolbar sx={{
        display:'flex',
        justifyContent: 'space-between',
        borderBottom: '0px',
        boxShadow: '0px 4px 4px rgba(0,0,0,0.25)',
      }}>
        
        <IconButton
          onClick={onOpenNav}
          sx={{
            mr: 1,
            color: 'text.primary',
            display: { lg: 'none' },
          }}
        >
          <Iconify icon="eva:menu-2-fill" />
        </IconButton>
        <StackItem
            direction="row"
            alignItems="center"
            spacing={{
              xs: 0.5,
              sm: 1,
            }}
            

          >
          <img width={120} src={getConfig().LOGO_URL}></img>
        
        <ButtonGroupItem size="large" sx={{
          display:'flex',
          justifyContent: 'flex-start',
          alignContent: 'center',
          paddingLeft: '20px',
          // height: '100%',
          borderRadius: '0px',
          boxShadow: '0'
          
        }} variant="contained" aria-label="outlined primary button group">
          <ButtonItem onClick={()=>{
            window.open(navItems[0].path, '_self');
          }}  >{navItems[0].title}</ButtonItem>
          <ButtonItem onClick={()=>{
            window.open(navItems[1].path, '_self');
          }}  >{navItems[1].title}</ButtonItem>
          <ButtonItem sx={{
            color: "#fff",
            background: '#D23228',
          }} onClick={()=>{
            window.open(navItems[2].path, '_self');
          }}  >{navItems[2].title}</ButtonItem>

          
        </ButtonGroupItem>
        </StackItem>
        {/* <Searchbar /> */}
        {/* <Box sx={{ flexGrow: 1 }} /> */}
        
          <Stack
            direction="row"
            alignItems="center"
            spacing={{
              xs: 0.5,
              sm: 1,
            }}
          >
          {/* <NotificationsPopover /> */}
          <AccountPopover />
        </Stack>
      </StyledToolbar>
    </StyledRoot>
  );
}
