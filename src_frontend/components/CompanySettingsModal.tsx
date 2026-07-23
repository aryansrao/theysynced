import React, { useState } from 'react';
import { Company, UserProfile } from '../types';
import { Settings, Image, Trash2, Key, Globe, Lock, Copy, Check, X, ShieldAlert } from 'lucide-react';

interface CompanySettingsModalProps {
  user: UserProfile;
  company: Company;
  token: string;
  onClose: () => void;
  onCompanyUpdated: (updatedCompany: Company) => void;
  onCompanyDeleted: () => void;
}

export const CompanySettingsModal: React.FC<CompanySettingsModalProps> = ({
  user,
  company,
  token,
  onClose,
  onCompanyUpdated,
  onCompanyDeleted,
}) => {
  const [activeTab, setActiveTab] = useState<'general' | 'public_site' | 'danger'>('general');
  const [name, setName] = useState(company.name);
  const [logoUrl, setLogoUrl] = useState(company.logo_url || '');
  const [headline, setHeadline] = useState(company.public_headline || '');
  const [description, setDescription] = useState(company.public_description || '');
  const [isPublic, setIsPublic] = useState(company.is_public);
  const [loading, setLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);


  const isOwner = company.owner_id === user.id;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 3 * 1024 * 1024) {
        setErrorMsg('Logo file size must be under 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRename = async (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/companies/rename', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, company_id: company.id, new_name: name.trim() }),
      });
      const data = await res.json();
      if (data.success && data.company) {
        onCompanyUpdated(data.company);
        setSuccessMsg('Company renamed successfully!');
      } else {
        setErrorMsg(data.message || 'Failed to rename company');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLogo = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/companies/logo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, company_id: company.id, logo_url: logoUrl.trim() }),
      });
      const data = await res.json();
      if (data.success && data.company) {
        onCompanyUpdated(data.company);
        setSuccessMsg('Company logo updated!');
      } else {
        setErrorMsg(data.message || 'Failed to update logo');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePublicSite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const res = await fetch('/api/companies/update-public-site', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          company_id: company.id,
          headline: headline.trim(),
          description: description.trim(),
          is_public: isPublic,
        }),

      });
      const data = await res.json();
      if (data.success && data.company) {
        onCompanyUpdated(data.company);
        setSuccessMsg('Public microsite settings saved!');
      } else {
        setErrorMsg(data.message || 'Failed to update public site settings');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteCompany = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/companies/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, company_id: company.id }),
      });
      const data = await res.json();
      if (data.success) {
        onCompanyDeleted();
        onClose();
      } else {
        setErrorMsg(data.message || 'Failed to delete company');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-white rounded-[40px] shadow-2xl border border-black/[0.06] p-8 relative flex flex-col md:flex-row overflow-hidden min-h-[480px]">
        
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-900 hover:bg-slate-100 transition-colors z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sidebar Nav */}
        <div className="w-full md:w-56 border-b md:border-b-0 md:border-r border-slate-100 pr-0 md:pr-6 pb-4 md:pb-0 mb-6 md:mb-0 space-y-1">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-3">
            Company Settings
          </div>

          <button
            onClick={() => setActiveTab('general')}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'general' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>General & Logo</span>
          </button>

          <button
            onClick={() => setActiveTab('public_site')}
            className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
              activeTab === 'public_site' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Public Microsite</span>
          </button>



          {isOwner && (
            <button
              onClick={() => setActiveTab('danger')}
              className={`w-full text-left px-4 py-2.5 rounded-2xl text-xs font-semibold flex items-center gap-2.5 transition-all ${
                activeTab === 'danger' ? 'bg-rose-600 text-white shadow-sm' : 'text-rose-600 hover:bg-rose-50'
              }`}
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Company</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 md:pl-8 flex flex-col justify-between">
          <div>
            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-50 text-rose-600 text-xs font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-emerald-50 text-emerald-700 text-xs font-medium">
                {successMsg}
              </div>
            )}

            {activeTab === 'general' && (
              <div className="space-y-6">
                <form onSubmit={handleRename} className="space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Rename Company</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800"
                    >
                      Save
                    </button>
                  </div>
                </form>

                <form onSubmit={handleUpdateLogo} className="space-y-3 border-t border-slate-100 pt-4">
                  <h3 className="text-sm font-bold text-slate-900">Company Logo & Avatar</h3>
                  <div className="flex items-center gap-3">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-10 h-10 rounded-xl object-cover border border-slate-200" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                        {company.name.charAt(0)}
                      </div>
                    )}
                    <label className="px-4 py-2 rounded-full border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold text-slate-700 cursor-pointer">
                      Upload Logo File
                      <input type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                    </label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={logoUrl}
                      onChange={(e) => setLogoUrl(e.target.value)}
                      placeholder="Paste Image URL or Base64 string..."
                      className="flex-1 px-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-900"
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-5 py-2.5 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800"
                    >
                      Update
                    </button>
                  </div>
                </form>
              </div>

            )}

            {activeTab === 'public_site' && (
              <form onSubmit={handleUpdatePublicSite} className="space-y-4">
                <h3 className="text-sm font-bold text-slate-900">Public Website CMS Settings</h3>

                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <div>
                    <div className="text-xs font-bold text-slate-900">Public Showcase Website</div>
                    <div className="text-[10px] text-slate-500">Allow a public showcase microsite at /c/company_id</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="w-5 h-5 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>

                <div>

                  <label className="block text-xs font-semibold text-slate-700 mb-1">Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="e.g. Scaling Realtime Tech at Speed"
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    placeholder="Describe your organization..."
                    className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-slate-900 text-white rounded-full text-xs font-bold hover:bg-slate-800"
                >
                  Save Public Site Settings
                </button>
              </form>
            )}


            {activeTab === 'danger' && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-rose-600">
                  <ShieldAlert className="w-5 h-5" />
                  <h3 className="text-sm font-bold">Danger Zone — Delete Company</h3>
                </div>
                <p className="text-xs text-slate-500">Deleting this company will permanently remove all associated teams, whiteboards, spreadsheets, docs, and channels for all members. This action cannot be undone.</p>

                {!showDeleteConfirm ? (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="px-6 py-3 bg-rose-600 text-white rounded-full text-xs font-bold hover:bg-rose-700 transition-all"
                  >
                    Delete Company
                  </button>
                ) : (
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-3">
                    <div className="text-xs font-bold text-rose-900">Are you absolutely sure you want to delete {company.name}?</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDeleteCompany}
                        disabled={loading}
                        className="px-5 py-2 bg-rose-600 text-white rounded-full text-xs font-bold hover:bg-rose-700"
                      >
                        {loading ? 'Deleting...' : 'Yes, Delete Permanently'}
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-5 py-2 bg-slate-200 text-slate-700 rounded-full text-xs font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
