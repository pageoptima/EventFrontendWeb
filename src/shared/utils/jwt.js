/**
 * Decodes the payload of a JWT without verifying the signature.
 * Safe for reading non-sensitive claims (id, name, email, role) on the client.
 * Returns null if the token is malformed.
 */
export function decodeJwt(token) {
  try {
    const base64 = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    const json = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + c.charCodeAt(0).toString(16).padStart(2, "0"))
        .join(""),
    );
    const { sub, name, email, role } = JSON.parse(json);
    return { id: sub ?? null, name: name ?? null, email: email ?? null, role: role ?? null };
  } catch {
    return null;
  }
}
