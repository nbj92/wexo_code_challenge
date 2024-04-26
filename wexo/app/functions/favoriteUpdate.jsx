import { getSession } from "../services/session.server";

export default async function favoriteUpdate(request) {
  const formData = await request.formData();

  const favorite = formData.get("favorite");
  const movieId = formData.get("movieId");
  const movieTitle = formData.get("movieTitle");

  const session = await getSession(request.headers.get("Cookie")); // get sessionCookie
  let user = session.data.user;
  let userFavorites = user.favorites;
  const movie = { title: movieTitle, id: movieId };

  // if favorite true add/push the movie data (movie.id, movie.title) to favorites array
  if (favorite === "true") {
    // since the movie appears more than once it should not be added more than once to array
    if (!userFavorites.map((e) => e.id).includes(movie.id)) {
      userFavorites.push(movie);
    }
  } else {
    //otherwise (false) delete movie object from the array
    const index = userFavorites.map((e) => e.id).indexOf(movieId);
    userFavorites.splice(index, 1);
  }

  return session;
}
