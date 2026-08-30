import { useState, useEffect, useCallback, useRef } from "react";
import AdminView from "../components/AdminView";
import { useToast } from "../hooks/useToast.js";
import api from "../services/api";

const PAGE_SIZE = 12;

function Admin() {
  const { showToast } = useToast();

  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [muscleGroup, setMuscleGroup] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  const fetchIdRef = useRef(0);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedQuery(query), 350);
    return () => clearTimeout(timeoutId);
  }, [query]);

  const fetchExercises = useCallback(async () => {
    const requestId = ++fetchIdRef.current;
    setLoading(true);
    setConnectionError(false);
    try {
      const response = await api.get("/exercise/search", {
        params: {
          page,
          size: PAGE_SIZE,
          name: debouncedQuery || undefined,
          muscleGroups: muscleGroup ? [muscleGroup] : undefined,
          sort: ["muscleGroup,asc", "name,asc"],
        },
        paramsSerializer: { indexes: null },
      });
      if (requestId !== fetchIdRef.current) return;
      setExercises(response.data.content);
      setTotalPages(response.data.totalPages);
      setTotalElements(response.data.totalElements);
    } catch (error) {
      if (requestId !== fetchIdRef.current) return;
      console.error("Erro ao buscar exercícios:", error);
      if (error.code === "ERR_NETWORK") setConnectionError(true);
    } finally {
      if (requestId === fetchIdRef.current) setLoading(false);
    }
  }, [page, debouncedQuery, muscleGroup]);

  useEffect(() => {
    fetchExercises();
  }, [fetchExercises]);

  function handleQueryChange(value) {
    setQuery(value);
    setPage(0);
  }

  function handleMuscleGroupChange(value) {
    setMuscleGroup(value);
    setPage(0);
  }

  async function handleCreate(data) {
    await api.post("/exercise", data);
    showToast("Exercício criado com sucesso!", "success");
    fetchExercises();
  }

  async function handleUpdate(id, data) {
    await api.put(`/exercise/${id}`, data);
    showToast("Exercício atualizado com sucesso!", "success");
    fetchExercises();
  }

  async function handleDelete(id) {
    await api.delete(`/exercise/${id}`);
    showToast("Exercício excluído com sucesso!", "success");
    fetchExercises();
  }

  return (
    <AdminView
      data={{
        exercises,
        loading,
        connectionError,
        onRetry: fetchExercises,
        query,
        onQueryChange: handleQueryChange,
        muscleGroup,
        onMuscleGroupChange: handleMuscleGroupChange,
        page,
        totalPages,
        totalElements,
        onPageChange: setPage,
        onCreate: handleCreate,
        onUpdate: handleUpdate,
        onDelete: handleDelete,
      }}
    />
  );
}

export default Admin;
