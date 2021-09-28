import axios from 'axios';

function buscarCep(cep) {
  const url = `https://viacep.com.br/ws/${cep}/json/`;

  try {
    if (cep != '') {
      const data = axios.get(url)
        .then(resp => {
          return resp.data;
        });
      return data;
    }
  }
  catch (err) {
    console.log(err);
  }
}

export default buscarCep;