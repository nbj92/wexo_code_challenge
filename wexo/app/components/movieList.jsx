import { Link } from "@remix-run/react";
import MovieItem from "./movieItem";

export default function MovieList({ movieList, user }) {
  const genreMovie = movieList.map((gm) => {
    const genre = gm[0];
    let movies = gm[1];

    return (
      <div key={genre}>
        {genre} <Link to={`genre/${genre}/1`}>See All</Link>
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
