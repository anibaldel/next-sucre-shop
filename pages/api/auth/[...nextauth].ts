import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import FacebookProvider from "next-auth/providers/facebook";
import { dbUsers } from "../../../database";

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correro:', type: 'email', placeholder:'correo@google.com' },
        password: { label: 'Contraseña:', type: 'password', placeholder:'Contraseña'}
      },
      async authorize( credentials ) {
        // TODO: 
        // return { name: 'Juan', correo: 'juan@google.com', role: 'admin' };
        return await dbUsers.checkUserEmailPasword(credentials!.email, credentials!.password);
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID || '',
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET || ''
    }),

  ],

  // Custom Pages
  pages: {
    signIn: '/auth/login',
    newUser: '/auth/register'
  },

  jwt: {

  },

  session: {
    maxAge: 2592000, /// 30d
    strategy: 'jwt',
    updateAge: 86400 // cada dia

  },

  // Callbacks
  callbacks: {
    async jwt({ token, account, user }) {

      if( account ) {
        token.accessToken = account.access_token;

        switch (account.type ) {

          case 'oauth':
            token.user = await dbUsers.oAuthToDbUser( user?.email || '', user?.name || '');
            break;
          case 'credentials':
            token.user = user
            break;
        }
      }
      return token
    },

    async session({ session, token, user }){
      // console.log({ session, token, user });
      session.accessToken = token.accessToken;
      session.user = token.user as any

      return session;
    }


  }
})
