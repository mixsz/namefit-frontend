import ExerciciosView from "../components/ExerciciosView.jsx";
import { CATEGORIES } from "../constants/exerciseCategories.js";
import api from "../services/api";
import { useEffect, useRef, useState } from "react";
import { useToast } from "../hooks/useToast.js";
import { useActiveWorkout } from "../hooks/useActiveWorkout";
import { useLocation, useNavigate } from "react-router-dom";

const PAGE_SIZE = 12;
const DEBOUNCE_MS = 250;

function Exercicios() {
  const location = useLocation();
  const initialQuery = location.state?.searchQuery ?? "";
  const navigate = useNavigate();

  const [exercises, setExercises] = useState([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(0);

  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [connectionError, setConnectionError] = useState(false);
  const hasLoadedOnce = useRef(false);

  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState(null);

  const { showToast } = useToast();
  const { activeWorkout } = useActiveWorkout();

  const skipCategoryEffect = useRef(true);
  const skipQueryEffect = useRef(true);

  useEffect(() => {
    if (location.state?.searchQuery) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    fetchWorkouts();
    fetchExercises(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skipCategoryEffect.current) {
      skipCategoryEffect.current = false;
      return;
    }
    fetchExercises(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  async function fetchExercises(targetPage, overrides = {}) {
    const effectiveQuery = overrides.query ?? query;
    const effectiveCategory =
      overrides.category !== undefined ? overrides.category : activeCategory;

    setLoading(!hasLoadedOnce.current);
    if (hasLoadedOnce.current) setSearching(true);
    setConnectionError(false);
    try {
      const category = CATEGORIES.find((c) => c.key === effectiveCategory);

      const searchParams = new URLSearchParams();
      searchParams.set("page", targetPage);
      searchParams.set("size", PAGE_SIZE);
      if (effectiveQuery) searchParams.set("name", effectiveQuery);
      if (category) {
        category.groups.forEach((g) => searchParams.append("muscleGroups", g));
      }

      const res = await api.get(`/exercise/search?${searchParams.toString()}`);

      setExercises(res.data.content);
      setTotalElements(res.data.totalElements);
      setTotalPages(res.data.totalPages);
      setPage(res.data.number);
      hasLoadedOnce.current = true;
    } catch (error) {
      console.error("Error fetching exercises:", error);
      if (error.code === "ERR_NETWORK") setConnectionError(true);
    } finally {
      setLoading(false);
      setSearching(false);
    }
  }

  function clearAllFilters() {
    skipQueryEffect.current = true;
    skipCategoryEffect.current = true;
    setQuery("");
    setActiveCategory(null);
    fetchExercises(0, { query: "", category: null });
  }

  function clearQueryOnly() {
    skipQueryEffect.current = true;
    setQuery("");
    fetchExercises(0, { query: "" });
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
      const message =
        error.response?.data || "Erro ao adicionar exercício, tente novamente";
      showToast(message, "error");
    }
  }

  return (
    <ExerciciosView
      data={{
        exercises,
        workouts,
        activeWorkout,
        loading,
        searching,
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
        onClearFilters: clearAllFilters,
        onClearQuery: clearQueryOnly,
      }}
      onAddToWorkout={handleAddToWorkout}
    />
  );
}

export default Exercicios;
