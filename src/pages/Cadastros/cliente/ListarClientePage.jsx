import { useEffect, useState } from "react";
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import api from '../../../services/api';
import { config, rowConfig } from '../../../config/tablesConfig';
import { Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';


function ListarClientePage() {
  const history = useHistory();
  const [clientes, setClientes] = useState([]);
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

  var isLoading = true;
  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/cliente/mostrar/" + id)
  }

  function handleOnClickEditButton(event, id) {
    history.push("/cliente/editar/" + id)
  }



  useEffect(() => {
    if (!isLoading)
      config.textLabels.body.noMatch = "Nenhum resultado encontrado."

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
              <SearchIcon className={'btn btn-lista'} onClick={(event) => handleOnClickShowButton(event, element['id'])} />
              <EditIcon className={'btn btn-lista'} onClick={(event) => handleOnClickEditButton(event, element['id'])} />
            </>
          ]
          data.push(array);
          isLoading = false;

        });
        setClientes(data)
        isLoading = false;

      })
  }, [isLoading]);

  return (
    <>
      <TopBar />
      <SideMenu>
        {clientes.map((cliente, index) => (
          <h4 key={index} >{cliente.nome}</h4>
        ))}
        <Button onClick={() => history.push("/cliente/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>Adicionar</Button>
        <MUIDataTable
          title={"Lista de Clientes"}
          data={clientes}
          columns={columns}
          options={config}
          className={'table-background'}
        />
      </SideMenu>

    </>
  );
}

export default ListarClientePage;