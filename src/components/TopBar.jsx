import { AppBar, Toolbar, IconButton } from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useMenu } from "../context/SideMenuContext";
import { Link, useHistory } from 'react-router-dom';
import UserMenu from './UserMenu';
import { Toaster } from 'react-hot-toast';
import { usePusherContext } from '../context/PusherContext';


function TopBar() {
  const [openSideMenu, setOpenSideMenu] = useMenu();
  const pusherContext = usePusherContext();
  const history = useHistory();

  return (
    <AppBar color="inherit" className={'topbar'}>
      <Toaster
        position="top-right"
        gutter={8}
        containerClassName="toast-container-all"
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: 'toast-container',
          duration: 5000,
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: 'green',
              secondary: 'black',
            },
          },
        }}
      />
      <Toolbar>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setOpenSideMenu(!openSideMenu)}>
          <MenuIcon />
        </IconButton>
        <Link to='/'>[LOGO]</Link>
        <div className={'topbar-spacing'}></div>

        <IconButton className={'topbar-icon'} color="inherit" onClick={() => {history.push("/chat"); }} >
          <Badge badgeContent={pusherContext.useMensagensNaoLidas.mensagensNaoLidas.length} color="secondary">
            <MailIcon />
          </Badge>
        </IconButton>

        <IconButton className={'topbar-icon'} color="inherit">
          <Badge badgeContent={10} color="secondary">
            <NotificationsIcon />
          </Badge>
        </IconButton>

        <UserMenu />

      </Toolbar>
    </AppBar>
  );

}

export default TopBar;