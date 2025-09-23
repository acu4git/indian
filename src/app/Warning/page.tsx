"use client";

import { useState } from "react";
import WarningMessage from "./components/WarningMessage";
import BackButton from "./components/BackButton";
import IgnoreButton from "./components/IgnoreButton";

export default function WarningPage() {
  const [showIgnore, setShowIgnore] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-red-600 p-6 text-white">
      <div className="max-w-xl w-full text-center">
        <WarningMessage onToggleDetails={setShowIgnore} />

        <div className="mt-6 flex flex-col items-start gap-2">
          <BackButton />
          <div className="h-10"> {/* 高さはIgnoreButtonと同じくらい */}
            {showIgnore && <IgnoreButton />}
          </div>
        </div>
      </div>
    </main>
  );
}
