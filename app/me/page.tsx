import { getCurrentUser } from "@/src/lib/current-user";
import Link from "next/link";

export default async function MePage() {
  const user = await getCurrentUser();

  if (!user) {
    return (
      <div style={{ maxWidth: 400, margin: "40px auto" }}>
        <p>You are not logged in.</p>
        <Link href="/login">Go to login</Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h1>My Profile</h1>
      <p>
        <strong>ID:</strong> {user.id}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Name:</strong> {user.name}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      <form action="/api/auth/logout" method="POST">
        <button type="submit">Log out</button>
      </form>
    </div>
  );
}
