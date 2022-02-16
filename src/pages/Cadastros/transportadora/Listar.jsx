import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from "react-router-dom";
import api from '../../../services/api';
import { config, rowConfig } from '../../../config/tablesConfig';
import { Button } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";


function ListarTransportadoraPage() {
  const history = useHistory();
  const [transportadoras, setTransportadoras] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const columns = [
    {
      name: 'Nome',
      options: rowConfig
    },
    {
      name: 'Grupo',
      options: rowConfig
    },
    {
      name: 'Ativo',
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
    history.push("/transportadoras/mostrar/" + id)
  }

  function handleOnClickEditButton(event, id) {
    history.push("/transportadoras/editar/" + id)
  }



  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get('/transportadoras')
      .then((response) => {
        response.data['data'].forEach(element => {
          if (element['tipoTransportadora'] === "pf") {
            element['tipoTransportadora'] = "Pessoa Física"
          }
          else if (element['tipoTransportadora'] === "pj") {
            element['tipoTransportadora'] = "Pessoa Jurídica"
          }
          var array = [
            element['nome'],
            element['tipoTransportadora'],
            element['telefone'],
            element['celular'],
            element['email'],
            element['contato'],
            <>
              <SearchIcon className={'btn-lista'} onClick={(event) => handleOnClickShowButton(event, element['id'])} />
              <EditIcon className={'btn-lista'} onClick={(event) => handleOnClickEditButton(event, element['id'])} />
            </>
          ]
          data.push(array);

        });
        setTransportadoras(data)

      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      })
  }, []);

  return (
    <>
      {transportadoras.map((transportador, index) => (
        <h4 key={index} >{transportador.nome}</h4>
      ))}
      <Button onClick={() => history.push("/transportadoras/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>Adicionar</Button>
      <MUIDataTable
        title={"Lista de Transportadoras"}
        data={transportadoras}
        columns={columns}
        options={config}
        className={'table-background'}
      />

    </>
  );
}

export default ListarTransportadoraPage;