import React, { useEffect, useState } from 'react';
import { Plus, Edit, Trash2, Save, X, Loader2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { DiscountCode, AnnouncementBanner } from '../../../types/admin';

const Marketing: React.FC = () => {
  const [discountCodes, setDiscountCodes] = useState<DiscountCode[]>([]);
  const [banner, setBanner] = useState<AnnouncementBanner>({ text: '', url: '', visible: false });
  const [loading, setLoading] = useState(true);
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [editingCode, setEditingCode] = useState<DiscountCode | null>(null);
  const [codeForm, setCodeForm] = useState<DiscountCode>({
    code: '',
    discount_percent: 0,
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0],
    max_uses: undefined,
    current_uses: 0,
    active: true,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [codes, bannerData] = await Promise.all([
        adminService.getDiscountCodes().catch(() => []),
        adminService.getAnnouncementBanner().catch(() => null),
      ]);
      setDiscountCodes(codes || []);
      if (bannerData) setBanner(bannerData);
    } catch (error) {
      console.error('Error loading marketing data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCode = async () => {
    try {
      setSaving(true);
      if (editingCode?.id) {
        await adminService.updateDiscountCode(editingCode.id, codeForm);
      } else {
        await adminService.createDiscountCode(codeForm);
      }
      setShowCodeForm(false);
      setEditingCode(null);
      loadData();
    } catch (error) {
      console.error('Error saving discount code:', error);
      alert('Error saving discount code');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCode = async (id: string) => {
    if (!confirm('Delete this discount code?')) return;
    try {
      await adminService.deleteDiscountCode(id);
      loadData();
    } catch (error) {
      console.error('Error deleting code:', error);
    }
  };

  const handleSaveBanner = async () => {
    try {
      setSaving(true);
      await adminService.updateAnnouncementBanner(banner);
      alert('Banner saved!');
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error saving banner');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Marketing Tools</h1>
        <p className="text-gray-600 mt-1">Manage discount codes and announcements</p>
      </div>

      {/* Discount Codes */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Discount Codes</h2>
          <button
            onClick={() => {
              setEditingCode(null);
              setCodeForm({
                code: '',
                discount_percent: 0,
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date().toISOString().split('T')[0],
                max_uses: undefined,
                current_uses: 0,
                active: true,
              });
              setShowCodeForm(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4" />
            <span>Add Code</span>
          </button>
        </div>

        <div className="space-y-3">
          {discountCodes.map((code) => (
            <div key={code.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <div className="flex items-center space-x-3">
                  <span className="font-semibold text-gray-900">{code.code}</span>
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                    {code.discount_percent}% off
                  </span>
                  {code.active ? (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">Active</span>
                  ) : (
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">Inactive</span>
                  )}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {new Date(code.start_date).toLocaleDateString()} - {new Date(code.end_date).toLocaleDateString()}
                  {code.max_uses && ` • ${code.current_uses}/${code.max_uses} uses`}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    setEditingCode(code);
                    setCodeForm(code);
                    setShowCodeForm(true);
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => code.id && handleDeleteCode(code.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Announcement Banner */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Announcement Banner</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Banner Text</label>
            <input
              type="text"
              value={banner.text || ''}
              onChange={(e) => setBanner({ ...banner, text: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Enter banner text..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link URL (optional)</label>
            <input
              type="url"
              value={banner.url || ''}
              onChange={(e) => setBanner({ ...banner, url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="bannerVisible"
              checked={banner.visible || false}
              onChange={(e) => setBanner({ ...banner, visible: e.target.checked })}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            />
            <label htmlFor="bannerVisible" className="text-sm font-medium text-gray-700">
              Show banner on site
            </label>
          </div>
          <button
            onClick={handleSaveBanner}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Banner</span>
          </button>
        </div>
      </div>

      {/* Discount Code Form Modal */}
      {showCodeForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold">{editingCode ? 'Edit' : 'New'} Discount Code</h3>
              <button onClick={() => setShowCodeForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Code *</label>
                <input
                  type="text"
                  value={codeForm.code}
                  onChange={(e) => setCodeForm({ ...codeForm, code: e.target.value.toUpperCase() })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Discount % *</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={codeForm.discount_percent}
                  onChange={(e) => setCodeForm({ ...codeForm, discount_percent: parseFloat(e.target.value) || 0 })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                  <input
                    type="date"
                    value={codeForm.start_date}
                    onChange={(e) => setCodeForm({ ...codeForm, start_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                  <input
                    type="date"
                    value={codeForm.end_date}
                    onChange={(e) => setCodeForm({ ...codeForm, end_date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Uses (optional)</label>
                <input
                  type="number"
                  value={codeForm.max_uses || ''}
                  onChange={(e) => setCodeForm({ ...codeForm, max_uses: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="codeActive"
                  checked={codeForm.active}
                  onChange={(e) => setCodeForm({ ...codeForm, active: e.target.checked })}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded"
                />
                <label htmlFor="codeActive" className="text-sm font-medium text-gray-700">Active</label>
              </div>
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  onClick={() => setShowCodeForm(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveCode}
                  disabled={saving || !codeForm.code}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  <span>Save</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Marketing;

