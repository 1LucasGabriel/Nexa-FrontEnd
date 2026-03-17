import { StatusVeiculo } from "../enums/status-veiculo";

export interface Veiculo {
    id: number,
    placa: string,
    modelo_veiculo_id: number,
    numero_chassi: string,
    quilometragem: number,
    status: StatusVeiculo
}
