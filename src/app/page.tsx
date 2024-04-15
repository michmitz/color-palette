import React from 'react';
import { ColorSchemeContainer } from "./components/ColorSchemeContainer";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-slate-50 p-20">
      <div className="p-12 shadow-2xl">
        <ColorSchemeContainer />
      </div>
    </main>
  );
}
