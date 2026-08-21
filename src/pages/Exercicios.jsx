import ExerciciosView, { CATEGORIES } from "../components/ExerciciosView";
import api from "../services/api";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../hooks/useToast.js";
import { useActiveWorkout } from "../hooks/useActivateWorkout";

const PAGE_SIZE = 12;
const DEBOUNCE_MS = 250;

function Exercicios() {
  const [exercises, setExercises] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  const { showToast } = useToast();
  const { activeWorkout } = useActiveWorkout();

  const skipCategoryEffect = useRef(true);
  const skipQueryEffect = useRef(true);

  useEffect(() => {
    fetchWorkouts();
    fetchExercises(0);
  }, []);

  useEffect(() => {
    if (skipCategoryEffect.current) {
      skipCategoryEffect.current = false;
      return;
    }
    fetchExercises(0);
  }, [activeCategory]);

  useEffect(() => {
    if (skipQueryEffect.current) {
      skipQueryEffect.current = false;
      return;
    }
    const handle = setTimeout(() => {
      fetchExercises(0);
    }, DEBOUNCE_MS);
    return () => clearTimeout(handle);
  }, [query]);

  async function fetchWorkouts() {
    try {
      const workoutsRes = await api.get("/workout");
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
      console.error("Error fetching workouts:", error);
      if (error.code === "ERR_NETWORK") setConnectionError(true);
    }
  }

  async function fetchExercises(targetPage) {
    setLoading(exercises.length === 0);
    setConnectionError(false);
    try {
      const category = CATEGORIES.find((c) => c.key === activeCategory);

      const searchParams = new URLSearchParams();
      searchParams.set("page", targetPage);
      searchParams.set("size", PAGE_SIZE);
      if (query) searchParams.set("name", query);
      if (category) {
        category.groups.forEach((g) => searchParams.append("muscleGroups", g));
      }

      const res = await api.get(`/exercise/search?${searchParams.toString()}`);

      setExercises(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
    } catch (error) {
      console.error("Error fetching exercises:", error);
      if (error.code === "ERR_NETWORK") setConnectionError(true);
    } finally {
      setLoading(false);
    }
  }

  function handlePageChange(newPage) {
    fetchExercises(newPage);
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
        onRetry: () => fetchExercises(page),
        query,
        onQueryChange: setQuery,
        activeCategory,
        onCategoryChange: setActiveCategory,
        totalElements,
        page,
        totalPages,
        onPageChange: handlePageChange,
      }}
      onAddToWorkout={handleAddToWorkout}
    />
  );
}

export default Exercicios;
