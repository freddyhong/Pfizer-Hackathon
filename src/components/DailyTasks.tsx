import React from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const fixedTasks: Task[] = [
  { id: 1, text: "Morning check-in", completed: true },
  { id: 2, text: "Take medicine", completed: true },
  { id: 3, text: "Drink a glass of water", completed: false },
  { id: 4, text: "A moment of quiet time", completed: false },
];

const TaskItem: React.FC<{ task: Task }> = ({ task }) => (
  <li
    className={`
      flex items-center p-4 rounded-xl
      ${task.completed ? "bg-green-100 text-gray-500" : "bg-white"}
    `}
  >
    <div className="text-2xl mr-4">{task.completed ? "✅" : ""}</div>
    <span
      className={`flex-1 font-medium ${task.completed ? "line-through" : ""}`}
    >
      {task.text}
    </span>
  </li>
);

export function DailyTasks() {
  const totalTasks = fixedTasks.length;
  const completedCount = fixedTasks.filter((task) => task.completed).length;

  return (
    <div className="w-full max-w-lg bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
        Today's Missions
      </h2>
      <p className="text-center text-gray-600 mb-4">
        Zach's completed {completedCount} of {totalTasks} tasks!
      </p>

      {/* Fixed 4-step Progress Bar */}
      <div className="flex justify-between mb-6">
        {fixedTasks.map((task) => (
          <div
            key={task.id}
            className={`flex-1 h-2 mx-1 rounded-full ${
              task.completed ? "bg-green-500" : "bg-gray-300"
            }`}
          />
        ))}
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {fixedTasks.map((task) => (
          <TaskItem key={task.id} task={task} />
        ))}
      </ul>
    </div>
  );
}
