import { useState } from "react";
import { Divider, Tabs, Tab } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { Dados, Detalhes, Valores, Estoque, Fotos, Fiscal, Fornecedores } from "./Tabs/index";

function CadastrarProduto() {
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
          <Tab label="Dados"/>
          <Tab label="Detalhes"/>
          <Tab label="Valores"/>
          <Tab label="Estoque"/>
          <Tab label="Fotos"/>
          <Tab label="Fiscal"/>
          <Tab label="Fornecedores"/>
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

export default CadastrarProduto;
