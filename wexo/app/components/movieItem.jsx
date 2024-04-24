import { Link } from "@remix-run/react";
import Favorit from "./favorite";
import { useState } from "react";

export default function MovieItem({ movie, user, favState = null }) {
  movie.id = movie.id.split("/").slice(-1)[0];
  //   console.log(movie.id);
  return (
    <li key={movie.id}>
      <Link to={`/movies/${movie.id}`}>{movie.title}</Link>
      {user ? <Favorit movie={movie} user={user} favState={favState} /> : null}
    </li>
  );
}
