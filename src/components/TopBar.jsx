import { AppBar, Toolbar, IconButton } from "@material-ui/core/";
import MenuIcon from "@material-ui/icons/Menu";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import NotificationsIcon from "@material-ui/icons/Notifications";
import { useMenu } from "../context/side-menu/SideMenuContext";
import { Link, useHistory } from "react-router-dom";
import UserMenu from "./UserMenu";
import { Toaster } from "react-hot-toast";
import { usePusherContext } from "../context/PusherContext";
import logoEmpresa from "../assets/logoEmpresa.svg";
import PaletteIcon from "@mui/icons-material/Palette";

function TopBar() {
  const [openSideMenu, setOpenSideMenu] = useMenu();
  const pusherContext = usePusherContext();
  const history = useHistory();
  const empresaConfig = JSON.parse(localStorage.getItem("config"));

  return (
    <AppBar color="inherit" className={"topbar"}>

      <Toaster
        position="top-right"
        gutter={8}
        containerClassName="toast-container-all"
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "toast-container",
          duration: 5000,
          // Default options for specific types
          success: {
            duration: 3000,
            theme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
      <Toolbar>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={() => setOpenSideMenu(!openSideMenu)}
        >
          <MenuIcon />
        </IconButton>
        <div style={{cursor: " pointer" }}>
          <img
            src={empresaConfig?.logo ?? 'https://via.placeholder.com/150'}
            alt="logo"
            style={{ height: "50px", width: "180px", objectFit: "contain" }}
            onClick={() => {
              history.push("/");
            }}
          />
        </div>
        <div className={"topbar-spacing"}></div>

        <IconButton
          className={"topbar-icon"}
          color="inherit"
          onClick={() => {
            history.push("/chat");
          }}
        >
          <Badge
            badgeContent={
              pusherContext.useMensagensNaoLidas.mensagensNaoLidas.length
            }
            color="secondary"
          >
            <MailIcon />
          </Badge>
        </IconButton>

        <IconButton
          className={"topbar-icon"}
          color="inherit"
          onClick={() => {
            history.push("/trocar-tema");
          }}
        >
          <Badge color="secondary">
            <PaletteIcon />
          </Badge>
        </IconButton>

        <IconButton className={"topbar-icon"} color="inherit">
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
