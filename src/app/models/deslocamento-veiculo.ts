import { StatusDeslocamentoVeiculo } from "../enums/status-deslocamento-veiculo";

export interface DeslocamentoVeiculo {
    id: number,
    id_locacao_veiculo: number,
    origem: string,
    destino: string,
    data_inicio: Date,
    data_fim: Date,
    status: StatusDeslocamentoVeiculo,
    distancia: number
}
