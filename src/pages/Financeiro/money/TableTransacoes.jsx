import {
  Dialog,
} from "@mui/material";
import {
  Button,
  DialogActions,
  DialogContent,
  Grid,
} from "@material-ui/core";
import { useRef, useState } from "react";
import MUIDataTable from "mui-datatables";
import { config, rowConfig } from "../../../config/tablesConfig";
import ArrowCircleUpIcon from "@mui/icons-material/ArrowCircleUp";
import ArrowCircleDownIcon from "@mui/icons-material/ArrowCircleDown";
import ModalTransacao from "./ModalTransacao";
import moment from "moment";

function TableTransacoes({
  open,
  setOpen,
  dataSelecionada,
  clientes,
  fornecedores,
  transportadoras,
  funcionarios,
  contasBancarias,
  transacoes,
  setTransacoes,
  tableData,
  modalTransacaoOpen,
  setModalTransacaoOpen,
  editTransacao,
  setEditTransacao,
  renderTransicoes

}) {
  const tipoTrans = useRef('');


  const columns = [
    {
      name: "Data",
      options: rowConfig,
    },
    {
      name: "Favorecido",
      options: rowConfig,
    },
    {
      name: "Conta Bancaria",
      options: rowConfig,
    },
    {
      name: "Valor",
      options: rowConfig,
    },
    {
      name: "Situação",
      options: rowConfig,
    },
    {
      name: "Ações",
      options: rowConfig,
    },
  ];


  const handleClose = () => {
    setOpen(false);
  };


  return (
    <>
      {/* Dialog transacoes */}
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth={true}
        maxWidth={"lg"}
      >
        <DialogContent className="dialogBackground" style={{ padding: 0 }}>
          <MUIDataTable
            style={{ boxShadow: "none" }}
            title={(() => {
              return (
                <h2 className="dialogTitle">
                  {"Transações agendadas para " + moment(dataSelecionada).format("DD/MM/YYYY")}
                </h2>
              );
            })()}
            data={tableData}
            columns={columns}
            options={{
              ...config,
              search: false,
              download: false,
              print: false,
              filter: false,
              viewColumns: false,
              customFooter: () => {
                return <></>;
              },
              customToolbar: () => {
                return <></>;
              },
            }}
            className={"dialogBackground"}
          />
        </DialogContent>
        <DialogActions className={"dialogBackground"}>
          <Grid container spacing={0}>
            <div style={{ marginLeft: "auto", display: "flex" }}>
              <Grid item>
                <Button
                  onClick={() => {
                    setEditTransacao(null);
                    tipoTrans.current = 'rendimento';
                    setModalTransacaoOpen(true);
                    setOpen(false);
                  }}
                  variant="outlined"
                  startIcon={<ArrowCircleUpIcon />}
                  className={"btn btn-primary btn-spacing"}
                  >
                  Novo Rendimento
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    setEditTransacao(null);
                    tipoTrans.current = 'despesa';
                    setModalTransacaoOpen(true);
                    setOpen(false);
                  }}
                  variant="outlined"
                  startIcon={<ArrowCircleDownIcon />}
                  className={"btn btn-error btn-spacing"}
                >
                  Nova Despesa
                </Button>
              </Grid>
            </div>
          </Grid>
        </DialogActions>
      </Dialog>

      <ModalTransacao
        open={modalTransacaoOpen}
        setOpen={setModalTransacaoOpen}
        clientes={clientes}
        fornecedores={fornecedores}
        transportadoras={transportadoras}
        funcionarios={funcionarios}
        tipoTransacao={tipoTrans}
        dataSelecionada={dataSelecionada}
        contasBancarias={contasBancarias}
        editTransacao={editTransacao}
        renderTransicoes={renderTransicoes}
      />
    </>
  );
}

export default TableTransacoes;
