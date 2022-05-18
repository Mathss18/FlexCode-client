import { useEffect, useRef, useState } from "react";
import api from "../../../../services/api";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  InputAdornment,
} from "@material-ui/core";
import OpenWithIcon from "@mui/icons-material/OpenWith";
import AssignmentIcon from "@material-ui/icons/Assignment";
import LocalShippingIcon from "@material-ui/icons/LocalShipping";
import { Autocomplete } from "@mui/material";
import { useNotaFiscalContext } from "../../../../context/NotaFiscalContext";
import { cfop } from "../../../../constants/cfop";

export default function Dados() {
  const notaFiscalContext = useNotaFiscalContext();
  const [clientesAndFornecedores, setClientesAndFornecedores] = useState([]);
  const clientes = useRef([]);
  const fornecedores = useRef([]);
  const [transportadoras, setTransportadoras] = useState([]);
  const [cfops, setCfops] = useState([]);

  function handleOnChange(event) {
    const { name, value } = event.target;
    notaFiscalContext.formik.setFieldValue(name, value); // Altera o formik
  }

  function handleOnAutoCompleteChange(name, value) {
    notaFiscalContext.formik.setFieldValue(name, value); // Altera o formik
  }

  useEffect(
    () => console.log(notaFiscalContext.formik.values),
    [notaFiscalContext.formik.values]
  );

  useEffect(() => {
    if (cfops.length > 0) return;

    var aux = [];
    var grupoAtual = "";
    for (var prop in cfop) {
      // Se o CFOP terminar em _000, é um grupo
      if (prop[1] == "0" && prop[2] == "0" && prop[3] == "0") {
        grupoAtual = prop + " - " + cfop[prop];
      }
      aux.push({
        value: prop,
        label: prop + " - " + cfop[prop],
        grupo: grupoAtual,
      });

      // Retira os CFOPs que são grupos (terminal com _000 ou __00)
      if (prop[1] == "0" && prop[2] == "0" && prop[3] == "0") {
        aux.pop();
      }
      if (prop[2] == "0" && prop[3] == "0") {
        aux.pop();
      }
    }
    setCfops(aux);
  }, []);

  useEffect(() => {
    api
      .get("/clientes")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((cliente) => {
          if (cliente.situacao === 1) {
            clientes.current.push(cliente);
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
            fornecedores.current.push(fornecedor);
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

  useEffect(() => {
    api
      .get("/transportadoras")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((transportadora) => {
          if (transportadora.situacao === 1) {
            array.push({
              label: transportadora.nome,
              value: transportadora.id,
            });
          }
        });
        setTransportadoras(array);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function getInfo(campo) {
    if (clientes.current.length === 0 || fornecedores.current.length === 0)
      return;

    const tipo = notaFiscalContext.formik.values.clienteFornecedor_id?.tipo;
    var resp = "";
    if (tipo === "clientes") {
      var cli = clientes.current.find((item) => {
        return (
          item.id ===
          notaFiscalContext.formik.values.clienteFornecedor_id?.value
        );
      });
      resp = cli[campo];
    } else if (tipo === "fornecedores") {
      var forne = fornecedores.current.find((item) => {
        return (
          item.id ===
          notaFiscalContext.formik.values.clienteFornecedor_id?.value
        );
      });
      resp = forne[campo];
    }

    if (resp === undefined || resp === null) {
      resp = "";
    }
    return resp;
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
        <OpenWithIcon />
        <h3>Detalhes</h3>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth name="tpNF">
            <InputLabel>Tipo *</InputLabel>
            <Select
              className={"input-select"}
              label="Tipo *"
              name="tpNF"
              value={notaFiscalContext.formik.values.tpNF}
              onChange={handleOnChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.tpNF &&
                Boolean(notaFiscalContext.formik.errors.tpNF)
              }
            >
              <MenuItem value={0}>Entrada</MenuItem>
              <MenuItem value={1}>Saída</MenuItem>
            </Select>
            {notaFiscalContext.formik.touched.tpNF &&
            Boolean(notaFiscalContext.formik.errors.tpNF) ? (
              <FormHelperText>
                {notaFiscalContext.formik.errors.tpNF}
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl variant="outlined" fullWidth name="finNFe">
            <InputLabel>Finalidade *</InputLabel>
            <Select
              className={"input-select"}
              label="Finalidade *"
              name="finNFe"
              value={notaFiscalContext.formik.values.finNFe}
              onChange={handleOnChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.finNFe &&
                Boolean(notaFiscalContext.formik.errors.finNFe)
              }
            >
              <MenuItem value={1}>NF-e normal</MenuItem>
              <MenuItem value={2}>NF-e complementar</MenuItem>
              <MenuItem value={3}>NF-e de ajuste</MenuItem>
              <MenuItem value={4}>Devolução de mercadoria</MenuItem>
            </Select>
            {notaFiscalContext.formik.touched.finNFe &&
            Boolean(notaFiscalContext.formik.errors.finNFe) ? (
              <FormHelperText>
                {notaFiscalContext.formik.errors.finNFe}
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <Autocomplete
            value={notaFiscalContext.formik.values.natOp}
            name="natOp"
            groupBy={(option) => option.grupo}
            onChange={(event, value) =>
              handleOnAutoCompleteChange("natOp", value)
            }
            disablePortal
            options={cfops}
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
            value={notaFiscalContext.formik.values.clienteFornecedor_id}
            name="clienteFornecedor_id"
            onChange={(event, value) =>
              handleOnAutoCompleteChange("clienteFornecedor_id", value)
            }
            disablePortal
            options={clientesAndFornecedores}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                label="Cliente ou Fornecedor *"
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
              value={notaFiscalContext.formik.values.indFinal}
              onChange={handleOnChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.indFinal &&
                Boolean(notaFiscalContext.formik.errors.indFinal)
              }
            >
              <MenuItem value={1}>Sim</MenuItem>
              <MenuItem value={0}>Não</MenuItem>
            </Select>
            {notaFiscalContext.formik.touched.indFinal &&
            Boolean(notaFiscalContext.formik.errors.indFinal) ? (
              <FormHelperText>
                {notaFiscalContext.formik.errors.indFinal}
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
              value={notaFiscalContext.formik.values.indPres}
              onChange={handleOnChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.indPres &&
                Boolean(notaFiscalContext.formik.errors.indPres)
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
            {notaFiscalContext.formik.touched.indPres &&
            Boolean(notaFiscalContext.formik.errors.indPres) ? (
              <FormHelperText>
                {notaFiscalContext.formik.errors.indPres}
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </Grid>
      </Grid>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          marginTop: 12,
        }}
      >
        <LocalShippingIcon />
        <h3>Transporte</h3>
      </div>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Autocomplete
            value={notaFiscalContext.formik.values.transportadora_id}
            name="transportadora_id"
            onChange={(event, value) =>
              handleOnAutoCompleteChange("transportadora_id", value)
            }
            isOptionEqualToValue={(option, value) =>
              option.value === value.value
            }
            options={transportadoras}
            renderInput={(params) => (
              <TextField
                variant="outlined"
                fullWidth
                {...params}
                label="Transportadora"
                placeholder="Pesquise..."
              />
            )}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl variant="outlined" fullWidth name="modFrete">
            <InputLabel>Modalidade do Frete *</InputLabel>
            <Select
              className={"input-select"}
              label="Modalidade do Frete *"
              name="modFrete"
              value={notaFiscalContext.formik.values.modFrete}
              onChange={handleOnChange}
              onBlur={notaFiscalContext.formik.handleBlur}
              error={
                notaFiscalContext.formik.touched.modFrete &&
                Boolean(notaFiscalContext.formik.errors.modFrete)
              }
            >
              <MenuItem value={0}>
                Contratação do Frete por conta do Remetente (CIF)
              </MenuItem>
              <MenuItem value={1}>
                Contratação do Frete por conta do Destinatário (FOB)
              </MenuItem>
              <MenuItem value={2}>
                Contratação do Frete por conta de Terceiros
              </MenuItem>
              <MenuItem value={3}>
                Transporte Próprio por conta do Remetente
              </MenuItem>
              <MenuItem value={4}>
                Transporte Próprio por conta do Destinatário
              </MenuItem>
              <MenuItem value={9}>Sem Ocorrência de Transporte</MenuItem>
            </Select>
            {notaFiscalContext.formik.touched.modFrete &&
            Boolean(notaFiscalContext.formik.errors.modFrete) ? (
              <FormHelperText>
                {notaFiscalContext.formik.errors.modFrete}
              </FormHelperText>
            ) : (
              ""
            )}
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <TextField
            variant="outlined"
            label="Valor do frete"
            fullWidth
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">R$:</InputAdornment>
              ),
            }}
            type="number"
            value={notaFiscalContext.formik.values.frete}
            name="frete"
            onChange={notaFiscalContext.formik.handleChange}
            onBlur={notaFiscalContext.formik.handleBlur}
            error={
              notaFiscalContext.formik.touched.frete &&
              Boolean(notaFiscalContext.formik.errors.frete)
            }
            helperText={
              notaFiscalContext.formik.touched.frete &&
              notaFiscalContext.formik.errors.frete
            }
          />
        </Grid>
      </Grid>

      <div
        style={{
          display: notaFiscalContext.formik.values.clienteFornecedor_id?.value
            ? "block"
            : "none",
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
          <h3>
            Confira os dados do{" "}
            {notaFiscalContext.formik.values.clienteFornecedor_id?.tipo ===
            "clientes"
              ? "Cliente"
              : "Fornecedor"}
          </h3>
        </div>

        <Grid container spacing={3}>
          <Grid item xs={3}>
            <h3 style={{ marginBottom: 4 }}>Nome</h3>
            <p style={{ margin: 0 }}>{getInfo("nome")}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 style={{ marginBottom: 4 }}>CPF/CNPJ</h3>
            <p style={{ margin: 0 }}>{getInfo("cpfCnpj")}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 style={{ marginBottom: 4 }}>E-mail</h3>
            <p style={{ margin: 0 }}>{getInfo("email")}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 style={{ marginBottom: 4 }}>Inscrição Estadual</h3>
            <p style={{ margin: 0 }}>{getInfo("inscricaoEstadual")}</p>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={3}>
            <h3 style={{ marginBottom: 4 }}>CEP</h3>
            <p style={{ margin: 0 }}>{getInfo("cep")}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 style={{ marginBottom: 4 }}>Rua</h3>
            <p style={{ margin: 0 }}>
              {getInfo("rua") + " ," + getInfo("numero")}
            </p>
          </Grid>
          <Grid item xs={3}>
            <h3 style={{ marginBottom: 4 }}>Bairro</h3>
            <p style={{ margin: 0 }}>{getInfo("bairro")}</p>
          </Grid>
          <Grid item xs={3}>
            <h3 style={{ marginBottom: 4 }}>Cidade</h3>
            <p style={{ margin: 0 }}>
              {getInfo("cidade") + " - " + getInfo("estado")}
            </p>
          </Grid>
        </Grid>
      </div>
    </>
  );
}
