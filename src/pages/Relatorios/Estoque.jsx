import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react";
import { config, rowConfig } from "../../config/tablesConfig";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import api from "../../services/api";

export default function Estoque() {
  const fullScreenLoader = useFullScreenLoader();
  const [estoque, setEstoque] = useState([]);
  const data = [];
  const [totalEstoque, setTotalEstoque] = useState(0);
  const empresaConfig = JSON.parse(localStorage.getItem("config"));
  const columns = [
    {
      name: "Nome",
      options: rowConfig,
    },
    {
      name: "Codigo Interno",
      options: rowConfig,
    },
    {
      name: "Grupo",
      options: rowConfig,
    },
    {
      name: "Valor unitário",
      options: rowConfig,
    },
    {
      name: "Estoque",
      options: rowConfig,
    },
    {
      name: "Total",
      options: rowConfig,
    },
  ];

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/produtos-mini")
      .then((response) => {
        let total = 0;

        response.data["data"].forEach((element) => {
          const totalEstoque = element.quantidadeAtual * element.custoFinal;
          total += totalEstoque;

          var array = [
            element["nome"],
            element["codigoInterno"],
            element["grupo_produto"]["nome"],
            element["custoFinal"].toLocaleString("pt-BR", {style:"currency", currency:"BRL"}),
            element["quantidadeAtual"].toFixed(empresaConfig.quantidadeCasasDecimaisQuantidade),
            totalEstoque.toLocaleString("pt-BR", {style:"currency", currency:"BRL"}),
          ];
          data.push(array);
        });
        setTotalEstoque(total);
        setEstoque(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  return (
    <>
      <MUIDataTable
        title={"Estoque"}
        data={estoque}
        columns={columns}
        options={config}
        className={"table-background"}
      />
      <h3>TOTAL: {totalEstoque.toLocaleString("pt-BR", {style:"currency", currency:"BRL"})}</h3>
    </>
  );
}
