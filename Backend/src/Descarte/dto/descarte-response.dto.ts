import { DescarteStatus } from '../../common/enums/descarte-status.enum';

export class DescarteResponseDto {
  id: string;
  status: DescarteStatus;
  dataDescarte: Date;
  pesoKg: number;
  tipoResiduo: string;
  destino: string;
  observacoes: string | null;
  dataCriacao: Date;
  usuarioId: string;
  coletorId: string | null;
  itens: Array<{
    id: string;
    objetoId: string;
    quantidade: number;
    objeto: {
      nome: string;
      tipo: string;
      pesoKg: number;
    };
  }>;
}
