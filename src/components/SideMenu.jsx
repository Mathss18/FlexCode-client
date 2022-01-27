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
import PeopleAltIcon from '@material-ui/icons/PeopleAlt';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import WorkIcon from '@material-ui/icons/Work';
import AddBoxIcon from '@material-ui/icons/AddBox';
import GroupsIcon from '@mui/icons-material/Groups';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import InventoryIcon from '@mui/icons-material/Inventory';
import LayersIcon from '@mui/icons-material/Layers';
import SchemaIcon from '@mui/icons-material/Schema';
import { useRef } from "react";
import { useCadastroMenu } from "../context/SideMenuCadastroContext";
import { useProdutoMenu } from "../context/SideMenuProdutoContext";
import { useMenu } from "../context/SideMenuContext";

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
    console.log('[RENDERS SIDE MENU: ]',renders.current++);
    
    const classes = useStyles();
    const history = useHistory();
    const [openCadastroList, setOpenCadastroList] = useCadastroMenu();
    const [openProdutoList, setOpenProdutoList] = useProdutoMenu();
    const [openSideMenu, setOpenSideMenu] = useMenu();

    // Função que controla se Side Menu esta aberto ou fechado
    const handleDrawerClose = () => {
        setOpenSideMenu(!openSideMenu);
    };

    // Função que controla se Lista de cadastros esta aberto ou fechado
    const handleOpenCadastroList = () => {
        setOpenCadastroList(!openCadastroList);
    };

    const handleOpenProdutosList = () => {
        setOpenProdutoList(!openProdutoList);
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
                    <Link to="/home">Flex Code</Link>
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
                    <ListItem button onClick={handleOpenCadastroList}>
                        <ListItemIcon>
                            <AddBoxIcon className={"sidemenu-text"}/>
                        </ListItemIcon>
                        <ListItemText className={"sidemenu-text"} primary="Cadastros"/>
                        {openCadastroList ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>

                    <Collapse in={openCadastroList} timeout="auto" unmountOnExit>
                        <List onClick={() => history.push("/clientes")} disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <PeopleAltIcon className={"sidemenu-text"} />
                                </ListItemIcon>
                                <ListItemText className={"sidemenu-text"} primary="Clientes" />
                            </ListItem>
                        </List>

                        <List onClick={() => history.push("/fornecedores")} disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <ShoppingBasketIcon className={"sidemenu-text"}/>
                                </ListItemIcon>
                                <ListItemText className={"sidemenu-text"} primary="Fornecedores" />
                            </ListItem>
                        </List>

                        <List onClick={() => history.push("/transportadoras")} disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <LocalShippingIcon className={"sidemenu-text"}/>
                                </ListItemIcon>
                                <ListItemText className={"sidemenu-text"} primary="Transportadoras" />
                            </ListItem>
                        </List>

                        <List onClick={() => history.push("/funcionarios")} disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <WorkIcon className={"sidemenu-text"}/>
                                </ListItemIcon>
                                <ListItemText className={"sidemenu-text"} primary="Funcionarios" />
                            </ListItem>
                        </List>
                        
                        <List onClick={() => history.push("/grupos")} disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <GroupsIcon className={"sidemenu-text"}/>
                                </ListItemIcon>
                                <ListItemText className={"sidemenu-text"} primary="Grupos" />
                            </ListItem>
                        </List>

                    </Collapse>

                    <ListItem button onClick={handleOpenProdutosList}>
                        <ListItemIcon>
                            <ShoppingCartIcon className={"sidemenu-text"}/>
                        </ListItemIcon>
                        <ListItemText className={"sidemenu-text"} primary="Produtos" />
                        {openProdutoList ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>

                    <Collapse in={openProdutoList} timeout="auto" unmountOnExit>
                        <List onClick={() => history.push("/produtos")} disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <LayersIcon className={"sidemenu-text"}/>
                                </ListItemIcon>
                                <ListItemText className={"sidemenu-text"} primary="Produtos" />
                            </ListItem>
                        </List>
                        <List onClick={() => history.push("/grupos-produtos")} disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <AutoAwesomeMotionIcon className={"sidemenu-text"}/>
                                </ListItemIcon>
                                <ListItemText className={"sidemenu-text"} primary="Grupos de Produtos" />
                            </ListItem>
                        </List>
                        <List onClick={() => history.push("/unidades-produtos")} disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <InventoryIcon className={"sidemenu-text"}/>
                                </ListItemIcon>
                                <ListItemText className={"sidemenu-text"} primary="Unidades de Produtos" />
                            </ListItem>
                        </List>
                        <List onClick={() => history.push("/grades-variacoes")} disablePadding>
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                    <SchemaIcon className={"sidemenu-text"}/>
                                </ListItemIcon>
                                <ListItemText className={"sidemenu-text"} primary="Grades/Variações" />
                            </ListItem>
                        </List>
                    </Collapse>

                    <ListItem button>
                        <ListItemIcon>
                            <SendIcon className={"sidemenu-text"}/>
                        </ListItemIcon>
                        <ListItemText className={"sidemenu-text"} primary="Sent mail" />
                    </ListItem>

                    <ListItem button>
                        <ListItemIcon>
                            <DraftsIcon className={"sidemenu-text"}/>
                        </ListItemIcon>
                        <ListItemText className={"sidemenu-text"} primary="Drafts" />
                    </ListItem>
                </List>
                <Divider />
            </Drawer>
            <main className={clsx(classes.content, { [classes.contentShift]: openSideMenu })}>
                <div className={classes.drawerHeader} />
                {children}
            </main>
        </div>
    );
}

export default SideMenu;
