import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../../config/tablesConfig";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";

function ListarServicos() {
  const history = useHistory();
  const fullScreenLoader = useFullScreenLoader();
  const [servicos, setServicos] = useState([]);
  const columns = [
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Valor",
      options: rowConfig,
    },
    {
      name: "Cadastro",
      options: rowConfig,
    },
    {
      name: 'Ações',
      options: rowConfig
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/servicos/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/servicos/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api.get("/servicos")
    .then((response) => {
      console.log(response);
      if (response != undefined) {
        response.data["data"].forEach((element) => {
          var array = [
            element["nome"],
            element["valor"].toLocaleString('pt-br', {minimumFractionDigits: 2}),
            new Date(element["created_at"]).toLocaleString(),
            <>
              {/* <SearchIcon className={'btn-lista'} onClick={(event) => handleOnClickShowButton(event, element["id"])} /> */}
              <EditIcon className={'btn-lista'} onClick={(event) => handleOnClickEditButton(event, element["id"])} />
            </>,
          ];
          data.push(array);
        });

        setServicos(data);
      }
    })
    .finally(() => {
      fullScreenLoader.setLoading(false);
    })
  }, []);

  return (
    <>
      {servicos.map((grupo, index) => (
        <h4 key={index}>{grupo.nome}</h4>
      ))}
      <Button onClick={() => history.push("/servicos/novo")} variant="outlined" startIcon={<AddIcon />} className={'btn btn-primary btn-spacing'}>
        Adicionar
      </Button>
      <MUIDataTable title={"Lista de Serviços"} data={servicos} columns={columns} options={config}
        className={'table-background'} />
    </>
  );
}

export default ListarServicos;
