import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Segunda barrera además del middleware: cada acción del panel la llama antes de escribir.
export async function requireAdmin() {
  const store = await cookies();
  if (!(await verifySessionToken(store.get(SESSION_COOKIE)?.value))) redirect("/admin/login");
}
