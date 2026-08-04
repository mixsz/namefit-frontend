import TreinoDetalheView from "../components/TreinoDetalheView";
import { useToast } from "../context/ToastContext";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { useLocation } from "react-router-dom";

function TreinoDetalhe() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [workout, setWorkout] = useState(null);
  const [availableExercises, setAvailableExercises] = useState([]);
  const [allWorkouts, setAllWorkouts] = useState([]);
  const params = useParams();
  const location = useLocation();

  useEffect(() => {
    fetchData();
  }, [params.id]);

  async function fetchData() {
    setLoading(true);
    setConnectionError(false);
    try {
      await Promise.all([
        fetchWorkout(),
        fetchAvailableExercises(),
        fetchAllWorkouts(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.code === "ERR_NETWORK") {
        setConnectionError(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function fetchWorkout() {
    try {
      const [workoutRes, exercisesRes] = await Promise.all([
        api.get(`/workout/${params.id}`),
        api.get(`/workoutExercise/${params.id}`),
      ]);

      setWorkout({
        id: workoutRes.data.id,
        title: workoutRes.data.title,
        exercises: exercisesRes.data.map((we) => ({
          id: we.id,
          exerciseId: we.exercise.id,
          name: we.exercise.name,
          sets: we.sets,
          reps: we.reps,
        })),
      });
    } catch (error) {
      console.error("Error fetching workout:", error);
      throw error;
    }
  }

  async function fetchAvailableExercises() {
    try {
      const response = await api.get("/exercise");
      setAvailableExercises(response.data);
    } catch (error) {
      console.error("Error fetching available exercises:", error);
      throw error;
    }
  }

  async function fetchAllWorkouts() {
    try {
      const response = await api.get("/workout");
      setAllWorkouts(response.data);
    } catch (error) {
      console.error("Error fetching all workouts:", error);
      throw error;
    }
  }

  async function handleSave(payload) {
    const { id: workoutId, title, exercises: draftExercises } = payload;
    const originalExercises = workout.exercises;

    try {
      if (title !== workout.title) {
        await api.put(`/workout/${workoutId}`, { title });
      }

      const draftIds = new Set(draftExercises.map((e) => e.exerciseId));
      const removed = originalExercises.filter(
        (e) => !draftIds.has(e.exerciseId),
      );
      await Promise.all(
        removed.map((e) =>
          api.delete(`/workoutExercise/${workoutId}/${e.exerciseId}`),
        ),
      );

      const added = draftExercises.filter((e) => e.id.startsWith("temp-"));
      await Promise.all(
        added.map((e) =>
          api.post(`/workoutExercise/${workoutId}`, {
            exerciseId: e.exerciseId,
            sets: e.sets,
            reps: e.reps,
          }),
        ),
      );

      const changed = draftExercises.filter((e) => {
        if (e.id.startsWith("temp-")) return false;
        const original = originalExercises.find(
          (o) => o.exerciseId === e.exerciseId,
        );
        return (
          original && (original.sets !== e.sets || original.reps !== e.reps)
        );
      });
      await Promise.all(
        changed.map((e) =>
          api.patch(`/workoutExercise/${workoutId}/${e.exerciseId}`, {
            exerciseId: e.exerciseId,
            sets: e.sets,
            reps: e.reps,
          }),
        ),
      );

      const originalOrder = originalExercises.map((e) => e.exerciseId);
      const draftOrder = draftExercises.map((e) => e.exerciseId);
      const orderChanged =
        JSON.stringify(originalOrder) !== JSON.stringify(draftOrder);
      if (orderChanged) {
        await api.put(`/workoutExercise/${workoutId}/reorder`, {
          exerciseIds: draftOrder,
        });
      }

      showToast("Treino atualizado com sucesso!", "success");
      await fetchWorkout();
    } catch (error) {
      console.error("Error saving workout:", error);
      const message =
        error.response?.data || "Erro ao salvar alterações, tente novamente";
      showToast(
        typeof message === "string" ? message : "Erro ao salvar alterações",
        "error",
      );
    }
  }

  return (
    <TreinoDetalheView
      data={{
        workout,
        availableExercises,
        otherWorkoutTitles: allWorkouts
          .filter((w) => w.id !== params.id)
          .map((w) => w.title),
        loading,
        connectionError,
        onRetry: fetchData,
        startInEdit: location.state?.isEditing ?? false,
        onSave: handleSave,
        onCancel: (hasChanges) => {
          console.log("onCancel, houve mudança?", hasChanges);
          if (hasChanges) {
            showToast("Alterações descartadas", "info");
          }
        },
        onStartWorkout: (id) => console.log("onStartWorkout:", id),
        onOpenExercise: (id) => console.log("onOpenExercise:", id),
      }}
    />
  );
}

export default TreinoDetalhe;
