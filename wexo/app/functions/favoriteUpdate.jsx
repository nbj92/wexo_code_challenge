import { getSession } from "../services/session.server";

export default async function favoriteUpdate(request) {
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

  return session;
}
