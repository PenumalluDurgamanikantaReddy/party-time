"use client";
import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    function onBeforeInstallPrompt(e) {
      e.preventDefault();
      setDeferredPrompt(e);
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, []);

  async function handleInstall() {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    // hide after prompt
    setVisible(false);
    setDeferredPrompt(null);
    console.log("PWA install choice:", choice);
  }

  if (!visible) return null;

  return (
    <button
      onClick={handleInstall}
      className="rounded bg-blue-600 text-white px-4 py-2 hover:bg-blue-700"
    >
      Install App
    </button>
  );
}
