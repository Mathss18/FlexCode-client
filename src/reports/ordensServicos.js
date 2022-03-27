import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import logoEmpresa from "../assets/logoEmpresa.png";
import instagramLogo from "../assets/instagramLogo.png";
import {} from "../utils/functions";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const getHeader = () => {
    return {
        columns: [
          {
            // auto-sized columns have their widths based on their content
            width: 'auto',
            text: 'First column'
          },
          {
            // star-sized columns fill the remaining space
            // if there's more than one star-column, available width is divided equally
            width: '*',
            text: 'Second column'
          },
          {
            // fixed width
            width: 100,
            text: 'Third column'
          },
          {
            // % width
            width: '20%',
            text: 'Fourth column'
          }
        ],
        // optional space between columns
        columnGap: 10
      }
};

const getFooter = (currentPage, pageCount) => {
  return [
    {
      text: `Página ${currentPage.toString()} de ${pageCount.toString()}`,
      alignment: "right",
      fontSize: 9,
      margin: [0, 10, 20, 0], // left, top, right, bottom
    },
  ];
};

const getBody = () => {
  return [
    {
      text: "This is a header",
      style: "header",
    },
    "No styling here, this is a standard paragraph",
    {
      text: "Another text",
      style: "anotherStyle",
    },
    {
      text: "Multiple styles applied",
      style: ["header", "anotherStyle"],
    },
  ];
};

export function createReport() {
  const config = {
    pageSize: "A4",
    pageMargins: [40, 60, 40, 60],
    defaultStyle: {
      font: "Roboto",
    },
    header: getHeader(),
    content: getBody(),
    footer: getFooter,
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        margin: [0, 0, 0, 10],
      },
    },
  };

  return pdfMake.createPdf(config).open();
}
