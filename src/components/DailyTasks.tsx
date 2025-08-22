import React, { useState } from "react";

interface Task {
  id: number;
  text: string;
  completed: boolean;
}

const initialTasks: Task[] = [
  { id: 1, text: "Morning check-in", completed: false },
  { id: 2, text: "Take medicine", completed: false },
  { id: 3, text: "Drink a glass of water", completed: false },
  { id: 4, text: "A moment of quiet time", completed: false },
];

const TaskItem: React.FC<{ task: Task; onToggle: () => void }> = ({
  task,
  onToggle,
}) => (
  <li
    onClick={onToggle}
    className={`
      flex items-center p-4 rounded-xl cursor-pointer
      transition-all duration-300 ease-in-out
      ${
        task.completed
          ? "bg-green-100 text-gray-500"
          : "bg-white hover:bg-gray-50"
      }
    `}
  >
    <div
      className={`text-2xl mr-4 transition-transform duration-300 ${
        task.completed ? "scale-110" : ""
      }`}
    >
      {task.completed ? "✅" : ""}
    </div>
    <span
      className={`flex-1 font-medium ${task.completed ? "line-through" : ""}`}
    >
      {task.text}
    </span>
  </li>
);

export function DailyTasks() {
  const [tasks, setTasks] = useState(initialTasks);

  const handleToggleTask = (id: number) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const completedCount = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedCount / totalTasks) * 100;

  return (
    <div className="w-full max-w-lg bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">
        Today's Missions
      </h2>
      <p className="text-center text-gray-600 mb-4">
        You've completed {completedCount} of {totalTasks} tasks!
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
        <div
          className="bg-green-500 h-2.5 rounded-full transition-all duration-500"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Task List */}
      <ul className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => handleToggleTask(task.id)}
          />
        ))}
      </ul>
    </div>
  );
}
