import { useState, useEffect, useCallback } from "react";
import api from "../services/api";
import { ActiveWorkoutContext } from "./activeWorkoutContext.js";

export function ActiveWorkoutProvider({ children }) {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loadingActiveWorkout, setLoadingActiveWorkout] = useState(true);

  const fetchActiveWorkout = useCallback(async () => {
    try {
      const response = await api.get("/workoutLog/active");
      if (response.status === 200 && response.data) {
        setActiveWorkout({
          id: response.data.id,
          title: response.data.workoutTitle,
        });
      }
    } catch (error) {
      console.error("Erro ao buscar treino ativo:", error);
    } finally {
      setLoadingActiveWorkout(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveWorkout();
  }, [fetchActiveWorkout]);

  return (
    <ActiveWorkoutContext.Provider
      value={{ activeWorkout, setActiveWorkout, loadingActiveWorkout }}
    >
      {children}
    </ActiveWorkoutContext.Provider>
  );
}