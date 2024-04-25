import { Link } from "@remix-run/react";
import Favorit from "./favorite";

export default function MovieItem({ movie, user, favState = null }) {
  movie.id = movie.id.split("/").slice(-1)[0];
  return (
    <li key={movie.id}>
      <div className="movies-mvItem-item">
        <div className="movies-mvItem-title">
          <img src="https://placehold.co/75x50?text=No%20Cover" alt="" />
          <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
        </div>
        {user ? (
          <Favorit movie={movie} user={user} favState={favState} />
        ) : null}
      </div>
    </li>
  );
}
