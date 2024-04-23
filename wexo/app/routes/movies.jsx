import { Link, Outlet, json, useLoaderData } from "@remix-run/react";
import Favorit from "../components/favorite";

export async function loader() {
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

  //   console.log(showCase);

  return json({ showCase });
}

export default function Movies() {
  const { showCase } = useLoaderData();

  //   console.log(
  //     result.entries[0]["plprogram$thumbnails"]["orig-93x165"]["plprogram$url"]
  //   );
  const url = "https://placehold.co/150x100?text=No%20Cover";
  //   const url =
  //     result.entries[0]["plprogram$thumbnails"]["orig-93x165"]["plprogram$url"];
  let genreMovie = Object.entries(showCase).map((gm) => gm);

  genreMovie = genreMovie.map((gm) => {
    const genre = gm[0];
    let movies = gm[1];

    movies = movies.map((movie) => {
      const id = movie.id.split("/").slice(-1)[0];
      //   console.log(typeof id);
      return (
        <li key={id}>
          <Link to={id}>{movie.title}</Link>
        </li>
      );
    });

    // console.log(movies);

    return (
      <div key={genre}>
        {genre} <Link to={`genre/${genre}/1`}>See All</Link>
        <ul>{movies}</ul>
      </div>
    );

    // return list.map((movie) => movie);
  });

  //   console.log(genreMovie);
  return (
    <>
      <h1>Movies</h1>
      {/* <img src={url} alt="" /> */}
      {genreMovie}
      {/* {genreMovie.map((gm) => gm)} */}
    </>
  );
}
