import { requireAdmin } from "@/src/lib/auth-guards";
import { db, users } from "@/src/db/client";
import { eq } from "drizzle-orm";

async function getUsers() {
  await requireAdmin();
  return db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users);
}

export default async function AdminUsersPage() {
  const allUsers = await getUsers();

  async function toggleRole(id: string, currentRole: "USER" | "ADMIN") {
    "use server";
    await requireAdmin();
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    await db
      .update(users)
      .set({ role: newRole })
      .where(eq(users.id, id));
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto" }}>
      <h1>Admin: Users</h1>
      <table border={1} cellPadding={8}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Name</th>
            <th>Role</th>
            <th>Created</th>
            <th>Toggle Role</th>
          </tr>
        </thead>
        <tbody>
          {allUsers.map(u => (
            <tr key={u.id}>
              <td>{u.email}</td>
              <td>{u.name}</td>
              <td>{u.role}</td>
              <td>{u.createdAt?.toISOString?.() ?? ""}</td>
              <td>
                <form action={toggleRole.bind(null, u.id, u.role as any)}>
                  <button type="submit">
                    Make {u.role === "ADMIN" ? "USER" : "ADMIN"}
                  </button>
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
