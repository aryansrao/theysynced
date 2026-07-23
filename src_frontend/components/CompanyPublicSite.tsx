'use client';

import React, { useState, useEffect } from 'react';
import { Building2, Sparkles, Shield, ArrowRight, ChevronDown, ChevronUp, CheckCircle2 } from 'lucide-react';

interface CompanyPublicSiteProps {
  companyId: string;
  onOpenAuth: () => void;
  onOpenJoinCompany: () => void;
}

interface PublicCompanyData {
  id: string;
  name: string;
  created_at: string;
  member_count: number;
  headline?: string;
  description?: string;
  faqs?: string;
}

export const CompanyPublicSite: React.FC<CompanyPublicSiteProps> = ({
  companyId,
  onOpenAuth,
  onOpenJoinCompany,
}) => {
  const [company, setCompany] = useState<PublicCompanyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  useEffect(() => {
    fetch(`/api/companies/public/${companyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.company) {
          setCompany(data.company);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [companyId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-[#F8F9FB] flex flex-col items-center justify-center px-6 text-center">
        <Building2 className="w-16 h-16 text-slate-300 mb-4" />
        <h1 className="text-2xl font-bold text-slate-900">Public Site Not Found</h1>
        <p className="text-slate-500 mt-2 text-sm max-w-md">The company public site you are trying to visit does not exist or has been set to private.</p>
        <a href="/" className="mt-6 px-6 py-3 bg-slate-900 text-white rounded-full font-bold text-xs">Return Home</a>
      </div>
    );
  }

  let parsedFaqs: Array<{ q: string; a: string }> = [];
  if (company.faqs) {
    try {
      parsedFaqs = JSON.parse(company.faqs);
    } catch (e) {
      console.warn('Failed to parse company FAQs JSON:', e);
    }
  }

  // Company-specific JSON-LD Schema for AEO & SEO
  const companyJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        'name': company.name,
        'url': `https://theysynced.com/c/${company.id}`,
        'description': company.description || `${company.name} collaborates on TheySynced Office.`,
      },
      {
        '@type': 'FAQPage',
        'mainEntity': parsedFaqs.map(faq => ({
          '@type': 'Question',
          'name': faq.q,
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': faq.a
          }
        }))
      }
    ]
  };

  return (
    <div className="min-h-screen bg-[#F8F9FB] text-slate-900 font-sans">
      
      {/* Inject Company JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(companyJsonLd) }}
      />

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-[#F8F9FB]/90 backdrop-blur-md border-b border-black/[0.04] px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-lg">
              {company.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-xl font-bold text-slate-900 block leading-tight">{company.name}</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Verified Public Workspace
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={onOpenAuth}
              className="px-5 py-2.5 rounded-full text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-all"
            >
              Sign In
            </button>
            <button
              onClick={onOpenJoinCompany}
              className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800 transition-all shadow-sm"
            >
              Join {company.name}
            </button>
          </div>
        </div>
      </header>

      {/* Public Company Hero Banner */}
      <section className="pt-16 pb-20 px-6 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs font-bold mb-6">
          <Building2 className="w-4 h-4 text-indigo-600" />
          <span>{company.member_count} Active Team Members</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-950 max-w-4xl mx-auto leading-[1.12]">
          {company.headline || `Welcome to ${company.name}`}
        </h1>

        <p className="mt-6 text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          {company.description || `${company.name} uses TheySynced to collaborate in real-time across whiteboards, spreadsheets, docs, and WebRTC meetings.`}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onOpenJoinCompany}
            className="px-8 py-4 bg-indigo-600 text-white rounded-full font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg flex items-center gap-2"
          >
            <span>Request to Join {company.name}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

      {/* Company FAQs Accordion */}
      {parsedFaqs.length > 0 && (
        <section className="py-16 px-6 max-w-4xl mx-auto border-t border-slate-200">
          <div className="text-center mb-10">
            <h2 className="text-2xl font-bold text-slate-950">About {company.name} FAQs</h2>
          </div>

          <div className="space-y-4">
            {parsedFaqs.map((faq, idx) => (
              <div key={idx} className="bg-white rounded-3xl border border-slate-200/80 p-5">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full text-left font-bold text-slate-900 flex items-center justify-between text-base"
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === idx ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                </button>
                {openFaqIndex === idx && (
                  <p className="mt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-8 px-6 text-center text-xs text-slate-500">
        <div>© 2026 {company.name}. Public site hosted on TheySynced Office Platform.</div>
      </footer>

    </div>
  );
};
