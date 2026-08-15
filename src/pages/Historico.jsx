import HistoricoView from "../components/HistoricoView";
import { useEffect, useState } from "react";
import api from "../services/api";

function Historico() {
  const [sessions, setSessions] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setConnectionError(false);
    try {
      const [workoutsRes, logsRes] = await Promise.all([
        api.get("/workout"),
        api.get("/workoutLog"),
      ]);

      setWorkouts(workoutsRes.data.map((w) => ({ id: w.id, title: w.title })));

      const withCounts = await Promise.all(
        logsRes.data.map(async (log) => {
          let done = 0;
          let planned = 0;
          try {
            const exRes = await api.get(`/workoutLogExercise/${log.id}`);
            planned = exRes.data.length;
            done = exRes.data.filter((e) => e.done).length;
          } catch (error) {
            console.error("Erro ao buscar exercícios da sessão:", error);
          }

          const date = new Date(log.date);
          const finishedAt = log.finishedAt ? new Date(log.finishedAt) : null;
          const minutes = finishedAt
            ? Math.max(0, Math.round((finishedAt - date) / 60000))
            : null;

          return {
            id: log.id,
            workoutId: log.workoutId,
            title: log.workoutTitle,
            deleted: log.workoutId === null,
            date,
            done,
            planned,
            minutes,
          };
        }),
      );

      setSessions(withCounts);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      if (error.code === "ERR_NETWORK") setConnectionError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <HistoricoView
      data={{ sessions, workouts, loading, connectionError, onRetry: fetchAll }}
    />
  );
}

export default Historico;
