import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";
import {compare} from "bcryptjs";
import User from "@/models/User";
import {connectToDatabase} from "../../../../lib/mongodb";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: {label: "Email", type: "text"},
        password: {label: "Password", type: "password"},
      },
      async authorize(credentials) {
        await connectToDatabase();

        const email = credentials?.email?.toLowerCase().trim();
        const password = credentials?.password || "";

        const user = await User.findOne({email});
        if (!user) return null;

        const ok = await compare(password, user.password);
        if (!ok) return null;

        // Pole, które trafi do JWT (lightweight, tylko to co potrzebne)
        return {
          id: user._id.toString(),
          email: user.email,
          role: user.role,
          name: user.name,
        };
      },
    }),
  ],
  session: {strategy: "jwt" as const},
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      // user jest tylko przy sign-in
      if (user) {
        token.id = (user as {id?: string}).id as string | undefined;
        const role = (user as {role?: string}).role;
        if (role === "admin" || role === "user") {
          (token as {role?: "admin" | "user"}).role = role;
        }
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      // dołóż id/rolę do session.user
      if (session.user) {
        (session.user as {id: string; role: string}).id = token.id as string;
        (session.user as {id: string; role: string}).role =
          token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/account/signin", // własna strona logowania
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export {handler as GET, handler as POST};
