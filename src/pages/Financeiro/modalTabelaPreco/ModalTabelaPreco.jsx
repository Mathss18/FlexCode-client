import { useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import api from "../../../services/api";

function ModalTabelaPreco({ produto, open, setOpen }) {
  useEffect(() => {
    if (!produto) return;
    console.log(produto);
  }, [produto]);

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      fullWidth={true}
      maxWidth={"sm"}
    >
      <div className="dialogBackground">
        <DialogTitle className="dialogTitle">
          Tabela de Preço - {produto?.nome}
        </DialogTitle>
        <DialogContent className="dialogBackground">
          <table style={{ width: "100%" }} className="dialogTitle">
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>Descrição</th>
              <th style={{ textAlign: "left", padding: 8 }}>Porcentagem</th>
              <th style={{ textAlign: "left", padding: 8 }}>Valor de Venda</th>
            </tr>
            {produto?.grupo_produto?.porcentagem_lucro.map((item, index) => {
              return (
                <tr>
                  <td style={{ textAlign: "left", padding: 8 }}>
                    {item?.descricao}
                  </td>
                  <td style={{ textAlign: "left", padding: 8 }}>
                    {item?.porcentagem}%
                  </td>
                  <td style={{ textAlign: "left", padding: 8 }}>
                    R$: {(produto.custoFinal +
                      produto.custoFinal * (item?.porcentagem / 100)).toFixed(2)}
                  </td>
                </tr>
              );
            })}
          </table>
        </DialogContent>
        <DialogActions>
          <Grid container spacing={0}>
            <div style={{ marginLeft: "auto", display: "flex" }}>
              <Grid item>
                <Button
                  onClick={() => {
                    setOpen(false);
                  }}
                  type="button"
                  variant="outlined"
                  startIcon={<CheckIcon />}
                  className={"btn btn-primary btn-spacing"}
                >
                  Entendido
                </Button>
              </Grid>
            </div>
          </Grid>
        </DialogActions>
      </div>
    </Dialog>
  );
}

export default ModalTabelaPreco;
