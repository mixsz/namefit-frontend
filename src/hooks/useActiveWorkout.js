import { useContext } from "react";
import { ActiveWorkoutContext } from "../context/activeWorkoutContext.js";

export function useActiveWorkout() {
  const context = useContext(ActiveWorkoutContext);
  if (!context) {
    throw new Error(
      "useActiveWorkout precisa ser usado em um ActiveWorkoutProvider",
    );
  }
  return context;
}