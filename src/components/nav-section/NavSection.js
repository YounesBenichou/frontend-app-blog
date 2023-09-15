import PropTypes from 'prop-types';
import { NavLink as RouterLink } from 'react-router-dom';
// @mui
import { Box, List, ListItemText } from '@mui/material';
//
import { StyledNavItem, StyledNavItemIcon } from './styles';
import {Divider} from '@mui/material';
import {AppContext} from '@edx/frontend-platform/react';
import { useContext} from 'react';
// ----------------------------------------------------------------------

NavSection.propTypes = {
  data: PropTypes.array,
};

export default function NavSection({ data = [], ...other }) {
  
  
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
    <Box {...other}>
      <List disablePadding sx={{ p: 1 }}>
        {navItems.map((item) => (
          
          <>
            <NavItem key={item.title} item={item} />
            <Divider></Divider>
            </>
        ))}
        
      </List>
    </Box>
  );
}

// ----------------------------------------------------------------------

NavItem.propTypes = {
  item: PropTypes.object,
};

function NavItem({ item }) {
  const { title, path, icon, info } = item;

  return (
    <StyledNavItem
    onClick={()=>{
      window.open(path, '_self');
    }} 
      component={RouterLink}
      to={path}
      sx={{
        
        '&.active': {
          color: 'text.primary',
          bgcolor: 'action.selected',
          fontWeight: 'fontWeightBold',
        },
      }}
    >
      {/* <StyledNavItemIcon>{icon && icon}</StyledNavItemIcon> */}

      <ListItemText disableTypography primary={title} />

      {info && info}
    </StyledNavItem>
  );
}
