import { json, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import { commitSession } from "../services/session.server";
import MovieList from "../components/movieList";
import favoriteUpdate from "../functions/favoriteUpdate";

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

export async function loader({ request }) {
  try {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };

    // Fetch Data to show
    const response = await fetch(
      "https://feed.entertainment.tv.theplatform.eu/f/jGxigC/bb-all-pas?form=json&lang=da&byTags=genre:war|action|comedy|thriller|romance|drama|crime|documentary|horror&range=1-300&sort=title&fields=id,title,tags",
      requestOptions
    );

    // Parse request body to json
    const result = await response.json();

    // Genres that need to be shown on page
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

    // object to hold key/value of genres/movies(array)
    const showCase = {};

    // add property key matching the respective genres
    genres.forEach((genre) => (showCase[genre] = []));

    // loop through the tags of the movies and add movie.id and movie.title to showCase obj.
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

    // Auth user. Used to show favorite icons
    const user = await authenticator.isAuthenticated(request);

    return json({ showCase, user });
  } catch (err) {
    json({ error: "No Movies Available." });
  }
}

export default function Movies() {
  const { showCase, user, error } = useLoaderData();

  // Because of no available pictures a placeholder cover is used.
  const url = "https://placehold.co/150x100?text=No%20Cover";

  // convert object to array consisting of arrays of [genre, [movies]]
  let genreMovie = Object.entries(showCase);

  return (
    <div className="movies-genreView">
      {error ? error : <MovieList movieList={genreMovie} user={user} />}
    </div>
  );
}
