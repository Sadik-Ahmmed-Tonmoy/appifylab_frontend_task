import { jwtDecode } from 'jwt-decode';

// export const verifyToken = (token: string) => {
//   return jwtDecode(token);
// };


export const verifyToken = (token?: string | null) => {
  try {
    if (!token) return null;

    const cleanToken = token.replace(/^Bearer\s+/i, "");

    if (cleanToken.split(".").length !== 3) {
      return null;
    }

    return jwtDecode(cleanToken);
  } catch {
    return null;
  }
};