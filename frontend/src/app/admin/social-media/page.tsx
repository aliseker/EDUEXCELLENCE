'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '@/config/api';

interface SocialMedia {
  id: number;
  platform: string;
  url: string;
  displayName?: string;
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const PLATFORM_ICONS: { [key: string]: string } = {
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  facebook: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z',
  twitter: 'M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z',
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  youtube: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z',
  tiktok: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z'
};

const PLATFORM_NAMES: { [key: string]: string } = {
  instagram: 'Instagram',
  facebook: 'Facebook',
  twitter: 'Twitter',
  linkedin: 'LinkedIn',
  youtube: 'YouTube',
  tiktok: 'TikTok'
};

export default function SocialMediaManagement() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [socialMedias, setSocialMedias] = useState<SocialMedia[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialMedia | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Modern Confirmation Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmConfig, setConfirmConfig] = useState<{
    title: string;
    message: string;
    onConfirm: () => void;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info';
  }>({
    title: '',
    message: '',
    onConfirm: () => {},
    confirmText: 'Tamam',
    cancelText: 'İptal',
    type: 'danger'
  });

  const [formData, setFormData] = useState({
    platform: '',
    url: '',
    displayName: '',
    order: 0,
    isActive: true
  });

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const accessToken = localStorage.getItem('accessToken');
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    
    if (!accessToken || isLoggedIn !== 'true') {
      router.push('/admin');
      return;
    }
    
    setIsAuthenticated(true);
    setIsLoading(false);
    fetchSocialMedias();
  };

  const fetchSocialMedias = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/socialmedia`, {
        cache: 'no-store',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setSocialMedias(data);
      } else {
        toast.error('Sosyal medya linkleri yüklenemedi');
      }
    } catch (error) {
      console.error('Error fetching social medias:', error);
      toast.error('Sunucuya bağlanırken bir hata oluştu');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const token = localStorage.getItem('accessToken');
      const url = editingItem 
        ? `${API_BASE_URL}/socialmedia/${editingItem.id}`
        : `${API_BASE_URL}/socialmedia`;
      
      const method = editingItem ? 'PUT' : 'POST';
      const body = editingItem 
        ? { ...formData, id: editingItem.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        toast.success(editingItem ? 'Sosyal medya linki güncellendi' : 'Sosyal medya linki eklendi');
        setShowModal(false);
        setEditingItem(null);
        resetForm();
        fetchSocialMedias();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Bir hata oluştu');
      }
    } catch (error) {
      console.error('Error saving social media:', error);
      toast.error('Sunucuya bağlanırken bir hata oluştu');
    }

    setIsSaving(false);
  };

  // Modern confirmation helper function
  const showConfirm = (title: string, message: string, onConfirm: () => void, type: 'danger' | 'warning' | 'info' = 'danger') => {
    setConfirmConfig({
      title,
      message,
      onConfirm,
      confirmText: type === 'danger' ? 'Sil' : 'Tamam',
      cancelText: 'İptal',
      type
    });
    setShowConfirmModal(true);
  };

  const handleDelete = (id: number) => {
    showConfirm(
      'Sosyal Medya Linki Sil',
      'Bu sosyal medya linkini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      async () => {
        try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/socialmedia/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

          if (response.ok) {
            toast.success('Sosyal medya linki silindi');
            fetchSocialMedias();
            setShowConfirmModal(false);
          } else {
            toast.error('Sosyal medya linki silinemedi');
          }
        } catch (error) {
          console.error('Error deleting social media:', error);
          toast.error('Sunucuya bağlanırken bir hata oluştu');
        }
      },
      'danger'
    );
  };

  const handleToggleActive = async (id: number) => {
    try {
      const token = localStorage.getItem('accessToken');
      const response = await fetch(`${API_BASE_URL}/socialmedia/${id}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        toast.success('Durum güncellendi');
        fetchSocialMedias();
      } else {
        toast.error('Durum güncellenemedi');
      }
    } catch (error) {
      console.error('Error toggling active status:', error);
      toast.error('Sunucuya bağlanırken bir hata oluştu');
    }
  };

  const openModal = (item?: SocialMedia) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        platform: item.platform,
        url: item.url,
        displayName: item.displayName || '',
        order: item.order,
        isActive: item.isActive
      });
    } else {
      setEditingItem(null);
      resetForm();
    }
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      platform: '',
      url: '',
      displayName: '',
      order: 0,
      isActive: true
    });
  };

  const getPlatformIcon = (platform: string) => {
    return PLATFORM_ICONS[platform.toLowerCase()] || PLATFORM_ICONS.instagram;
  };

  const getPlatformName = (platform: string) => {
    return PLATFORM_NAMES[platform.toLowerCase()] || platform;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Sosyal Medya Yönetimi</h1>
              <p className="mt-1 text-sm text-gray-500">
                Sosyal medya hesaplarınızı yönetin ve web sitesinde görüntüleyin
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => router.push('/admin/home')}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Geri Dön
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(PLATFORM_NAMES).map(([platformKey, platformName]) => {
            const existingSocialMedia = socialMedias.find(sm => sm.platform.toLowerCase() === platformKey.toLowerCase());
            const platformColors = {
              instagram: 'bg-pink-50 border-pink-200',
              facebook: 'bg-blue-50 border-blue-200',
              twitter: 'bg-sky-50 border-sky-200',
              linkedin: 'bg-indigo-50 border-indigo-200',
              youtube: 'bg-red-50 border-red-200',
              tiktok: 'bg-gray-50 border-gray-200'
            };
            const iconColors = {
              instagram: 'bg-pink-500',
              facebook: 'bg-blue-600',
              twitter: 'bg-sky-500',
              linkedin: 'bg-indigo-600',
              youtube: 'bg-red-600',
              tiktok: 'bg-black'
            };

            return (
              <div key={platformKey} className={`bg-white rounded-lg shadow-sm border-2 p-6 ${platformColors[platformKey as keyof typeof platformColors]}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 ${iconColors[platformKey as keyof typeof iconColors]} rounded-lg flex items-center justify-center`}>
                      <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d={getPlatformIcon(platformKey)} />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {platformName}
                      </h3>
                      {existingSocialMedia && (
                        <p className="text-sm text-gray-500">Sıra: {existingSocialMedia.order}</p>
                      )}
                    </div>
                  </div>
                  {existingSocialMedia && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleToggleActive(existingSocialMedia.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          existingSocialMedia.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {existingSocialMedia.isActive ? 'Aktif' : 'Pasif'}
                      </button>
                    </div>
                  )}
                </div>

                {existingSocialMedia ? (
                  <>
                    <div className="space-y-2 mb-4">
                      <div>
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">URL</label>
                        <p className="text-sm text-gray-900 break-all">{existingSocialMedia.url}</p>
                      </div>
                      {existingSocialMedia.displayName && (
                        <div>
                          <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">Görünen Ad</label>
                          <p className="text-sm text-gray-900">{existingSocialMedia.displayName}</p>
                        </div>
                      )}
                    </div>

                    <div className="flex space-x-2">
                      <button
                        onClick={() => openModal(existingSocialMedia)}
                        className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDelete(existingSocialMedia.id)}
                        className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="mb-4">
                      <p className="text-sm text-gray-500">No {platformName} link added</p>
                    </div>
                    <button
                      onClick={() => {
                        setFormData({
                          platform: platformKey,
                          url: '',
                          displayName: '',
                          order: 0,
                          isActive: true
                        });
                        setEditingItem(null);
                        setShowModal(true);
                      }}
                      className="w-full bg-gray-50 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      Add {platformName} Link
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  {editingItem ? 'Sosyal Medya Linkini Düzenle' : 'Yeni Sosyal Medya Linki'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600">
                    {getPlatformName(formData.platform)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="https://instagram.com/yourusername"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Görünen Ad (Opsiyonel)
                  </label>
                  <input
                    type="text"
                    value={formData.displayName}
                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Özel görünen ad"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sıra
                  </label>
                  <input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    min="0"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Aktif
                  </label>
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Kaydediliyor...' : (editingItem ? 'Güncelle' : 'Ekle')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modern Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowConfirmModal(false)}>
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className={`p-6 rounded-t-2xl ${
              confirmConfig.type === 'danger' ? 'bg-gradient-to-r from-red-500 to-red-600' :
              confirmConfig.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
              'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">{confirmConfig.title}</h3>
              </div>
            </div>

            <div className="p-6">
              <p className="text-gray-700 text-base leading-relaxed">
                {confirmConfig.message}
              </p>
            </div>

            <div className="flex gap-3 p-6 pt-0">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95"
              >
                {confirmConfig.cancelText}
              </button>
              <button
                onClick={() => {
                  confirmConfig.onConfirm();
                }}
                className={`flex-1 px-6 py-3 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg ${
                  confirmConfig.type === 'danger' ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' :
                  confirmConfig.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700' :
                  'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700'
                }`}
              >
                {confirmConfig.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
