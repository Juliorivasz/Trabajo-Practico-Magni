import type { Instrumento } from "../models/Instrumento";
import { CardInstrumento } from "./CardInstrumento";

interface InstrumentosProps {
  instrumentos: Instrumento[];
}

export const MostrarInstrumentos: React.FC<InstrumentosProps> = ({ instrumentos }) => {
  return (
    <div className="space-y-6 p-6">
      {instrumentos.map((instrumento) => (
        <CardInstrumento
          key={instrumento.getId()}
          instrumento={instrumento}
        />
      ))}
    </div>
  );
};
