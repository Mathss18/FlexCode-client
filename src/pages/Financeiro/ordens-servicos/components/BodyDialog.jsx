import {
  Avatar,
  Box,
  Card,
  Container,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";

export default function BodyDialog({ selectedFuncionario, ordemServico }) {
  const [produtos, setProdutos] = useState([]);
  const [foto, setFoto] = useState(
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
  );

  useEffect(() => {
    ordemServico?.funcionarios?.map((funcionario) => {
      if (funcionario.nomeFuncionario === selectedFuncionario) {
        setProdutos(funcionario.produtos);
        setFoto(funcionario.foto);
        console.log("Funcionario", funcionario);
      }
    });
  }, [selectedFuncionario]);

  return (
    <>
      {!selectedFuncionario ? (
        <>
          <div style={{marginLeft: "30px"}}>
            <h1>Selecione um funcionário para visualizar o progresso</h1>
            <h1>Ou aperte esc para sair</h1>
          </div>
        </>
      ) : (
        <>
          <Container maxWidth="xl">
            <Box style={{ display: "flex", justifyContent: "end" }}>
              <div sx={{ display: "block" }}>
                <ListItemText
                  primary={`Ordem de serviço nº ${ordemServico.numero}`}
                  // secondary={`2 de 4 finalizados`} colocar um progress
                />
              </div>
            </Box>
            <Stack direction="row" spacing={2}>
              <Avatar
                alt="Remy Sharp"
                src={foto}
                sx={{ width: 80, height: 80 }}
              />
            </Stack>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                  {selectedFuncionario}
                </Typography>

                <List>
                  {produtos.length === 0 ? (
                    <>
                      <h1>O funcionário não iniciou essa ordem de serviço</h1>
                    </>
                  ) : (
                    produtos.map((produto, index) => {
                      return (
                        <>
                          <ListItem key={index}>
                            <ListItemAvatar>
                              <Avatar
                                style={{
                                  background:
                                    produto.status === true
                                      ? "#43d179"
                                      : "#d14343",
                                }}
                              >
                                {produto.status === true ? (
                                  <CheckIcon style={{ fill: "#000" }} />
                                ) : (
                                  <CloseIcon style={{ fill: "#000" }} />
                                )}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              style={{
                                flex: "none",
                              }}
                              primary={produto.nome}
                              secondary={
                                "Código Interno: " + produto.codigoInterno
                              }
                            />
                            <ListItemText
                              style={{
                                flex: "none",
                                marginLeft: 48,
                              }}
                              primary={"Quantidade: " + produto.quantidade}
                            />
                          </ListItem>
                        </>
                      );
                    })
                  )}
                </List>
              </Grid>
            </Grid>
          </Container>
        </>
      )}
    </>
  );
}
