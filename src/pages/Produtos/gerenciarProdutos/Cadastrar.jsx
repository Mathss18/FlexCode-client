import { useState } from "react";
import SideMenu from "../../../components/SideMenu";
import TopBar from "../../../components/TopBar";
import { Grid, Divider, Button, Box, Tabs, Tab, TextField } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Dados, Detalhes } from "./Tabs/index";

function CadastrarProduto() {
  const history = useHistory();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleOnChange = (e) => {
  //   let { name, value, id } = e.target;

  //   console.log(e);

  //   if (name === "variacoes") {
  //     const index = id.split("_")[1];
  //     const newVariacoes = [...values.variacoes];
  //     newVariacoes[index] = value;
  //     console.log(newVariacoes);
  //     setValues({ ...values, variacoes: newVariacoes });
  //   } else {
  //     setValues({ ...values, [name]: value });
  //   }
  // };

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <Grid role="tabpanel" hidden={value !== index} id={`simple-tabpanel-${index}`} aria-labelledby={`simple-tab-${index}`} {...other}>
        {value === index && <Box p={3}>{children}</Box>}
      </Grid>
    );
  }

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  // function handleOnSubmit(e) {
  //   e.preventDefault();

  //   api
  //     .post("/tipo-variacao-produto", { nome: values.nome })
  //     .then((res) => {
  //       console.log("@VARIACAO-PRODUTO", res.data);
  //       values.variacoes.forEach((variacao) => {
  //         api
  //           .post("/nome-variacao-produto", {
  //             nome: variacao,
  //             tipo_variacao_produto_id: res.data.data.id,
  //             tipo_variacao_produto: res.data.data,
  //           })
  //           .catch((err) => {
  //             console.log(err);
  //           });
  //       });
  //     })
  //     .catch((err) => {
  //       console.log("@ERROR", err);
  //     });
  // }

  return (
    <>
      <TopBar />
      <SideMenu>
        <div>
          <Divider />
          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
            <AssignmentIcon />
            <h3>Dados da Unidade de Produtos</h3>
          </div>
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Dados" {...a11yProps(0)} />
                    <Tab label="Detalhes" {...a11yProps(1)} />
                    <Tab label="Valores" {...a11yProps(2)} />
                    <Tab label="Estoque" {...a11yProps(3)} />
                    <Tab label="Fotos" {...a11yProps(4)} />
                    <Tab label="Fiscal" {...a11yProps(5)} />
                    <Tab label="Composição" {...a11yProps(6)} />
                    <Tab label="Fornecedores" {...a11yProps(7)} />
                  </Tabs>
                </Box>
              </Grid>
            </Grid>

            <form>
              <TabPanel value={value} index={0}>
                <Dados />
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Detalhes />
              </TabPanel>
              <TabPanel value={value} index={2}>
                Valores
              </TabPanel>
            </form>

            <Grid>
              <Button className={"btn btn-primary btn-spacing"} variant="outlined">
                Continuar
              </Button>
            </Grid>
            <br />
            <Divider />

            <Grid container spacing={0}>
              <Grid item>
                <Button type="submit" variant="outlined" startIcon={<CheckIcon />} className={"btn btn-primary btn-spacing"}>
                  Salvar
                </Button>
              </Grid>
              <Grid item>
                <Button onClick={() => history.push("/produtos")} variant="outlined" startIcon={<CloseIcon />} className={"btn btn-error btn-spacing"}>
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </SideMenu>
    </>
  );
}

export default CadastrarProduto;
