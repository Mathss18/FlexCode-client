import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Divider, Tab, Tabs, Box } from "@mui/material";
import { EmAndamento, Finalizadas } from "./Tabs";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { RefreshTarefasProvider } from "../../../../context/RefreshTarefasContext";

function ListarOrdensServicosFuncionariosPage() {
  const history = useHistory();
  const { idUsuario } = useParams();
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (idUsuario != user.id) {
      toast.error("Você pode ver somente suas tarefas.");
      history.push(`/minhas-tarefas/${user.id}`);
    }
  }, []);

  function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return <div>{value === index && children}</div>;
  }

  function handleTabChange(event, val) {
    setCurrentTab(val);
  }

  return (
    <RefreshTarefasProvider>
      <>
        <div>
          <Divider />
          <Box sx={{ display: "flex", alignItems: "center", flexWrap: "wrap", mb: 3 }}>
            <AssignmentIcon sx={{ mr: 1 }} />
            <h3>Ordens de Serviço</h3>
          </Box>
          
          <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
            <Tabs
              value={currentTab}
              onChange={handleTabChange}
              sx={{
                "& .MuiTab-root": {
                  textTransform: "uppercase",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                },
                "& .Mui-selected": {
                  color: "primary.main",
                },
              }}
            >
              <Tab label="Em Andamento" className="app-default-text-color" />
              <Tab label="Finalizadas" className="app-default-text-color" />
            </Tabs>
          </Box>

          <TabPanel value={currentTab} index={0}>
            <Box sx={{ width: "100%", px: 2 }}>
              <EmAndamento />
            </Box>
          </TabPanel>
          <TabPanel value={currentTab} index={1}>
            <Box sx={{ width: "100%", px: 2 }}>
              <Finalizadas />
            </Box>
          </TabPanel>
        </div>
      </>
    </RefreshTarefasProvider>
  );
}

export default ListarOrdensServicosFuncionariosPage;
