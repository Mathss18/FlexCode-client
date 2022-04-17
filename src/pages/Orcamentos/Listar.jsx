import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import { Button, Tooltip } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { config, rowConfig } from "../../config/tablesConfig";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import api from "../../services/api";
import moment from "moment";


function ListarOrcamentos() {
  const history = useHistory();
  const [orcamentos, setOrcamentos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const columns = [
    {
      name: 'Número',
      options: rowConfig
    },
    {
      name: 'Cliente',
      options: rowConfig
    },
    {
      name: 'Situacao',
      options: rowConfig
    },
    {
      name: 'Data Entrada',
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
    history.push("/orcamentos/editar/" + id)
  }

  function handleOnClickPdfButton(event, item) {
    console.log(event, item);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get('/orcamentos')
      .then((response) => {
        response.data['data'].forEach(element => {
          if (element['situacao'] === 0) {
            element['situacao'] = "Aberto"
          }
          else if (element['situacao'] === 1) {
            element['situacao'] = "Aprovado"
          }
          else if (element['situacao'] === 2) {
            element['situacao'] = "Reprovado"
          }
          var array = [
            element['numero'],
            element['cliente']['nome'],
            element['situacao'],
            moment(element["dataEntrada"]).format('DD/MM/YYYY'),
            <>
              <Tooltip title={'Baixar PDF'} arrow>
                <InsertDriveFileIcon className={'btn btn-lista'} onClick={(event) => handleOnClickPdfButton(event, element)} />
              </Tooltip>
              <SearchIcon className={'btn btn-lista'} onClick={(event) => handleOnClickShowButton(event, element['id'])} />
              <EditIcon className={'btn btn-lista'} onClick={(event) => handleOnClickEditButton(event, element['id'])} />
            </>
          ]
          data.push(array);
          


        });
        setOrcamentos(data)

      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      })
  }, []);


  return (
    <>
        <Button onClick={() => history.push("/orcamentos/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>Adicionar</Button>
        <MUIDataTable
          title={"Lista de Orçamentos"}
          data={orcamentos}
          columns={columns}
          options={config}
          className={'table-background'}
        />
    </>
  );
}

export default ListarOrcamentos;