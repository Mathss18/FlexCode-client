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
import { useProdutoContext } from "../../../context/GerenciarProdutosContext";
import { Chip } from "@mui/material";

function ListarProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const produtoContext = useProdutoContext();
  const empresaConfig = JSON.parse(localStorage.getItem("config"));
  const columns = [
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Código Interno",
      options: rowConfig,
    },
    {
      name: "Grupo",
      options: rowConfig,
    },
    {
      name: "Custo Final",
      options: rowConfig,
    },
    {
      name: "Estoque",
      options: rowConfig,
    },
    {
      name: "Cliente",
      options: rowConfig,
    },
    {
      name: "Fornecedores",
      options: rowConfig,
    },
    {
      name: "Atualizado em",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];

  const data = [];

  function handleOnClickShowButton(event, id) {
    history.push("/produtos/mostrar/" + id);
  }

  function handleOnClickEditButton(event, id) {
    history.push("/produtos/editar/" + id);
  }

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/produtos-mini")
      .then((response) => {
        response.data["data"].forEach((element) => {
          var qtdFornecedores = element?.fornecedores?.length - 1;
          // console.log("Element", element.fornecedores.length)
          var array = [
            element["nome"],
            element["codigoInterno"],
            element["grupo_produto"]["nome"],
            `R$: ${element["custoFinal"].toFixed(
              empresaConfig.quantidadeCasasDecimaisValor
            )}`,
            `${element["quantidadeAtual"]} ${
              element["unidade_produto"]?.sigla ?? ""
            }`,
            element?.cliente?.nome,

            // element["fornecedores"].map((item,index)=>{
            //   if(element["fornecedores"].length > 3){
            //     let string = '';
            //     if(index < 3){
            //       string += item["nome"] + ', ';
            //       if(index === 2){
            //         string += '... + ' + (element["fornecedores"].length - 3) + ' fornecedores';
            //       }
            //       return string;
            //     }
            //   }
            //   else{
            //     return item["nome"] + ', ';
            //   }
            // }),

            element?.fornecedores?.length === 0 ? null : (
              <>
                <Chip
                  label={element?.fornecedores[0]?.nome}
                  style={{ background: "#585858" }}
                />
                {qtdFornecedores === 0 ? null : (
                  <Chip
                    label={"+" + qtdFornecedores}
                    style={{ background: "#585858", marginLeft: 2 }}
                  />
                )}
              </>
            ),

            new Date(element["updated_at"]).toLocaleString(),
            <>
              {/* <SearchIcon className={"btn-lista"} onClick={(event) => handleOnClickShowButton(event, element["id"])} /> */}
              <EditIcon
                className={"btn-lista"}
                onClick={(event) =>
                  handleOnClickEditButton(event, element["id"])
                }
              />
            </>,
          ];
          data.push(array);
        });

        setGrupos(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  useEffect(() => {
    produtoContext.formik.resetForm(); // Reseta o formik
  }, []);

  return (
    <>
      <Button
        onClick={() => history.push("/produtos/novo")}
        variant="outlined"
        startIcon={<AddIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        Adicionar
      </Button>
      <MUIDataTable
        title={"Lista de Produtos"}
        data={grupos}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default ListarProdutos;
