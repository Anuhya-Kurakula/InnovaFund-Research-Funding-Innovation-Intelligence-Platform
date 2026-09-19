import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile, updateMyProfile } from "../services/profileService";
import { useAuth } from "../context/AuthContext";
import {
  BarChart3, LayoutDashboard, UserCircle, FlaskConical, Coins,
  FileBadge, Settings, HelpCircle, LogOut, Bell, Save,
} from "lucide-react";

function ResearchProfile() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    research_domains: "",
    keywords: "",
    bio: "",
    publications: "",
    patents: "",
    technology_areas: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getMyProfile()
      .then((data) => {
        setForm({
          research_domains: data.research_domains || "",
          keywords: data.keywords || "",
          bio: data.bio || "",
          publications: data.publications || "",
          patents: data.patents || "",
          technology_areas: data.technology_areas || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const updated = await updateMyProfile(form);
      setForm({
        research_domains: updated.research_domains || "",
        keywords: updated.keywords || "",
        bio: updated.bio || "",
        publications: updated.publications || "",
        patents: updated.patents || "",
        technology_areas: updated.technology_areas || "",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400";

  const hasSavedData =
    form.research_domains || form.keywords || form.bio || form.publications || form.patents || form.technology_areas;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-60 bg-white border-r border-gray-100 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 px-5 py-5">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <BarChart3 size={18} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm leading-tight">InnovaFund AI</p>
              <p className="text-xs text-gray-400 leading-tight">Enterprise Intelligence</p>
            </div>
          </div>
          <div className="px-3 space-y-1">
            <NavItem icon={<LayoutDashboard size={16} />} label="Dashboard" onClick={() => navigate("/dashboard")} />
            <NavItem icon={<UserCircle size={16} />} label="Research Profile" active />
            <NavItem icon={<FlaskConical size={16} />} label="Research" />
            <NavItem icon={<Coins size={16} />} label="Funding" />
            <NavItem icon={<FileBadge size={16} />} label="Patent Intelligence" />
          </div>
          <p className="text-xs font-medium text-gray-400 px-5 mt-6 mb-1">SYSTEM</p>
          <div className="px-3 space-y-1">
            <NavItem icon={<Settings size={16} />} label="Settings" />
            <NavItem icon={<HelpCircle size={16} />} label="Help" />
          </div>
        </div>
        <div className="px-3 pb-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-500 hover:bg-gray-50"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1">
        <div className="flex items-center justify-between px-8 py-4 border-b border-gray-100 bg-white">
          <p className="font-semibold">Research Profile</p>
          <div className="flex items-center gap-4">
            <Bell size={18} className="text-gray-400" />
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center text-white text-sm font-medium">
              K
            </div>
          </div>
        </div>

        <div className="p-8 max-w-2xl">
          <h1 className="text-2xl font-bold mb-1">Research Profile</h1>
          <p className="text-gray-500 mb-6">
            Add your research interests and past work to get better funding and trend matches.
          </p>

          {!loading && hasSavedData && (
            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 mb-6">
              <p className="text-sm font-medium text-purple-700 mb-3">Your saved profile</p>
              <div className="space-y-2 text-sm">
                {form.research_domains && (
                  <p><span className="text-gray-500">Domains:</span> {form.research_domains}</p>
                )}
                {form.keywords && (
                  <p><span className="text-gray-500">Keywords:</span> {form.keywords}</p>
                )}
                {form.bio && (
                  <p><span className="text-gray-500">Bio:</span> {form.bio}</p>
                )}
                {form.publications && (
                  <p><span className="text-gray-500">Publications:</span> {form.publications}</p>
                )}
                {form.patents && (
                  <p><span className="text-gray-500">Patents:</span> {form.patents}</p>
                )}
                {form.technology_areas && (
                  <p><span className="text-gray-500">Tech areas:</span> {form.technology_areas}</p>
                )}
              </div>
            </div>
          )}

          {loading ? (
            <p className="text-sm text-gray-400">Loading profile...</p>
          ) : (
            <form onSubmit={handleSave} className="bg-white border border-gray-100 rounded-xl p-6 space-y-5">
              <div>
                <label className="text-sm font-medium text-gray-700">Research Domains</label>
                <input
                  name="research_domains"
                  placeholder="e.g. Battery materials, Renewable energy"
                  value={form.research_domains}
                  onChange={handleChange}
                  className={`${inputClass} mt-1`}
                />
                <p className="text-xs text-gray-400 mt-1">Separate multiple domains with commas</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Keywords</label>
                <input
                  name="keywords"
                  placeholder="e.g. solid-state batteries, energy storage"
                  value={form.keywords}
                  onChange={handleChange}
                  className={`${inputClass} mt-1`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  placeholder="Brief summary of your research background"
                  value={form.bio}
                  onChange={handleChange}
                  className={`${inputClass} mt-1 resize-none`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Publications</label>
                <textarea
                  name="publications"
                  rows={2}
                  placeholder="List publication titles, separated by commas"
                  value={form.publications}
                  onChange={handleChange}
                  className={`${inputClass} mt-1 resize-none`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Patents</label>
                <textarea
                  name="patents"
                  rows={2}
                  placeholder="List any patents you hold, separated by commas"
                  value={form.patents}
                  onChange={handleChange}
                  className={`${inputClass} mt-1 resize-none`}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">Technology Areas</label>
                <input
                  name="technology_areas"
                  placeholder="e.g. AI, Materials Science, Biotech"
                  value={form.technology_areas}
                  onChange={handleChange}
                  className={`${inputClass} mt-1`}
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium disabled:opacity-60"
                >
                  <Save size={16} /> {saving ? "Saving..." : "Save Profile"}
                </button>
                {saved && <span className="text-sm text-green-600">Saved successfully</span>}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer ${
        active ? "bg-purple-50 text-purple-700 font-medium" : "text-gray-600 hover:bg-gray-50"
      }`}
    >
      {icon} {label}
    </div>
  );
}

export default ResearchProfile;