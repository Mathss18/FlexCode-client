import { useEffect, useState } from "react";
import MUIDataTable from "mui-datatables";
import { useHistory, useParams } from "react-router-dom";
import api from "../../services/api";
import { config, rowConfig } from "../../config/tablesConfig";
import { Button } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { useFullScreenLoader } from "../../context/FullScreenLoaderContext";
import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";
import * as locales from "react-date-range/dist/locale";
import { defaultStaticRanges } from "./range";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import moment from "moment";

function MovimentacoesPage() {
  const history = useHistory();
  const { id } = useParams();
  const [movimentacoes, setMovimentacoes] = useState([]);
  const fullScreenLoader = useFullScreenLoader();
  const [produto, setProduto] = useState(null);

  const [clientes, setClientes] = useState(null);
  const [fornecedores, setFornecedores] = useState(null);
  const [usuarios, setUsuarios] = useState(null);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const columns = [
    {
      name: "Data",
      options: rowConfig,
    },
    {
      name: "Entidade",
      options: rowConfig,
    },
    {
      name: "Tipo",
      options: rowConfig,
    },
    {
      name: "Qtde movimentada",
      options: rowConfig,
    },
    {
      name: "Qtde disponível",
      options: rowConfig,
    },
    {
      name: "Custo unitário",
      options: rowConfig,
    },
    {
      name: "Total",
      options: rowConfig,
    },
    {
      name: "Descrição da ação",
      options: rowConfig,
    },
  ];

  const data = [];

  useEffect(() => {
    console.log(state);
    if (!produto || !clientes || !fornecedores || !usuarios) return;
    if(open) return;

    fullScreenLoader.setLoading(true);
    api
      .get(`/estoques/movimentacoes/${id}?startDate=${moment(state[0].startDate).format('YYYY-MM-DD')}&endDate=${moment(state[0].endDate).format('YYYY-MM-DD')}`)
      .then((response) => {
        response.data["data"].forEach((element) => {
          if (element["tipoCliente"] === "pf") {
            element["tipoCliente"] = "Pessoa Física";
          } else if (element["tipoCliente"] === "pj") {
            element["tipoCliente"] = "Pessoa Jurídica";
          }
          var array = [
            new Date(element["created_at"]).toLocaleString(),
            element["fornecedor_id"] !== null
              ? fornecedores.map((item) => {
                  if (item.id === element["fornecedor_id"]) {
                    return item.nome;
                  }
                })
              : element["cliente_id"] !== null
              ? clientes.map((item) => {
                  if (item.id === element["cliente_id"]) {
                    return item.nome;
                  }
                })
              : usuarios.map((item) => {
                  if (item.id === element["usuario_id"]) {
                    return item.nome;
                  }
                }),
            element["tipo"],
            element["tipo"]==='entrada' ? `${element["quantidade"]} ${produto.unidade_produto?.sigla ?? ""}` : `-${element["quantidade"]} ${produto.unidade_produto?.sigla ?? ""}`,
            `${element["quantidadeMomento"]} ${produto.unidade_produto?.sigla ?? ""}`,
            `R$: ${element["preco"].toFixed(2)}`,
            `R$: ${(element["quantidade"] * element["preco"]).toFixed(2)}`,
            element["observacao"],
          ];
          data.push(array);
        });
        setMovimentacoes(data);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, [produto, clientes, fornecedores, usuarios, open]);

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/produtos/" + id)
      .then((response) => {
        setProduto(response.data["data"]);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/clientes")
      .then((response) => {
        setClientes(response.data["data"]);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/fornecedores")
      .then((response) => {
        setFornecedores(response.data["data"]);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  useEffect(() => {
    fullScreenLoader.setLoading(true);
    api
      .get("/usuarios")
      .then((response) => {
        setUsuarios(response.data["data"]);
      })
      .finally(() => {
        fullScreenLoader.setLoading(false);
      });
  }, []);

  function handleClose(){
    setOpen(false);

  }

  return (
    <>
      <Dialog
        fullWidth={false}
        maxWidth={"lg"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Optional sizes</DialogTitle>
        <DialogContent>
          <DateRangePicker
            onChange={(item) => setState([item.selection])}
            showSelectionPreview={true}
            moveRangeOnFirstSelection={false}
            months={2}
            ranges={state}
            direction="horizontal"
            locale={locales.pt}
            dateDisplayFormat={"dd/MM/yyyy"}
            staticRanges={defaultStaticRanges}
            showMonthAndYearPickers={true}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
          >
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Button
        onClick={() => setOpen(true)}
        variant="outlined"
        startIcon={<CalendarMonthIcon />}
        className={"btn btn-primary btn-spacing"}
      >
        {`${new Date(state[0].startDate).toLocaleString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })} - ${new Date(state[0].endDate).toLocaleString("pt-BR", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
        })}`}
      </Button>
      <MUIDataTable
        title={
          "Movimentações de " + produto?.nome + " - " + produto?.codigoInterno
        }
        data={movimentacoes}
        columns={columns}
        options={config}
        className={"table-background"}
      />
    </>
  );
}

export default MovimentacoesPage;
