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

function ModalNovoFavorecido({ open, setOpen, tipoTransacao }) {
  const [dialogValue, setDialogValue] = useState({
    favorecido: "",
  });
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <form onSubmit={() => {}} className="dialogBackground">
        <DialogTitle className="dialogTitle">
          Novo Favorecido - {tipoTransacao}
        </DialogTitle>
        <DialogContent className="dialogBackground">
          <DialogContentText>
            Precisa de um novo favorecido? Adicione aqui.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            fullWidth
            value={dialogValue.favorecido}
            onChange={(event) =>
              setDialogValue({
                ...dialogValue,
                favorecido: event.target.value,
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
