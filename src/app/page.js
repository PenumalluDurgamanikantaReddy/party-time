"use client";

import Image from "next/image";
import dynamic from "next/dynamic";

const InstallButton = dynamic(() => import("../components/InstallButton"), { ssr: false });
const ServiceWorkerStatus = dynamic(() => import("../components/ServiceWorkerStatus"), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 sm:p-12">
      <div className="max-w-4xl mx-auto flex flex-col gap-8 items-center sm:items-start">
        <header className="w-full flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/next.svg" alt="logo" width={48} height={12} />
            <h1 className="text-xl font-semibold">My Next PWA</h1>
          </div>
          <div>
            <InstallButton />
          </div>
        </header>

        <section className="w-full grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h2 className="text-lg font-medium mb-2">Welcome</h2>
            <p className="text-sm leading-relaxed">This is a simple PWA starter. Use the Install button to add to your device. If you see a blank screen after opening from the home shortcut, check the Service Worker status below.</p>
          </div>

          <div className="p-6 border rounded-lg bg-gray-50 dark:bg-gray-800">
            <h2 className="text-lg font-medium mb-2">Quick Checks</h2>
                        <InstallButton />

            <ul className="text-sm list-disc pl-5">
              <li>Manifest linked and icons available</li>
              <li>Service Worker registered</li>
              <li>Site served on HTTPS or localhost</li>
            </ul>
            <ServiceWorkerStatus />
          </div>
        </section>

        <footer className="w-full text-sm text-gray-600 dark:text-gray-400">Built with Next.js PWA setup</footer>
      </div>
    </main>
  );
}
