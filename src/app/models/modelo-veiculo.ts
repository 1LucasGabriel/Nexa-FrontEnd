import { TipoCombustivel } from "../enums/tipo-combustivel";
import { TipoModeloVeiculo } from "../enums/tipo-modelo-veiculo";

export interface ModeloVeiculo {
    id: number,
    fabricante: string,
    tipo: TipoModeloVeiculo,
    ano: string,
    tipo_combustivel: TipoCombustivel,
    lotacao_maxima: number
}
