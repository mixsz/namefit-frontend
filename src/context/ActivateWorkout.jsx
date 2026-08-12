import { createContext, useState, useEffect } from "react";
import api from "../services/api";

export const ActiveWorkoutContext = createContext(null);

export function ActiveWorkoutProvider({ children }) {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loadingActiveWorkout, setLoadingActiveWorkout] = useState(true);

  useEffect(() => {
    fetchActiveWorkout();
  }, []);

  async function fetchActiveWorkout() {
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
  }

  return (
    <ActiveWorkoutContext.Provider
      value={{ activeWorkout, setActiveWorkout, loadingActiveWorkout }}
    >
      {children}
    </ActiveWorkoutContext.Provider>
  );
}