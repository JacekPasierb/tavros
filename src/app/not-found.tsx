// app/not-found.tsx (server component)
import { redirect } from "next/navigation";

export default function NotFound() {
  // natychmiastowy redirect na stronę główną
  redirect("/");
}
