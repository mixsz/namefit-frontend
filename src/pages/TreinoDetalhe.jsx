import TreinoDetalheView from "../components/TreinoDetalheView";
import { useToast } from "../context/ToastContext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useLocation } from "react-router-dom";

function TreinoDetalheTeste() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [workout, setWorkout] = useState(null);
  const [availableExercises, setAvailableExercises] = useState([]);
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchWorkout();
        await fetchAvailableExercises();
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [params.id]);

  async function fetchWorkout() {
    try{
      const response = await api.get(`/workout/${params.id}`);
      setWorkout(response.data);
    }
    catch(error){
      console.error("Error fetching workout:", error);
    }
  }

  async function fetchAvailableExercises() {
    try{
      const response = await api.get("/exercise");
      setAvailableExercises(response.data);
    }
    catch(error){
      console.error("Error fetching available exercises:", error);
    }
  }

  return (
    <TreinoDetalheView
      data={{
        workout,
        availableExercises,
        loading,
        startInEdit: location.state?.isEditing ?? false,
        onSave: (payload) => {
          console.log("onSave:", payload);
          showToast("Treino atualizado com sucesso!", "success");
        },
        onCancel: (hasChanges) => {
          console.log("onCancel, houve mudança?", hasChanges);
          if (hasChanges) {
            showToast("Alterações descartadas", "info");
          }
        },
        onDelete: () => console.log("onDelete"),
        onStartWorkout: (id) => console.log("onStartWorkout:", id),
        onOpenExercise: (id) => console.log("onOpenExercise:", id),
      }}
    />
  );
}

export default TreinoDetalheTeste;