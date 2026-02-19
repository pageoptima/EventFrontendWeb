import { Link } from "react-router-dom";

function Register() {
  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold">Register</h2>
      <p className="text-sm text-muted-foreground">
        Registration form placeholder.
      </p>
      <p className="text-sm">
        Already have an account?{" "}
        <Link className="text-primary underline-offset-4 hover:underline" to="/auth/login">
          Login
        </Link>
      </p>
    </section>
  );
}

export default Register;
