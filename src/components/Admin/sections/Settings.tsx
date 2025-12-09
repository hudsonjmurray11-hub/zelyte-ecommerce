import React, { useEffect, useState } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { BrandSettings, BusinessSettings } from '../../../types/admin';

const Settings: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brandSettings, setBrandSettings] = useState<BrandSettings>({
    logo_url: '',
    primary_color: '#3b82f6',
    tagline: '',
  });
  const [businessSettings, setBusinessSettings] = useState<BusinessSettings>({
    support_email: '',
    social_instagram: '',
    social_twitter: '',
    social_facebook: '',
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const [brand, business] = await Promise.all([
        adminService.getBrandSettings().catch(() => null),
        adminService.getBusinessSettings().catch(() => null),
      ]);
      if (brand) setBrandSettings(brand);
      if (business) setBusinessSettings(business);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBrand = async () => {
    try {
      setSaving(true);
      await adminService.updateBrandSettings(brandSettings);
      alert('Brand settings saved!');
    } catch (error) {
      console.error('Error saving brand settings:', error);
      alert('Error saving settings');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveBusiness = async () => {
    try {
      setSaving(true);
      await adminService.updateBusinessSettings(businessSettings);
      alert('Business settings saved!');
    } catch (error) {
      console.error('Error saving business settings:', error);
      alert('Error saving settings');
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
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your site settings</p>
      </div>

      {/* Brand Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Brand Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
            <input
              type="url"
              value={brandSettings.logo_url || ''}
              onChange={(e) => setBrandSettings({ ...brandSettings, logo_url: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
            <div className="flex items-center space-x-3">
              <input
                type="color"
                value={brandSettings.primary_color || '#3b82f6'}
                onChange={(e) => setBrandSettings({ ...brandSettings, primary_color: e.target.value })}
                className="w-16 h-10 border border-gray-300 rounded-lg"
              />
              <input
                type="text"
                value={brandSettings.primary_color || '#3b82f6'}
                onChange={(e) => setBrandSettings({ ...brandSettings, primary_color: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tagline</label>
            <input
              type="text"
              value={brandSettings.tagline || ''}
              onChange={(e) => setBrandSettings({ ...brandSettings, tagline: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="Your brand tagline..."
            />
          </div>
          <button
            onClick={handleSaveBrand}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Brand Settings</span>
          </button>
        </div>
      </div>

      {/* Business Settings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Settings</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label>
            <input
              type="email"
              value={businessSettings.support_email || ''}
              onChange={(e) => setBusinessSettings({ ...businessSettings, support_email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="support@zelyte.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">Social Media Links</label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">Instagram</label>
                <input
                  type="url"
                  value={businessSettings.social_instagram || ''}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, social_instagram: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Twitter</label>
                <input
                  type="url"
                  value={businessSettings.social_twitter || ''}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, social_twitter: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://twitter.com/..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Facebook</label>
                <input
                  type="url"
                  value={businessSettings.social_facebook || ''}
                  onChange={(e) => setBusinessSettings({ ...businessSettings, social_facebook: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="https://facebook.com/..."
                />
              </div>
            </div>
          </div>
          <button
            onClick={handleSaveBusiness}
            disabled={saving}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Business Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;

