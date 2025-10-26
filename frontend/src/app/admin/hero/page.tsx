'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import apiService from '@/services/api';

interface HeroItem {
  id: number;
  text: string;
  heroId: number;
}

interface Hero {
  id: number;
  title: string;
  description?: string;
  items: HeroItem[];
  isDisplayedOnHomepage: boolean; // Anasayfada gösteriliyor mu?
  createdAt: string;
  updatedAt: string;
}

interface CreateHeroItem {
  text: string;
}

interface UpdateHeroItem {
  id: number;
  text: string;
}

export default function HeroManagement() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [heroes, setHeroes] = useState<Hero[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingHero, setEditingHero] = useState<Hero | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [selectedHeroId, setSelectedHeroId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    items: [] as CreateHeroItem[]
  });
  const [editingFormData, setEditingFormData] = useState({
    id: 0,
    title: '',
    description: '',
    items: [] as UpdateHeroItem[]
  });
  
  // Delete confirmation modal
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{type: string, id: number} | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('accessToken');
      const adminAuth = localStorage.getItem('adminLoggedIn');
      
      if (!accessToken || adminAuth !== 'true') {
        router.push('/admin');
      } else {
        setIsAuthenticated(true);
        setIsLoading(false);
        fetchHeroes();
      }
    };
    
    checkAuth();
  }, [router]);

  const fetchHeroes = async () => {
    try {
      const data = await apiService.getHeroes();
      // API'den dönen veriyi Hero tipine uygun hale getir
      const heroesWithDisplay: Hero[] = data.map((hero: any) => ({
        ...hero,
        isDisplayedOnHomepage: false // Varsayılan olarak false, aktif hero'yu sonra belirleyeceğiz
      }));
      
      // Aktif hero'yu al
      try {
        const activeHero = await apiService.getActiveHero();
        if (activeHero) {
          const activeIndex = heroesWithDisplay.findIndex(h => h.id === activeHero.id);
          if (activeIndex !== -1) {
            heroesWithDisplay[activeIndex].isDisplayedOnHomepage = true;
            setSelectedHeroId(activeHero.id);
          }
        }
      } catch (error) {
        console.log('No active hero found');
      }
      
      setHeroes(heroesWithDisplay);
      
      // Eğer seçili hero yoksa ilk hero'yu seç
      if (!heroesWithDisplay.find(h => h.isDisplayedOnHomepage) && heroesWithDisplay.length > 0) {
        setSelectedHeroId(heroesWithDisplay[0].id);
      }
    } catch (error) {
      console.error('Error fetching heroes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.createHero(formData);
      setFormData({ title: '', description: '', items: [] });
      setIsCreating(false);
      fetchHeroes();
    } catch (error) {
      console.error('Error creating hero:', error);
    }
  };

  const handleUpdateHero = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await apiService.updateHero(editingHero!.id, editingFormData);
      setEditingHero(null);
      fetchHeroes();
    } catch (error) {
      console.error('Error updating hero:', error);
    }
  };

  const handleDeleteHero = async (id: number) => {
    setDeleteTarget({ type: 'hero', id });
    setShowDeleteConfirm(true);
  };

  const confirmDeleteHero = async () => {
    if (!deleteTarget) return;
    
    try {
      await apiService.deleteHero(deleteTarget.id);
      fetchHeroes();
    } catch (error) {
      console.error('Error deleting hero:', error);
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  const handleConfirmActive = async () => {
    if (selectedHeroId === null) return;
    
    try {
      await apiService.setActiveHero(selectedHeroId);
      fetchHeroes();
    } catch (error) {
      console.error('Error setting active hero:', error);
    }
  };

  const addItem = (isEditing: boolean = false) => {
    if (isEditing) {
      setEditingFormData(prev => ({
        ...prev,
        items: [...prev.items, { id: 0, text: '' }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        items: [...prev.items, { text: '' }]
      }));
    }
  };

  const removeItem = (index: number, isEditing: boolean = false) => {
    if (isEditing) {
      setEditingFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        items: prev.items.filter((_, i) => i !== index)
      }));
    }
  };

  const updateItem = (index: number, text: string, isEditing: boolean = false) => {
    if (isEditing) {
      setEditingFormData(prev => ({
        ...prev,
        items: prev.items.map((item, i) => i === index ? { ...item, text } : item)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        items: prev.items.map((item, i) => i === index ? { ...item, text } : item)
      }));
    }
  };

  const startEdit = (hero: Hero) => {
    console.log('🔍 Düzenlenen hero:', hero);
    console.log('🔍 Hero items:', hero.items);
    setEditingHero(hero);
    setEditingFormData({
      id: hero.id,
      title: hero.title,
      description: hero.description || '',
      items: (hero.items || []).map(item => ({ id: item.id, text: item.text }))
    });
    console.log('✅ EditingFormData set edildi');
  };

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Yetkilendirme kontrol ediliyor...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded mb-6"></div>
            <div className="h-64 bg-gray-300 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    setDeleteTarget({ type: 'logout', id: 0 });
    setShowDeleteConfirm(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('adminData');
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin');
    setShowDeleteConfirm(false);
    setDeleteTarget(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Bar */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Hero Yönetimi</h1>
              <button
                onClick={() => router.push('/admin/home')}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Ana Panele Dön
              </button>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Çıkış
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        <div className="mb-6">
          <p className="text-gray-600">Ana sayfa hero bölümünü yönetin</p>
        </div>

        {/* Create New Hero */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Yeni Hero Oluştur</h2>
            <button
              onClick={() => setIsCreating(!isCreating)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              {isCreating ? 'İptal' : 'Yeni Hero'}
            </button>
          </div>

          {isCreating && (
            <form onSubmit={handleCreateHero} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  placeholder="Örn: Discover the World with Erasmus"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Açıklama
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  rows={3}
                  placeholder="Hero açıklaması (opsiyonel)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Madde Madde İçerik
                </label>
                {formData.items.map((item, index) => (
                  <div key={index} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) => updateItem(index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                      placeholder="Örn: 500+ Graduates"
                    />
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors"
                    >
                      Sil
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addItem()}
                  className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Madde Ekle
                </button>
              </div>

              {/* Info Note */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-blue-700">
                  ℹ️ Yeni hero otomatik olarak <strong>pasif</strong> durumda kaydedilir. 
                  Daha sonra aşağıdaki listeden seçip <strong>&quot;Aktif Yap&quot;</strong> butonuna tıklayarak anasayfada gösterebilirsiniz.
                </p>
              </div>

              <button
                type="submit"
                className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                Hero Oluştur
              </button>
            </form>
          )}
        </div>

        {/* Heroes List */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Mevcut Hero&apos;lar</h2>
            <button
              onClick={handleConfirmActive}
              disabled={selectedHeroId === null || heroes.find(h => h.id === selectedHeroId)?.isDisplayedOnHomepage}
              className={`px-6 py-2 rounded-lg font-medium shadow-sm transition-colors ${
                selectedHeroId !== null && !heroes.find(h => h.id === selectedHeroId)?.isDisplayedOnHomepage
                  ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {selectedHeroId === null 
                ? 'Bir Hero Seçin' 
                : heroes.find(h => h.id === selectedHeroId)?.isDisplayedOnHomepage 
                  ? 'Zaten Aktif' 
                  : "Seçili Hero'yu Aktif Yap"}
            </button>
          </div>
          
          {heroes.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Henüz hero oluşturulmamış</p>
          ) : (
            <div className="space-y-4">
              {heroes.map((hero) => (
                <div key={hero.id} className={`border rounded-lg p-4 transition-all ${hero.isDisplayedOnHomepage ? 'border-green-500 bg-green-50 shadow-md' : 'border-gray-200'}`}>
                  <div className="flex items-start gap-4">
                    {/* Radio Button - Aktif Seçimi */}
                    <div className="flex items-start pt-1">
                      <input
                        type="radio"
                        id={`hero-active-${hero.id}`}
                        name="activeHero"
                        checked={selectedHeroId === hero.id}
                        onChange={() => setSelectedHeroId(hero.id)}
                        className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 focus:ring-green-500 focus:ring-2 cursor-pointer"
                      />
                      <label htmlFor={`hero-active-${hero.id}`} className="sr-only">
                        Bu hero&apos;yu seç
                      </label>
                    </div>

                    {/* Hero İçeriği */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900">{hero.title}</h3>
                        {hero.isDisplayedOnHomepage && (
                          <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-medium animate-pulse">
                            Anasayfada Gösteriliyor
                          </span>
                        )}
                      </div>
                      {hero.description && (
                        <p className="text-gray-600 mt-1 text-sm">{hero.description}</p>
                      )}
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {hero.items.map((item) => (
                          <span key={item.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                            {item.text}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Butonlar */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(hero)}
                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteHero(hero.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
                      >
                        Sil
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Edit Modal */}
        {editingHero && (
          <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-gray-900">Hero Düzenle</h2>
                <button
                  onClick={() => setEditingHero(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <form onSubmit={handleUpdateHero} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingFormData.title}
                    onChange={(e) => setEditingFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    placeholder="Hero başlığını girin..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    value={editingFormData.description}
                    onChange={(e) => setEditingFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                    rows={3}
                    placeholder="Hero açıklaması (opsiyonel)..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Madde Madde İçerik ({editingFormData.items.length} madde)
                  </label>
                  <div className="space-y-3">
                    {editingFormData.items.map((item, index) => (
                      <div key={index} className="flex gap-2 items-start bg-gray-50 p-3 rounded-lg">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-semibold text-sm flex-shrink-0 mt-1">
                          {index + 1}
                        </span>
                        <input
                          type="text"
                          value={item.text}
                          onChange={(e) => updateItem(index, e.target.value, true)}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                          placeholder={`${index + 1}. maddeyi girin...`}
                        />
                        <button
                          type="button"
                          onClick={() => removeItem(index, true)}
                          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors flex-shrink-0"
                        >
                          Sil
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addItem(true)}
                      className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      + Yeni Madde Ekle
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  >
                    ✓ Güncelle
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingHero(null)}
                    className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                  >
                    ✕ İptal
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-10 backdrop-blur-[2px] flex items-center justify-center p-4 z-50 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all animate-scaleIn">
              <div className="flex items-center justify-center w-16 h-16 mx-auto bg-red-100 rounded-full mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              
              <h3 className="text-2xl font-bold text-center text-gray-900 mb-2">
                {deleteTarget?.type === 'logout' ? 'Çıkış Onayı' : 'Silme Onayı'}
              </h3>
              
              <p className="text-center text-gray-600 mb-8">
                {deleteTarget?.type === 'logout' 
                  ? 'Çıkış yapmak istediğinizden emin misiniz?'
                  : "Bu hero'yu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."}
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDelete}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-semibold hover:scale-105 active:scale-95"
                >
                  İptal
                </button>
                <button
                  onClick={() => {
                    if (deleteTarget?.type === 'logout') {
                      confirmLogout();
                    } else {
                      confirmDeleteHero();
                    }
                  }}
                  className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-all font-semibold hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                >
                  {deleteTarget?.type === 'logout' ? 'Çıkış Yap' : 'Sil'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
