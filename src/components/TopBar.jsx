import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, IconButton } from '@material-ui/core/';
import MenuIcon from '@material-ui/icons/Menu';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import Badge from '@material-ui/core/Badge';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useMenu } from "../context/SideMenuContext";
import { useHistory } from "react-router-dom";
import { Link } from 'react-router-dom';



function TopBar() {
    const [openSideMenu, setOpenSideMenu] = useMenu();
    const history = useHistory();

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

                <Button className={'btn btn-error'} variant="outlined" startIcon={<ExitToAppIcon />}  onClick={() => {
                    localStorage.removeItem('token')
                    history.push("/login")
                }}>Sair</Button>
            </Toolbar>
        </AppBar>
    );

}

export default TopBar;