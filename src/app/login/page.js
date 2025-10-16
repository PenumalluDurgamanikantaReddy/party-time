"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

const ROLE_KEY = 'user_role';

export default function LoginPage() {
  const { user, loading, signInWithGoogle } = useAuth();
  const router = useRouter();
  const [role, setRole] = useState('');

  // On component mount, try to get the role from localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem(ROLE_KEY);
    if (savedRole) {
      setRole(savedRole);
    }
  }, []);


  console.log(user)
  // After login, redirect based on the selected role
  useEffect(() => {
    if (!loading && user) {
      const savedRole = localStorage.getItem(ROLE_KEY);
      console.log(savedRole)
      if (savedRole === 'organizer') {
        router.replace('/organizer');
      } else if (savedRole === 'user') {
        router.replace('/events');
      } else {
        // Default redirect if no role is found, though this shouldn't happen
        // router.replace('/');
      }
    }
  }, [user, loading, router]);

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setRole(newRole);
    localStorage.setItem(ROLE_KEY, newRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="max-w-md w-full p-8 border rounded-lg shadow-md bg-white">
        <h1 className="text-2xl font-bold mb-4 text-center">Welcome</h1>
        <p className="mb-6 text-center text-gray-600">First, select your role.</p>
        
        <div className="mb-6 space-y-4">
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
                <input 
                    type="radio" 
                    name="role" 
                    value="organizer" 
                    checked={role === 'organizer'} 
                    onChange={handleRoleChange}
                    className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-3 text-lg">I am an Event Organizer</span>
            </label>
            <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-100">
                <input 
                    type="radio" 
                    name="role" 
                    value="user" 
                    checked={role === 'user'} 
                    onChange={handleRoleChange}
                    className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-3 text-lg">I am a Participant</span>
            </label>
        </div>

        <button 
          onClick={signInWithGoogle} 
          disabled={!role || loading}
          className="w-full px-4 py-2 bg-blue-600 text-white rounded-md disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Loading...' : 'Sign in with Google'}
        </button>
      </div>
    </div>
  );
}
