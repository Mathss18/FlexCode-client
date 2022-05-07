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

function ListarProdutos() {
  const history = useHistory();
  const [grupos, setGrupos] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const produtoContext = useProdutoContext();
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
      name: "Valor Custo",
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
      name: "Cadastrado em",
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
    api.get("/produtos")
      .then((response) => {
          response.data["data"].forEach((element) => {
            var array = [
              element["nome"],
              element["codigoInterno"],
              element["grupo_produto"]["nome"],
              `R$: ${element['valorCusto'].toFixed(2)}`,
              `${element["quantidadeAtual"]} ${element["unidade_produto"]?.sigla ?? ''}`,
              element?.cliente?.nome,
              element["fornecedores"].map((item,index)=>{
                if(element["fornecedores"].length > 3){
                  let string = '';
                  if(index < 3){
                    string += item["nome"] + ', ';
                    if(index === 2){
                      string += '... + ' + (element["fornecedores"].length - 3) + ' fornecedores';
                    }
                    return string;
                  }
                }
                else{
                  return item["nome"] + ', ';
                }
              }),
              new Date(element["created_at"]).toLocaleString(),
              <>
                {/* <SearchIcon className={"btn-lista"} onClick={(event) => handleOnClickShowButton(event, element["id"])} /> */}
                <EditIcon className={"btn-lista"} onClick={(event) => handleOnClickEditButton(event, element["id"])} />
              </>,
            ];
            data.push(array);
          });

          setGrupos(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      })
  }, []);

  useEffect(() => {
    produtoContext.formik.resetForm(); // Reseta o formik
  }, []);

  return (
    <>
      <Button onClick={() => history.push("/produtos/novo")} variant="outlined" startIcon={<AddIcon />} className={"btn btn-primary btn-spacing"}>
        Adicionar
      </Button>
      <MUIDataTable title={"Lista de Produtos"} data={grupos} columns={columns} options={config} className={"table-background"} />
    </>
  );
}

export default ListarProdutos;
