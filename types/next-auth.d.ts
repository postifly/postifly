import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      firstName?: string | null;
      lastName?: string | null;
      role: string;
      phoneVerified?: boolean;
      roomNumber?: string;
    };
  }

  interface User {
    id: string;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    role: string;
    phoneVerified?: boolean;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
    phoneVerified?: boolean;
    roomNumber?: string;
  }
}
