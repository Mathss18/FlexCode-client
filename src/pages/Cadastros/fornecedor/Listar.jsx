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


function ListarFornecedorPage() {
  const history = useHistory();
  const [fornecedores, setFornecedores] = useState([]);
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
    history.push("/fornecedores/mostrar/" + id)
  }

  function handleOnClickEditButton(event, id) {
    history.push("/fornecedores/editar/" + id)
  }



  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get('/fornecedores')
      .then((response) => {
        response.data['data'].forEach(element => {
          if (element['tipoFornecedor'] === "pf") {
            element['tipoFornecedor'] = "Pessoa Física"
          }
          else if (element['tipoFornecedor'] === "pj") {
            element['tipoFornecedor'] = "Pessoa Jurídica"
          }
          var array = [
            element['nome'],
            element['tipoFornecedor'],
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
        setFornecedores(data)

      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      })
  }, []);

  return (
    <>
      <Button onClick={() => history.push("/fornecedores/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>Adicionar</Button>
      <MUIDataTable
        title={"Lista de Fornecedors"}
        data={fornecedores}
        columns={columns}
        options={config}
        className={'table-background'}
      />
    </>
  );
}

export default ListarFornecedorPage;