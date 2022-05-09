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

  function getInitialView() {
    if (window.screen.width < 500) {
      return "dayGridDay";
    } else {
      return "dayGridMonth";
    }
  }

  function renderEventContent(eventInfo) {
    // console.log(eventInfo);
    return (
      <>
        <span>{eventInfo.event.title}</span>
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

  function test(event, element) {
    setEditTransacao(element)
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
        moment(element["start"]).format("DD/MM/YYYY"),
        element["title"],
        element["conta_bancaria"]["nome"],
        element["valor"].toFixed(2),
        <b
          style={{
            color: element["situacao"] === "aberta" ? "#1976d2" : "#ff9920",
          }}
        >
          {element["situacao"]}
        </b>,
        <>
          <EditIcon
            className={"btn btn-lista"}
            onClick={(event) => test(event, element)}
          />
        </>,
      ];
      data.push(array);
    });
    setTableData(data);
  }

  useEffect(() => {
    api
      .get("/clientes")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((cliente) => {
          array.push({ label: cliente.nome, value: cliente.id });
        });
        setClientes(array);
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
          array.push({ label: fornecedor.nome, value: fornecedor.id });
        });
        setFornecedores(array);
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
          array.push({ label: transportadora.nome, value: transportadora.id });
        });
        setTransportadoras(array);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .get("/funcionarios")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((funcionario) => {
          array.push({ label: funcionario.nome, value: funcionario.id });
        });
        setFuncionarios(array);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    api
      .get("/contas-bancarias")
      .then((response) => {
        var array = [];
        response.data["data"].forEach((contaBancaria) => {
          array.push({ label: contaBancaria.nome, value: contaBancaria.id });
        });
        setContasBancarias(array);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function renderTransicoes(dataInicio, dataFim) {
    api
      .get(`/transacoes?dataInicio=${dataInicio}&dataFim=${dataFim}`)
      .then((response) => {
        console.log(response.data["data"]);
        var array = [];
        response.data["data"].forEach((transacao) => {
          array.push({
            id: transacao.id,
            title: transacao.title,
            start: transacao.data,
            end: transacao.data,
            allDay: true,
            backgroundColor:
              transacao.tipo === "rendimento" ? "#00a65a" : "#f56954",
            borderColor:
              transacao.tipo === "rendimento" ? "#00a65a" : "#f56954",
            fontSize: "12px",

            conta_bancaria: transacao.conta_bancaria,
            valor: transacao.valor,
            situacao: transacao.situacao,
            favorecido_id: {value: transacao.favorecido_id, label: transacao.favorecido_nome},
            favorecido_nome: transacao.favorecido_nome,
            tipoFavorecido: transacao.tipoFavorecido,
            tipo: transacao.tipo,
            observacao: transacao.observacao,
          });
        });
        setTransacoes(array);
      })
      .catch((error) => {
        console.log(error);
      });
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
        transacoes={transacoes}
        setTransacoes={setTransacoes}
        tableData={tableData}
        setTableData={setTableData}
        modalTransacaoOpen={modalTransacaoOpen}
        setModalTransacaoOpen={setModalTransacaoOpen}
        editTransacao={editTransacao}
        setEditTransacao={setEditTransacao}
      />
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
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
            renderTransicoes(
              dayCell.view.activeStart.toISOString().replace(/T.*$/, ""),
              dayCell.view.activeEnd.toISOString().replace(/T.*$/, "")
            );
          }
        }}
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
