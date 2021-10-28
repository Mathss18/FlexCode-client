import * as yup from 'yup';

const validationSchema = yup.object({
  email: yup
    .string('Insira seu email')
    .email('Insira um email válido')
    .required('Este campo é obrigatório'),
  password: yup
    .string('Insira sua senha')
    .min(8, 'São necessários no minímo 8 caracteres para a senha')
    .required('Este campo é obrigatório'),
  cpf: yup
    .string('Insira seu CPF')
    .min(11, 'São necessários no minímo 11 caracteres para o CPF')
    .required('Este campo é obrigatório'),
  phone: yup
    .string('Insira seu telefone')
    .min(10, 'São necessários no minímo 10 caracteres para o telefone')
    .required('Este campo é obrigatório'),

});

export default validationSchema;