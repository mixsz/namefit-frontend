import HistoricoView from "../components/HistoricoView";
import { useEffect, useState } from "react";
import api from "../services/api";

const PAGE_SIZE = 5;
const DELETED_OPTION = "__DELETED__";

function periodToRange(period) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  if (period === "TODAY") return { start, end: null };
  if (period === "WEEK") {
    const weekStart = new Date(start);
    weekStart.setDate(start.getDate() - ((start.getDay() + 6) % 7));
    return { start: weekStart, end: null };
  }
  if (period === "MONTH") {
    return { start: new Date(now.getFullYear(), now.getMonth(), 1), end: null };
  }
  if (period === "6M") {
    const limit = new Date(now);
    limit.setMonth(limit.getMonth() - 6);
    return { start: limit, end: null };
  }
  if (period === "1Y") {
    const limit = new Date(now);
    limit.setFullYear(limit.getFullYear() - 1);
    return { start: limit, end: null };
  }
  return { start: null, end: null };
}

function toDateParam(date) {
  if (!date) return undefined;
  return date.toISOString().slice(0, 10);
}

function Historico() {
  const [workouts, setWorkouts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [page, setPage] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const [period, setPeriod] = useState("ALL");
  const [workoutId, setWorkoutId] = useState("ALL");
  const [includeDeleted, setIncludeDeleted] = useState(false);

  useEffect(() => {
    api.get("/workout").then((res) => {
      setWorkouts(res.data.map((w) => ({ id: w.id, title: w.title })));
    });
  }, []);

  useEffect(() => {
    fetchHistory(0, true);
  }, [period, workoutId, includeDeleted]);

  async function fetchHistory(targetPage, replace) {
    setLoading(replace);
    setConnectionError(false);
    try {
      const { start, end } = periodToRange(period);
      const onlyDeleted = workoutId === DELETED_OPTION;

      const params = {
        page: targetPage,
        size: PAGE_SIZE,
        start: toDateParam(start),
        end: toDateParam(end),
        includeDeleted,
        onlyDeleted,
      };
      if (workoutId !== "ALL" && !onlyDeleted) {
        params.workoutId = workoutId;
      }

      const res = await api.get("/workoutLog/history", { params });

      const mapped = res.data.content.map((log) => ({
        id: log.id,
        workoutId: log.workoutId,
        title: log.workoutTitle,
        deleted: log.workoutId === null,
        date: new Date(log.date),
        done: log.done,
        planned: log.planned,
        minutes: log.finishedAt
          ? Math.max(
              0,
              Math.round(
                (new Date(log.finishedAt) - new Date(log.date)) / 60000,
              ),
            )
          : null,
      }));

      setSessions((prev) => (replace ? mapped : [...prev, ...mapped]));
      setPage(res.data.number);
      setTotalElements(res.data.totalElements);
      setHasMore(!res.data.last);
    } catch (error) {
      console.error("Erro ao buscar histórico:", error);
      if (error.code === "ERR_NETWORK") setConnectionError(true);
    } finally {
      setLoading(false);
    }
  }

  function handleLoadMore() {
    fetchHistory(page + 1, false);
  }

  return (
    <HistoricoView
      data={{
        sessions,
        workouts,
        loading,
        connectionError,
        onRetry: () => fetchHistory(0, true),
        period,
        onPeriodChange: setPeriod,
        workoutId,
        onWorkoutIdChange: setWorkoutId,
        includeDeleted,
        onIncludeDeletedChange: setIncludeDeleted,
        totalElements,
        hasMore,
        onLoadMore: handleLoadMore,
      }}
    />
  );
}

export default Historico;
