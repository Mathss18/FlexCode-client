import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import { config, rowConfig } from "../../config/tablesConfig";
import { Button, Chip } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import SearchIcon from "@material-ui/icons/Search";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";

function ListarConfiguracoesPage() {
  const history = useHistory();
  const [configuracoes, setConfiguracoes] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const columns = [
    {
      name: "Nome/Razão Social",
      options: rowConfig,
    },
    {
      name: "CPF/CNPJ",
      options: rowConfig,
    },
    {
      name: "email",
      options: rowConfig,
    },
    {
      name: "Situacao",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/configuracoes/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/configuracoes/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/configuracoes")
      .then((response) => {
        response.data["data"].forEach((element) => {
          if (element["situacao"] === 0) {
            element["situacao"] = "Inativa";
          } else if (element["situacao"] === 1) {
            element["situacao"] = "Ativa";
          }
          var array = [
            element["nome"],
            element["cpfCnpj"],
            element["email"],
            <Chip
              className="table-tag"
              label={element["situacao"]}
              color={
                element["situacao"] === "Ativa"
                  ? "primary"
                  : "error"
              }
              size="small"
              style={{ width: "90px", backgroundColor: element["situacao"] === "Inativa" ? '#c55959' : '' }}
            />,
            <>
              {/* <SearchIcon className={'btn btn-lista'} onClick={(event) => handleOnClickShowButton(event, element['id'])} /> */}
              <EditIcon
                className={"btn btn-lista"}
                onClick={(event) =>
                  handleOnClickEditButton(event, element["id"])
                }
              />
            </>,
          ];
          data.push(array);
        });
        setConfiguracoes(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  return (
    <>
      <Button
        onClick={() => history.push("/configuracoes/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>
      <MUIDataTable
        title={"Lista de Configurações"}
        data={configuracoes}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarConfiguracoesPage;
