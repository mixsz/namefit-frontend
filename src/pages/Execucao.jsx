import ExecucaoView from "../components/ExecucaoView.jsx";
import { useEffect, useState, useRef } from "react";
import { useNavigate, useBlocker } from "react-router-dom";
import api from "../services/api";
import { useToast } from "../hooks/useToast.js";
import { useActiveWorkout } from "../hooks/useActivateWorkout";

function Execucao() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { setActiveWorkout } = useActiveWorkout();

  const [workoutLogId, setWorkoutLogId] = useState(null);
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const allowNavigateRef = useRef(false);

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const shouldBlock =
      !!workout &&
      !allowNavigateRef.current &&
      currentLocation.pathname !== nextLocation.pathname;
    return shouldBlock;
  });

  useEffect(() => {
    if (blocker.state === "blocked") {
      setExitModalOpen(true);
    }
  }, [blocker.state]);

  useEffect(() => {
    fetchWorkout();
  }, []);

  async function fetchWorkout() {
    setLoading(true);
    setConnectionError(false);
    try {
      const activeRes = await api.get("/workoutLog/active");
      const active = activeRes.data;

      if (!active || !active.workoutId) {
        setWorkout(null);
        setLoading(false);
        return;
      }

      setWorkoutLogId(active.id);

      const [workoutRes, exercisesRes, logExercisesRes] = await Promise.all([
        api.get(`/workout/${active.workoutId}`),
        api.get(`/workoutExercise/${active.workoutId}`),
        api.get(`/workoutLogExercise/${active.id}`),
      ]);

      setWorkout({
        title: workoutRes.data.title,
        exercises: exercisesRes.data.map((we) => {
          const saved = logExercisesRes.data.find(
            (le) => le.exercise.id === we.exercise.id,
          );
          return {
            id: we.id,
            exerciseId: we.exercise.id,
            name: we.exercise.name,
            sets: we.sets,
            reps: we.reps,
            done: saved?.done ?? false,
            setsDone: saved?.setsDone ?? we.sets,
            repsDone: saved?.repsDone ?? we.reps,
            weight: saved?.weightDone ?? "",
          };
        }),
      });
      setActiveWorkout({ id: active.id, title: workoutRes.data.title });
    } catch (error) {
      console.error("Erro ao buscar treino:", error);
      if (error.code === "ERR_NETWORK") setConnectionError(true);
    } finally {
      setLoading(false);
    }
  }

  function proceedNavigation() {
    allowNavigateRef.current = true;
    if (blocker.state === "blocked") {
      blocker.proceed();
    } else {
      navigate("/home");
    }
  }

  async function handleCancelWorkout() {
    try {
      await api.delete(`/workoutLog/${workoutLogId}`);
      setActiveWorkout(null);
      showToast("Treino descartado", "info");
      proceedNavigation();
    } catch (error) {
      console.error("Erro ao descartar treino:", error);
      showToast("Erro ao descartar treino, tente novamente", "error");
    }
  }

  async function saveProgress(w, progress) {
    return Promise.all(
      w.exercises.map((exercise) => {
        const p = progress.find((x) => x.id === exercise.id);
        return api.post(`/workoutLogExercise/${workoutLogId}`, {
          exerciseId: exercise.exerciseId,
          done: p.done,
          setsDone: p.done && p.setsDone !== "" ? Number(p.setsDone) : null,
          repsDone: p.done && p.repsDone !== "" ? Number(p.repsDone) : null,
          weightDone: p.done && p.weight !== "" ? Number(p.weight) : null,
        });
      }),
    );
  }

  async function handleFinish({ workout: w, progress }) {
    try {
      await saveProgress(w, progress);
      await api.patch(`/workoutLog/${workoutLogId}/finish`);
      setActiveWorkout(null);
      showToast("Treino finalizado com sucesso!", "success");
      proceedNavigation();
    } catch (error) {
      console.error("Erro ao finalizar treino:", error);
      showToast("Erro ao finalizar treino, tente novamente", "error");
    }
  }

  async function handleExitWithoutFinishing({ workout: w, progress }) {
    try {
      await saveProgress(w, progress);
      proceedNavigation();
    } catch (error) {
      console.error("Erro ao salvar progresso:", error);
      showToast("Erro ao salvar progresso, tente novamente", "error");
    }
  }

  function handleRequestExit() {
    navigate(-1);
  }

  function handleCloseExitModal() {
    setExitModalOpen(false);
    if (blocker.state === "blocked") {
      blocker.reset();
    }
  }

  return (
    <ExecucaoView
      workout={workout ?? undefined}
      loading={loading}
      connectionError={connectionError}
      onRetry={fetchWorkout}
      onFinish={handleFinish}
      onCancelWorkout={handleCancelWorkout}
      onExitWithoutFinishing={handleExitWithoutFinishing}
      exitModalOpen={exitModalOpen}
      onRequestExit={handleRequestExit}
      onCloseExitModal={handleCloseExitModal}
    />
  );
}

export default Execucao;
