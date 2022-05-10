import { Dialog } from "@mui/material";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import { useState } from "react";
import api from "../../../services/api";

function ModalNovoFavorecido({ open, setOpen, tipoTransacao, setTransacaoOpen }) {
  const [dialogValue, setDialogValue] = useState({
    nome: "",
    tipo: "",
  });

  function handleOnSubmit(event) {
    event.preventDefault();
    api.post("/outros-favorecidos", dialogValue)
    .then((response) => {
      console.log(response)
      setOpen(false);
      window.location.reload();
    })
    .catch((error)=>{})
    .finally(()=>{
      setDialogValue({
        nome: "",
        tipo: "",
      });
    })
  }
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
        setDialogValue({
          nome: "",
          tipo: "",
        });
      }}
    >
      <form onSubmit={handleOnSubmit} className="dialogBackground">
        <DialogTitle className="dialogTitle">
          Novo Favorecido - {tipoTransacao}
        </DialogTitle>
        <DialogContent className="dialogBackground">
          <DialogContentText>
            Precisa de um novo favorecido? Adicione aqui.
          </DialogContentText>
          <TextField
            required
            autoFocus
            margin="dense"
            id="name"
            fullWidth
            value={dialogValue.nome}
            onChange={(event) =>
              setDialogValue({
                ...dialogValue,
                nome: event.target.value,
                tipo: tipoTransacao,
              })
            }
            label="Favorecido"
            type="text"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Grid container spacing={0}>
            <div style={{ marginLeft: "auto", display: "flex" }}>
              <Grid item>
                <Button
                  type="submit"
                  variant="outlined"
                  startIcon={<CheckIcon />}
                  className={"btn btn-primary btn-spacing"}
                >
                  Salvar
                </Button>
              </Grid>
              <Grid item>
                <Button
                  onClick={() => {
                    setOpen(false);
                    setDialogValue({
                      nome: "",
                      tipo: "",
                    });
                  }}
                  variant="outlined"
                  startIcon={<CloseIcon />}
                  className={"btn btn-error btn-spacing"}
                >
                  Cancelar
                </Button>
              </Grid>
            </div>
          </Grid>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ModalNovoFavorecido;
