import { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";
import { ActiveWorkoutContext } from "./activeWorkoutContext.js";

export function ActiveWorkoutProvider({ children }) {
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [loadingActiveWorkout, setLoadingActiveWorkout] = useState(true);
  const timeoutRef = useRef(null);
  const attemptRef = useRef(0);
  const fetchActiveWorkoutRef = useRef(null);

  const fetchActiveWorkout = useCallback(async ({ cancelledRef }) => {
    try {
      const response = await api.get("/workoutLog/active");
      if (cancelledRef.current) return;
      if (response.status === 200 && response.data) {
        setActiveWorkout({
          id: response.data.id,
          title: response.data.workoutTitle,
        });
      }
      setLoadingActiveWorkout(false);
    } catch (error) {
      if (cancelledRef.current) return;

      if (!error.response) {
        attemptRef.current += 1;
        const delay = Math.min(1000 * 2 ** attemptRef.current, 10000);
        timeoutRef.current = setTimeout(
          () => fetchActiveWorkoutRef.current({ cancelledRef }),
          delay,
        );
      } else {
        console.error("Erro ao buscar treino ativo:", error);
        setLoadingActiveWorkout(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchActiveWorkoutRef.current = fetchActiveWorkout;
  });

  useEffect(() => {
    const cancelledRef = { current: false };
    fetchActiveWorkoutRef.current({ cancelledRef });

    return () => {
      cancelledRef.current = true;
      clearTimeout(timeoutRef.current);
    };
  }, []);

  return (
    <ActiveWorkoutContext.Provider
      value={{ activeWorkout, setActiveWorkout, loadingActiveWorkout }}
    >
      {children}
    </ActiveWorkoutContext.Provider>
  );
}
