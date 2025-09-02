import { useState } from "react";
import {
  format,
  addDays,
  subDays,
  startOfToday,
  isSameDay,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
} from "date-fns";

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

const today = new Date("2025-09-01T00:00:00-04:00");
const attendanceStart = new Date("2025-08-14T00:00:00-04:00");
const attendanceDates = eachDayOfInterval({
  start: attendanceStart,
  end: today,
});

const LessonCard = ({ lesson }: { lesson: Lesson }) => (
  <div className="bg-white p-5 rounded-lg shadow border border-blue-300">
    <h3 className="text-xl font-bold text-[#15144B] mb-2">{lesson.topic}</h3>
    <p>
      <strong>Date:</strong> {lesson.date}
    </p>
    <p>
      <strong>Summary:</strong> {lesson.summary}
    </p>
    <p>
      <strong>Quiz Score:</strong> {lesson.quizScore}
    </p>
    <p>
      <strong>Video:</strong>{" "}
      <a href="#" className="text-blue-600 underline">
        Video
      </a>
    </p>
  </div>
);

interface Lesson {
  date: string;
  topic: string;
  summary: string;
  quizScore: string;
  video: string;
}

const todayLesson: Lesson = {
  date: format(today, "yyyy-MM-dd"),
  topic: "What is Cancer?",
  summary:
    "Zach learned the basics of how cancer forms and how treatments work.",
  quizScore: "3/5",
  video: "Intro to Cancer Biology",
};

const pastLessons: Lesson[] = Array.from({ length: 7 }, (_, i) => {
  const date = subDays(today, 7 - i);
  return {
    date: format(date, "yyyy-MM-dd"),
    topic: `Lesson on Day ${i + 1}`,
    summary: `Summary of learning content for Day ${i + 1}.`,
    quizScore: `${(i % 5) + 1}/5`,
    video: "Video",
  };
});

const futureLessons: Lesson[] = Array.from({ length: 7 }, (_, i) => {
  const date = addDays(today, i + 1);
  return {
    date: format(date, "yyyy-MM-dd"),
    topic: `Planned Topic ${i + 1}`,
    summary: `Planned summary for future lesson ${i + 1}.`,
    quizScore: "-",
    video: "Video",
  };
});

function CalendarSection() {
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(today));
  const handlePrevMonth = () => {
    setCurrentMonth((prev) => subDays(startOfMonth(prev), 1));
  };
  const handleNextMonth = () => {
    setCurrentMonth((prev) => addDays(endOfMonth(prev), 1));
  };

  const start = startOfMonth(currentMonth);
  const end = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start, end });

  const isAttended = (date: Date) =>
    attendanceDates.some((d) => isSameDay(d, date));
  const streakCount = attendanceDates.length;

  return (
    <div className="bg-white rounded-lg shadow p-5 border border-blue-300">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-[#3857A6] flex items-center gap-2">
          📅 Learning Calendar
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="bg-blue-200 px-2 py-1 rounded hover:bg-blue-300"
          >
            ◀
          </button>
          <button
            onClick={() => setCurrentMonth(startOfToday())}
            className="bg-blue-200 px-3 py-1 rounded hover:bg-blue-300"
          >
            Today
          </button>
          <button
            onClick={handleNextMonth}
            className="bg-blue-200 px-2 py-1 rounded hover:bg-blue-300"
          >
            ▶
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={`p-2 rounded border text-sm ${
              isSameDay(day, today) ? "bg-blue-100 font-bold" : ""
            }`}
          >
            {format(day, "d")} {isAttended(day) ? "😊" : ""}
          </div>
        ))}
      </div>
      <p className="text-sm text-gray-700 mt-3">
        😊 indicates participation of the daily lessons
      </p>
      <p className="text-sm text-gray-700">
        🔥 Longest streak: {streakCount} days
      </p>
    </div>
  );
}

export default function LearningPage() {
  const [selectedPastDate, setSelectedPastDate] = useState(pastLessons[6].date);
  const [selectedFutureDate, setSelectedFutureDate] = useState(
    futureLessons[0].date
  );

  const pastLesson = pastLessons.find((l) => l.date === selectedPastDate);
  const futureLesson = futureLessons.find((l) => l.date === selectedFutureDate);

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden ml-32 pb-20"
      style={{
        background: `linear-gradient(270deg, ${PFIZER.blue7}, ${PFIZER.blue8})`,
      }}
    >
      <header className="sticky top-0 z-30 border-b backdrop-blur bg-white/70">
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-center">
          <h1
            className="text-xl sm:text-3xl font-bold"
            style={{ color: PFIZER.blue1 }}
          >
            Zach's Learning Progress
          </h1>
        </div>
      </header>

      <div className="max-w-3xl mx-auto space-y-10 mt-10">
        {/* Calendar Section */}
        <CalendarSection />

        {/* Today's Lesson */}
        <div>
          <h2 className="text-2xl font-semibold text-[#3857A6] mb-3">
            📘 Today's Lesson
          </h2>
          <LessonCard lesson={todayLesson} />
        </div>

        {/* Past Lessons */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-semibold text-[#3857A6]">
              🕒 Past Lessons
            </h2>
            <select
              value={selectedPastDate}
              onChange={(e) => setSelectedPastDate(e.target.value)}
              className="border border-blue-300 rounded px-2 py-1"
            >
              {pastLessons.map((lesson) => (
                <option key={lesson.date} value={lesson.date}>
                  {lesson.date}
                </option>
              ))}
            </select>
          </div>
          {pastLesson && <LessonCard lesson={pastLesson} />}
        </div>

        {/* Future Lessons */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-semibold text-[#3857A6]">
              🧘‍♀️ Future Lessons
            </h2>
            <select
              value={selectedFutureDate}
              onChange={(e) => setSelectedFutureDate(e.target.value)}
              className="border border-blue-300 rounded px-2 py-1"
            >
              {futureLessons.map((lesson) => (
                <option key={lesson.date} value={lesson.date}>
                  {lesson.date}
                </option>
              ))}
            </select>
          </div>
          {futureLesson && <LessonCard lesson={futureLesson} />}
        </div>
      </div>
    </div>
  );
}
