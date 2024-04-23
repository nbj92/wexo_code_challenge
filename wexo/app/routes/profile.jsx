import { Form, redirect } from "@remix-run/react";
import { authenticator } from "../services/auth.server";
export async function loader({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    failureRedirect: "/movies",
  });

  return user;
}

export async function action({ request }) {
  return await authenticator.logout(request, { redirectTo: "/movies" });
}

export default function Profile() {
  return (
    <>
      <Form method="post">
        <h1>Welcome to your profile, see your favorite movies</h1>
        <button type="submit">Logout</button>
      </Form>
    </>
  );
}
