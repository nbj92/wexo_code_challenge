import { Form } from "@remix-run/react";
import { authenticator } from "../services/auth.server";

export default function Login() {
  return (
    <Form method="post">
      <input type="email" name="email" required />
      <input
        type="password"
        name="password"
        autoComplete="current-password"
        required
      />
      <button>Sign In</button>
    </Form>
  );
}

// ACTION (POST) & LOADERS (GET)
export async function action({ request }) {
  // Confirm or reject user input with the chosen strategy to login
  return await authenticator.authenticate("user-pass", request, {
    successRedirect: "/profile",
    failureRedirect: "/login",
  });
}

export async function loader({ request }) {
  let user = await authenticator.isAuthenticated(request, {
    successRedirect: "/profile",
  });
  return user;
}
