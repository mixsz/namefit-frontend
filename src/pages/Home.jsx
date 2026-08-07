import HomeView from "../components/HomeView";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

function Home() {
  const { username } = useAuth();
  // console.log("Username: ", username);
  const [hasWorkout, setHasWorkout] = useState(false);
  const [trained, setTrained] = useState(false);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);
  const [todayWorkoutName, setTodayWorkoutName] = useState("");
  const [weekCount, setWeekCount] = useState(0);
  const [lastWorkout, setLastWorkout] = useState({
    id: "",
    name: "",
    daysAgo: 0,
  });
  const [streak, setStreak] = useState(0);
  const [suggestion, setSuggestion] = useState({ name: "", muscleGroup: "" });

  useEffect(() => {
    fetchAll();
  }, []);

  async function fetchAll() {
    setLoading(true);
    setConnectionError(false);
    try {
      const results = await Promise.allSettled([
        hasAnyWorkout(),
        trainedToday(),
        fetchWeekCount(),
        fetchLastWorkout(),
        fetchStreak(),
        fetchSuggestion(),
      ]);

      const allFailedByNetwork = results.every(
        (r) => r.status === "rejected" && r.reason?.code === "ERR_NETWORK",
      );
      if (allFailedByNetwork) {
        setConnectionError(true);
      }
    } finally {
      setLoading(false);
    }
  }

  async function hasAnyWorkout() {
    try {
      const response = await api.get("/workout");
      setHasWorkout(response.data.length > 0);
      // console.log("Has any workout:", response.data.length > 0);
    } catch (error) {
      console.error("Error fetching workouts:", error);
      throw error;
    }
  }

  async function trainedToday() {
    try {
      const now = new Date();
      const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
      const response = await api.get(`/workoutLog/date?date=${today}`);
      const hasTrained = response.data.length > 0;
      setTrained(hasTrained);
      if (hasTrained && response.data[0]) {
        setTodayWorkoutName(response.data[0].workoutTitle);
      }
      // console.log("Trained today:", response.data.length > 0);
      // console.log("Today's workout name:", response.data[0]?.workoutTitle);
    } catch (error) {
      console.error("Error fetching workout logs:", error);
      throw error;
    }
  }

  const [trainedWeekDays, setTrainedWeekDays] = useState([
    false,
    false,
    false,
    false,
    false,
    false,
    false,
  ]);

  async function fetchWeekCount() {
    try {
      const now = new Date();

      const dayOfWeek = now.getDay();
      const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      const monday = new Date(now);
      monday.setDate(now.getDate() - diffToMonday);

      const formatDate = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      const start = formatDate(monday);
      const end = formatDate(now);

      const response = await api.get("/workoutLog/date/between", {
        params: { start, end },
      });
      setWeekCount(response.data.length);

      const trainedDates = new Set(
        response.data.map((log) => formatDate(new Date(log.date))),
      );
      const days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date(monday);
        d.setDate(monday.getDate() + i);
        return trainedDates.has(formatDate(d));
      });
      setTrainedWeekDays(days);
    } catch (error) {
      console.error("Error fetching week count:", error);
      throw error;
    }
  }

  async function fetchLastWorkout() {
    try {
      const response = await api.get("/workoutLog");
      if (response.data.length > 0) {
        const sorted = [...response.data].sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );
        const latest = sorted[0];

        const rawDiff =
          new Date().setHours(0, 0, 0, 0) -
          new Date(latest.date).setHours(0, 0, 0, 0);
        const daysAgo = Math.max(
          0,
          Math.floor(rawDiff / (1000 * 60 * 60 * 24)),
        );

        setLastWorkout({
          id: latest.id,
          name: latest.workoutTitle,
          daysAgo,
        });
      }
    } catch (error) {
      console.error("Error fetching last workout:", error);
      throw error;
    }
  }

  async function fetchStreak() {
    try {
      const response = await api.get("/workoutLog");

      const formatDate = (date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;

      const trainedDates = new Set(
        response.data.map((log) => formatDate(new Date(log.date))),
      );

      let cursor = new Date();
      let streakCount = 0;

      if (!trainedDates.has(formatDate(cursor))) {
        cursor.setDate(cursor.getDate() - 1);
      }

      while (trainedDates.has(formatDate(cursor))) {
        streakCount++;
        cursor.setDate(cursor.getDate() - 1);
      }

      setStreak(streakCount);
    } catch (error) {
      console.error("Error fetching streak:", error);
      throw error;
    }
  }

  async function fetchSuggestion() {
    try {
      const response = await api.get("/exercise");
      if (response.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * response.data.length);
        const randomExercise = response.data[randomIndex];

        setSuggestion({
          name: randomExercise.name,
          muscleGroup: randomExercise.muscleGroupLabel,
        });
      }
    } catch (error) {
      console.error("Error fetching exercise suggestion:", error);
      throw error;
    }
  }

  return (
    <HomeView
      data={{
        username,
        hasWorkout,
        trained,
        todayWorkoutName,
        weekCount,
        trainedWeekDays,
        lastWorkout,
        streak,
        suggestion,
        loading,
        connectionError,
        onRetry: fetchAll,
      }}
    />
  );
}

export default Home;
