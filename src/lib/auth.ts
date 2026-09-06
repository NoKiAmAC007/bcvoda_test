import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Пароль", type: "password" },
      },
      async authorize(credentials) {
        const email = process.env.ADMIN_EMAIL || "admin@bcvoda.com.ua";
        const password = process.env.ADMIN_PASSWORD || "bcvoda2026";

        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email === email && credentials.password === password) {
          return { id: "1", email, name: "Адміністратор" };
        }
        return null;
      },
    }),
  ],
  session: { strategy: "jwt" as const },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET || "dev-secret-bcvoda-2026-please-change-in-prod-32chars",
};
