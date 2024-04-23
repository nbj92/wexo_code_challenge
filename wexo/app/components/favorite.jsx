import { useFetcher } from "@remix-run/react";
export default function Favorit({ user, movie }) {
  const fetcher = useFetcher();
  const favorite = user.favorites.includes(movie.id);

  return (
    <fetcher.Form method="post">
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? "false" : "true"}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
