import HistoricoDetalheView from "../components/HistoricoDetalheView";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";

function HistoricoDetalhe() {
  const { id } = useParams();

  const [session, setSession] = useState(null);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    fetchSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchSession() {
    setStatus("loading");
    try {
      const [logRes, exercisesRes] = await Promise.all([
        api.get(`/workoutLog/session/${id}`),
        api.get(`/workoutLogExercise/${id}`),
      ]);

      const log = logRes.data;
      const done = exercisesRes.data.filter((e) => e.done).length;

      setSession({
        id: log.id,
        workoutName: log.workoutTitle,
        deleted: log.workoutId === null,
        startTime: log.date,
        endTime: log.finishedAt,
        planned: exercisesRes.data.length,
        done,
        exercises: exercisesRes.data.map((e) => ({
          id: e.id,
          name: e.exercise.name,
          muscleGroup: e.exercise.muscleGroup,
          position: e.position,
          done: e.done,
          sets: e.setsDone,
          reps: e.repsDone,
          weight: e.weightDone,
        })),
      });
      setStatus("success");
    } catch (error) {
      console.error("Erro ao buscar sessão:", error);
      if (error.response?.status === 404) {
        setStatus("notFound");
      } else {
        setStatus("error");
      }
    }
  }

  return (
    <HistoricoDetalheView data={{ status, session, onRetry: fetchSession }} />
  );
}

export default HistoricoDetalhe;
