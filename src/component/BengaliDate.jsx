"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

function getSnapshot() {
  try {
    return new Date().toLocaleDateString("bn-BD", {
      dateStyle: "full",
    });
  } catch {
    return "আজকের বাজার দর";
  }
}

function getServerSnapshot() {
  return "";
}

export default function BengaliDate() {
  const dateText = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
      {dateText || "আজকের বাজার দর"}
    </p>
  );
}
