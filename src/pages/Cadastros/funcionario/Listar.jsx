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



function ListarFuncionarioPage() {
  const history = useHistory();
  const [funcionarios, setFuncionarios] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const [grupos, setGrupos] = useState([]);
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
      name: 'Ações',
      options: rowConfig
    },
  ];
  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/funcionarios/mostrar/" + id)
  }

  function handleOnClickEditButton(event, id) {
    history.push("/funcionarios/editar/" + id)
  }



  useEffect(() => {
    fullScreenLoader.setLoading(true);

    api.get('/funcionarios')
      .then((response) => {
        response.data['data'].forEach(element => {
          if (element['situacao'] === 1) {
            element['ativo'] = "Sim"
          }
          else if (element['situacao'] === 0) {
            element['ativo'] = "Não"
          }

          var array = [
            element['nome'],
            element['grupo']['nome'],
            element['ativo'],
            element['celular'],
            element['email'],
            <>
              <SearchIcon className={'btn-lista'} onClick={(event) => handleOnClickShowButton(event, element['id'])} />
              <EditIcon className={'btn-lista'} onClick={(event) => handleOnClickEditButton(event, element['id'])} />
            </>
          ]
          data.push(array);

        });
        setFuncionarios(data)

      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      })
  }, []);

  return (
    <>
      {funcionarios.map((funcionario, index) => (
        <h4 key={index} >{funcionario.nome}</h4>
      ))}
      <Button onClick={() => history.push("/funcionarios/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>Adicionar</Button>
      <MUIDataTable
        title={"Lista de Funcionarios"}
        data={funcionarios}
        columns={columns}
        options={config}
        className={'table-background'}
      />

    </>
  );
}

export default ListarFuncionarioPage;