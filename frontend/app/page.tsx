"use client";

import { useEffect, useState } from "react";
import { checkBackendHealth } from "../src/services/api";

export default function Home() {
  const [backendStatus, setBackendStatus] = useState("Checking backend...");

  useEffect(() => {
    async function checkHealth() {
      try {
        const data = await checkBackendHealth();
        setBackendStatus(data.status);
      } catch {
        setBackendStatus("Backend unavailable");
      }
    }

    checkHealth();
  }, []);

  return (
    <main>
      <h1>AI Recruitment Voice Agent</h1>
      <p>Frontend is running successfully.</p>
      <p>Backend status: {backendStatus}</p>
    </main>
  );
}