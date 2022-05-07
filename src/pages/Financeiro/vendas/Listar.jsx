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


function ListarVendas() {
  const history = useHistory();
  const [vendas, setVendas] = useState([]);
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
    history.push("/vendas/editar/" + id)
  }

  function handleOnClickPdfButton(event, item) {
    const BASE_URL = window.location.origin;
    const data = btoa(JSON.stringify(item));
    localStorage.setItem("compraReport", data);

    window.open(`${BASE_URL}/vendas/relatorio`, '_blank');
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get('/vendas')
      .then((response) => {
        response.data['data'].forEach(element => {
          if (element['situacao'] === 0) {
            element['situacao'] = "Aberta"
          }
          else if (element['situacao'] === 1) {
            element['situacao'] = "Realizada"
          }
          else if (element['situacao'] === 2) {
            element['situacao'] = "Cancelada"
          }
          var array = [
            element['numero'],
            element['cliente']['nome'],
            <Chip
                  className="table-tag"
                  label={element['situacao']}
                  color={element['situacao'] === "Aberta" ? "primary" : element['situacao'] === "Realizada" ? "secondary" : "error"}
                  size="small"
                  style={{width: "90px"}}
            />,
            `R$: ${element['total'].toFixed(2)}`,
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
        setVendas(data)

      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      })
  }, []);


  return (
    <>
        <Button onClick={() => history.push("/vendas/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>Adicionar</Button>
        <MUIDataTable
          title={"Lista de Vendas"}
          data={vendas}
          columns={columns}
          options={config}
          className={'table-background'}
        />
    </>
  );
}

export default ListarVendas;