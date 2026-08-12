import ExerciciosView from "../components/ExerciciosView";
import api from "../services/api";
import { useEffect, useState } from "react";
import { useToast } from "../hooks/useToast.js";
import { useActiveWorkout } from "../hooks/useActivateWorkout";

function Exercicios() {
  const [exercises, setExercises] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const { showToast } = useToast();
  const { activeWorkout } = useActiveWorkout();

  useEffect(() => {
    fetchExercises();
  }, []);

  async function fetchExercises() {
    setLoading(true);
    setConnectionError(false);
    try {
      const [exercisesRes, workoutsRes] = await Promise.all([
        api.get("/exercise"),
        api.get("/workout"),
      ]);

      setExercises(exercisesRes.data);

      const workoutExercisesRes = await Promise.all(
        workoutsRes.data.map((w) => api.get(`/workoutExercise/${w.id}`)),
      );

      setWorkouts(
        workoutsRes.data.map((w, i) => ({
          id: w.id,
          title: w.title,
          exerciseIds: workoutExercisesRes[i].data.map((we) => we.exercise.id),
        })),
      );
    } catch (error) {
      console.error("Error fetching exercises:", error);
      if (error.code === "ERR_NETWORK") {
        setConnectionError(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function handleAddToWorkout({ workoutId, exerciseId, sets, reps }) {
    try {
      await api.post(`/workoutExercise/${workoutId}`, {
        exerciseId,
        sets,
        reps,
      });

      showToast("Exercício adicionado ao treino!", "success");

      setWorkouts((prev) =>
        prev.map((w) =>
          w.id === workoutId
            ? { ...w, exerciseIds: [...w.exerciseIds, exerciseId] }
            : w,
        ),
      );
    } catch (error) {
      console.error("Error adding exercise to workout:", error);
      showToast("Erro ao adicionar exercício, tente novamente", "error");
    }
  }

  return (
    <ExerciciosView
      data={{
        exercises,
        workouts,
        activeWorkout,
        loading,
        connectionError,
        onRetry: fetchExercises,
      }}
      onAddToWorkout={handleAddToWorkout}
    />
  );
}

export default Exercicios;
