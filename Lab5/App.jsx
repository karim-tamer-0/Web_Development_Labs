import { useState } from "react";
import "./App.css";

const MAX_STARS = 5;

// Renders ⭐⭐⭐☆☆ — clicking a star sets the rating (clicking the same star again clears it)
function StarRating({ value, onChange }) {
  return (
    <div className="stars" role="radiogroup" aria-label="Star rating">
      {Array.from({ length: MAX_STARS }, (_, i) => {
        const n = i + 1;
        return (
          <button
            key={n}
            type="button"
            className={n <= value ? "star on" : "star"}
            onClick={() => onChange(n === value ? 0 : n)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
          >
            {n <= value ? "⭐" : "☆"}
          </button>
        );
      })}
    </div>
  );
}

function MovieCard({ movie, onRemove, onRate, onComment }) {
  return (
    <li className="card">
      <div className="card-head">
        <h3>{movie.title}</h3>
        <button className="remove" onClick={() => onRemove(movie.id)}>
          Remove
        </button>
      </div>

      {/* Requirement 3: add a star rating */}
      <StarRating value={movie.stars} onChange={(n) => onRate(movie.id, n)} />

      {/* Requirement 4: show how many stars using emojis */}
      <p className="stars-shown">
        {movie.stars > 0
          ? `${"⭐".repeat(movie.stars)} (${movie.stars}/${MAX_STARS})`
          : "Not rated yet"}
      </p>

      {/* Requirement 2: comment review */}
      <textarea
        placeholder="Write your review..."
        value={movie.comment}
        onChange={(e) => onComment(movie.id, e.target.value)}
        rows={2}
      />
    </li>
  );
}

export default function App() {
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState("");

  // Requirement 1: add
  const addMovie = (e) => {
    e.preventDefault();
    const name = title.trim();
    if (!name) return;
    setMovies([
      ...movies,
      { id: Date.now(), title: name, stars: 0, comment: "" },
    ]);
    setTitle("");
  };

  // Requirement 1: remove
  const removeMovie = (id) => setMovies(movies.filter((m) => m.id !== id));

  const updateMovie = (id, changes) =>
    setMovies(movies.map((m) => (m.id === id ? { ...m, ...changes } : m)));

  return (
    <main className="app">
      <h1>🎬 Movies Watch List</h1>

      <form className="add-form" onSubmit={addMovie}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Movie title"
          aria-label="Movie title"
        />
        <button type="submit">Add movie</button>
      </form>

      {movies.length === 0 ? (
        <p className="empty">No movies yet. Add the first one you watched.</p>
      ) : (
        <ul className="list">
          {movies.map((m) => (
            <MovieCard
              key={m.id}
              movie={m}
              onRemove={removeMovie}
              onRate={(id, stars) => updateMovie(id, { stars })}
              onComment={(id, comment) => updateMovie(id, { comment })}
            />
          ))}
        </ul>
      )}
    </main>
  );
}
