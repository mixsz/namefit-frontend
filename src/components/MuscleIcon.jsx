import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { ORANGE } from "../theme";

export const MUSCLE_ICONS = {
  CHEST: "/assets/muscles/chest.png",
  LATS: "/assets/muscles/lats.png",
  MIDDLE_BACK: "/assets/muscles/middle-back.png",
  LOWER_BACK: "/assets/muscles/lower-back.png",
  TRAPS: "/assets/muscles/traps.png",
  SHOULDERS: "/assets/muscles/shoulder.png",
  BICEPS: "/assets/muscles/biceps.png",
  TRICEPS: "/assets/muscles/triceps.png",
  FOREARMS: "/assets/muscles/forearm.png",
  ABDOMINALS: "/assets/muscles/abdominal.png",
  NECK: "/assets/muscles/neck.png",
  QUADRICEPS: "/assets/muscles/quadriceps.png",
  HAMSTRINGS: "/assets/muscles/hamstring.png",
  GLUTES: "/assets/muscles/glute.png",
  ABDUCTORS: "/assets/muscles/abductor.png",
  ADDUCTORS: "/assets/muscles/adductor.png",
  CALVES: "/assets/muscles/calve.png",
};

function MuscleIcon({ group, size = 40 }) {
  const [errored, setErrored] = useState(false);
  const src = MUSCLE_ICONS[group];

  if (errored || !src) {
    return (
      <span
        className="flex items-center justify-center rounded-lg"
        style={{
          width: size,
          height: size,
          background: "rgba(255,77,28,0.12)",
          color: ORANGE,
        }}
      >
        <Dumbbell size={Math.round(size * 0.5)} strokeWidth={2.4} />
      </span>
    );
  }

  return (
    <img
      src={src || "/placeholder.svg"}
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      onError={() => setErrored(true)}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

export default MuscleIcon;
