import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import localePtBr from "@fullcalendar/core/locales/pt-br";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EditIcon from "@material-ui/icons/Edit";
import listPlugin from "@fullcalendar/list";
import TableTransacoes from "./TableTransacoes";
import api from "../../../services/api";
import moment from "moment";
import { useFullScreenLoader } from "../../../context/FullScreenLoaderContext";
import { errorAlert } from "../../../utils/alert";
import { Tooltip } from "@material-ui/core";

function CalendarioPage() {
  const data = [];
  const [modalTableOpen, setModalTableOpen] = useState(false);
  const dataSelecionada = useRef("");
  const [clientes, setClientes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [transportadoras, setTransportadoras] = useState([]);
  const [funcionarios, setFuncionarios] = useState([]);
  const [contasBancarias, setContasBancarias] = useState([]);
  const [transacoes, setTransacoes] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [editTransacao, setEditTransacao] = useState([]);
  const [modalTransacaoOpen, setModalTransacaoOpen] = useState(false);
  const fullScreenLoader = useFullScreenLoader();
  const [datasView, setDatasView] = useState(null);

  function getInitialView() {
    if (window.screen.width < 500) {
      return "dayGridDay";
    } else {
      return "dayGridMonth";
    }
  }

  function renderEventContent(eventInfo) {
    return (
      <>
        {/* <b>{`${
          eventInfo.event.title
        } - R$: ${eventInfo.event.extendedProps.valor.toFixed(2)}`}</b> */}
        <span>{`${eventInfo.event.title}`}</span>
      </>
    );
  }

  function handleDayClick(day) {
    dataSelecionada.current = day.date.toISOString().replace(/T.*$/, ""); //Format - YYYY-MM-DD
    setModalTableOpen(true);
    showTransacoesFromSelectedDay();
  }

  function handleEventClick(event) {
    dataSelecionada.current = event.event.start
      .toISOString()
      .replace(/T.*$/, ""); //Format - YYYY-MM-DD
    setModalTableOpen(true);
    showTransacoesFromSelectedDay();
  }

  function handleEditClick(event, element) {
    setEditTransacao(element);
    setModalTableOpen(false);
    setModalTransacaoOpen(true);
  }

  function showTransacoesFromSelectedDay() {
    const transacoesFromSelectedDay = transacoes.filter((item) =>
      item.start.includes(dataSelecionada.current)
    );
    console.log(transacoesFromSelectedDay);
    transacoesFromSelectedDay.forEach((element) => {
      var array = [
        <Tooltip
          title={element["situacao"] === "aberta" ? "Aberta" : "Registrada"}
        >
          <div
            style={{
              backgroundColor:
                element["situacao"] === "aberta"
                  ? element["tipo"] === "rendimento"
                    ? "#539e61"
                    : "#c06058"
                  : "transparent",
              border: "2px solid",
              borderColor:
                element["tipo"] === "rendimento" ? "#539e61" : "#c06058",
              width: "15px",
              height: "15px",
              borderRadius: "20px",
            }}
          ></div>
        </Tooltip>,
        moment(element["start"]).format("DD/MM/YYYY"),
        element["title"],
        element["conta_bancaria"]["nome"],
        <b
          style={{
            color: element["tipo"] === "rendimento" ? "#539e61" : "#c06058",
          }}
        >
          {element["valor"].toFixed(2)}
        </b>,
        <>
          <EditIcon
            className={"btn btn-lista"}
            onClick={(event) => handleEditClick(event, element)}
          />
        </>,
      ];
      data.push(array);
    });
    setTableData(data);
  }

  useEffect(() => {
    let url1 = "/clientes";
    let url2 = "/fornecedores";
    let url3 = "/funcionarios";
    let url4 = "/contas-bancarias";
    let url5 = "/transportadoras";

    const req1 = api.get(url1);
    const req2 = api.get(url2);
    const req3 = api.get(url3);
    const req4 = api.get(url4);
    const req5 = api.get(url5);

    Promise.all([req1, req2, req3, req4, req5])
      .then(function ([resp1, resp2, resp3, resp4, resp5]) {
        var array = [];
        resp1.data["data"].forEach((cliente) => {
          if (cliente.situacao === 1) {
            array.push({ label: cliente.nome, value: cliente.id });
          }
        });
        setClientes(array);

        array = [];
        resp2.data["data"].forEach((fornecedor) => {
          if (fornecedor.situacao === 1) {
            array.push({ label: fornecedor.nome, value: fornecedor.id });
          }
        });
        setFornecedores(array);

        array = [];
        resp3.data["data"].forEach((funcionario) => {
          if (funcionario.situacao === 1) {
            array.push({ label: funcionario.nome, value: funcionario.id });
          }
        });
        setFuncionarios(array);

        array = [];
        resp4.data["data"].forEach((contaBancaria) => {
          array.push({ label: contaBancaria.nome, value: contaBancaria.id });
        });
        setContasBancarias(array);

        array = [];
        resp5.data["data"].forEach((transportadora) => {
          if (transportadora.situacao === 1) {
            array.push({
              label: transportadora.nome,
              value: transportadora.id,
            });
          }
        });
        setTransportadoras(array);
      })
      .catch((errors) => {
        errorAlert(
          "Erro ao carregar informações da tela!",
          "tente novamente mais tarde"
        );
      });
  }, []);

  useEffect(() => {
    if (!datasView) return;
    renderTransicoes();
  }, [datasView]);

  function renderTransicoes() {
    fullScreenLoader.setLoading(true);
    api
      .get(`/transacoes?dataInicio=${datasView.start}&dataFim=${datasView.end}`)
      .then((response) => {
        console.log(response.data["data"]);
        var array = [];
        response.data["data"].forEach((transacao) => {
          array.push({
            ...transacao,
            start: transacao.data,
            end: transacao.data,
            allDay: true,
            backgroundColor: (() => {
              if (transacao.situacao === "aberta") {
                if (transacao.tipo === "rendimento") {
                  return "#539e61";
                } else {
                  return "#c06058";
                }
              } else {
                return "transparent";
              }
            })(),
            borderColor:
              transacao.tipo === "rendimento" ? "#539e61" : "#c06058",
            fontSize: "12px",
            favorecido_id: {
              value: transacao.favorecido_id,
              label: transacao.favorecido_nome,
            },
          });
        });
        setTransacoes(array);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => fullScreenLoader.setLoading(false));
  }

  return (
    <div>
      <TableTransacoes
        open={modalTableOpen}
        setOpen={setModalTableOpen}
        dataSelecionada={dataSelecionada.current}
        clientes={clientes}
        fornecedores={fornecedores}
        transportadoras={transportadoras}
        funcionarios={funcionarios}
        contasBancarias={contasBancarias}
        tableData={tableData}
        setTableData={setTableData}
        modalTransacaoOpen={modalTransacaoOpen}
        setModalTransacaoOpen={setModalTransacaoOpen}
        editTransacao={editTransacao}
        setEditTransacao={setEditTransacao}
        renderTransicoes={renderTransicoes}
      />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        showNonCurrentDates={true}
        initialView={getInitialView()}
        headerToolbar={{
          left: "prev,next,today",
          center: "title",
          right: "dayGridMonth dayGridDay",
        }}
        dayMaxEvents={3}
        allDayDefault={true}
        eventContent={renderEventContent}
        dayCellDidMount={(dayCell) => {
          if (dayCell.dayNumberText === "1") {
            setDatasView({
              start: dayCell.view.activeStart.toISOString().replace(/T.*$/, ""),
              end: dayCell.view.activeEnd.toISOString().replace(/T.*$/, ""),
            });
          }
        }}
        eventOrder={"-dataTransacaoRegistrada, -tipo"}
        events={transacoes}
        dateClick={handleDayClick}
        eventClick={handleEventClick}
        locale={localePtBr}
        height={"85vh"}
      />
    </div>
  );
}

export default CalendarioPage;
