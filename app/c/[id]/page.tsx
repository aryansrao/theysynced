'use client';

import React, { use } from 'react';
import dynamic from 'next/dynamic';

const CompanyPublicSite = dynamic(() => import('../../../src_frontend/components/CompanyPublicSite').then(m => m.CompanyPublicSite), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

export default function CompanyPublicPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return (
    <CompanyPublicSite
      companyId={resolvedParams.id}
      onOpenAuth={() => { window.location.href = '/?auth=true'; }}
      onOpenJoinCompany={() => { window.location.href = `/?join=${resolvedParams.id}`; }}
    />
  );
}
