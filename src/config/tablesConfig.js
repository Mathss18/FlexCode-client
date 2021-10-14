import CircularProgress from '@mui/material/CircularProgress';

export const config = {
  textLabels: {
    body: {
      noMatch: <CircularProgress />,
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
    return {
      style: {
        background: rowIndex % 2 == 0 ? 'white' : '#F2F2F2',
        fontSize: 30,
        color: 'red'
      },
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
