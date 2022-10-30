import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";

export default function AppBarDialog({
  nomesFuncionarios,
  setSelectedFuncionario,
}) {
  return (
    <>
      <AppBar position="static" style={{ background: "#22252a" }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box
              sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              {nomesFuncionarios?.map((nome) => (
                <Button
                  className={"btn btn-primary"}
                  onClick={() => setSelectedFuncionario(nome)}
                  key={nome}
                  sx={{
                    my: 2,
                    color: "white",
                    display: "block",
                  }}
                >
                  {nome}
                </Button>
              ))}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </>
  );
}
