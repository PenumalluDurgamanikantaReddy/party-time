"use client";
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { TOKEN_KEY } from '../context/AuthContext'; // Import the key from the source

export default function AuthGate({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTokenChecked, setIsTokenChecked] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem(TOKEN_KEY);
      const role = localStorage.getItem('user_role');

      if (!token && pathname !== '/login') {
        // If no token, redirect to login page
        router.replace('/login');
      } else if (token && pathname === '/login') {
        // If token exists and user is on login page, redirect based on role
        if (role === 'organizer') {
          router.replace('/organizer');
        } else {
          router.replace('/events');
        }
      } else {
        // Allow access
        setIsTokenChecked(true);
      }
    }
  }, [pathname]);

  // Show children only if the token has been checked and the user is on the correct path
  // Or if the user is on the login page
  if (isTokenChecked || pathname === '/login') {
    return children;
  }

  // Render nothing or a loading spinner while checking
  return null;
}
