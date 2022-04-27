import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import api from '../../../services/api';
import { config, rowConfig } from '../../../config/tablesConfig';
import { Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import { changeFavicon } from "../../../utils/faviconNotification";


function ListarClientePage() {
  const history = useHistory();
  const [clientes, setClientes] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const columns = [
    {
      name: 'Nome',
      options: rowConfig
    },
    {
      name: 'Tipo',
      options: rowConfig
    },
    {
      name: 'Telefone',
      options: rowConfig
    },
    {
      name: 'Celular',
      options: rowConfig
    },
    {
      name: 'Email',
      options: rowConfig
    },
    {
      name: 'Contato',
      options: rowConfig
    },
    {
      name: 'Ações',
      options: rowConfig
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/clientes/mostrar/" + id)
  }

  function handleOnClickEditButton(event, id) {
    history.push("/clientes/editar/" + id)
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get('/clientes')
      .then((response) => {
        response.data['data'].forEach(element => {
          if (element['tipoCliente'] === "pf") {
            element['tipoCliente'] = "Pessoa Física"
          }
          else if (element['tipoCliente'] === "pj") {
            element['tipoCliente'] = "Pessoa Jurídica"
          }
          var array = [
            element['nome'],
            element['tipoCliente'],
            element['telefone'],
            element['celular'],
            element['email'],
            element['contato'],
            <>
              {/* <SearchIcon className={'btn btn-lista'} onClick={(event) => handleOnClickShowButton(event, element['id'])} /> */}
              <EditIcon className={'btn btn-lista'} onClick={(event) => handleOnClickEditButton(event, element['id'])} />
            </>
          ]
          data.push(array);
          


        });
        console.log(data);
        setClientes(data)

      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      })
  }, []);


  return (
    <>
        <Button onClick={() => history.push("/clientes/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>Adicionar</Button>
        <MUIDataTable
          title={"Lista de Clientes"}
          data={clientes}
          columns={columns}
          options={config}
          className={'table-background'}
        />
    </>
  );
}

export default ListarClientePage;