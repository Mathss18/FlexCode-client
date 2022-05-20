import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import { Button, Tooltip } from "@material-ui/core";
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import SearchIcon from '@material-ui/icons/Search';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { config, rowConfig } from "../../../config/tablesConfig";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import api from "../../../services/api";
import moment from "moment";
import { Chip } from "@mui/material";


function ListarCompras() {
  const history = useHistory();
  const [compras, setCompras] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const empresaConfig = JSON.parse(localStorage.getItem("config"));
  const columns = [
    {
      name: 'Número',
      options: rowConfig
    },
    {
      name: 'Fornecedor',
      options: rowConfig
    },
    {
      name: 'Situacao',
      options: rowConfig
    },
    {
      name: 'Valor da compra',
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
    history.push("/compras/editar/" + id)
  }

  function handleOnClickPdfButton(event, item) {
    const BASE_URL = window.location.origin;
    const data = btoa(JSON.stringify(item));
    localStorage.setItem("compraReport", data);

    window.open(`${BASE_URL}/compras/relatorio`, '_blank');
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get('/compras')
      .then((response) => {
        response.data['data'].forEach(element => {
          if (element['situacao'] === 0) {
            element['situacao'] = "Aberta"
          }
          else if (element['situacao'] === 1) {
            element['situacao'] = "Recebida"
          }
          else if (element['situacao'] === 2) {
            element['situacao'] = "Cancelada"
          }
          var array = [
            element['numero'],
            element['fornecedor']['nome'],
            <Chip
                  className="table-tag"
                  label={element['situacao']}
                  color={element['situacao'] === "Aberta" ? "primary" : element['situacao'] === "Recebida" ? "secondary" : "error"}
                  size="small"
                  style={{width: "90px", backgroundColor: element["situacao"] === "Cancelada" ? '#c55959' : ''}}
            />,
            `R$: ${element['total'].toFixed(empresaConfig.quantidadeCasasDecimaisValor)}`,
            moment(element["dataEntrada"]).format('DD/MM/YYYY'),
            <>
              <Tooltip title={'Baixar PDF'} arrow>
                <InsertDriveFileIcon className={'btn btn-lista'} onClick={(event) => handleOnClickPdfButton(event, element)} />
              </Tooltip>
              {/* <SearchIcon className={'btn btn-lista'} onClick={(event) => handleOnClickShowButton(event, element['id'])} /> */}
              <EditIcon className={'btn btn-lista'} onClick={(event) => handleOnClickEditButton(event, element['id'])} />
            </>
          ]
          data.push(array);
          


        });
        setCompras(data)

      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      })
  }, []);


  return (
    <>
        <Button onClick={() => history.push("/compras/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>Adicionar</Button>
        <MUIDataTable
          title={"Lista de Compras"}
          data={compras}
          columns={columns}
          options={config}
          className={'table-background'}
        />
    </>
  );
}

export default ListarCompras;