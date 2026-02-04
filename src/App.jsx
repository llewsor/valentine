import { useEffect, useRef, useState } from "react";

// const celebrationGif = "https://media.giphy.com/media/111ebonMs90YLu/giphy.gif";
const celebrationGif =
  "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExZjNiaW5icXAzcWVrOWx1emxoZHY3and2c3psdXc1OXh5Y3FxZnQzcSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/20NDgRLTSWRuwOQmUo/giphy.gif";

export default function App() {
  const [accepted, setAccepted] = useState(false);
  const [yesBig, setYesBig] = useState(false);
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const areaRef = useRef(null);
  const noRef = useRef(null);
  const yesRef = useRef(null);

  useEffect(() => {
    if (!areaRef.current || !noRef.current) return;
    const area = areaRef.current.getBoundingClientRect();
    const no = noRef.current.getBoundingClientRect();
    const x = Math.max(0, area.width - no.width);
    setNoPosition({ x: 470, y: 20 });
  }, []);

  const moveNoButton = () => {
    if (!areaRef.current || !noRef.current) return;

    const areaRect = areaRef.current.getBoundingClientRect();
    const noRect = noRef.current.getBoundingClientRect();
    const yesRect = yesRef.current?.getBoundingClientRect?.();

    const maxX = Math.max(0, areaRect.width - noRect.width - 20);
    const maxY = Math.max(0, areaRect.height - noRect.height - 20);

    // Tune these:
    const MIN_MOVE_PX = 100; // must move at least this far from current position
    const MIN_FROM_YES_PX = 120; // keep "No" away from "Yes"
    const MAX_TRIES = 60;

    const prev = noPosition;

    const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

    const distFromYes = (pos) => {
      if (!yesRect) return Infinity;
      // Compare center points
      const yesCenter = {
        x: yesRect.left - areaRect.left + yesRect.width / 2,
        y: yesRect.top - areaRect.top + yesRect.height / 2,
      };
      const noCenter = {
        x: pos.x + noRect.width / 2,
        y: pos.y + noRect.height / 2,
      };
      return Math.hypot(noCenter.x - yesCenter.x, noCenter.y - yesCenter.y);
    };

    let next = prev;

    for (let i = 0; i < MAX_TRIES; i++) {
      const candidate = {
        x: Math.round(Math.random() * maxX),
        y: Math.round(Math.random() * maxY),
      };

      if (dist(candidate, prev) < MIN_MOVE_PX) continue;
      if (distFromYes(candidate) < MIN_FROM_YES_PX) continue;

      next = candidate;
      break;
    }

    // Fallback: if we couldn't find a good spot, still move somewhere random.
    if (next === prev) {
      next = { x: Math.round(Math.random() * maxX), y: Math.round(Math.random() * maxY) };
    }

    setNoPosition(next);
    setYesBig(true);
  };

  return (
    <div className="page">
      <main className="card" aria-live="polite">
        <div className="icon" aria-hidden="true">
          <svg viewBox="0 0 120 120" role="img" aria-label="Cat with heart">
            <defs>
              <linearGradient id="fur" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#f6c07a" />
                <stop offset="1" stopColor="#eaa561" />
              </linearGradient>
              <linearGradient id="heart" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ff5c8a" />
                <stop offset="1" stopColor="#ff2d6f" />
              </linearGradient>
            </defs>
            <circle cx="60" cy="64" r="36" fill="url(#fur)" />
            <polygon points="36,34 50,56 28,50" fill="#eaa561" />
            <polygon points="84,34 92,50 70,56" fill="#eaa561" />
            <circle cx="48" cy="68" r="4.5" fill="#2d1f1f" />
            <circle cx="72" cy="68" r="4.5" fill="#2d1f1f" />
            <path d="M60 74 l6 6 -6 6 -6-6z" fill="#ff7aa9" />
            <path
              d="M88 30
                 c0-6 8-10 14-4
                 c6-6 14-2 14 4
                 c0 10-14 18-14 18
                 s-14-8-14-18z"
              transform="translate(-6 10) scale(0.7)"
              fill="url(#heart)"
            />
          </svg>
        </div>

        <h1>
          Marita-Louise, will you be my <span>valentine</span>?
        </h1>

        <div className="content">
          {!accepted ? (
            <div className="button-area" ref={areaRef}>
              <button ref={yesRef} className={`btn yes ${yesBig ? "big" : ""}`} onClick={() => setAccepted(true)}>
                Yes
              </button>

              <button
                ref={noRef}
                className="btn no"
                style={{
                  transform: `translate(${noPosition.x}px, ${noPosition.y}px)`,
                }}
                onPointerEnter={moveNoButton}
                onPointerDown={(e) => {
                  e.preventDefault();
                  moveNoButton();
                }}
                onFocus={moveNoButton}
                onTouchStart={(e) => {
                  e.preventDefault();
                  moveNoButton();
                }}
              >
                No
              </button>
            </div>
          ) : (
            <div className="celebrate">
              <div className="yay">YAY!</div>
              <img src={celebrationGif} alt="Celebration" />
            </div>
          )}
        </div>

        {!accepted && <p className="note">'No' seems a bit shy.</p>}
      </main>
    </div>
  );
}
