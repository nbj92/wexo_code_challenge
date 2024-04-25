import { Link, json, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import MovieItem from "../components/movieItem";
import favoriteUpdate from "../functions/favoriteUpdate";
import { commitSession } from "../services/session.server";

export async function action({ request }) {
  const session = await favoriteUpdate(request);

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export async function loader({ params, request }) {
  const genreId = params.genreId;
  const pageId = parseInt(params.pageId);

  console.log(request);

  console.log(params);

  const start = (pageId - 1) * 100 + 1;
  const end = pageId * 100;

  const genreList = [
    ["Komedie", "comedy"],
    ["Krigsfilm", "war"],
    ["Romantik", "romance"],
    ["Krimi", "crime"],
    ["Dokumentar", "documentary"],
    ["Gyser", "horror"],
  ];

  let genre = genreId;

  genreList.forEach((el) => (el[0] == genreId ? (genre = el[1]) : ""));

  var requestOptions = {
    method: "GET",
    redirect: "follow",
  };
  const response = await fetch(
    "https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas?form=json&lang=da&byTags=genre:" +
      genre +
      "&range=" +
      `${start}-${end}` +
      "&sort=title&fields=id,title",
    requestOptions
  );

  let movies = await response.json();
  movies = movies.entries;

  console.log(movies.length);

  const user = await authenticator.isAuthenticated(request);
  // console.log(new URL(request.url).pathname);

  console.log(
    new URL(request.url).pathname.split("/").splice(1, 3).join("/") +
      `/${pageId - 1}`
  );

  // console.log(window.history.state);

  // if (movies?.length == 0) {
  //   return redirect(
  //     `/${new URL(request.url).pathname.split("/").splice(1, 3).join("/")}/${
  //       pageId - 1
  //     }`
  //   );
  // }

  return json({ genreId, movies, pageId, user });
}

export default function GenrePage() {
  const { genreId, movies, pageId, user } = useLoaderData();

  return (
    <div className="genre-view">
      <h1>{genreId}</h1>
      <ul>
        {movies.map((movie) => (
          <MovieItem user={user} movie={movie} key={movie.id} />
        ))}
      </ul>
      <div className="genre-pages">
        {pageId > 1 ? (
          <Link to={`../${pageId - 1}`} relative="path">
            Forrige
          </Link>
        ) : null}{" "}
        {movies.length >= 100 ? (
          <Link to={`../${pageId + 1}`} relative="path">
            Næste
          </Link>
        ) : null}
      </div>
    </div>
  );
}
