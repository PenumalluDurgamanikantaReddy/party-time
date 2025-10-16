// components/InstallButton.jsx
'use client'; 

import React, { useEffect, useState } from 'react';

// Define the type for the deferred prompt event (not strictly necessary for JS but good practice)
// Note: In a pure JS file, you can omit the interface, but the logic remains the same.
// The event is typically BeforeInstallPromptEvent.

const InstallButton = () => {
  // State to hold the deferred prompt event
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  // State to control button visibility
  const [isInstallable, setIsInstallable] = useState(false);

  // Use a timeout state for iOS instructions
  const [showIosInstructions, setShowIosInstructions] = useState(false);

  // Function to detect iOS devices
  const isIOS = () => {
    if (typeof window === 'undefined') return false;
    const userAgent = window.navigator.userAgent.toLowerCase();
    return /iphone|ipad|ipod/.test(userAgent) && !window.MSStream; // exclude Edge on Windows
  };

  // 1. Event Listener for beforeinstallprompt
  useEffect(() => {
    // This function only runs on the client-side
    if (typeof window === 'undefined') return;

    const handleBeforeInstallPrompt = (e) => {
      // Prevent the browser's default installation prompt
      e.preventDefault();
      // Store the event so we can trigger it later
      setDeferredPrompt(e);
      // Make the custom button visible
      setIsInstallable(true);
      setShowIosInstructions(false); // Hide instructions if the event fires
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Set timeout to check for iOS if the prompt didn't fire
    const timer = setTimeout(() => {
        if (!deferredPrompt && isIOS()) {
            setShowIosInstructions(true);
        }
    }, 500);

    // Clean up event listener and timeout
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      clearTimeout(timer);
    };
  }, [deferredPrompt]); // Depend on deferredPrompt to re-run the iOS check logic

  // 2. Click Handler for the button
  const handleInstallClick = async () => {
    if (deferredPrompt) {
      // Hide our custom button immediately
      setIsInstallable(false);

      // Show the browser's installation prompt
      deferredPrompt.prompt();

      // Wait for the user to respond
      const { outcome } = await deferredPrompt.userChoice;

      console.log(`User choice outcome: ${outcome}`);
      
      // Reset the deferred prompt (it can only be used once)
      setDeferredPrompt(null);
    }
  };
  
  // 3. Optional: Hide the button if the app is installed via another method (e.g., browser menu)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleAppInstalled = () => {
      setIsInstallable(false);
      setDeferredPrompt(null);
      setShowIosInstructions(false);
      console.log('PWA installed successfully via appinstalled event.');
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);


  // 4. Conditional Rendering
  
  // A. For browsers that support the prompt (Desktop, Android Chrome/Edge/etc.)
  if (isInstallable) {
    return (
      <button 
        onClick={handleInstallClick}
        style={{ padding: '10px 15px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
      >
        Install App 🚀
      </button>
    );
  }

  // B. For iOS/Safari (where beforeinstallprompt is NOT supported)
  if (showIosInstructions) {
    return (
      <div style={{ padding: '10px', backgroundColor: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px' }}>
        To install on iOS: Tap the **Share** icon <span style={{fontSize: '1.2em'}}>&#x2197;</span>, then select **'Add to Home Screen'**.
      </div>
    );
  }

  // C. Default state (already installed or not installable yet)
  return null; 
};

export default InstallButton;