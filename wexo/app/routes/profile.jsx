import { json, useLoaderData } from "@remix-run/react";
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

  const session = await getSession(request.headers.get("Cookie")); //get the sessionCookie
  let user = session.data.user; // get user object from the session
  let userFavorites = user.favorites; //get the array of user favorites

  const index = userFavorites.map((e) => e.id).indexOf(movieId); // get array index of the movie
  userFavorites.splice(index, 1); // delete the movie object from the array

  return json(
    { user },
    {
      headers: {
        "Set-Cookie": await commitSession(session), // Commit changes to the session
      },
    }
  );
}

export default function Profile() {
  const { user } = useLoaderData();
  const [favorites, setFavorites] = useState(user.favorites);

  // re-render when favorite changes
  useEffect(() => {}, [favorites]);

  return (
    <div className="profile">
      <div>
        <h3>Welcome, Check out your favorite movies.</h3>
      </div>

      <ul>
        {user.favorites?.map((movie) => (
          <MovieItem
            user={user}
            movie={movie}
            key={movie.id}
            favState={setFavorites}
          />
        ))}
      </ul>
    </div>
  );
}
