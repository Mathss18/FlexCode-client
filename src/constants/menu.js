import HomeIcon from '@mui/icons-material/Home';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import WorkIcon from '@material-ui/icons/Work';
import AddBoxIcon from '@material-ui/icons/AddBox';
import GroupsIcon from '@mui/icons-material/Groups';
import ShoppingBasketIcon from '@material-ui/icons/ShoppingBasket';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import InventoryIcon from '@mui/icons-material/Inventory';
import ConstructionIcon from '@mui/icons-material/Construction';
import CalculateIcon from '@mui/icons-material/Calculate';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PaidIcon from '@mui/icons-material/Paid';
import LanIcon from '@mui/icons-material/Lan';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import PaymentsIcon from '@mui/icons-material/Payments';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PeopleIcon from '@mui/icons-material/People';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import StorageIcon from '@mui/icons-material/Storage';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RoomServiceIcon from '@mui/icons-material/RoomService';
import BalanceIcon from '@mui/icons-material/Balance';
import EqualizerIcon from '@mui/icons-material/Equalizer';

const user = JSON.parse(localStorage.getItem("user"));

export const menu = [
  {
    title: 'Home',
    path: '/',
    icon: <HomeIcon className={"sidemenu-text"} />,
    className: 'sidemenu-text',
    click: '()=>{history.push(`/`)}',
    state: null,
    collapse: false,
    children: [],
  },
  {
    title: 'Minhas Tarefas',
    path: '/ordens-servicos-funcionarios',
    icon: <RoomServiceIcon className={"sidemenu-text"} />,
    className: 'sidemenu-text',
    click: `()=>{history.push('/ordens-servicos-funcionarios/${user?.id}')}`,
    state: null,
    collapse: false,
    children: [],
  },
  {
    title: 'Cadastros',
    path: null,
    icon: <AddBoxIcon className={"sidemenu-text"} />,
    className: 'sidemenu-text',
    click: 'handleOpenCadastroList',
    state: ['openCadastroList', 'setOpenCadastroList'],
    collapse: true,
    children: [
      {
        title: 'Clientes',
        path: '/clientes',
        icon: <PeopleIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Fornecedores',
        path: '/fornecedores',
        icon: <ShoppingBasketIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Transportadoras',
        path: '/transportadoras',
        icon: <LocalShippingIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Funcionários',
        path: '/funcionarios',
        icon: <WorkIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Grupos',
        path: '/grupos',
        icon: <GroupsIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
    ],
  },
  {
    title: 'Produtos',
    path: null,
    icon: <LanIcon className={"sidemenu-text"} />,
    className: 'sidemenu-text',
    click: 'handleOpenProdutosList',
    state: ['openProdutoList', 'setOpenProdutoList'],
    collapse: true,
    children: [
      {
        title: 'Produtos',
        path: '/produtos',
        icon: <LanIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Grupos de Produtos',
        path: '/grupos-produtos',
        icon: <AutoAwesomeMotionIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Unidades de Produtos',
        path: '/unidades-produtos',
        icon: <InventoryIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Porcentagens de Lucros',
        path: '/porcentagens-lucros',
        icon: <CalculateIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
    ],
  },
  {
    title: 'Serviços',
    path: null,
    icon: <ConstructionIcon className={"sidemenu-text"} />,
    className: 'sidemenu-text',
    click: 'handleOpenServicoList',
    state: ['openServicoList', 'setOpenServicoList'],
    collapse: true,
    children: [
      {
        title: 'Serviços',
        path: '/servicos',
        icon: <ConstructionIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
    ],
  },
  {
    title: 'Financeiro',
    path: null,
    icon: <PaidIcon className={"sidemenu-text"} />,
    className: 'sidemenu-text',
    click: 'handleOpenFinanceiroList',
    state: ['openFinanceiroList', 'setOpenFinanceiroList'],
    collapse: true,
    children: [
      {
        title: 'Money',
        path: '/money',
        icon: <CalendarMonthIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Contas Bancárias',
        path: '/contas-bancarias',
        icon: <AccountBalanceIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Compras',
        path: '/compras',
        icon: <ShoppingCartIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Vendas',
        path: '/vendas',
        icon: <LocalAtmIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Orçamentos',
        path: '/orcamentos',
        icon: <AssignmentIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Ordens de Serviço',
        path: '/ordens-servicos',
        icon: <LinearScaleIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
      {
        title: 'Formas de Pagamento',
        path: '/formas-pagamentos',
        icon: <PaymentsIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
    ],
  },
  {
    title: 'Notas Físcais',
    path: null,
    icon: <BalanceIcon className={"sidemenu-text"} />,
    className: 'sidemenu-text',
    click: 'handleOpenNotaFiscalList',
    state: ['openNotaFiscalList', 'setOpenNotaFiscalList'],
    collapse: true,
    children: [
      {
        title: 'Notas Físcais',
        path: '/notas-fiscais',
        icon: <BalanceIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
    ],
  },
  {
    title: 'Estoque',
    path: null,
    icon: <StorageIcon className={"sidemenu-text"} />,
    className: 'sidemenu-text',
    click: 'handleOpenEstoqueList',
    state: ['openEstoqueList', 'setOpenEstoqueList'],
    collapse: true,
    children: [
      {
        title: 'Estoque',
        path: '/estoques',
        icon: <StorageIcon className={"sidemenu-text"} />,
        className: 'sidemenu-text',
        click: '()=>{}',
        state: null,
        collapse: false,
        children: [],
      },
    ],
  },
  {
    title: 'Relatórios',
    path: '/relatorios',
    icon: <EqualizerIcon className={"sidemenu-text"} />,
    className: 'sidemenu-text',
    click: '()=>{history.push(`/relatorios`)}',
    state: null,
    collapse: false,
    children: [],
  },
]