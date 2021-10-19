import { useEffect, useState } from "react";
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
import api from '../../../services/api';
import { makeStyles } from '@material-ui/core/styles';
import { config, rowConfig } from '../../../config/tablesConfig';
import SearchIcon from '@material-ui/icons/Search';
import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles((theme) => ({
  optionsButtons: {
    border: '1px solid #3f51b5',
    borderRadius: '6px',
    boxShadow: "2px 2px #757575",
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    marginRight: theme.spacing(1),
    padding: 2,
    fontSize: '28px',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: theme.palette.secondary.main,
    },
  },
  saveButton: {
    marginBottom: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    color: '#fff',
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(2),
    '&:hover': {
      backgroundColor: '#fff',
      color: theme.palette.primary.main,
    },
  },
}));

function ListarProdutoPage() {
  const [produtos, setProdutos] = useState([]);
  const classes = useStyles();

  var isLoading = true;
  const data = [];

  useEffect(() => {

    api.get('/produtos')
      .then((response) => {
        data.push(response.data);
        isLoading = false;
        
        setProdutos(data)
        isLoading = false;
      })
  }, [isLoading]);
  return (
    <>
    <TopBar />
    <SideMenu>
    {produtos}
    </SideMenu>
    
    </>
  )
};

export default ListarProdutoPage;
