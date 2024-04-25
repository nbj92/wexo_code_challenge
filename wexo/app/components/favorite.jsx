import { useFetcher } from "@remix-run/react";

export default function Favorit({ user, movie, favState = null }) {
  const currentMovie = { title: movie.title, id: movie.id };
  const fetcher = useFetcher();
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") == "true"
    : user?.favorites?.map((e) => e.id).includes(currentMovie.id);

  return (
    <fetcher.Form method="post">
      <input type="hidden" name="movieId" value={movie.id} />
      <input type="hidden" name="movieTitle" value={movie.title} />
      <button
        aria-label={favorite ? "Remove from favorites" : "Add to favorites"}
        name="favorite"
        value={favorite ? false : true}
        onClick={() => {
          if (favState) favState(user.favorites);
        }}
      >
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}
