"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";


export default function ServiceWorkerStatus() {
  const [status, setStatus] = useState("unknown");
  const [controller, setController] = useState(null);

  const InstallButton = dynamic(() => import("./InstallButton"), { ssr: false });
  useEffect(() => {
    if (!('serviceWorker' in navigator)) {
      setStatus('unsupported');
      return;
    }

    navigator.serviceWorker.getRegistration().then((reg) => {
      if (reg) {
        setStatus('registered');
      } else {
        setStatus('not-registered');
      }
    }).catch(() => setStatus('error'));

    setController(navigator.serviceWorker.controller || null);

    function onControllerChange() {
      setController(navigator.serviceWorker.controller || null);
    }
    navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);
    return () => navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  }, []);

  return (
    <div className="mt-4 text-sm text-gray-600 dark:text-gray-300">
        <InstallButton/>
      <div>Service Worker: <strong>{status}</strong></div>
      <div>Controller: <strong>{controller ? 'yes' : 'no'}</strong></div>
    </div>
  );
}
