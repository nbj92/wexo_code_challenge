import { Link, Outlet, json, redirect, useLoaderData } from "@remix-run/react";
import Favorit from "../components/favorite";
import { authenticator } from "../services/auth.server";
import { commitSession, getSession } from "../services/session.server";
import MovieList from "../components/movieList";

export async function action({ request }) {
  const formData = await request.formData();

  const favorite = formData.get("favorite");
  const movieId = formData.get("movieId");
  const movieTitle = formData.get("movieTitle");

  const session = await getSession(request.headers.get("Cookie"));
  let user = session.data.user;
  let userFavorites = user.favorites;
  const movie = { title: movieTitle, id: movieId };
  if (favorite === "true") {
    if (!userFavorites.map((e) => e.id).includes(movie.id)) {
      userFavorites.push(movie);
    }
    session.set("user", {
      email: user.email,
      favorites: userFavorites,
    });
  } else {
    const index = userFavorites.map((e) => e.id).indexOf(movieId);
    userFavorites.splice(index, 1);
    session.set("user", {
      email: user.email,
      favorites: userFavorites,
    });
  }

  console.log(session.data.user);

  return json(
    {},
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );
}

export async function loader({ request }) {
  try {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    const response = await fetch(
      "https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas?form=json&lang=da&byTags=genre:war|action|comedy|thriller|romance|drama|crime|documentary|horror&range=1-300&sort=title&fields=id,title,tags",
      requestOptions
    );

    const result = await response.json();

    const genres = [
      "Action",
      "Komedie",
      "Thriller",
      "Krigsfilm",
      "Romantik",
      "Drama",
      "Krimi",
      "Dokumentar",
      "Gyser",
    ];

    const showCase = {};
    genres.forEach((genre) => (showCase[genre] = []));

    result.entries.forEach((movie) => {
      const tags = movie["plprogram$tags"];

      tags.forEach((tag) => {
        if (tag["plprogram$scheme"] === "genre") {
          const genre = tag["plprogram$title"];

          if (genres.includes(genre) && showCase[genre].length < 3) {
            showCase[genre].push({ id: movie.id, title: movie.title });
          }
        }
      });
    });

    const user = await authenticator.isAuthenticated(request);

    return json({ showCase, user });
  } catch (err) {
    json({ error: "No Movies Available." });
  }
}

export default function Movies() {
  const { showCase, user, error } = useLoaderData();

  //   console.log(
  //     result.entries[0]["plprogram$thumbnails"]["orig-93x165"]["plprogram$url"]
  //   );
  const url = "https://placehold.co/150x100?text=No%20Cover";
  //   const url =
  //     result.entries[0]["plprogram$thumbnails"]["orig-93x165"]["plprogram$url"];
  let genreMovie = Object.entries(showCase).map((gm) => gm);

  return (
    <>
      <h1>Movies</h1>
      {/* <img src={url} alt="" /> */}
      {error ? error : <MovieList movieList={genreMovie} user={user} />}
      {/* {genreMovie.map((gm) => gm)} */}
    </>
  );
}
