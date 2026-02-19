import { Link } from "react-router-dom";

function Login() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Login</h2>
      <p className="text-sm text-muted-foreground">
        Login form placeholder.
      </p>
      <p className="text-sm">
        Don&apos;t have an account?{" "}
        <Link className="text-primary underline-offset-4 hover:underline" to="/auth/register">
          Register
        </Link>
      </p>
    </section>
  );
}

export default Login;
