const language = {
    textLabels: {
        body: {
            noMatch: "Nenhum resultado encontrado.",
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
    onCellClick: (colData,cellMeta) => {
        //console.log(cellMeta);
    },
    onRowsDelete: (rowsDeleted) => {
        console.log(rowsDeleted);
    },
    rowsPerPageOptions: [10,25,50,100],
    selectableRowsHideCheckboxes: true,	
};

export default language;