import { StatusAlojamento } from "../enums/status-alojamento";

export interface Alojamento {
    id: number,
    nome: string,
    endereco: string,
    cidadde: string,
    cep: string,
    lotacao_maxima: number,
    lotacao_atual: number,
    status: StatusAlojamento
}
