import { useEffect, useState } from "react";
import { Grid, TextField, Select, Divider, Button, MenuItem, FormControl, InputLabel, FormHelperText, Checkbox } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useFormik } from "formik";
import { Autocomplete } from "@mui/material";
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const initialValues = {
  numero: "",
  cliente_id: { label: '', value: null },
  funcionarios_id: [{ label: '', value: null }],
  produtos_id: [{ label: '', value: null }],
  servicos_id: [{ label: '', value: null }],
  situacao: 0,
  dataEntrada: "",
  horaEntrada: "",
  dataSaida: "",
  horaSaida: "",
  maoDeObra: 0,
  frete: 0,
  outros: 0,
  desconto: 0,
  total: 0,
  observacao: "",
  observacaoInterna: "",
};

function CadastrarOrdemServicoPage() {
  const history = useHistory();
  const [clientes, setClientes] = useState({});
  const [fornecedores, setFornecedores] = useState([{}]);
  const formik = useFormik({
    initialValues: initialValues,
    onSubmit: (event) => { handleOnSubmit(event) },


  })

  useEffect(() => {
    api.get("/clientes").then(response => {
      var array = [];
      response.data['data'].forEach(cliente => {
        array.push({ label: cliente.nome, value: cliente.id });
      })
      formik.setFieldValue('cliente_id', {}); // Altera o formik
      setClientes(array);
    })
      .catch(error => {
        console.log(error);
      });

  }, []);

  useEffect(() => {
    api.get("/fornecedores").then(response => {
      var array = [];
      response.data['data'].forEach(fornecedor => {
        array.push({ label: fornecedor.nome, value: fornecedor.id });
      })
      formik.setFieldValue('fornecedores_id', []); // Altera o formik
      setFornecedores(array);
    })
      .catch(error => {

      });

  }, []);

  function handleOnSubmit(values) {
    console.log(formik.values);
  }

  function handleOnChange(name, value) {
    formik.setFieldValue(name, value); // Altera o formik
  }

  return (
    <>
      <form onSubmit={formik.handleSubmit}>
        <div>
          <Divider />
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <AssignmentIcon />
            <h3>Dados do Serviço</h3>
          </div>

          <Grid container spacing={3}>
            <Grid item xs={4}>
              <TextField
                variant="outlined"
                label="Número"
                fullWidth
                type="text"
                value={formik.values.numero}
                name="numero"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.numero && Boolean(formik.errors.numero)}
                helperText={formik.touched.numero && formik.errors.numero} />
            </Grid>
            <Grid item xs={4}>
              <Autocomplete
                value={formik.cliente_id}
                name="cliente_id"
                onChange={(event, value) => handleOnChange("cliente_id", value)}
                disablePortal
                options={clientes}
                renderInput={(params) => <TextField variant="outlined" fullWidth {...params} label="Cliente" placeholder="Pesquise..." />}
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl variant="outlined" fullWidth name="tipoCliente">
                <InputLabel>Situação</InputLabel>
                <Select
                  className={"input-select"}
                  label="Situação"
                  name="situacao"
                  value={formik.values.situacao}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.situacao && Boolean(formik.errors.situacao)}

                >
                  <MenuItem value={0}>Aberta</MenuItem>
                  <MenuItem value={1}>Fechada</MenuItem>
                  <MenuItem value={2}>Cancelada</MenuItem>
                </Select>
                {formik.touched.situacao && Boolean(formik.errors.situacao)
                  ? <FormHelperText>{formik.errors.situacao}</FormHelperText>
                  : ''
                }

              </FormControl>
            </Grid>
          </Grid>
          <Grid container spacing={3} style={{ marginTop: 8 }}>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Data Entrada"
                fullWidth
                type="text"
                value={formik.values.dataEntrada}
                name="dataEntrada"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dataEntrada && Boolean(formik.errors.dataEntrada)}
                helperText={formik.touched.dataEntrada && formik.errors.dataEntrada} />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Hora Entrada"
                fullWidth
                type="text"
                value={formik.values.horaEntrada}
                name="horaEntrada"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.horaEntrada && Boolean(formik.errors.horaEntrada)}
                helperText={formik.touched.horaEntrada && formik.errors.horaEntrada} />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Data Saída"
                fullWidth
                type="text"
                value={formik.values.dataSaida}
                name="dataSaida"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.dataSaida && Boolean(formik.errors.dataSaida)}
                helperText={formik.touched.dataSaida && formik.errors.dataSaida} />
            </Grid>
            <Grid item xs={3}>
              <TextField
                variant="outlined"
                label="Hora Saída"
                fullWidth
                type="text"
                value={formik.values.horaSaida}
                name="horaSaida"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.horaSaida && Boolean(formik.errors.horaSaida)}
                helperText={formik.touched.horaSaida && formik.errors.horaSaida} />
            </Grid>

          </Grid>
          <br />
          <br />


        </div>
        <div>

          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <AssignmentIcon />
            <h3>Funcionários</h3>
          </div>
          <Grid container spacing={3}>
          <Grid item xs={6}>
          <Autocomplete
            multiple
            value={formik.values.fornecedores_id}
            name="fornecedores_id"
            onChange={(event, value) => handleOnChange("fornecedores_id", value)}
            options={fornecedores}
            disableCloseOnSelect
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
              <li {...props} >
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.label}
              </li>
            )}
            renderInput={(params) => (
              <TextField {...params} label="Fornecedores" fullWidth variant="outlined" placeholder="Pesquise..." />
            )}
          />
        </Grid>
          </Grid>
          <br />
          <Divider />

          <Grid container spacing={0}>
            <Grid item>
              <Button type="submit" variant="outlined" startIcon={<CheckIcon />} className={'btn btn-primary btn-spacing'}>
                Salvar
              </Button>
            </Grid>
            <Grid item>
              <Button onClick={() => history.push("/servicos")} variant="outlined" startIcon={<CloseIcon />} className={'btn btn-error btn-spacing'}>
                Cancelar
              </Button>
            </Grid>
          </Grid>
        </div>
      </form>
    </>
  );
}

export default CadastrarOrdemServicoPage;
