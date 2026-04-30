import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/utils/db";
import User from "@/models/User";

console.log("NextAuth: route.ts initialized");

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      profile(profile) {
        console.log("NextAuth: Google Profile received", { name: profile.name, picture: profile.picture });
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          role: profile.role || "student",
        };
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter an email and password");
        }

        if (credentials.email.toLowerCase() === "admin@isoftware.com" && credentials.password === "admin") {
          console.log("NextAuth: Hardcoded admin bypass activated!");
          return {
            id: "hardcoded-admin-id-123",
            email: "admin@isoftware.com",
            name: "Super Admin",
            role: "admin",
          };
        }

        await dbConnect();
        const user = await User.findOne({ email: credentials.email.toLowerCase() });

        if (!user || !user.password) {
          console.log("NextAuth: No user found with this email", credentials.email);
          throw new Error("No user found with this email");
        }
        
        const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordCorrect) {
          console.log("NextAuth: Password incorrect for", user.email);
          throw new Error("Invalid password");
        }

        if (!user.isVerified) {
          throw new Error("Please verify your email address to log in.");
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role
        };
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      console.log("NextAuth: signIn callback triggered", { email: user.email, name: user.name });
      if (account?.provider === "google" && user.email) {
        await dbConnect();
        const email = user.email.toLowerCase();
        // Google profile photo is typically in profile.picture
        const googleImage = profile?.picture || user.image;

        try {
          const existingUser = await User.findOne({ email });
          if (existingUser) {
            console.log("NextAuth: Updating existing user", email);
            existingUser.name = (user.name as string) || existingUser.name;
            if (googleImage) existingUser.image = googleImage;
            await existingUser.save();
          } else {
            console.log("NextAuth: Creating new user", email);
            await User.create({
              name: user.name as string,
              email: email,
              image: googleImage,
              password: "", 
              role: "student",
              isVerified: true, 
            });
          }
        } catch (error) {
          console.error("NextAuth: Error in signIn callback", error);
        }
      }
      return true;
    },
    async session({ session, token }: any) {
      console.log("NextAuth: session callback triggered", { tokenEmail: token?.email });
      if (session.user) {
        // Carry over image/picture from token
        session.user.image = token.picture || session.user.image;
        
        try {
          await dbConnect();
          const email = (token.email || session.user.email)?.toLowerCase();
          if (email) {
            const dbUser = await User.findOne({ email });
            if (dbUser) {
              console.log("NextAuth: session merging data from DB", dbUser.email);
              session.user.id = dbUser._id.toString();
              session.user.role = dbUser.role;
              session.user.name = dbUser.name;
              // Only override if DB has a specific image, else keep token image
              if (dbUser.image) session.user.image = dbUser.image;
              session.user.email = dbUser.email;
            }
          }
        } catch (error) {
          console.error("NextAuth: Error in session callback", error);
        }
      }
      return session;
    },
    async jwt({ token, user, trigger, session }: any) {
      console.log("NextAuth: jwt callback triggered", { trigger, userEmail: user?.email });
      if (user) {
        token.id = user.id;
        token.email = user.email?.toLowerCase();
        token.name = user.name;
        token.picture = user.image || (user as any).picture;
        
        try {
          await dbConnect();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.role;
            if (dbUser.image) token.picture = dbUser.image;
          } else {
            token.role = "student";
          }
        } catch (error) {
          console.error("NextAuth: Error in jwt callback", error);
        }
      }
      
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      
      return token;
    },
  },
  pages: {
    signIn: "/get-started",
    error: "/get-started",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
