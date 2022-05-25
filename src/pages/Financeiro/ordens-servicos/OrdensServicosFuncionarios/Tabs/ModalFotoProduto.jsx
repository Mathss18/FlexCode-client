import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

function ModalFotoProduto({ open, setOpen, item }) {
  return (
    <Dialog
      style={{ zIndex: "4000" }}
      open={open}
      onClose={() => {
        setOpen(false);
      }}
      fullWidth={true}
      maxWidth={"md"}
    >
      <DialogContent className="dialogBackground">
        <div>
          <iframe
            style={{ border: "2px solid black" }}
            src={item?.fotoPrincipal}
            width="800"
            height="850"
          ></iframe>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ModalFotoProduto;
