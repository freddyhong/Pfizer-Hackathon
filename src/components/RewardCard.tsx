import React from "react";

const PFIZER = {
  blue1: "#15144B",
  blue2: "#272C77",
  blue3: "#33429D",
  blue4: "#3857A6",
  blue5: "#488CCA",
  blue6: "#74BBE6",
  blue7: "#CFEAFB",
  blue8: "#EBF5FC",
};

interface RewardCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  requirement: string;
  isUnlocked: boolean;
}

export function RewardCard({
  icon,
  title,
  description,
  requirement,
  isUnlocked,
}: RewardCardProps) {
  return (
    <div
      className="p-4 rounded-2xl border-2 transition-all duration-300 text-center flex flex-col items-center"
      style={{
        backgroundColor: isUnlocked ? PFIZER.blue2 : PFIZER.blue8,
        borderColor: isUnlocked ? PFIZER.blue4 : PFIZER.blue6,
        opacity: isUnlocked ? 1 : 0.6,
      }}
    >
      <div
        className="text-4xl mb-2"
        style={{
          color: isUnlocked ? PFIZER.blue8 : PFIZER.blue4,
        }}
      >
        {icon}
      </div>
      <h3
        className="font-bold"
        style={{
          color: isUnlocked ? PFIZER.blue8 : PFIZER.blue2,
        }}
      >
        {title}
      </h3>
      <p
        className="text-sm mt-1 h-10"
        style={{
          color: isUnlocked ? PFIZER.blue7 : PFIZER.blue3,
        }}
      >
        {description}
      </p>
      <p
        className="text-xs mt-2 font-semibold"
        style={{
          color: isUnlocked ? PFIZER.blue6 : PFIZER.blue3,
        }}
      >
        {requirement}
      </p>
    </div>
  );
}
