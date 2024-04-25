import { Link } from "@remix-run/react";
import MovieItem from "./movieItem";

export default function MovieList({ user, movieList = null }) {
  const genreMovie = movieList.map((gm) => {
    const genre = gm[0];
    const movies = gm[1];

    return (
      <div key={genre}>
        <div className="movies-mvList-genre">
          <h2>{genre}</h2> <Link to={`genre/${genre}/1`}>See All</Link>
        </div>
        <ul>
          {movies.map((movie) => (
            <MovieItem key={movie.id} movie={movie} user={user} />
          ))}
        </ul>
      </div>
    );
  });

  return <>{genreMovie}</>;
}
