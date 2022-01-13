import { AppBar, Toolbar, IconButton } from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useMenu } from "../context/SideMenuContext";
import { Link } from 'react-router-dom';
import UserMenu from './UserMenu';



function TopBar() {
  const [openSideMenu, setOpenSideMenu] = useMenu();

  return (
    <AppBar color="inherit" className={'topbar'}>
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpenSideMenu(!openSideMenu)}>
          <MenuIcon />
        </IconButton>
        <Link to='/'>[LOGO]</Link>
        <div className={'topbar-spacing'}></div>

        <IconButton className={'topbar-icon'} color="inherit">
          <Badge badgeContent={4} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>

        <IconButton className={'topbar-icon'} color="inherit">
          <Badge badgeContent={10} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <UserMenu/>

      </Toolbar>
    </AppBar>
  );

}

export default TopBar;