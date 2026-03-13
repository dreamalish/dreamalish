import React from "react";
import "../postIndex/Profile.css";

type Props = {
  points: number;
  nextLevel: number | null;
  level: number;
  title: string;
};

export default function LevelProgress({ points, nextLevel, level, title }: Props) {

  const progress = nextLevel
    ? Math.min((points / nextLevel) * 100, 100)
    : 100;

  return (
    <div className="xp-container">

      <div className="xp-title">
        🌙 Level {level} {title}
      </div>

      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="xp-text">
        {nextLevel ? `${points} / ${nextLevel} XP` : `${points} XP (MAX LEVEL)`}
      </div>

    </div>
  );
}