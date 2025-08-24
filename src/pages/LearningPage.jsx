// src/pages/LearningPage.jsx
import React, { useEffect, useState } from "react";
import characterImage from "../assets/character.png"; // Poko's profile picture (auto-set)

/* Pfizer palette (only) */
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

/* LocalStorage keys */
const LS = {
  coins: "learn.coins",
  progress: "learn.progress",
  rewards: "learn.rewards.claimed",
};

/* Small helpers */
function cx(...a) {
  return a.filter(Boolean).join(" ");
}

function Coin({ size = 22 }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full border font-bold select-none"
      style={{
        width: size,
        height: size,
        background: PFIZER.blue6,
        borderColor: PFIZER.blue4,
        color: "white",
        fontSize: size * 0.65,
        lineHeight: 1,
      }}
    >
      C
    </span>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Cancer learning content (kid-friendly)
   ─────────────────────────────────────────────────────────────────────────── */
const LESSON_CONTENT = [
  {
    type: "lesson",
    id: "L1",
    title: "What is Cancer?",
    bullets: [
      "Summary:",
      "Our bodies are made of tiny parts called cells.",
      "Cells usually grow, do their job, and rest.",
      "Cancer is when some cells grow too fast and don’t follow the rules.",
      "Doctors help the body find and stop those cells.",
    ],
  },
  { type: "reward", id: "R1" },
  {
    type: "lesson",
    id: "L2",
    title: "How Doctors Help",
    bullets: [
      "Doctors have tools like strong medicine, gentle light beams, and surgery.",
      "Chemo is strong medicine that tells cancer cells to stop.",
      "Radiation is a special light doctors use to shrink bad cells.",
      "Treatments are chosen carefully to help people feel better.",
    ],
  },
  { type: "reward", id: "R2" },
  {
    type: "lesson",
    id: "L3",
    title: "Healthy Habits",
    bullets: [
      "Sleep, fruits and veggies, and moving your body help keep cells happy.",
      "Wearing sunscreen protects skin cells from too much sun.",
      "Staying away from smoke keeps lungs strong.",
      "Small healthy choices add up over time!",
    ],
  },
  { type: "reward", id: "R3" },
  {
    type: "lesson",
    id: "L4",
    title: "Feelings & Support",
    bullets: [
      "It’s okay to feel worried or sad—feelings are normal.",
      "Talking to family, friends, or a teacher can help.",
      "Healthcare teams include helpers like nurses and counselors.",
      "You are not alone—many people are on your team.",
    ],
  },
];

const QUIZ = [
  {
    q: "What is cancer?",
    options: [
      "Cells that grow too fast and break the rules",
      "A kind of cold you catch from friends",
      "A special vitamin",
      "A type of grown-up illness",
    ],
    a: 0,
  },
  {
    q: "Which helper is a strong medicine doctors use?",
    options: ["Chemo", "Bubbles", "Stickers", "Juice"],
    a: 0,
  },
  {
    q: "Which choice helps your body’s cells stay healthy?",
    options: [
      "Eating fruits and veggies",
      "Never sleeping",
      "Staring at the sun",
      "Breathing smoke",
    ],
    a: 0,
  },
  {
    q: "What protects skin cells when you play outside?",
    options: ["Sunscreen and shade", "Extra homework", "Cold water", "Glue"],
    a: 0,
  },
  {
    q: "What can you do if you feel worried?",
    options: [
      "Talk to someone you trust",
      "Keep it a secret forever",
      "Yell at your cells",
      "Start being a meanie",
    ],
    a: 0,
  },
];

/* ───────────────────────────────────────────────────────────────────────────
   Duolingo-like zig-zag path
   ─────────────────────────────────────────────────────────────────────────── */
function Path({ items, progress, claimed, onOpenLesson, onCollectReward }) {
  const STEP = 140;
  const LEFT_A = "12%";
  const LEFT_B = "58%";
  const height = (items.length - 1) * STEP + 240;

  function isUnlocked(idx) {
    const it = items[idx];
    if (it.type === "lesson") {
      return idx === 0 || progress >= idx - 2; // previous lesson index
    }
    // reward: unlocked after the previous lesson is completed
    return progress >= idx - 1;
  }

  return (
    <div className="relative" style={{ height }}>
      {/* Spine */}
      <div
        className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-1.5 rounded-full"
        style={{ background: PFIZER.blue3 }}
      ></div>

      {items.map((item, idx) => {
        const unlocked = isUnlocked(idx);
        const done = item.type === "lesson" && progress >= idx;
        const claimedReward = claimed.includes(idx);
        const isLeft = idx % 2 === 0;
        const left = isLeft ? LEFT_A : LEFT_B;
        const top = idx * STEP + 40;

        return (
          <div key={item.id} className="absolute" style={{ top, left }}>
            {/* connector to spine */}
            <div
              className="absolute top-6 h-1 rounded-full"
              style={{
                left: isLeft ? "100%" : "-140%",
                width: "140%",
                background: PFIZER.blue4,
                opacity: 0.5,
              }}
            ></div>

            {/* node */}
            {item.type === "lesson" ? (
              <button
                onClick={() => unlocked && onOpenLesson(idx)}
                disabled={!unlocked}
                className={cx(
                  "relative grid place-items-center rounded-full w-24 h-24 border-4 transition-transform",
                  unlocked ? "hover:scale-105" : "opacity-50 cursor-not-allowed"
                )}
                style={{
                  borderColor: PFIZER.blue4,
                  background: unlocked
                    ? `radial-gradient(circle at 30% 30%, ${PFIZER.blue6}, ${PFIZER.blue5})`
                    : PFIZER.blue3,
                }}
                title={unlocked ? (done ? "Completed" : "Lesson") : "Locked"}
              >
                <div
                  className="grid place-items-center rounded-full"
                  style={{
                    width: 66,
                    height: 66,
                    background: PFIZER.blue7,
                    boxShadow: "0 6px 0 rgba(0,0,0,0.15)",
                  }}
                >
                  <span className="text-xl" style={{ color: PFIZER.blue1 }}>
                    {done ? "✔" : "★"}
                  </span>
                </div>

                {/* START badge */}
                {idx === 0 && unlocked && (
                  <div
                    className="absolute -top-8 px-3 py-1 text-xs font-bold rounded-xl"
                    style={{
                      background: PFIZER.blue5,
                      color: "white",
                      boxShadow: "0 2px 0 rgba(0,0,0,0.15)",
                    }}
                  >
                    START
                    <div
                      className="absolute left-1/2 -translate-x-1/2 -bottom-1 w-2 h-2 rotate-45"
                      style={{ background: PFIZER.blue5 }}
                    ></div>
                  </div>
                )}
              </button>
            ) : (
              <button
                id={`reward-${idx}`}
                onClick={() => unlocked && !claimedReward && onCollectReward(idx)}
                disabled={!unlocked || claimedReward}
                className={cx(
                  "relative grid place-items-center rounded-2xl border-4 w-24 h-24 transition-transform",
                  unlocked && !claimedReward
                    ? "hover:scale-105"
                    : "opacity-50 cursor-not-allowed"
                )}
                style={{
                  borderColor: PFIZER.blue4,
                  background: PFIZER.blue8,
                }}
                title={claimedReward ? "Claimed" : unlocked ? "+50 coins" : "Locked"}
              >
                {/* chest (PFIZER colors) */}
                <div className="w-14 h-10 rounded-md relative" style={{ background: "#9ec0e4" }}>
                  <div
                    className="absolute inset-x-2 -top-2 h-3"
                    style={{ background: PFIZER.blue7, borderRadius: 4 }}
                  ></div>
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-6 h-4"
                    style={{ background: PFIZER.blue5, borderRadius: 4 }}
                  ></div>
                  <div
                    className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-2 h-2"
                    style={{ background: PFIZER.blue4, borderRadius: 3 }}
                  ></div>
                </div>

                {claimedReward && (
                  <div
                    className="absolute -bottom-3 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: PFIZER.blue5, color: "white" }}
                  >
                    Claimed
                  </div>
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Pretty Quiz UI (PFIZER only)
   ─────────────────────────────────────────────────────────────────────────── */
function QuizCard({ onSubmit, submitted, quizAnswers, setQuizAnswers }) {
  let correct = 0;
  QUIZ.forEach((q, i) => {
    if (quizAnswers[i] === q.a) correct++;
  });

  return (
    <div
      className="rounded-2xl p-4 md:p-5 border shadow-sm"
      style={{ borderColor: PFIZER.blue4, background: "white" }}
    >
      <div
        className="text-xs uppercase tracking-wide mb-3"
        style={{ color: PFIZER.blue2 }}
      >
        Daily Quiz • 5 Questions
      </div>

      <div className="space-y-4">
        {QUIZ.map((q, i) => {
          const chosen = quizAnswers[i];
          const correctIdx = q.a;
          return (
            <div
              key={i}
              className="rounded-xl p-3 md:p-4 border"
              style={{ borderColor: PFIZER.blue7, background: PFIZER.blue8 }}
            >
              <div
                className="font-semibold mb-3 text-lg"
                style={{ color: PFIZER.blue1 }}
              >
                {i + 1}. {q.q}
              </div>

              <div className="grid gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = chosen === oi;
                  const isCorrect = submitted && oi === correctIdx;
                  const isWrong = submitted && isSelected && oi !== correctIdx;

                  return (
                    <label
                      key={oi}
                      className={cx(
                        "flex items-center gap-3 rounded-xl px-3 py-2 border cursor-pointer transition",
                        isCorrect
                          ? "bg-white"
                          : isWrong
                          ? "bg-white"
                          : "bg-white hover:bg-blue-50"
                      )}
                      style={{
                        borderColor: isCorrect
                          ? "#6bd36b"
                          : isWrong
                          ? "#f5a3a3"
                          : PFIZER.blue4,
                      }}
                    >
                      <input
                        type="radio"
                        name={`q-${i}`}
                        className="h-4 w-4 accent-blue-600"
                        disabled={submitted}
                        checked={isSelected}
                        onChange={() =>
                          setQuizAnswers({ ...quizAnswers, [i]: oi })
                        }
                      />
                      <span
                        className="text-sm md:text-base"
                        style={{ color: PFIZER.blue1 }}
                      >
                        {opt}
                      </span>
                    </label>
                  );
                })}
              </div>

              {submitted && (
                <div className="mt-2 text-sm" style={{ color: PFIZER.blue2 }}>
                  Correct answer:{" "}
                  <span className="font-semibold">{q.options[correctIdx]}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between">
        {!submitted ? (
          <button
            onClick={onSubmit}
            className="px-4 py-2 rounded-xl font-semibold shadow-sm text-white"
            style={{ background: PFIZER.blue5, border: `1px solid ${PFIZER.blue4}` }}
          >
            Submit Quiz
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm md:text-base">
            <Coin />
            <span style={{ color: PFIZER.blue1 }}>
              You got <b>{correct}/5</b> correct • +{correct * 20} coins
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────────────────
   Page
   ─────────────────────────────────────────────────────────────────────────── */
export default function LearningPage() {
  const [coins, setCoins] = useState(0);
  const [progress, setProgress] = useState(-1);
  const [claimed, setClaimed] = useState([]);

  // lesson panel state
  const [openLesson, setOpenLesson] = useState(null);
  const [watching, setWatching] = useState(false);
  const [watchedSec, setWatchedSec] = useState(0);
  const WATCH_NEED = 30;
  const [videoMarkedComplete, setVideoMarkedComplete] = useState(false);

  // quiz
  const [quizAnswers, setQuizAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // load persisted
  useEffect(() => {
    const c = Number(localStorage.getItem(LS.coins) || 0);
    const p = Number(localStorage.getItem(LS.progress) || -1);
    const r = JSON.parse(localStorage.getItem(LS.rewards) || "[]");
    setCoins(c);
    setProgress(p);
    setClaimed(r);
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(LS.coins, String(coins));
    localStorage.setItem(LS.progress, String(progress));
    localStorage.setItem(LS.rewards, JSON.stringify(claimed));
  }, [coins, progress, claimed]);

  // watch timer
  useEffect(() => {
    if (!watching) return;
    const t = setInterval(() => setWatchedSec((s) => s + 1), 1000);
    return () => clearInterval(t);
  }, [watching]);

  function handleCollect(idx) {
    setClaimed((r) => [...r, idx]);
    setCoins((c) => c + 50);
  }

  function handleLesson(idx) {
    setOpenLesson(idx);
    setWatching(false);
    setWatchedSec(0);
    setVideoMarkedComplete(false);
    setSubmitted(false);
    setQuizAnswers({});
  }

  const canMarkComplete = watchedSec >= WATCH_NEED && !videoMarkedComplete;
  const canTakeQuiz = videoMarkedComplete;

  function markVideoComplete() {
    if (!canMarkComplete) return;
    setVideoMarkedComplete(true);
    setCoins((c) => c + 100); // +100 for finishing the video
    // if this is the next lesson, mark as progressed
    if (openLesson != null && progress < openLesson) {
      setProgress(openLesson);
    }
  }

  function submitQuiz() {
    let correct = 0;
    QUIZ.forEach((q, i) => {
      if (quizAnswers[i] === q.a) correct++;
    });
    setCoins((c) => c + correct * 20);
    setSubmitted(true);
  }

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden ml-32"
      style={{ background: `linear-gradient(180deg, ${PFIZER.blue2}, #ffffff)` }}
    >
      {/* Header */}
      <header
        className="sticky top-0 z-30 border-b bg-white/70 backdrop-blur"
        style={{ borderColor: PFIZER.blue4 }}
      >
        <div className="flex justify-between px-6 py-3 max-w-6xl mx-auto">
          <h1 className="text-xl md:text-2xl font-bold" style={{ color: PFIZER.blue1 }}>
            Learning Path
          </h1>
          <div className="flex items-center gap-2">
            <Coin />
            <span className="font-semibold" style={{ color: PFIZER.blue1 }}>
              {coins}
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 max-w-6xl mx-auto">
        {/* Path column with floating character */}
        <section className="lg:col-span-2 relative">
          <img
            src={characterImage}
            alt="Poko"
            className="hidden md:block pointer-events-none select-none"
            style={{
              position: "sticky",
              top: 140,
              left: "calc(100% - 120px)",
              width: 140,
              filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.25))",
              animation: "poko-float 3s ease-in-out infinite",
            }}
          />
          <style>{`
            @keyframes poko-float { 
              0%, 100% { transform: translateY(0); } 
              50% { transform: translateY(-10px); } 
            }
          `}</style>

          <Path
            items={LESSON_CONTENT}
            progress={progress}
            claimed={claimed}
            onOpenLesson={handleLesson}
            onCollectReward={handleCollect}
          />
        </section>

        {/* Lesson panel */}
        <aside
          className="rounded-2xl border shadow bg-white p-4 sm:p-6 h-fit sticky top-20"
          style={{ borderColor: PFIZER.blue4 }}
        >
          {openLesson == null ? (
            <p style={{ color: PFIZER.blue2 }}>Select a lesson on the left to begin.</p>
          ) : (
            <div className="space-y-5">
              <h2 className="text-lg md:text-xl font-bold" style={{ color: PFIZER.blue1 }}>
                {LESSON_CONTENT[openLesson].title}
              </h2>

              {/* “Video” section – watch timer + content */}
              <div
                className="rounded-xl overflow-hidden border"
                style={{ borderColor: PFIZER.blue5, background: PFIZER.blue8 }}
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-sm font-semibold" style={{ color: PFIZER.blue1 }}>
                      Lesson Video (simulated)
                    </div>
                    <div className="text-xs" style={{ color: PFIZER.blue2 }}>
                      Watched: {Math.min(watchedSec, WATCH_NEED)}s / {WATCH_NEED}s
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 rounded-full mb-4" style={{ background: PFIZER.blue7 }}>
                    <div
                      className="h-2 rounded-full"
                      style={{
                        width: `${Math.min((watchedSec / WATCH_NEED) * 100, 100)}%`,
                        background: PFIZER.blue6,
                      }}
                    ></div>
                  </div>

                  {/* Content bullets */}
                  <ul className="list-disc pl-5 space-y-1 text-sm md:text-base" style={{ color: PFIZER.blue2 }}>
                    {LESSON_CONTENT[openLesson].bullets.map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>

                  {/* Watch controls */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {!videoMarkedComplete && (
                      <>
                        <button
                          onClick={() => setWatching((w) => !w)}
                          className="px-3 py-2 rounded-xl font-semibold text-white"
                          style={{ background: PFIZER.blue5, border: `1px solid ${PFIZER.blue4}` }}
                        >
                          {watching ? "Pause" : "Start"}
                        </button>
                        <button
                          onClick={() => {
                            setWatching(false);
                            setWatchedSec(0);
                          }}
                          className="px-3 py-2 rounded-xl font-semibold"
                          style={{
                            background: "white",
                            color: PFIZER.blue4,
                            border: `1px solid ${PFIZER.blue4}`,
                          }}
                        >
                          Reset
                        </button>
                        <button
                          onClick={markVideoComplete}
                          disabled={!canMarkComplete}
                          className={cx(
                            "px-3 py-2 rounded-xl font-semibold text-white",
                            canMarkComplete ? "" : "opacity-60 cursor-not-allowed"
                          )}
                          style={{
                            background: PFIZER.blue6,
                            border: `1px solid ${PFIZER.blue4}`,
                          }}
                          title={canMarkComplete ? "+100 coins" : "Watch full time to enable"}
                        >
                          Mark Complete (+100)
                        </button>
                      </>
                    )}
                    {videoMarkedComplete && (
                      <div className="text-sm font-semibold" style={{ color: PFIZER.blue1 }}>
                        Video complete! +100 coins
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Quiz */}
              <div className="space-y-3">
                {!canTakeQuiz ? (
                  <div className="text-sm" style={{ color: PFIZER.blue2 }}>
                    Watch the video for {WATCH_NEED} seconds and press <b>Mark Complete</b> to unlock the quiz.
                  </div>
                ) : (
                  <QuizCard
                    onSubmit={submitQuiz}
                    submitted={submitted}
                    quizAnswers={quizAnswers}
                    setQuizAnswers={setQuizAnswers}
                  />
                )}
              </div>
            </div>
          )}
        </aside>
      </main>
    </div>
  );
}
