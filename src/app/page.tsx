// src/app/page.tsx
'use client';

import { SafetyPlanPlatform } from '@/components/safety-plan-platform';

export default function Home() {
  return (
    <main className="min-h-screen">
      <SafetyPlanPlatform />
    </main>
  );
}