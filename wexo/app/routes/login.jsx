// app/routes/login.jsx

import { Form } from "@remix-run/react";
import { authenticator } from "../services/auth.server";

// First we create our UI with the form doing a POST and the inputs with the
// names we are going to use in the strategy
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

// Second, we need to export an action function, here we will use the
// `authenticator.authenticate method`
export async function action({ request }) {
  // we call the method with the name of the strategy we want to use and the
  // request object, optionally we pass an object with the URLs we want the user
  // to be redirected to after a success or a failure
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
