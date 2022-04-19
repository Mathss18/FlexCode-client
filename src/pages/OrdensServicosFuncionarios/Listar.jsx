import { useState } from "react";
import { useHistory } from "react-router-dom";
import { Divider, Tab, Tabs } from "@mui/material";
import { Abertas, Fazendo ,Finalizadas } from "./Tabs";
import AssignmentIcon from "@material-ui/icons/Assignment";

function ListarOrdensServicosFuncionariosPage() {
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
          <h3>Dados das Ordens de Serviços</h3>
        </div>
        <Tabs style={{marginBottom: '24px'}} value={currentTab} onChange={handleTabChange}>
          <Tab label="Abertas" style={{color: 'white'}}/>
          <Tab label="Fazendo" style={{color: 'white'}}/>
          <Tab label="Finalizadas" style={{color: 'white'}}/>
        </Tabs>

        <TabPanel value={currentTab} index={0}><Abertas /></TabPanel>
        <TabPanel value={currentTab} index={1}><Fazendo /></TabPanel>
        <TabPanel value={currentTab} index={2}><Finalizadas /></TabPanel>
      </div>
    </>
  );
}

export default ListarOrdensServicosFuncionariosPage;
