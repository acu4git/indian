"use client";

import { WARNING_MESSAGE } from "../consts/index";

export default function WarningMessage() {
  return (
    <div className="text-center">
      <h1 className="text-2xl font-bold text-red-600 mb-4">⚠ 危険なサイト</h1>
      <p className="text-black whitespace-pre-line">{WARNING_MESSAGE}</p>
    </div>
  );
}
