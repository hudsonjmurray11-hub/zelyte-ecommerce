import React, { useEffect, useState } from 'react';
import { Save, Loader2, Plus, Trash2 } from 'lucide-react';
import { adminService } from '../../../services/adminService';
import { ContentSettings } from '../../../types/admin';

const Content: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<ContentSettings>({
    hero_headline: '',
    hero_subheadline: '',
    hero_cta_text: '',
    about_text: '',
    faq_items: [],
  });
  const [newFAQ, setNewFAQ] = useState({ question: '', answer: '' });

  useEffect(() => {
    loadContent();
  }, []);

  const loadContent = async () => {
    try {
      setLoading(true);
      const data = await adminService.getContentSettings();
      if (data) {
        setContent(data);
      }
    } catch (error) {
      console.error('Error loading content:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await adminService.updateContentSettings(content);
      alert('Content saved successfully!');
    } catch (error) {
      console.error('Error saving content:', error);
      alert('Error saving content');
    } finally {
      setSaving(false);
    }
  };

  const addFAQ = () => {
    if (newFAQ.question && newFAQ.answer) {
      setContent({
        ...content,
        faq_items: [...(content.faq_items || []), newFAQ],
      });
      setNewFAQ({ question: '', answer: '' });
    }
  };

  const removeFAQ = (index: number) => {
    setContent({
      ...content,
      faq_items: content.faq_items?.filter((_, i) => i !== index) || [],
    });
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
        <h1 className="text-3xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600 mt-1">Manage your site content</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
        {/* Hero Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Headline</label>
              <input
                type="text"
                value={content.hero_headline || ''}
                onChange={(e) => setContent({ ...content, hero_headline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="FUEL YOUR POTENTIAL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subheadline</label>
              <input
                type="text"
                value={content.hero_subheadline || ''}
                onChange={(e) => setContent({ ...content, hero_subheadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Premium electrolyte pouches..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">CTA Button Text</label>
              <input
                type="text"
                value={content.hero_cta_text || ''}
                onChange={(e) => setContent({ ...content, hero_cta_text: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Shop Collection"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About Zelyte</h2>
          <textarea
            value={content.about_text || ''}
            onChange={(e) => setContent({ ...content, about_text: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Enter about text..."
          />
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">FAQ Items</h2>
          <div className="space-y-4">
            {content.faq_items?.map((faq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{faq.question}</h3>
                  <button
                    onClick={() => removeFAQ(index)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-sm text-gray-600">{faq.answer}</p>
              </div>
            ))}
            <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="space-y-3">
                <input
                  type="text"
                  value={newFAQ.question}
                  onChange={(e) => setNewFAQ({ ...newFAQ, question: e.target.value })}
                  placeholder="Question"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <textarea
                  value={newFAQ.answer}
                  onChange={(e) => setNewFAQ({ ...newFAQ, answer: e.target.value })}
                  placeholder="Answer"
                  rows={2}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={addFAQ}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add FAQ</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center space-x-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Content;

