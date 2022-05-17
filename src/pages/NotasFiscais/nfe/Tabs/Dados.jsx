import { useEffect, useState } from "react";
import api from "../../../../services/api";
import { useProdutoContext } from "../../../../context/GerenciarProdutosContext";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Autocomplete } from "@mui/material";

export function Dados() {
  const produtoContext = useProdutoContext();
  const [clientesAndFornecedores, setClientesAndFornecedores] = useState([]);

  function handleOnChange(event) {
    const { name, value } = event.target;
    produtoContext.formik.setFieldValue(name, value); // Altera o formik
  }

  useEffect(() => {
    api
      .get("/clientes")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((cliente) => {
          if (cliente.situacao === 1) {
            array.push({
              label: cliente.nome,
              value: cliente.id,
              tipo: "clientes",
            });
          }
        });
        setClientesAndFornecedores((prev) => [...prev, ...array]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .get("/fornecedores")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((fornecedor) => {
          if (fornecedor.situacao === 1) {
            array.push({
              label: fornecedor.nome,
              value: fornecedor.id,
              tipo: "fornecedores",
            });
          }
        });
        setClientesAndFornecedores((prev) => [...prev, ...array]);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function handleOnChange(name, value) {
    produtoContext.formik.setFieldValue(name, value); // Altera o formik
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Detalhes</h3>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth name="tpNf">
            <InputLabel>Tipo *</InputLabel>
            <Select
              className={"input-select"}
              label="Tipo *"
              name="tpNF"
              value={produtoContext.formik.values.tpNf}
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={
                produtoContext.formik.touched.tpNf &&
                Boolean(produtoContext.formik.errors.tpNf)
              }
            >
              <MenuItem value={0}>Entrada</MenuItem>
              <MenuItem value={1}>Saída</MenuItem>
            </Select>
            {produtoContext.formik.touched.tpNf &&
            Boolean(produtoContext.formik.errors.tpNf) ? (
              <FormHelperText>
                {produtoContext.formik.errors.tpNf}
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth name="finNFe ">
            <InputLabel>Finalidade *</InputLabel>
            <Select
              className={"input-select"}
              label="Finalidade *"
              name="finNFe "
              value={produtoContext.formik.values.finNFe}
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={
                produtoContext.formik.touched.finNFe &&
                Boolean(produtoContext.formik.errors.finNFe)
              }
            >
              <MenuItem value={1}>NF-e normal</MenuItem>
              <MenuItem value={2}>NF-e complementar</MenuItem>
              <MenuItem value={3}>NF-e de ajuste</MenuItem>
              <MenuItem value={4}>Devolução de mercadoria</MenuItem>
            </Select>
            {produtoContext.formik.touched.finNFe &&
            Boolean(produtoContext.formik.errors.finNFe) ? (
              <FormHelperText>
                {produtoContext.formik.errors.finNFe}
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            value={produtoContext.formik.values.natOp}
            name="natOp"
            onChange={(event, value) => handleOnChange("natOp", value)}
            disablePortal
            options={[]}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                label="Natureza da Operação *"
                placeholder="Pesquise..."
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            value={produtoContext.formik.values.clienteFornecedor_id}
            name="clienteFornecedor_id"
            onChange={(event, value) =>
              handleOnChange("clienteFornecedor_id", value)
            }
            disablePortal
            options={clientesAndFornecedores}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                label="Cliente ou Fornecedor"
                placeholder="Pesquise..."
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth name="indFinal">
            <InputLabel>Consumidor Final *</InputLabel>
            <Select
              className={"input-select"}
              label="Consumidor Final *"
              name="indFinal"
              value={produtoContext.formik.values.indFinal}
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={
                produtoContext.formik.touched.indFinal &&
                Boolean(produtoContext.formik.errors.indFinal)
              }
            >
              <MenuItem value={0}>Não</MenuItem>
              <MenuItem value={1}>Sim</MenuItem>
            </Select>
            {produtoContext.formik.touched.indFinal &&
            Boolean(produtoContext.formik.errors.indFinal) ? (
              <FormHelperText>
                {produtoContext.formik.errors.indFinal}
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth name="indPres">
            <InputLabel>Tipo Atendimento *</InputLabel>
            <Select
              className={"input-select"}
              label="Tipo Atendimento *"
              name="indPres"
              value={produtoContext.formik.values.indPres}
              onChange={handleOnChange}
              onBlur={produtoContext.formik.handleBlur}
              error={
                produtoContext.formik.touched.indPres &&
                Boolean(produtoContext.formik.errors.indPres)
              }
            >
              <MenuItem value="0">Não se aplica</MenuItem>
              <MenuItem value="1">Operação presencial</MenuItem>
              <MenuItem value="2">
                Operação não presencial, pela Internet
              </MenuItem>
              <MenuItem value="3">
                Operação não presencial, Teleatendimento
              </MenuItem>
              <MenuItem value="9">Operação não presencial, outros</MenuItem>
            </Select>
            {produtoContext.formik.touched.indPres &&
            Boolean(produtoContext.formik.errors.indPres) ? (
              <FormHelperText>
                {produtoContext.formik.errors.indPres}
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </Grid>
      </Grid>

      <div
        style={{
          marginTop: 24,
          boxShadow:
            "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
          padding: 24,
        }}
      >
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <AssignmentIcon />
          <h3>Confira os dados do cliente ou fornecedor</h3>
        </div>

        <Grid container spacing={3}>
          <Grid item xs={3}>
            <h3>Nome</h3>
            <h4>Matheus Bezerra Filho</h4>
          </Grid>
          <Grid item xs={3}>
            <h3>CPF/CNPJ</h3>
            <h4>427.024.218-58</h4>
          </Grid>
          <Grid item xs={3}>
            <h3>E-mail</h3>
            <h4>theus.7@hotmail.com</h4>
          </Grid>
          <Grid item xs={3}>
            <h3>Inscrição Estadual</h3>
            <h4>297023651113</h4>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <h3>CEP</h3>
            <h4>13402-803</h4>
          </Grid>
          <Grid item xs={3}>
            <h3>Rua</h3>
            <h4>Rua Bofete, 79</h4>
          </Grid>
          <Grid item xs={3}>
            <h3>Bairro</h3>
            <h4>São Jorge</h4>
          </Grid>
          <Grid item xs={3}>
            <h3>Cidade</h3>
            <h4>Piracicaba - SP</h4>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
