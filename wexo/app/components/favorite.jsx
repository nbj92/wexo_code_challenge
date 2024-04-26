import { useFetcher } from "@remix-run/react";

export default function Favorit({ user, movie, favState = null }) {
  const currentMovie = { title: movie.title, id: movie.id };
  const fetcher = useFetcher(); // get the data submitted with useFetcher instead of reloading
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") == "true"
    : user?.favorites?.map((e) => e.id).includes(currentMovie.id); // favorit is updated to the fetcher formData or the users preferences

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
