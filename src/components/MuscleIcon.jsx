import { useState } from "react";
import { Dumbbell } from "lucide-react";
import { ORANGE } from "../theme";
import { MUSCLE_ICONS } from "../constants/muscleIcons.js";

function MuscleIcon({ group, size = 40, className = "" }) {
  const [errored, setErrored] = useState(false);
  const src = MUSCLE_ICONS[group];

  if (errored || !src) {
    return (
      <span
        className={"flex items-center justify-center rounded-lg " + className}
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
      className={className}
      style={{ width: size, height: size, objectFit: "contain" }}
    />
  );
}

export default MuscleIcon;
