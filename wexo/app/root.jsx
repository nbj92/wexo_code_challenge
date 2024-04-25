import {
  Form,
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  json,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { authenticator } from "./services/auth.server";

import appStylesHref from "./styles/app.css?url";

export const links = () => [{ rel: "stylesheet", href: appStylesHref }];

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader({ request }) {
  const user = await authenticator.isAuthenticated(request);

  return json({ user });
}

export default function App() {
  const { user } = useLoaderData();
  return (
    <div>
      <header>
        <div className="banner">
          <img src={"app/img/topbanner.jpg"} alt="MovieBox" />{" "}
          <div>MovieBox</div>
        </div>

        <nav>
          <Link to="/movies">Movies</Link>{" "}
          {user ? (
            <>
              <Link to="/profile">Profile</Link>
              <Form method="post" action="/logout">
                <button type="submit">Logout</button>
              </Form>
            </>
          ) : (
            <Link to="/login">Login</Link>
          )}
        </nav>
      </header>
      <div id="content">
        <Outlet />
      </div>
    </div>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();
  console.error(error);
  return (
    <html>
      <head>
        <title>Oh no!</title>
        <Meta />
        <Links />
      </head>
      <body>
        <h1>THE PAGE WAS NOT FOUND (404)</h1>
        <Scripts />
      </body>
    </html>
  );
}
