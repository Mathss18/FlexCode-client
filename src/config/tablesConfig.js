import CircularProgress from '@mui/material/CircularProgress';
const empresaConfig = JSON.parse(localStorage.getItem("config"));
console.log(empresaConfig);

export const config = {
  textLabels: {
    body: {
      noMatch: 'Nenhum resultado encontrado.',//<CircularProgress />,
      toolTip: "Filtrar",
      columnHeaderTooltip: column => `Filtrar por ${column.label}`
    },
    pagination: {
      next: "Próxima",
      previous: "Anterior",
      rowsPerPage: "Linhas por página",
      displayRows: "de",
    },
    toolbar: {
      search: "Procurar",
      downloadCsv: "Exportar para planilha",
      print: "Imprimir",
      viewColumns: "Ver Colunas",
      filterTable: "Filtrar Tabela",
    },
    filter: {
      all: "Todos",
      title: "Filtros",
      reset: "Limpar",
    },
    viewColumns: {
      title: "Mostrar Colunas",
      titleAria: "Mostrar/Esconder Colunas",
    },
    selectedRows: {
      text: "linha(s) selecionadas",
      delete: "Deletar",
      deleteAria: "Deletar linhas selecionadas",
    },
  },
  downloadOptions: {
    filename: 'clientes.csv',
    separator: ',',
  },
  setRowProps: (row, dataIndex, rowIndex) => {
    var classRow = '';
    if (row[2] === "entrada" || row[2] === "saida") {
      if(row[2] === "entrada"){
        classRow = 'row row-entrada'
      }
      else{
        classRow = 'row row-saida'
      }
    }
    else {
      if (rowIndex % 2 === 0) {
        classRow = 'row row-par';
      }
      else {
        classRow = 'row row-impar';
      }
    }
    return {
      className: classRow,
    };
  },
  setCellProps: (value) => {
    console.log(value);
    return {
      style: {
        border: '2px solid blue'
      }
    };
  },
  onCellClick: (colData, cellMeta) => {
    //console.log(cellMeta);
  },
  onRowsDelete: (rowsDeleted) => {
    console.log(rowsDeleted);
  },
  rowsPerPageOptions: [10, 25, 50, 100],
  selectableRowsHideCheckboxes: true,
  rowsPerPage: empresaConfig?.registrosPorPagina ?? 10,
};


// Configurações da linha da tabela
export const rowConfig = {
  filter: true,
  setCellProps: () => {
    return {
      style: {
        paddingTop: 8,
        paddingBottom: 8
      }
    };
  }
}
