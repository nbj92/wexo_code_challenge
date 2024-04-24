import { json, useLoaderData } from "@remix-run/react";

export async function loader({ params }) {
  const id = params.movieId;

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const response = await fetch(
    "https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas/" +
      id +
      "?form=json&lang=da",
    requestOptions
  );

  const result = await response.json();

  // console.log(result);

  const movie = {};
  movie.title = result.title;
  movie.description = result.description;
  movie.year = result["plprogram$year"];

  // console.log(result["plprogram$credits"]);

  movie.genre = result["plprogram$tags"]
    .filter((tag) => tag["plprogram$scheme"] == "genre")
    .map((tag) => tag["plprogram$title"]);

  movie.actors = result["plprogram$credits"]
    .filter((credit) => credit["plprogram$creditType"] == "actor")
    .map((actor) => actor["plprogram$personName"]);

  movie.directors = result["plprogram$credits"]
    .filter((credit) => credit["plprogram$creditType"] == "director")
    .map((director) => director["plprogram$personName"]);

  return json({ movie, result });
}
export default function MoviePage() {
  const { movie, result } = useLoaderData();
  // console.log(showCase);
  // console.log(id);
  console.log(result);

  return (
    <>
      <div>Title: {movie.title}</div>
      <div>desription: {movie.description}</div>
      <div>year: {movie.year}</div>
      <div>Genre: {movie.genre.join(", ")}</div>
      <div>Actors: {movie.actors.join(", ")}</div>
      <div>Directors: {movie.directors.join(", ")}</div>
    </>
  );
}
