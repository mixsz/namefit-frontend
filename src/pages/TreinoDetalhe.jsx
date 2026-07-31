import { useParams } from "react-router-dom";

function TreinoDetalhe() {
  const { id } = useParams();

  return <div>Treino {id}</div>;
}

export default TreinoDetalhe;
