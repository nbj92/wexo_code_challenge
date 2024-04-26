import { json, useLoaderData } from "@remix-run/react";

export async function loader({ params }) {
  const id = params.movieId;

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };

  // Fetch data for the specific movie
  const response = await fetch(
    "https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas/" +
      id +
      "?form=json&lang=da",
    requestOptions
  );

  const result = await response.json();

  // Save all the relevant data in variable 'movie'
  const movie = {};
  movie.title = result.title;
  movie.description = result.description;
  movie.year = result["plprogram$year"];

  // filter and map to get genre, actors & directors respectively
  movie.genre = result["plprogram$tags"]
    .filter((tag) => tag["plprogram$scheme"] == "genre")
    .map((tag) => tag["plprogram$title"]);

  movie.actors = result["plprogram$credits"]
    .filter((credit) => credit["plprogram$creditType"] == "actor")
    .map((actor) => actor["plprogram$personName"]);

  movie.directors = result["plprogram$credits"]
    .filter((credit) => credit["plprogram$creditType"] == "director")
    .map((director) => director["plprogram$personName"]);

  return json({ movie });
}
export default function MoviePage() {
  // Destructure movie object from data provided by route loader
  const { movie } = useLoaderData();

  return (
    <div className="movie-box">
      <div>
        <h1>{movie.title}</h1>
      </div>
      <div>
        <h3>YEAR</h3> {movie.year}
      </div>
      <div>
        <h3>GENRER</h3> {movie.genre.join(", ")}
      </div>
      <div>
        <h3>DESCRIPTION</h3>
        {movie.description}
      </div>
      <div>
        <h3>CAST</h3>
        <div>
          <h4>Directors</h4> {movie.directors.join(", ")}
        </div>
        <div>
          <h4>Actors</h4> {movie.actors.join(", ")}
        </div>
      </div>
    </div>
  );
}
