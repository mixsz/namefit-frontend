import TreinosView from "../components/TreinosView";
import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

function Treinos() {
  const [workouts, setWorkouts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkouts() {
      try {
        const response = await api.get("/workout");
        setWorkouts(response.data);
        //console.log(response.data);
      } catch (error) {
        console.error("Erro ao buscar treinos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkouts();
  }, []);

  async function handleCreateWorkout(title) {
    try {
      const response = await api.post("/workout", { title });
      setWorkouts([...workouts, response.data]);
      //console.log("Treino criado:", response.data);
    } catch (error) {
      console.error("Erro ao criar treino:", error);
    }
  }

  async function handleDeleteWorkout(id) {
    try {
      await api.delete(`/workout/${id}`);
      setWorkouts(workouts.filter((w) => w.id !== id));
    } catch (error) {
      console.error("Erro ao deletar treino:", error);
    }
  }

  async function handleReorderWorkout(id, direction) {
    const ordered = [...workouts].sort((a, b) => a.position - b.position);
    const index = ordered.findIndex((w) => w.id === id);
    const targetIndex = direction === "up" ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= ordered.length) return;

    [ordered[index], ordered[targetIndex]] = [
      ordered[targetIndex],
      ordered[index],
    ];

    try {
      const response = await api.put("/workout/reorder", {
        workoutIds: ordered.map((w) => w.id),
      });
      setWorkouts(response.data);
    } catch (error) {
      console.error("Erro ao reordenar treinos:", error);
    }
  }

  async function startWorkout(id) {
    try {
      const { data } = await api.post(`/workoutLog/${id}`);
      navigate(`/execucao/${data.id}`);
    } catch (error) {
      console.error("Erro ao iniciar treino:", error);
    }
  }

  return (
    <TreinosView
      data={{
        workouts,
        loading,
        onCreate: handleCreateWorkout,
        onStart: (id) => startWorkout(id),
        onDelete: (id) => handleDeleteWorkout(id),
        onReorder: (id, direction) => handleReorderWorkout(id, direction),
      }}
    />
  );
}

export default Treinos;
