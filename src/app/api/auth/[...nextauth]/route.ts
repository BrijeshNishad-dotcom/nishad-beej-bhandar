import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

const customHandler = async (req: Request, context: any) => {
  const response = await handler(req, context);
  
  // Clone headers because original response headers might be read-only
  const newHeaders = new Headers();
  
  // getSetCookie() returns an array of all Set-Cookie header strings
  const setCookies = typeof response.headers.getSetCookie === 'function' 
    ? response.headers.getSetCookie() 
    : [];
  
  for (const [key, value] of response.headers.entries()) {
    if (key.toLowerCase() !== 'set-cookie') {
      newHeaders.append(key, value);
    }
  }
  
  if (setCookies.length > 0) {
    setCookies.forEach((cookieStr: string) => {
      const isNextAuthCookie = cookieStr.includes('session-token') || 
                               cookieStr.includes('csrf-token') || 
                               cookieStr.includes('callback-url');
      const isDeletion = cookieStr.includes('max-age=0') || 
                         cookieStr.includes('Max-Age=0') || 
                         cookieStr.includes('expires=Thu, 01 Jan 1970') || 
                         cookieStr.includes('Expires=Thu, 01 Jan 1970');
      
      if (isNextAuthCookie && !isDeletion) {
        const parts = cookieStr.split(';');
        const modifiedParts = parts.filter((part) => {
          const trimmed = part.trim().toLowerCase();
          return !trimmed.startsWith('max-age=') && !trimmed.startsWith('expires=');
        });
        const modifiedCookieStr = modifiedParts.join(';');
        newHeaders.append('set-cookie', modifiedCookieStr);
      } else {
        newHeaders.append('set-cookie', cookieStr);
      }
    });
  }
  
  // Read body as text from cloned response to avoid locking or empty stream issues
  const bodyText = await response.clone().text();
  
  return new Response(bodyText, {
    status: response.status,
    statusText: response.statusText,
    headers: newHeaders,
  });
};

export { customHandler as GET, customHandler as POST };
