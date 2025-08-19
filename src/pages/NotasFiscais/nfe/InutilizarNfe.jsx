import React, { useState } from "react";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  CircularProgress,
  IconButton,
  InputAdornment,
} from "@material-ui/core";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import api from "../../../services/api";
import { showAlert } from "../../../utils/alert";

export default function InutilizarNfe() {
  const [formData, setFormData] = useState({
    serie: "",
    numeroInicial: "",
    numeroFinal: "",
    justificativa: "",
  });
  
  const [senha, setSenha] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const SENHA_REQUERIDA = "88121747Ma1@";

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro específico quando usuário começar a digitar
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Validação da série
    if (!formData.serie || parseInt(formData.serie) < 0) {
      newErrors.serie = "Série deve ser um número maior ou igual a 0";
    }
    
    // Validação do número inicial
    if (!formData.numeroInicial || parseInt(formData.numeroInicial) < 0) {
      newErrors.numeroInicial = "Número inicial deve ser um número maior ou igual a 0";
    }
    
    // Validação do número final
    if (!formData.numeroFinal || parseInt(formData.numeroFinal) < 0) {
      newErrors.numeroFinal = "Número final deve ser um número maior ou igual a 0";
    }
    
    // Verificar se número final é maior ou igual ao inicial
    if (
      formData.numeroInicial && 
      formData.numeroFinal && 
      parseInt(formData.numeroFinal) < parseInt(formData.numeroInicial)
    ) {
      newErrors.numeroFinal = "Número final deve ser maior ou igual ao número inicial";
    }
    
    // Validação da justificativa
    if (!formData.justificativa) {
      newErrors.justificativa = "Justificativa é obrigatória";
    } else if (formData.justificativa.length < 15) {
      newErrors.justificativa = "Justificativa deve ter pelo menos 15 caracteres";
    } else if (formData.justificativa.length > 255) {
      newErrors.justificativa = "Justificativa deve ter no máximo 255 caracteres";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setDialogOpen(true);
    }
  };

  const handleConfirm = async () => {
    if (senha !== SENHA_REQUERIDA) {
      showAlert("Senha incorreta!", "error");
      return;
    }

    setLoading(true);
    setDialogOpen(false);

    try {
      const payload = {
        serie: parseInt(formData.serie),
        numeroInicial: parseInt(formData.numeroInicial),
        numeroFinal: parseInt(formData.numeroFinal),
        justificativa: formData.justificativa,
      };

      const response = await api.post("/notas-fiscais/inutilizar", payload);
      
      if (response.data.success) {
        showAlert("NFes inutilizadas com sucesso!", "success");
        
        // Resetar formulário
        setFormData({
          serie: "",
          numeroInicial: "",
          numeroFinal: "",
          justificativa: "",
        });
        setSenha("");
        
        // Se houver um link para o XML, poderia abrir em nova janela
        if (response.data.data) {
          console.log("XML gerado:", response.data.data);
        }
      } else {
        showAlert(response.data.message || "Erro ao inutilizar NFes", "error");
      }
    } catch (error) {
      console.error("Erro ao inutilizar NFes:", error);
      
      if (error.response?.status === 422) {
        // Erros de validação do backend
        const backendErrors = error.response.data.errors;
        const formattedErrors = {};
        
        Object.keys(backendErrors).forEach(key => {
          formattedErrors[key] = backendErrors[key][0]; // Pegar primeira mensagem de erro
        });
        
        setErrors(formattedErrors);
        showAlert("Por favor, corrija os erros no formulário", "error");
      } else if (error.response?.status === 500) {
        showAlert(error.response.data.error || "Erro interno do servidor", "error");
      } else {
        showAlert("Erro ao inutilizar NFes. Tente novamente.", "error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
    setSenha("");
  };

  return (
    <Container maxWidth="md">
      <Box mt={3}>
        <Paper elevation={3}>
          <Box p={3}>
            <Typography variant="h4" gutterBottom>
              Inutilização de NF-e
            </Typography>
            
            <Typography variant="body1" color="textSecondary" gutterBottom>
              Use este formulário para inutilizar uma faixa de numeração de Notas Fiscais Eletrônicas.
            </Typography>

            <Box mt={3}>
              <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    name="serie"
                    label="Série"
                    type="number"
                    value={formData.serie}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.serie}
                    helperText={errors.serie}
                    InputProps={{
                      inputProps: { min: 0 }
                    }}
                  />

                  <Box display="flex" gap={2}>
                    <TextField
                      name="numeroInicial"
                      label="Número Inicial"
                      type="number"
                      value={formData.numeroInicial}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!errors.numeroInicial}
                      helperText={errors.numeroInicial}
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />

                    <TextField
                      name="numeroFinal"
                      label="Número Final"
                      type="number"
                      value={formData.numeroFinal}
                      onChange={handleInputChange}
                      fullWidth
                      required
                      error={!!errors.numeroFinal}
                      helperText={errors.numeroFinal}
                      InputProps={{
                        inputProps: { min: 0 }
                      }}
                    />
                  </Box>

                  <TextField
                    name="justificativa"
                    label="Justificativa"
                    multiline
                    rows={4}
                    value={formData.justificativa}
                    onChange={handleInputChange}
                    fullWidth
                    required
                    error={!!errors.justificativa}
                    helperText={
                      errors.justificativa || 
                      `${formData.justificativa.length}/255 caracteres (mínimo 15)`
                    }
                    placeholder="Digite o motivo da inutilização (mínimo 15 caracteres)"
                  />

                  <Box mt={2}>
                    <Alert severity="warning">
                      <Typography variant="body2">
                        <strong>Atenção:</strong> A inutilização de NF-e é uma operação irreversível. 
                        Certifique-se de que os dados estão corretos antes de prosseguir.
                      </Typography>
                    </Alert>
                  </Box>

                  <Box mt={3} display="flex" justifyContent="flex-end" gap={2}>
                    <Button
                      type="button"
                      variant="outlined"
                      onClick={() => {
                        setFormData({
                          serie: "",
                          numeroInicial: "",
                          numeroFinal: "",
                          justificativa: "",
                        });
                        setErrors({});
                      }}
                    >
                      Limpar
                    </Button>
                    
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <CircularProgress size={20} style={{ marginRight: 8 }} />
                          Processando...
                        </>
                      ) : (
                        "Inutilizar NFes"
                      )}
                    </Button>
                  </Box>
                </Box>
              </form>
            </Box>
          </Box>
        </Paper>
      </Box>

      {/* Dialog de confirmação com senha */}
      <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmação de Segurança</DialogTitle>
        <DialogContent>
          <Box mt={2}>
            <Typography variant="body1" gutterBottom>
              Para confirmar a inutilização das NFes, digite a senha de segurança:
            </Typography>
            
            <Box mt={2}>
              <Typography variant="body2" color="textSecondary" gutterBottom>
                <strong>Resumo da operação:</strong>
              </Typography>
              <Typography variant="body2">
                • Série: {formData.serie}
              </Typography>
              <Typography variant="body2">
                • Faixa: {formData.numeroInicial} até {formData.numeroFinal}
              </Typography>
              <Typography variant="body2">
                • Justificativa: {formData.justificativa}
              </Typography>
            </Box>

            <Box mt={3}>
              <TextField
                type={showPassword ? 'text' : 'password'}
                label="Senha de Segurança"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                fullWidth
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} disabled={loading}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="primary"
            disabled={loading || !senha}
          >
            {loading ? (
              <>
                <CircularProgress size={16} style={{ marginRight: 8 }} />
                Processando...
              </>
            ) : (
              "Confirmar"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
