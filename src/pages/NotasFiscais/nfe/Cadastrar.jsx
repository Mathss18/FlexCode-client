import { useState } from "react";
import { Divider, Tabs, Tab } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import AssignmentIcon from "@material-ui/icons/Assignment";
import Produtos from "./Tabs/Produtos";
import Dados from "./Tabs/Dados";
import Valores from "./Tabs/Valores";

function CadastrarNotasFiscais() {
  const history = useHistory();
  const [currentTab, setCurrentTab] = useState(0);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return <div>{value === index && children}</div>;
  }

  function handleTabChange(event, val) {
    setCurrentTab(val);
  }

  return (
    <>
      <div>
        <Divider />
        <div
          style={{ display: "flex", alignItems: "center", flexWrap: "wrap" }}
        >
          <AssignmentIcon />
          <h3>Dados da nota físcal eletrônica</h3>
        </div>
        <Tabs
          style={{ marginBottom: "24px" }}
          value={currentTab}
          onChange={handleTabChange}
        >
          <Tab label="Dados" />
          <Tab label="Produtos" />
          <Tab label="Valores" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <Dados />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
          <Produtos />
        </TabPanel>
        <TabPanel value={currentTab} index={2}>
          <Valores />
        </TabPanel>
      </div>
    </>
  );
}

export default CadastrarNotasFiscais;
