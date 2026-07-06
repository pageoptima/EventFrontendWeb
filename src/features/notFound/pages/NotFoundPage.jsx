import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <section className="space-y-3">
      <h1 className="text-2xl font-semibold">Page Not Found</h1>
      <p className="text-muted-foreground">
        The page you are looking for does not exist.
      </p>
      <Link className="text-primary underline-offset-4 hover:underline" to="/">
        Go back home
      </Link>
    </section>
  );
}

export default NotFoundPage;
