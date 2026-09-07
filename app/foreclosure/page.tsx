import { cookies } from "next/headers";
import ForeclosurePageContent from "@/components/ForeclosurePage";
import {
  isAuthLoggedInCookieHint,
  ZAPCASH_AUTH_LOGGED_IN_COOKIE_NAME,
} from "@/lib/auth-session-cookie";
import { redirect } from "next/navigation";

export default async function Page() {
  const jar = await cookies();
  const loggedInHintFromCookies = isAuthLoggedInCookieHint(
    jar.get(ZAPCASH_AUTH_LOGGED_IN_COOKIE_NAME)?.value,
  );
  if (!loggedInHintFromCookies) {
    redirect("/");
  }

  return <ForeclosurePageContent />;
}