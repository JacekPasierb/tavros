"use client";

import {signOut, useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import React from "react";

const Page = () => {
  const {data: session, status} = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <section className="container mx-auto py-10 text-center">
        <p className="text-gray-600">Ładowanie danych konta...</p>
      </section>
    );
  }

  if (!session) {
    return (
      <section className="container mx-auto py-10 text-center">
        <p className="text-gray-600">Nie jesteś zalogowany.</p>
        <button
          onClick={() => router.push("/login")}
          className="mt-4 rounded bg-black px-4 py-2 text-white font-semibold"
        >
          Zaloguj się
        </button>
      </section>
    );
  }
  return (
    <div>
      Account
      <p className="text-gray-700">
        <span className="font-semibold">Email:</span> {session.user?.email}
      </p>
      <button
          onClick={() => signOut({ callbackUrl: "/account/signin" })}
          className="w-full rounded bg-red-600 py-2 text-white font-semibold hover:bg-red-700 transition"
        >
          Wyloguj się
        </button>
    </div>
  );
};

export default Page;
