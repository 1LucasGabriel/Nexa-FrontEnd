import { StatusFuncionario } from "../enums/status-funcionario";

export interface Funcionario {
    id: number,
    usuario_id: number,
    nome: string,
    cpf: string,
    cargo: string,
    telefone: string,
    data_admisssao: Date,
    status: StatusFuncionario,
    alojamento_id: number
}
