import HomeView from "../components/HomeView";
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import api from "../services/api";

function Home() {
  const { username } = useAuth();
  const [hasWorkout, setHasWorkout] = useState(false);
  const [trained, setTrained] = useState(false);
  const [loading, setLoading] = useState(true);
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
    async function hasAnyWorkout() {
      try {
        const response = await api.get("/workout");
        setHasWorkout(response.data.length > 0);
        // console.log("Has any workout:", response.data.length > 0);
      } catch (error) {
        console.error("Error fetching workouts:", error);
      } finally {
        setLoading(false);
      }
    }

    hasAnyWorkout();
  }, []);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    }

    trainedToday();
  }, []);

  useEffect(() => {
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
      } catch (error) {
        console.error("Error fetching week count:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchWeekCount();
  }, []);

  useEffect(() => {
    async function fetchLastWorkout() {
      try {
        const response = await api.get("/workoutLog");
        if (response.data.length > 0) {
          const sorted = [...response.data].sort(
            (a, b) => new Date(b.date) - new Date(a.date),
          );
          const latest = sorted[0];

          const daysAgo = Math.floor(
            (new Date().setHours(0, 0, 0, 0) -
              new Date(latest.date).setHours(0, 0, 0, 0)) /
              (1000 * 60 * 60 * 24),
          );
          setLastWorkout({
            id: latest.id,
            name: latest.workoutTitle,
            daysAgo,
          });
        }
      } catch (error) {
        console.error("Error fetching last workout:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLastWorkout();
  }, []);

  useEffect(() => {
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
      } finally {
        setLoading(false);
      }
    }

    fetchStreak();
  }, []);

  useEffect(() => {
    async function fetchSuggestion() {
      try {
        const response = await api.get("/exercise");
        if (response.data.length > 0) {
          const randomIndex = Math.floor(Math.random() * response.data.length);
          const randomExercise = response.data[randomIndex];

          setSuggestion({
            name: randomExercise.name,
            muscleGroup: randomExercise.muscleGroup,
          });
        }
      } catch (error) {
        console.error("Error fetching exercise suggestion:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestion();
  }, []);

  return (
    <HomeView // dps atualizar conforme as outras pages estiverem prontas
      data={{
        username: "Mudar Dados da Home.jsx Depois do Santos",
        hasWorkout: true,
        trained: false,
        todayWorkoutName: "Peito e Tríceps",
        weekCount: 5,
        lastWorkout: { id: "abc-123", name: "Costas e Bíceps", daysAgo: 1 },
        streak: 12,
        suggestion: { name: "Agachamento Livre", muscleGroup: "Pernas" },
      }}
    />
  );
}

export default Home;
