import { makeStyles } from "@material-ui/core/styles";
import {
  Drawer,
  IconButton,
  List,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText,
  Collapse,
  ListSubheader,
  Link,
} from "@material-ui/core/";
import { useHistory } from "react-router-dom";
import clsx from "clsx";

import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import { useRef } from "react";
import { useCadastroMenu } from "../context/side-menu/SideMenuCadastroContext";
import { useProdutoMenu } from "../context/side-menu/SideMenuProdutoContext";
import { useMenu } from "../context/side-menu/SideMenuContext";
import { useServicoMenu } from "../context/side-menu/SideMenuServicoContext";
import { menu } from "../constants/menu";
import { useFinanceiroMenu } from "../context/side-menu/SideMenuFinanceiroContext";
import { useEstoqueMenu } from "../context/side-menu/SideMenuEstoqueContext";
import { useNotaFiscalMenu } from "../context/side-menu/SideMenuNotaFiscalContext";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: "flex-end",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: -drawerWidth,
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginLeft: 0,
  },
  nested: {
    paddingLeft: theme.spacing(4),
  },
}));

function SideMenu({ children }) {
  const renders = useRef(0);
  console.log('[RENDERS SIDE MENU: ]', renders.current++);

  const classes = useStyles();
  const history = useHistory();
  const [openCadastroList, setOpenCadastroList] = useCadastroMenu();
  const [openProdutoList, setOpenProdutoList] = useProdutoMenu();
  const [openServicoList, setOpenServicoList] = useServicoMenu();
  const [openFinanceiroList, setOpenFinanceiroList] = useFinanceiroMenu();
  const [openEstoqueList, setOpenEstoqueList] = useEstoqueMenu();
  const [openNotaFiscalList, setOpenNotaFiscalList] = useNotaFiscalMenu();
  const [openSideMenu, setOpenSideMenu] = useMenu();

  // Função que controla se Side Menu esta aberto ou fechado
  const handleDrawerClose = () => {
    setOpenSideMenu(!openSideMenu);
  };

  // Função que controla se Lista de cadastros esta aberto ou fechado (Mesmo não 'sendo usada', deve existir por é chamada no arquivo de menu)
  const handleOpenCadastroList = () => {
    setOpenCadastroList(!openCadastroList);
  };

  const handleOpenServicoList = () => {
    setOpenServicoList(!openServicoList);
  };

  const handleOpenProdutosList = () => {
    setOpenProdutoList(!openProdutoList);
  }

  const handleOpenFinanceiroList = () => {
    setOpenFinanceiroList(!openFinanceiroList);
  }

  const handleOpenEstoqueList = () => {
    setOpenEstoqueList(!openEstoqueList);
  }

  const handleOpenNotaFiscalList = () => {
    setOpenNotaFiscalList(!openNotaFiscalList);
  }

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={openSideMenu}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.drawerHeader}>
          <Link to="/home">[LOGO]</Link>
          <IconButton onClick={handleDrawerClose}>
            <ChevronLeftIcon />
          </IconButton>
        </div>
        <Divider />
        <List
          className={"sidemenu-list"}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Menu Lateral
            </ListSubheader>
          }
        >
          {menu.map((item, index) => {
            return (
              <>
                <ListItem button onClick={eval(item.click)} key={index}>
                  <ListItemIcon>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText className={item.className} primary={item.title} />
                  {(() => { if (item.collapse) { return eval(item.state[0]) ? <ExpandLess /> : <ExpandMore /> } })()}
                </ListItem>
                {item.collapse && (
                  <Collapse in={eval(item.state[0])} timeout="auto" unmountOnExit>
                    {item.children.map((child, index) => {
                      return (
                        <List onClick={() => history.push(`${child.path}`)} disablePadding key={index}>
                          <ListItem button className={classes.nested}>
                            <ListItemIcon>
                              {child.icon}
                            </ListItemIcon>
                            <ListItemText className={child.className} primary={child.title} />
                          </ListItem>
                        </List>
                      )
                    })}
                  </Collapse>
                )}
              </>
            )
          })}
        </List>
        <Divider />
      </Drawer>
      <main id="content-container-full" className={clsx(classes.content, { [classes.contentShift]: openSideMenu })}>
        <div className={classes.drawerHeader} />
        {children}
      </main>
    </div>
  );
}

export default SideMenu;
