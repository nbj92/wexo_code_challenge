import { redirect } from "@remix-run/react";
import { authenticator } from "../services/auth.server";

export async function action({ request }) {
  await authenticator.isAuthenticated(request, { failureRedirect: "/movies" });
  return authenticator.logout(request, {
    redirectTo: "/movies",
  });
}

export async function loader() {
  return redirect("/movies");
}
