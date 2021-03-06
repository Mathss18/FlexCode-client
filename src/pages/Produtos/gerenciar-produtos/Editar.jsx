import { useState, useContext, useEffect } from "react";
import { Grid, Divider, Button, Box, Tabs, Tab, AppBar } from "@material-ui/core";
import { useHistory, useParams } from "react-router-dom";
import { useProdutoContext } from "../../../context/GerenciarProdutosContext";
import api from "../../../services/api";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Dados, Detalhes, Valores, Estoque, Fotos, Fiscal, Fornecedores, Composicao } from "./Tabs2/index";
import { infoAlert } from "../../../utils/alert";

function EditarProduto() {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(0);


  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div>
        {value === index && children}
      </div>
    );
  }

  function handleTabChange(event, val) {
    setCurrentTab(val);
  }

  return (

    <>

      <div>
        <Divider />
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}>
          <AssignmentIcon />
          <h3>Dados da Unidade de Produtos</h3>
        </div>
        <Tabs style={{marginBottom: '24px'}} value={currentTab} onChange={handleTabChange}>
          <Tab label="Dados" icon={<AssignmentIcon />} />
          <Tab label="Detalhes" icon={<AssignmentIcon />} />
          <Tab label="Valores" icon={<AssignmentIcon />} />
          <Tab label="Estoque" icon={<AssignmentIcon />} />
          <Tab label="Fotos" icon={<AssignmentIcon />} />
          <Tab label="Fiscal" icon={<AssignmentIcon />} />
          <Tab label="Fornecedores" icon={<AssignmentIcon />} />
        </Tabs>

        <TabPanel value={currentTab} index={0}><Dados /></TabPanel>
        <TabPanel value={currentTab} index={1}><Detalhes /></TabPanel>
        <TabPanel value={currentTab} index={2}><Valores /></TabPanel>
        <TabPanel value={currentTab} index={3}><Estoque /></TabPanel>
        <TabPanel value={currentTab} index={4}><Fotos /></TabPanel>
        <TabPanel value={currentTab} index={5}><Fiscal /></TabPanel>
        <TabPanel value={currentTab} index={6}><Fornecedores /></TabPanel>
      </div>
    </>
  );
}

export default EditarProduto;
