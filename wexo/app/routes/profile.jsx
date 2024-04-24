import { Form, json, useLoaderData } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
import MovieItem from "../components/movieItem";
import { useEffect, useState } from "react";
import { commitSession, getSession } from "../services/session.server";

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/movies",
  });

  return json({ user });
}

export async function action({ request }) {
  const formData = await request.formData();

  const movieId = formData.get("movieId");

  const session = await getSession(request.headers.get("Cookie"));
  let user = session.data.user;
  let userFavorites = user.favorites;

  const index = userFavorites.map((e) => e.id).indexOf(movieId);
  userFavorites.splice(index, 1);
  session.set("user", {
    email: user.email,
    favorites: userFavorites,
  });

  return json(
    { user },
    {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    }
  );

  // return await authenticator.logout(request, { redirectTo: "/movies" });
}

export default function Profile() {
  const { user } = useLoaderData();
  const [favorites, setFavorites] = useState(user.favorites);

  useEffect(() => {
    console.log(favorites);
  }, [favorites]);

  console.log(user);
  return (
    <>
      <Form method="post">
        <h1>Welcome to your profile, see your favorite movies</h1>
        <button type="submit">Logout</button>
      </Form>
      <ul>
        {user.favorites?.map((movie) => (
          <MovieItem user={user} movie={movie} key={movie.id} />
        ))}
      </ul>
    </>
  );
}
