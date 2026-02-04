import {
  Avatar,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import BubbleChartIcon from "@mui/icons-material/BubbleChart";

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
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            p: 4,
          }}
        >
          <BubbleChartIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
          <Typography variant="h5" color="text.secondary" sx={{ fontWeight: 500, mb: 1 }}>
            Selecione um funcionário para visualizar o progresso
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Ou pressione ESC para sair
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            p: { xs: 2, sm: 3, md: 3 },
            minHeight: "60vh",
            width: "100%",
          }}
          className="cardBackground"
        >
          {/* Header com info do funcionário */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
              mb: 4,
              pb: 3,
              borderBottom: 2,
              borderColor: "divider",
            }}
          >
            <Avatar
              alt={selectedFuncionario}
              src={foto}
              sx={{ width: 80, height: 80, boxShadow: 3 }}
            />
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
                {selectedFuncionario}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Ordem de serviço nº {ordemServico.numero}
              </Typography>
              <Chip
                label={`${produtos.filter(p => p.status).length}/${produtos.length} itens concluídos`}
                size="small"
                color={produtos.filter(p => p.status).length === produtos.length ? "success" : "primary"}
                sx={{ mt: 1, fontWeight: 600 }}
              />
            </Box>
          </Box>

          {/* Seção de Produtos */}
          {produtos.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 10,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <BubbleChartIcon sx={{ fontSize: 64, color: "text.disabled" }} />
              <Typography
                variant="h6"
                color="text.secondary"
                sx={{ fontWeight: 500 }}
              >
                O funcionário não iniciou essa ordem de serviço
              </Typography>
            </Box>
          ) : (
            <Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 3,
                  pb: 2,
                  borderBottom: 2,
                  borderColor: "primary.main",
                }}
              >
                <BubbleChartIcon sx={{ color: "primary.main", fontSize: 32 }} />
                <Typography
                  variant="h5"
                  sx={{ fontWeight: 700 }}
                  className="cardText"
                >
                  Produtos
                </Typography>
                <Chip
                  label={`${produtos.filter(p => p.status).length}/${produtos.length}`}
                  size="small"
                  color="primary"
                  sx={{ ml: 1, fontWeight: 600 }}
                />
              </Box>
              
              <Grid container spacing={3}>
                {produtos.map((produto, index) => {
                  const isCompleted = produto.status === true;
                  return (
                    <Grid item xs={12} sm={12} md={6} lg={6} xl={3} key={index}>
                      <Card
                        elevation={isCompleted ? 4 : 1}
                        className="cardBackground"
                        sx={{
                          height: "100%",
                          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                          border: 2,
                          borderColor: isCompleted ? "success.main" : "error.main",
                          position: "relative",
                          overflow: "visible",
                          "&:hover": {
                            transform: "translateY(-6px)",
                            boxShadow: 8,
                            borderColor: isCompleted ? "success.dark" : "error.dark",
                          },
                          "&::before": isCompleted
                            ? {
                                content: '""',
                                position: "absolute",
                                top: -2,
                                right: -2,
                                width: 24,
                                height: 24,
                                bgcolor: "success.main",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 1,
                              }
                            : {},
                        }}
                      >
                        <CardContent sx={{ p: 2.5 }}>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              gap: 2,
                            }}
                          >
                            {/* Ícone de status (apenas visual, não clicável) */}
                            <Box
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                bgcolor: isCompleted ? "success.main" : "error.main",
                                color: "white",
                                boxShadow: 2,
                                flexShrink: 0,
                              }}
                            >
                              {isCompleted ? (
                                <CheckIcon />
                              ) : (
                                <CloseIcon />
                              )}
                            </Box>
                            
                            <Box sx={{ flex: 1, minWidth: 0 }}>
                              <Typography
                                variant="h6"
                                className="cardText"
                                sx={{
                                  mb: 1.5,
                                  fontSize: { xs: "1rem", sm: "1.1rem" },
                                  lineHeight: 1.3,
                                }}
                              >
                                {produto.nome}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: 1,
                                }}
                              >
                                <Typography
                                  variant="h6"
                                  className="cardText"
                                  sx={{
                                    width: "fit-content",
                                    fontWeight: 700,
                                    fontSize: "1rem",
                                  }}
                                >
                                  {`Código: ${produto.codigoInterno}`}
                                </Typography>
                                <Chip
                                  label={`Quantidade: ${produto.quantidade}`}
                                  size="small"
                                  color="primary"
                                  sx={{
                                    width: "fit-content",
                                    fontWeight: 600,
                                  }}
                                />
                              </Box>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}
