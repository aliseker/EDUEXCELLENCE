'use client';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { authenticatedFetch } from '@/utils/authenticatedFetch';
import { API_BASE_URL, BACKEND_BASE_URL } from '@/config/api';

export default function AdminHome() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isContactSaving, setIsContactSaving] = useState(false);
  const [formKey, setFormKey] = useState(0); // Form reset için
  const [adminData, setAdminData] = useState<any>(null); // Admin bilgileri için
  const [ka2DescriptionHtml, setKa2DescriptionHtml] = useState<string>('');
  const router = useRouter();

  // DOMPurify only works in browser (consistent with other pages)
  const DOMPurify = useMemo(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require('dompurify');
    }
    return null;
  }, []);

  const stripHtml = (html: string) =>
    html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

  const ka2DescriptionEditor = useEditor({
    // Fix SSR/hydration warning in Next.js (Tiptap recommendation)
    immediatelyRender: false,
    extensions: [StarterKit],
    content: '',
    editorProps: {
      attributes: {
        class:
          'min-h-[140px] w-full px-3 py-2 outline-none text-black leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      setKa2DescriptionHtml(editor.getHTML());
    },
  });

  // Keep editor content in sync when opening/closing rich-text modals or editing existing item
  useEffect(() => {
    if (!showModal || (modalType !== 'ka2project' && modalType !== 'ka1course')) return;
    const initial = (editingItem?.description as string) || '';
    setKa2DescriptionHtml(initial);
    if (ka2DescriptionEditor) {
      // Avoid extra update event on init
      ka2DescriptionEditor.commands.setContent(initial || '', { emitUpdate: false });
    }
  }, [showModal, modalType, editingItem, ka2DescriptionEditor]);

  // Helper function to handle date conversion without timezone issues
  const formatDateForInput = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    // Add timezone offset to prevent date shifting
    const offset = date.getTimezoneOffset();
    const adjustedDate = new Date(date.getTime() + (offset * 60 * 1000));
    return adjustedDate.toISOString().split('T')[0];
  };

  // Helper function to update daily program from duration
  const updateDailyProgramFromDuration = (duration: string) => {
    const dayCount = parseInt(duration) || 0;
    if (dayCount > 0) {
      setTimeout(() => {
        if (typeof window !== 'undefined' && (window as any).updateDailyProgramFields) {
          (window as any).updateDailyProgramFields(dayCount);
        }
      }, 100);
    }
  };

  // Blog data from API
  const [blogs, setBlogs] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);

  const [contactInfo, setContactInfo] = useState({
    address: {
      id: 0,
      title: 'Adres',
      type: 'address',
      details: '["Kısla Mah. 37 Sk. Cengizhan Apt. B Girişi No: 6", "İç Kapı No: 102 Muratpaşa, Antalya / Türkiye"]',
      order: 1,
      isPrimary: true
    },
    phone: {
      id: 0,
      title: 'Telefon',
      type: 'phone',
      details: '["+90 505 274 90 36"]',
      order: 2,
      isPrimary: true
    },
    email: {
      id: 0,
      title: 'E-posta',
      type: 'email',
      details: '["info@edu-excellence.net"]',
      order: 3,
      isPrimary: true
    }
  });

  // WhatsApp Settings
  const [whatsappSettings, setWhatsappSettings] = useState({
    phoneNumber: '+905555555555',
    welcomeMessage: 'Hello! How can we help you?',
    isEnabled: true
  });
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false);

  const [ka1Courses, setKa1Courses] = useState<any[]>([]);

  const [ka2Projects, setKa2Projects] = useState<any[]>([]);
  
  // Meeting management states
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [currentProjectMeetings, setCurrentProjectMeetings] = useState<any[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [editingMeeting, setEditingMeeting] = useState<any>(null);
  const [meetingImages, setMeetingImages] = useState<File[]>([]);
  const [meetingImagePreviews, setMeetingImagePreviews] = useState<string[]>([]);

  // Dissemination management states
  const [showDisseminationModal, setShowDisseminationModal] = useState(false);
  const [currentProjectDisseminations, setCurrentProjectDisseminations] = useState<any[]>([]);
  const [selectedDisseminationProjectId, setSelectedDisseminationProjectId] = useState<number | null>(null);
  const [editingDissemination, setEditingDissemination] = useState<any>(null);
  const [disseminationImages, setDisseminationImages] = useState<File[]>([]);
  const [disseminationImagePreviews, setDisseminationImagePreviews] = useState<string[]>([]);

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

  useEffect(() => {
    const checkAuth = async () => {
      const adminAuth = localStorage.getItem('adminLoggedIn');
      const accessToken = localStorage.getItem('accessToken');
      const storedAdminData = localStorage.getItem('adminData');
      
      // Admin bilgilerini yükle
      if (storedAdminData) {
        try {
          setAdminData(JSON.parse(storedAdminData));
        } catch (error) {
          console.error('Failed to parse admin data:', error);
        }
      }
      
      if (adminAuth === 'true' && accessToken) {
        try {
          // Validate access token with backend
          const response = await authenticatedFetch(`${API_BASE_URL}/auth/validate`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(accessToken),
          });

          if (response.ok) {
            setIsAuthenticated(true);
          } else {
            // Token invalid, try to refresh
            const { tokenManager } = await import('@/utils/tokenManager');
            try {
              await tokenManager.refreshAccessToken();
              setIsAuthenticated(true);
            } catch {
              // Refresh failed, logout
              tokenManager.logout();
            }
          }
        } catch (error) {
          console.error('Token validation error:', error);
          const { tokenManager } = await import('@/utils/tokenManager');
          tokenManager.logout();
        }
      } else {
        router.push('/admin');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  // Fetch data from API
  const fetchData = async () => {
    try {
      // Fetch blogs
      const blogsResponse = await authenticatedFetch(`${API_BASE_URL}/Blogs`);
      if (blogsResponse.ok) {
        const blogsData = await blogsResponse.json();
        // Sort by date descending (newest first)
        const sortedBlogs = blogsData.sort((a: any, b: any) => 
          new Date(b.createdAt || b.publishedAt).getTime() - new Date(a.createdAt || a.publishedAt).getTime()
        );
        setBlogs(sortedBlogs);
      }

      // Fetch courses
        const coursesResponse = await authenticatedFetch(`${API_BASE_URL}/Courses`);
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        // Sort by date descending (newest first)
        const sortedCourses = coursesData.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setCourses(sortedCourses);
        // Also set ka1Courses for backward compatibility
        setKa1Courses(sortedCourses);
      }

      // Fetch KA2 projects
      const ka2Response = await authenticatedFetch(`${API_BASE_URL}/Ka2`);
      if (ka2Response.ok) {
        const ka2Data = await ka2Response.json();
        // Sort by date descending (newest first)
        const sortedKa2 = ka2Data.sort((a: any, b: any) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setKa2Projects(sortedKa2);
      }

      // Fetch contacts
      const contactsResponse = await authenticatedFetch(`${API_BASE_URL}/Contact`);
      if (contactsResponse.ok) {
        const contactsData = await contactsResponse.json();
        
        // Update contactInfo with fetched data
        const addressContact = contactsData.find((c: any) => c.type === 'address');
        const phoneContact = contactsData.find((c: any) => c.type === 'phone');
        const emailContact = contactsData.find((c: any) => c.type === 'email');
        
        if (addressContact) setContactInfo(prev => ({ ...prev, address: addressContact }));
        if (phoneContact) setContactInfo(prev => ({ ...prev, phone: phoneContact }));
        if (emailContact) setContactInfo(prev => ({ ...prev, email: emailContact }));
      }

      // Fetch WhatsApp settings
      const whatsappResponse = await authenticatedFetch(`${API_BASE_URL}/Settings/whatsapp`);
      if (whatsappResponse.ok) {
        const whatsappData = await whatsappResponse.json();
        setWhatsappSettings(whatsappData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    router.push('/admin');
  };

  const generateDailyProgramFields = (dayCount: number, existingProgram?: string[]) => {
    const container = document.getElementById('dailyProgramContainer');
    if (!container) return;

    // Smooth animation için önce fade out
    container.style.opacity = '0.5';
    container.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      // Clear container first
      container.textContent = '';
      
      // Create header
      const headerDiv = document.createElement('div');
      headerDiv.className = 'mb-4';
      
      const headerFlex = document.createElement('div');
      headerFlex.className = 'flex items-center justify-between mb-3';
      
      const label = document.createElement('label');
      label.className = 'block text-sm font-medium text-gray-900';
      label.textContent = 'Daily Program';
      
      const badgeContainer = document.createElement('div');
      badgeContainer.className = 'flex items-center space-x-2';
      
      const badge = document.createElement('span');
      badge.className = 'bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-1 rounded-full';
      badge.textContent = `${dayCount} days`;
      
      badgeContainer.appendChild(badge);
      headerFlex.appendChild(label);
      headerFlex.appendChild(badgeContainer);
      
      const description = document.createElement('p');
      description.className = 'text-xs text-gray-600 mb-4 bg-gray-50 p-2 rounded-lg';
      description.textContent = '✨ Program fields are automatically generated from duration. Enter details for each day.';
      
      headerDiv.appendChild(headerFlex);
      headerDiv.appendChild(description);
      container.appendChild(headerDiv);
      
      // Create daily fields container
      const dailyFieldsContainer = document.createElement('div');
      dailyFieldsContainer.id = 'dailyFields';
      dailyFieldsContainer.className = 'space-y-3';
      
      // Generate fields for each day
      Array.from({ length: dayCount }, (_, i) => {
        const fieldDiv = document.createElement('div');
        fieldDiv.className = 'daily-field-item bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-all duration-200';
        
        const labelRow = document.createElement('div');
        labelRow.className = 'flex items-center justify-between mb-2';
        
        const dayLabel = document.createElement('label');
        dayLabel.className = 'text-sm font-semibold text-gray-900 flex items-center';
        
        const dayBadge = document.createElement('span');
        dayBadge.className = 'w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-xs font-bold mr-2';
        dayBadge.textContent = `${i + 1}`;
        
        const dayText = document.createTextNode(`Day ${i + 1}`);
        dayLabel.appendChild(dayBadge);
        dayLabel.appendChild(dayText);
        
        // Normalize stored HTML (<br>, <p>) back to plain textarea newlines for editing
        const rawExisting = existingProgram?.[i] || '';
        const normalizedExisting = rawExisting
          .replace(/<br\s*\/?>/gi, '\n')
          .replace(/<\/(p|div|li)>/gi, '\n')
          .replace(/<(p|div|ul|ol|li)[^>]*>/gi, '')
          .trim();

        const statusSpan = document.createElement('span');
        statusSpan.className = 'text-xs text-gray-500';
        statusSpan.textContent = normalizedExisting.length > 0 ? '✅' : '⏳';
        
        labelRow.appendChild(dayLabel);
        labelRow.appendChild(statusSpan);
        
        const textarea = document.createElement('textarea');
        textarea.name = `day_${i + 1}`;
        textarea.rows = 2;
        textarea.placeholder = `Enter Day ${i + 1} program details...`;
        textarea.className = 'w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 resize-none';
        textarea.value = normalizedExisting;
        textarea.oninput = function() {
          (window as any).updateDayStatus(i + 1, (this as HTMLTextAreaElement).value);
        };
        
        fieldDiv.appendChild(labelRow);
        fieldDiv.appendChild(textarea);
        dailyFieldsContainer.appendChild(fieldDiv);
      });
      
      container.appendChild(dailyFieldsContainer);
      
      // Smooth animation için fade in
      container.style.opacity = '1';
    }, 150);
  };

  // Set up global functions for daily program management
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Global function for updating daily program fields
      (window as any).updateDailyProgramFields = (dayCount: number) => {
        const existingValues: string[] = [];
        const dailyFields = document.getElementById('dailyFields');
        if (dailyFields) {
          const inputs = dailyFields.querySelectorAll('textarea[name^="day_"]');
          inputs.forEach((input: any) => {
            existingValues.push(input.value);
          });
        }
        generateDailyProgramFields(dayCount, existingValues);
      };

      // Global function for updating daily program from duration
      (window as any).updateDailyProgramFromDuration = () => {
        const durationInput = document.getElementById('courseDuration') as HTMLInputElement;
        if (durationInput) {
          const duration = durationInput.value.trim();
          // Just get the number directly
          const dayCount = parseInt(duration);
          if (dayCount > 0 && dayCount <= 30) {
            // Preserve existing values
            const existingValues: string[] = [];
            const dailyFields = document.getElementById('dailyFields');
            if (dailyFields) {
              const inputs = dailyFields.querySelectorAll('textarea[name^="day_"]');
              inputs.forEach((input: any) => {
                existingValues.push(input.value);
              });
            }
            generateDailyProgramFields(dayCount, existingValues);
          }
        }
      };

      // Global function for updating day status
      (window as any).updateDayStatus = (dayNumber: number, value: string) => {
        const statusElement = document.querySelector(`textarea[name="day_${dayNumber}"]`)?.parentElement?.querySelector('.text-xs');
        if (statusElement) {
          statusElement.textContent = value.length > 0 ? '✅' : '⏳';
        }
      };

      // Global function for regenerating days
      (window as any).regenerateDays = () => {
        const durationInput = document.getElementById('courseDuration') as HTMLInputElement;
        if (durationInput) {
          updateDailyProgramFromDuration(durationInput.value);
        }
      };
    }
  }, []);

  const handleAdd = (type: string) => {
    setModalType(type);
    setEditingItem(null);
    setShowModal(true);
    if (type === 'ka1course') {
      setTimeout(() => generateDailyProgramFields(1), 100); // Start with 1 day
    }
  };

  const handleEdit = (type: string, item: any) => {
    setModalType(type);
    setEditingItem(item);
    setFormKey(prev => prev + 1); // Form'u reset et
    
    // Blog düzenleme için mevcut resimleri yükle
    if (type === 'blog' && item?.images) {
      setExistingImages(item.images);
    } else {
      setExistingImages([]);
    }
    
    // Yeni resim seçimlerini temizle
    setSelectedImages([]);
    setImagePreviews([]);
    
    setShowModal(true);
    if (type === 'ka1course') {
      // Extract day count from duration (e.g., "3 DAYS" -> 3)
        const dayCount = item?.duration ? parseInt(item.duration.match(/\d+/)?.[0] || '1') : 1;
      setTimeout(() => generateDailyProgramFields(dayCount, item?.dailyPrograms || []), 100);
    }
  };


  const handleContactSave = async (data: any) => {
    setIsContactSaving(true);
    try {
      // Validasyon
      if (!data.addressTitle?.trim()) {
        toast.error('Adres başlığı gereklidir!');
        return;
      }
      if (!data.addressDetails?.trim()) {
        toast.error('Adres detayları gereklidir!');
        return;
      }
      if (!data.phoneTitle?.trim()) {
        toast.error('Telefon başlığı gereklidir!');
        return;
      }
      if (!data.phoneDetails?.trim()) {
        toast.error('Telefon numaraları gereklidir!');
        return;
      }
      if (!data.emailTitle?.trim()) {
        toast.error('E-posta başlığı gereklidir!');
        return;
      }
      if (!data.emailDetails?.trim()) {
        toast.error('E-posta adresleri gereklidir!');
        return;
      }

      // E-posta format validasyonu
      const emailLines = data.emailDetails.split('\n').filter((line: string) => line.trim());
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      for (const email of emailLines) {
        if (!emailRegex.test(email.trim())) {
          alert(`Geçersiz e-posta formatı: ${email}`);
          return;
        }
      }

      // Telefon format validasyonu
      const phoneLines = data.phoneDetails.split('\n').filter((line: string) => line.trim());
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
      for (const phone of phoneLines) {
        if (!phoneRegex.test(phone.trim())) {
          alert(`Geçersiz telefon formatı: ${phone}`);
          return;
        }
      }

      // API'ye gönderilecek data hazırla
      const contactsToUpdate = [
        {
          ...contactInfo.address,
          title: data.addressTitle.trim(),
          details: JSON.stringify(data.addressDetails.split('\n').filter((line: string) => line.trim()))
        },
        {
          ...contactInfo.phone,
          title: data.phoneTitle.trim(),
          details: JSON.stringify(data.phoneDetails.split('\n').filter((line: string) => line.trim()))
        },
        {
          ...contactInfo.email,
          title: data.emailTitle.trim(),
          details: JSON.stringify(data.emailDetails.split('\n').filter((line: string) => line.trim()))
        }
      ];

      // API çağrısı
      const response = await authenticatedFetch(`${API_BASE_URL}/Contact/bulk-update`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(contactsToUpdate)
      });

      if (response.ok) {
        // Local state'i güncelle
        setContactInfo({
          address: {
            ...contactInfo.address,
            title: data.addressTitle.trim(),
            details: JSON.stringify(data.addressDetails.split('\n').filter((line: string) => line.trim()))
          },
          phone: {
            ...contactInfo.phone,
            title: data.phoneTitle.trim(),
            details: JSON.stringify(data.phoneDetails.split('\n').filter((line: string) => line.trim()))
          },
          email: {
            ...contactInfo.email,
            title: data.emailTitle.trim(),
            details: JSON.stringify(data.emailDetails.split('\n').filter((line: string) => line.trim()))
          }
        });
        
        toast.success('İletişim bilgileri başarıyla güncellendi!');
        setShowContactModal(false);
      } else {
        const errorData = await response.json();
        toast.error(`Güncelleme hatası: ${errorData.message || 'Bilinmeyen hata'}`);
      }
    } catch (error) {
      console.error('Contact save error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsContactSaving(false);
    }
  };

  // Şifre validasyon fonksiyonu
  const validatePassword = (password: string) => {
    const errors = [];
    
    if (password.length < 8) {
      errors.push('En az 8 karakter olmalıdır');
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('En az bir büyük harf içermelidir');
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('En az bir küçük harf içermelidir');
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('En az bir rakam içermelidir');
    }
    
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
      errors.push('En az bir özel karakter içermelidir');
    }
    
    return errors;
  };

  // Şifre değiştirme fonksiyonu
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const currentPassword = formData.get('currentPassword') as string;
    const newPassword = formData.get('newPassword') as string;
    const confirmPassword = formData.get('confirmPassword') as string;

    // Client-side validasyon
    const validationErrors = validatePassword(newPassword);
    if (validationErrors.length > 0) {
      toast.error(`Şifre gereksinimleri: ${validationErrors.join(', ')}`);
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor!');
      return;
    }

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
          confirmPassword
        }),
      });

      if (response.ok) {
        toast.success('Şifre başarıyla değiştirildi!');
        setShowPasswordModal(false);
        (e.target as HTMLFormElement).reset();
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || 'Şifre değiştirme başarısız!');
      }
    } catch (error) {
      console.error('Password change error:', error);
      toast.error('Bir hata oluştu. Lütfen tekrar deneyin.');
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    // Add new files to existing ones instead of replacing
    const updatedImages = [...selectedImages, ...files];
    setSelectedImages(updatedImages);
    
    // Create preview URLs for new files and add to existing previews
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newPreviews]);
    
    // Clear the input so the same files can be selected again if needed
    event.target.value = '';
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setSelectedImages(newImages);
    setImagePreviews(newPreviews);
  };

  const removeExistingImage = (index: number) => {
    const newExistingImages = existingImages.filter((_, i) => i !== index);
    setExistingImages(newExistingImages);
  };

  const handleDelete = (type: string, id: number) => {
    // Type'a göre başlık ve mesaj belirle
    let title = '';
    let message = '';
    
    switch (type) {
      case 'blog':
        title = 'Blog/Haber Sil';
        message = 'Bu blog/haberi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.';
        break;
      case 'ka1course':
        title = 'KA1 Kursu Sil';
        message = 'Bu kursu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.';
        break;
      case 'ka2project':
        title = 'KA2 Projesi Sil';
        message = 'Bu projeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.';
        break;
    }

    showConfirm(
      title,
      message,
      async () => {
        try {
          switch (type) {
            case 'blog':
              const blogResponse = await authenticatedFetch(`${API_BASE_URL}/Blogs/${id}`, {
                method: 'DELETE'
              });
              
              if (blogResponse.ok) {
                setBlogs(blogs.filter(blog => blog.id !== id));
                toast.success('Blog/Haber başarıyla silindi!');
                setShowConfirmModal(false);
              } else {
                const errorText = await blogResponse.text();
                toast.error('Blog/Haber silinemedi: ' + errorText);
              }
              break;
              
            case 'ka1course':
              const courseResponse = await authenticatedFetch(`${API_BASE_URL}/Courses/${id}`, {
                method: 'DELETE'
              });
              
              if (courseResponse.ok) {
                setCourses(courses.filter(course => course.id !== id));
                setKa1Courses(ka1Courses.filter(course => course.id !== id));
                toast.success('KA1 kursu başarıyla silindi!');
                setShowConfirmModal(false);
              } else {
                const errorText = await courseResponse.text();
                console.error('Delete failed:', errorText);
                toast.error('Kurs silinemedi: ' + errorText);
              }
              break;
              
            case 'ka2project':
              const ka2Response = await authenticatedFetch(`${API_BASE_URL}/Ka2/${id}`, {
                method: 'DELETE'
              });
              
              if (ka2Response.ok) {
                setKa2Projects(ka2Projects.filter(project => project.id !== id));
                toast.success('KA2 projesi başarıyla silindi!');
                setShowConfirmModal(false);
              } else {
                const errorText = await ka2Response.text();
                console.error('KA2 delete failed:', errorText);
                toast.error('KA2 projesi silinemedi: ' + errorText);
              }
              break;
          }
        } catch (error) {
          console.error('Error deleting item:', error);
          toast.error('Silme işlemi sırasında bir hata oluştu!');
        }
      },
      'danger'
    );
  };

  const handleSave = async (type: string, data: any, e?: React.FormEvent) => {
    try {
      switch (type) {
        case 'blog':
          
          // Convert selected images to base64 or URLs (only if there are images)
          let imageUrls: string[] = [];
          if (selectedImages && selectedImages.length > 0) {
            try {
              imageUrls = await Promise.all(
                selectedImages.map(async (file) => {
                  return new Promise((resolve, reject) => {
                    try {
                      // Compress image to reduce size
                      const canvas = document.createElement('canvas');
                      const ctx = canvas.getContext('2d');
                      const img = new Image();
                      
                      img.onload = () => {
                        try {
                          // Set canvas size (max 800px width, maintain aspect ratio)
                          const maxWidth = 800;
                          const maxHeight = 600;
                          let { width, height } = img;
                          
                          if (width > maxWidth) {
                            height = (height * maxWidth) / width;
                            width = maxWidth;
                          }
                          if (height > maxHeight) {
                            width = (width * maxHeight) / height;
                            height = maxHeight;
                          }
                          
                          canvas.width = width;
                          canvas.height = height;
                          
                          // Draw and compress with WebP for better quality
                          ctx?.drawImage(img, 0, 0, width, height);
                          
                          // Try WebP first (better quality, smaller size)
                          let compressedDataUrl = canvas.toDataURL('image/webp', 0.8); // 80% quality for WebP
                          
                          // If WebP is not supported, fallback to JPEG with better quality
                          if (compressedDataUrl.length === 0 || compressedDataUrl.includes('data:,')) {
                            compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality for JPEG
                          }
                          
                          // If still too large, compress more
                          if (compressedDataUrl.length > 100000) { // Increased limit for better quality
                            if (compressedDataUrl.includes('image/webp')) {
                              compressedDataUrl = canvas.toDataURL('image/webp', 0.6); // 60% quality
                            } else {
                              compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5); // 50% quality
                            }
                          }
                          
                          resolve(compressedDataUrl);
                        } catch (error) {
                          console.error('Error compressing image:', error);
                          reject(error);
                        }
                      };
                      
                      img.onerror = () => {
                        console.error('Error loading image');
                        reject(new Error('Failed to load image'));
                      };
                      
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        img.src = e.target?.result as string;
                      };
                      reader.onerror = () => {
                        console.error('Error reading file');
                        reject(new Error('Failed to read file'));
                      };
                      reader.readAsDataURL(file);
                    } catch (error) {
                      console.error('Error in image processing:', error);
                      reject(error);
                    }
                  });
                })
              );
            } catch (error) {
              // Fallback: simple base64 conversion without compression
              try {
                imageUrls = await Promise.all(
                  selectedImages.map(async (file) => {
                    return new Promise((resolve, reject) => {
                      const reader = new FileReader();
                      reader.onload = (e) => resolve(e.target?.result as string);
                      reader.onerror = () => reject(new Error('Failed to read file'));
                      reader.readAsDataURL(file);
                    });
                  })
                );
              } catch (fallbackError) {
                console.error('Fallback conversion also failed:', fallbackError);
                alert('Resim işleme hatası: ' + fallbackError);
                return; // Stop execution if both methods fail
              }
            }
          }

          // Combine existing images with new images
          const allImages = [...existingImages, ...imageUrls];
          
          const blogData: any = {
            title: data.title,
            excerpt: data.content,
            fullContent: data.fullContent || data.content,
            type: data.type || 'news',
            author: 'Admin',
            images: allImages
          };

          // Only add imageUrl if there are images
          if (allImages.length > 0) {
            blogData.imageUrl = allImages[0];
          }

          if (editingItem) {
            const updateData = { ...blogData, id: editingItem.id };
            
            const response = await authenticatedFetch(`${API_BASE_URL}/Blogs/${editingItem.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updateData)
            });
            
            if (response.ok) {
              const updatedBlog = await response.json();
              setBlogs(blogs.map(blog => blog.id === editingItem.id ? updatedBlog : blog));
            } else {
              const errorText = await response.text();
              console.error('Blog update failed:', errorText);
              alert('Blog update failed: ' + errorText);
            }
          } else {
            const response = await authenticatedFetch(`${API_BASE_URL}/Blogs`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(blogData)
            });
            
            if (response.ok) {
              const newBlog = await response.json();
              setBlogs([...blogs, newBlog]);
              alert('Blog başarıyla oluşturuldu!');
            } else {
              const errorText = await response.text();
              console.error('Blog create failed:', errorText);
              alert('Blog oluşturma başarısız: ' + errorText);
            }
          }
          break;

        case 'ka1course':
          // Sanitize rich text HTML coming from Tiptap
          const sanitizedCourseDescription =
            DOMPurify && typeof data.description === 'string'
              ? DOMPurify.sanitize(data.description, {
                  ALLOWED_TAGS: [
                    'p',
                    'br',
                    'strong',
                    'em',
                    'u',
                    'h1',
                    'h2',
                    'h3',
                    'ul',
                    'ol',
                    'li',
                    'a',
                    'blockquote',
                    'code',
                    'pre',
                    'span',
                    'div',
                  ],
                  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
                  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
                  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
                })
              : (typeof data.description === 'string' ? data.description : '');

          // Collect daily program data from dynamic fields
          const dailyProgramData: string[] = [];
          const form = e?.target as HTMLFormElement;
          const dayInputs = form.querySelectorAll('textarea[name^="day_"]');
          dayInputs.forEach((input: any) => {
            if (input.value.trim()) {
              // Preserve line breaks by converting to <br> for storage/render
              dailyProgramData.push(input.value.replace(/\r?\n/g, '<br>'));
            }
          });

          const courseData = {
            title: data.title,
            description: sanitizedCourseDescription,
            fee: data.fee,
            duration: `${data.duration} DAYS`,
            startDate: data.startDate ? new Date(data.startDate + 'T00:00:00').toISOString() : null,
            endDate: data.endDate ? new Date(data.endDate + 'T00:00:00').toISOString() : null,
            location: data.location,
            level: data.level,
            maxParticipants: parseInt(data.maxParticipants),
            currentParticipants: parseInt(data.currentParticipants) || 0,
            isApproved: data.isApproved === 'true',
            imageUrl: null,
            learningOutcomes: data.learningOutcomes ? data.learningOutcomes.split('\n').filter((item: string) => item.trim()) : [],
            dailyPrograms: dailyProgramData
          };

          if (editingItem) {
            const updateData = {
              id: editingItem.id,
              title: courseData.title,
              description: courseData.description,
              fee: courseData.fee,
              duration: courseData.duration,
              startDate: courseData.startDate,
              endDate: courseData.endDate,
              location: courseData.location,
              level: courseData.level,
              maxParticipants: courseData.maxParticipants,
              currentParticipants: courseData.currentParticipants,
              isApproved: courseData.isApproved,
              imageUrl: null,
              learningOutcomes: courseData.learningOutcomes,
              dailyPrograms: courseData.dailyPrograms
            };
            const response = await authenticatedFetch(`${API_BASE_URL}/Courses/${editingItem.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updateData)
            });
            
            if (response.ok) {
              const updatedCourse = await response.json();
              setCourses(courses.map(course => course.id === editingItem.id ? updatedCourse : course));
              setKa1Courses(ka1Courses.map(course => course.id === editingItem.id ? updatedCourse : course));
              toast.success('Kurs başarıyla güncellendi!');
              // Refresh data to ensure consistency
              await fetchData();
            } else {
              const errorText = await response.text();
              console.error('Update failed:', errorText);
              console.error('Request data:', updateData);
              toast.error('Kurs güncelleme başarısız: ' + errorText);
            }
          } else {
            const response = await authenticatedFetch(`${API_BASE_URL}/Courses`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(courseData)
            });
            
            if (response.ok) {
              const newCourse = await response.json();
              setCourses([...courses, newCourse]);
              setKa1Courses([...ka1Courses, newCourse]);
              toast.success('Kurs başarıyla oluşturuldu!');
              // Refresh data to ensure consistency
              await fetchData();
            } else {
              const errorText = await response.text();
              console.error('Create failed:', errorText);
              toast.error('Kurs oluşturma başarısız: ' + errorText);
            }
          }
          break;
        case 'ka2project':
          // Sanitize rich text HTML coming from Tiptap
          const sanitizedDescription =
            DOMPurify && typeof data.description === 'string'
              ? DOMPurify.sanitize(data.description, {
                  ALLOWED_TAGS: [
                    'p',
                    'br',
                    'strong',
                    'em',
                    'u',
                    'h1',
                    'h2',
                    'h3',
                    'ul',
                    'ol',
                    'li',
                    'a',
                    'blockquote',
                    'code',
                    'pre',
                    'span',
                    'div',
                  ],
                  ALLOWED_ATTR: ['href', 'title', 'target', 'rel'],
                  FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'style'],
                  FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'form', 'input', 'button'],
                })
              : (typeof data.description === 'string' ? data.description : '');

          const projectData = {
            title: data.title,
            description: sanitizedDescription,
            type: data.type,
            location: data.location,
            partnerCountries: data.partners,
            objectives: data.objectives,
            activities: data.activities ? data.activities.split('\n').filter((activity: string) => activity.trim()) : [],
            targetGroup: data.targetGroup,
            budget: data.projectValue,
            isActive: true
          };

          if (editingItem) {
            const updateData = { ...projectData, id: editingItem.id };
            const response = await authenticatedFetch(`${API_BASE_URL}/Ka2/${editingItem.id}`, {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(updateData)
            });
            
            if (response.ok) {
              const updatedProject = await response.json();
              setKa2Projects(ka2Projects.map(project => project.id === editingItem.id ? updatedProject : project));
              toast.success('KA2 projesi başarıyla güncellendi!');
              // Refresh data to ensure consistent shape/order
              await fetchData();
            } else {
              const errorText = await response.text();
              console.error('KA2 update failed:', errorText);
              alert('KA2 update failed: ' + errorText);
            }
          } else {
            const response = await authenticatedFetch(`${API_BASE_URL}/Ka2`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(projectData)
            });
            
            if (response.ok) {
              const newProject = await response.json();
              setKa2Projects([...ka2Projects, newProject]);
              toast.success('KA2 projesi başarıyla oluşturuldu!');
              // Refresh data to ensure consistent shape/order
              await fetchData();
            } else {
              const errorText = await response.text();
              console.error('KA2 create failed:', errorText);
              alert('KA2 create failed: ' + errorText);
            }
          }
          break;
      }
      
      setShowModal(false);
      setEditingItem(null);
      setSelectedImages([]);
      setImagePreviews([]);
      setExistingImages([]);
    } catch (error) {
      console.error('Error saving data:', error);
      alert('Error saving data. Please try again.');
    }
  };

  // Meeting Management Functions
  const handleManageMeetings = async (projectId: number) => {
    setSelectedProjectId(projectId);
    setShowMeetingModal(true);
    
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/Meeting/project/${projectId}`);
      if (response.ok) {
        const meetings = await response.json();
        setCurrentProjectMeetings(meetings);
      }
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const handleAddMeeting = () => {
    setEditingMeeting({
      title: '',
      description: '',
      images: []
    });
    setMeetingImages([]);
    setMeetingImagePreviews([]);
  };

  const handleEditMeeting = (meeting: any) => {
    setEditingMeeting({
      ...meeting,
      // Eski resimleri orijinal halinde (relative URL) sakla
      images: meeting.images || []
    });
    
    // Preview için absolute URL'ye çevir
    const imagePreviews = (meeting.images || []).map((img: string) => 
      img.startsWith('http') ? img : `${BACKEND_BASE_URL}${img}`
    );
    setMeetingImagePreviews(imagePreviews);
    
    // Yeni resim listesini temizle
    setMeetingImages([]);
  };

  const handleMeetingImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    // Yeni dosyaları ekle
    setMeetingImages(prev => [...prev, ...files]);
    
    // Preview'ları oluştur
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMeetingImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    // Input'u temizle (aynı dosyayı tekrar seçebilmek için)
    e.target.value = '';
  };

  const handleRemoveMeetingImage = (index: number) => {
    const existingImagesCount = editingMeeting?.images?.length || 0;
    
    if (index < existingImagesCount) {
      // Eski resim siliniyor (database'den gelen)
      setEditingMeeting((prev: any) => ({
        ...prev,
        images: prev.images.filter((_: any, i: number) => i !== index)
      }));
    } else {
      // Yeni yüklenen resim siliniyor
      const newImageIndex = index - existingImagesCount;
      setMeetingImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }
    
    // Preview'dan da kaldır
    setMeetingImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveMeeting = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get('meetingTitle') as string;
    const description = formData.get('meetingDescription') as string;

    try {
      // Yeni resimleri base64'e çevir (blog gibi - CORS sorunu olmaması için)
      let uploadedImageUrls: string[] = [];
      
      if (meetingImages.length > 0) {
        try {
          uploadedImageUrls = await Promise.all(
            meetingImages.map(async (file) => {
              return new Promise((resolve, reject) => {
                try {
                  // Compress image to reduce size
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const img = new Image();
                  
                  img.onload = () => {
                    try {
                      // Set canvas size (max 800px width, maintain aspect ratio)
                      const maxWidth = 800;
                      const maxHeight = 600;
                      let { width, height } = img;
                      
                      if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                      }
                      if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                      }
                      
                      canvas.width = width;
                      canvas.height = height;
                      
                      // Draw and compress with WebP for better quality
                      ctx?.drawImage(img, 0, 0, width, height);
                      
                      // Try WebP first (better quality, smaller size)
                      let compressedDataUrl = canvas.toDataURL('image/webp', 0.8); // 80% quality for WebP
                      
                      // If WebP is not supported, fallback to JPEG with better quality
                      if (compressedDataUrl.length === 0 || compressedDataUrl.includes('data:,')) {
                        compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality for JPEG
                      }
                      
                      // If still too large, compress more
                      if (compressedDataUrl.length > 100000) { // Increased limit for better quality
                        if (compressedDataUrl.includes('image/webp')) {
                          compressedDataUrl = canvas.toDataURL('image/webp', 0.6); // 60% quality
                        } else {
                          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5); // 50% quality
                        }
                      }
                      
                      resolve(compressedDataUrl);
                    } catch (error) {
                      console.error('Error compressing image:', error);
                      reject(error);
                    }
                  };
                  
                  img.onerror = () => {
                    console.error('Error loading image');
                    reject(new Error('Failed to load image'));
                  };
                  
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    img.src = e.target?.result as string;
                  };
                  reader.onerror = () => {
                    console.error('Error reading file');
                    reject(new Error('Failed to read file'));
                  };
                  reader.readAsDataURL(file);
                } catch (error) {
                  console.error('Error in image processing:', error);
                  reject(error);
                }
              });
            })
          );
        } catch (error) {
          // Fallback: simple base64 conversion without compression
          try {
            uploadedImageUrls = await Promise.all(
              meetingImages.map(async (file) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = (e) => resolve(e.target?.result as string);
                  reader.onerror = () => reject(new Error('Failed to read file'));
                  reader.readAsDataURL(file);
                });
              })
            );
          } catch (fallbackError) {
            console.error('Fallback conversion also failed:', fallbackError);
            toast.error('Resim işleme hatası: ' + fallbackError);
            return; // Stop execution if both methods fail
          }
        }
      }

      // Eski resimlerle yeni resimleri birleştir
      const existingImages = (editingMeeting?.images || [])
        .filter((img: string) => img && img.trim() !== ''); // Boş olanları temizle
      
      const allImages = [...existingImages, ...uploadedImageUrls];

      if (editingMeeting?.id) {
        // Update existing meeting
        const updateData = {
          id: editingMeeting.id,
          title,
          description,
          images: allImages
        };

        const response = await authenticatedFetch(`${API_BASE_URL}/Meeting/${editingMeeting.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          const updated = await response.json();
          setCurrentProjectMeetings(prev => 
            prev.map(m => m.id === updated.id ? updated : m)
          );
          toast.success('Meeting başarıyla güncellendi!');
          setEditingMeeting(null);
          setMeetingImages([]);
          setMeetingImagePreviews([]);
        } else {
          const errorData = await response.text();
          console.error('Update error:', errorData);
          toast.error(`Meeting güncellenemedi: ${errorData}`);
        }
      } else {
        // Create new meeting
        const createData = {
          title,
          description,
          images: allImages,
          ka2ProjectId: selectedProjectId
        };

        const response = await authenticatedFetch(`${API_BASE_URL}/Meeting`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(createData),
        });

        if (response.ok) {
          const created = await response.json();
          setCurrentProjectMeetings(prev => [...prev, created]);
          toast.success('Meeting başarıyla eklendi!');
          setEditingMeeting(null);
          setMeetingImages([]);
          setMeetingImagePreviews([]);
        } else {
          const errorData = await response.text();
          console.error('Create error:', errorData);
          toast.error(`Meeting eklenemedi: ${errorData}`);
        }
      }
    } catch (error) {
      console.error('Error saving meeting:', error);
      toast.error('Meeting kaydedilirken bir hata oluştu!');
    }
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

  const handleDeleteMeeting = (meetingId: number) => {
    showConfirm(
      'Meeting Sil',
      'Bu meeting\'i silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      async () => {
        try {
          const response = await authenticatedFetch(`${API_BASE_URL}/Meeting/${meetingId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setCurrentProjectMeetings(prev => prev.filter(m => m.id !== meetingId));
            toast.success('Meeting başarıyla silindi!');
            setShowConfirmModal(false);
          } else {
            toast.error('Meeting silinemedi!');
          }
        } catch (error) {
          console.error('Error deleting meeting:', error);
          toast.error('Meeting silinemedi!');
        }
      },
      'danger'
    );
  };

  // Dissemination Management Functions
  const handleManageDisseminations = async (projectId: number) => {
    setSelectedDisseminationProjectId(projectId);
    setShowDisseminationModal(true);
    
    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/Dissemination/project/${projectId}`);
      if (response.ok) {
        const disseminations = await response.json();
        setCurrentProjectDisseminations(disseminations);
      }
    } catch (error) {
      console.error('Error fetching disseminations:', error);
    }
  };

  const handleAddDissemination = () => {
    setEditingDissemination({
      title: '',
      description: '',
      images: []
    });
    setDisseminationImages([]);
    setDisseminationImagePreviews([]);
  };

  const handleEditDissemination = (dissemination: any) => {
    setEditingDissemination({
      ...dissemination,
      images: dissemination.images || []
    });
    
    const imagePreviews = (dissemination.images || []).map((img: string) => 
      img.startsWith('http') ? img : `${BACKEND_BASE_URL}${img}`
    );
    setDisseminationImagePreviews(imagePreviews);
    setDisseminationImages([]);
  };

  const handleDisseminationImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    setDisseminationImages(prev => [...prev, ...files]);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDisseminationImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    e.target.value = '';
  };

  const handleRemoveDisseminationImage = (index: number) => {
    const existingImagesCount = editingDissemination?.images?.length || 0;
    
    if (index < existingImagesCount) {
      setEditingDissemination((prev: any) => ({
        ...prev,
        images: prev.images.filter((_: any, i: number) => i !== index)
      }));
    } else {
      const newImageIndex = index - existingImagesCount;
      setDisseminationImages(prev => prev.filter((_, i) => i !== newImageIndex));
    }
    
    setDisseminationImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveDissemination = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDisseminationProjectId) return;

    const formData = new FormData(e.currentTarget);
    const title = formData.get('disseminationTitle') as string;
    const description = formData.get('disseminationDescription') as string;

    try {
      // Yeni resimleri base64'e çevir (blog gibi - CORS sorunu olmaması için)
      let uploadedImageUrls: string[] = [];
      
      if (disseminationImages.length > 0) {
        try {
          uploadedImageUrls = await Promise.all(
            disseminationImages.map(async (file) => {
              return new Promise((resolve, reject) => {
                try {
                  // Compress image to reduce size
                  const canvas = document.createElement('canvas');
                  const ctx = canvas.getContext('2d');
                  const img = new Image();
                  
                  img.onload = () => {
                    try {
                      // Set canvas size (max 800px width, maintain aspect ratio)
                      const maxWidth = 800;
                      const maxHeight = 600;
                      let { width, height } = img;
                      
                      if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                      }
                      if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                      }
                      
                      canvas.width = width;
                      canvas.height = height;
                      
                      // Draw and compress with WebP for better quality
                      ctx?.drawImage(img, 0, 0, width, height);
                      
                      // Try WebP first (better quality, smaller size)
                      let compressedDataUrl = canvas.toDataURL('image/webp', 0.8); // 80% quality for WebP
                      
                      // If WebP is not supported, fallback to JPEG with better quality
                      if (compressedDataUrl.length === 0 || compressedDataUrl.includes('data:,')) {
                        compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7); // 70% quality for JPEG
                      }
                      
                      // If still too large, compress more
                      if (compressedDataUrl.length > 100000) { // Increased limit for better quality
                        if (compressedDataUrl.includes('image/webp')) {
                          compressedDataUrl = canvas.toDataURL('image/webp', 0.6); // 60% quality
                        } else {
                          compressedDataUrl = canvas.toDataURL('image/jpeg', 0.5); // 50% quality
                        }
                      }
                      
                      resolve(compressedDataUrl);
                    } catch (error) {
                      console.error('Error compressing image:', error);
                      reject(error);
                    }
                  };
                  
                  img.onerror = () => {
                    console.error('Error loading image');
                    reject(new Error('Failed to load image'));
                  };
                  
                  const reader = new FileReader();
                  reader.onload = (e) => {
                    img.src = e.target?.result as string;
                  };
                  reader.onerror = () => {
                    console.error('Error reading file');
                    reject(new Error('Failed to read file'));
                  };
                  reader.readAsDataURL(file);
                } catch (error) {
                  console.error('Error in image processing:', error);
                  reject(error);
                }
              });
            })
          );
        } catch (error) {
          // Fallback: simple base64 conversion without compression
          try {
            uploadedImageUrls = await Promise.all(
              disseminationImages.map(async (file) => {
                return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = (e) => resolve(e.target?.result as string);
                  reader.onerror = () => reject(new Error('Failed to read file'));
                  reader.readAsDataURL(file);
                });
              })
            );
          } catch (fallbackError) {
            console.error('Fallback conversion also failed:', fallbackError);
            toast.error('Resim işleme hatası: ' + fallbackError);
            return; // Stop execution if both methods fail
          }
        }
      }

      // Eski resimlerle yeni resimleri birleştir
      const existingImages = (editingDissemination?.images || [])
        .filter((img: string) => img && img.trim() !== '');
      
      const allImages = [...existingImages, ...uploadedImageUrls];

      if (editingDissemination?.id) {
        const updateData = {
          id: editingDissemination.id,
          title,
          description,
          images: allImages
        };

        const response = await authenticatedFetch(`${API_BASE_URL}/Dissemination/${editingDissemination.id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          const updated = await response.json();
          setCurrentProjectDisseminations(prev => 
            prev.map(d => d.id === updated.id ? updated : d)
          );
          toast.success('Dissemination başarıyla güncellendi!');
          setEditingDissemination(null);
          setDisseminationImages([]);
          setDisseminationImagePreviews([]);
        } else {
          const errorData = await response.text();
          console.error('Update error:', errorData);
          toast.error(`Dissemination güncellenemedi: ${errorData}`);
        }
      } else {
        const createData = {
          title,
          description,
          images: allImages,
          ka2ProjectId: selectedDisseminationProjectId
        };

        const response = await authenticatedFetch(`${API_BASE_URL}/Dissemination`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(createData),
        });

        if (response.ok) {
          const created = await response.json();
          setCurrentProjectDisseminations(prev => [...prev, created]);
          toast.success('Dissemination başarıyla eklendi!');
          setEditingDissemination(null);
          setDisseminationImages([]);
          setDisseminationImagePreviews([]);
        } else {
          const errorData = await response.text();
          console.error('Create error:', errorData);
          toast.error(`Dissemination eklenemedi: ${errorData}`);
        }
      }
    } catch (error) {
      console.error('Error saving dissemination:', error);
      toast.error('Dissemination kaydedilirken bir hata oluştu!');
    }
  };

  const handleDeleteDissemination = (disseminationId: number) => {
    showConfirm(
      'Dissemination Sil',
      'Bu dissemination\'ı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.',
      async () => {
        try {
          const response = await authenticatedFetch(`${API_BASE_URL}/Dissemination/${disseminationId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            setCurrentProjectDisseminations(prev => prev.filter(d => d.id !== disseminationId));
            toast.success('Dissemination başarıyla silindi!');
            setShowConfirmModal(false);
          } else {
            toast.error('Dissemination silinemedi!');
          }
        } catch (error) {
          console.error('Error deleting dissemination:', error);
          toast.error('Dissemination silinemedi!');
        }
      },
      'danger'
    );
  };

  const handleSaveWhatsAppSettings = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const settings = {
      phoneNumber: formData.get('phoneNumber') as string,
      welcomeMessage: formData.get('welcomeMessage') as string,
      isEnabled: formData.get('isEnabled') === 'on'
    };

    try {
      const response = await authenticatedFetch(`${API_BASE_URL}/Settings/whatsapp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });

      if (response.ok) {
        setWhatsappSettings(settings);
        setShowWhatsAppModal(false);
        toast.success('WhatsApp ayarları kaydedildi!');
      }
    } catch (error) {
      console.error('Error saving WhatsApp settings:', error);
      toast.error('WhatsApp ayarları kaydedilemedi!');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-900">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
              <p className="text-gray-900">EduExcellence Yönetim Paneli</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Çıkış Yap
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex space-x-4 sm:space-x-8 border-t border-gray-200 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-900 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('blogs')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'blogs'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-900 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Blog & Haberler
            </button>
            <button
              onClick={() => setActiveTab('ka1courses')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'ka1courses'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-900 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              KA1 Kursları
            </button>
            <button
              onClick={() => setActiveTab('ka2projects')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'ka2projects'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-900 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              KA2 Projeleri
            </button>
            <button
              onClick={() => setActiveTab('hero')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'hero'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-900 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              Hero Yönetimi
            </button>
            <button
              onClick={() => router.push('/admin/social-media')}
              className="py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap border-transparent text-gray-900 hover:text-gray-900 hover:border-gray-300"
            >
              Sosyal Medya
            </button>
            <button
              onClick={() => router.push('/admin/reviews')}
              className="py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap border-transparent text-gray-900 hover:text-gray-900 hover:border-gray-300"
            >
              Müşteri Yorumları
            </button>
            <button
              onClick={() => setActiveTab('contact')}
              className={`py-4 px-2 sm:px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'contact'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-900 hover:text-gray-900 hover:border-gray-300'
              }`}
            >
              İletişim Bilgileri
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            {/* Admin Settings */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-gray-900">Admin Ayarları</h2>
                <button
                  onClick={() => setShowPasswordModal(true)}
                  className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  Şifre Değiştir
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {adminData ? `${adminData.firstName} ${adminData.lastName}` : 'Admin Kullanıcısı'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {adminData?.email || 'admin@edu-excellence.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Toplam Blog</p>
                    <p className="text-2xl font-bold text-gray-900">{blogs.length}</p>
                  </div>
                </div>
              </div>


              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">KA1 Kursları</p>
                    <p className="text-2xl font-bold text-gray-900">{ka1Courses.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">KA2 Projeleri</p>
                    <p className="text-2xl font-bold text-gray-900">{ka2Projects.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">İletişim Bilgileri</p>
                    <p className="text-2xl font-bold text-gray-900">3</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Toplam İçerik</p>
                    <p className="text-2xl font-bold text-gray-900">{blogs.length + ka1Courses.length + ka2Projects.length}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Dashboard Visualizations */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Onaylı/Onaysız Kurs Oranı */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Kurs Onay Durumu</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">Onaylı Kurslar</span>
                    </div>
                    <span className="text-lg font-bold text-green-600">
                      {ka1Courses.filter(course => course.isApproved).length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gray-500 rounded-full mr-3"></div>
                      <span className="text-sm font-medium text-gray-900">Devlet Onaylı Değil</span>
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {ka1Courses.filter(course => !course.isApproved).length}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-4">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${ka1Courses.length > 0 ? (ka1Courses.filter(course => course.isApproved).length / ka1Courses.length) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-900 text-center">
                    %{ka1Courses.length > 0 ? Math.round((ka1Courses.filter(course => course.isApproved).length / ka1Courses.length) * 100) : 0} Onaylı
                  </p>
                </div>
              </div>

              {/* Yaklaşan Kurslar */}
              <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Yaklaşan Kurslar (2 Ay)</h3>
                <div className="relative">
                  <div className="overflow-x-auto scrollbar-hide">
                    <div className="flex space-x-4 pb-2" style={{ minWidth: 'max-content' }}>
                      {(() => {
                        const now = new Date();
                        const twoMonthsFromNow = new Date();
                        twoMonthsFromNow.setMonth(now.getMonth() + 2);
                        
                        const upcomingCourses = ka1Courses
                          .filter(course => {
                            if (!course.startDate) return false;
                            const courseDate = new Date(course.startDate);
                            return courseDate > now && courseDate <= twoMonthsFromNow;
                          })
                          .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

                        if (upcomingCourses.length === 0) {
                          return (
                            <p className="text-sm text-gray-900 text-center py-4 w-full">
                              Gelecek 2 ay içinde kurs bulunmuyor
                            </p>
                          );
                        }

                        return upcomingCourses.map((course) => (
                          <div key={course.id} className="flex-shrink-0 w-64 p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="space-y-2">
                              <h4 className="font-medium text-gray-900 text-sm line-clamp-2">{course.title}</h4>
                              <div className="flex items-center text-xs text-gray-900">
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                {course.location}
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-xs font-medium text-blue-600">
                                  {new Date(course.startDate).toLocaleDateString('tr-TR', {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit'
                                  })}
                                </p>
                                {course.isApproved && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Onaylı
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                  
                  {/* Scroll indicator */}
                  <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-white to-transparent pointer-events-none"></div>
                </div>
              </div>
            </div>

            {/* Son Eklenen İçerikler */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Son Eklenen İçerikler</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Son Blog/Haberler */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">Blog/Haberler</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">{blogs.length}</p>
                  <p className="text-xs text-gray-900">Toplam içerik</p>
                </div>

                {/* Son KA1 Kursları */}
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">KA1 Kursları</span>
                  </div>
                  <p className="text-2xl font-bold text-purple-600">{ka1Courses.length}</p>
                  <p className="text-xs text-gray-900">Toplam kurs</p>
                </div>

                {/* Son KA2 Projeleri */}
                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <span className="font-medium text-gray-900">KA2 Projeleri</span>
                  </div>
                  <p className="text-2xl font-bold text-orange-600">{ka2Projects.length}</p>
                  <p className="text-xs text-gray-900">Toplam proje</p>
                </div>
              </div>
            </div>

            {/* Popüler Lokasyonlar */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Popüler Kurs Lokasyonları</h3>
              <div className="space-y-3">
                {Object.entries(
                  ka1Courses.reduce((acc, course) => {
                    acc[course.location] = (acc[course.location] || 0) + 1;
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([,a], [,b]) => (b as number) - (a as number))
                  .slice(0, 5)
                  .map(([location, count]) => (
                    <div key={location} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <span className="font-medium text-gray-900">{location}</span>
                      </div>
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-3">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${((count as number) / Math.max(...Object.values(ka1Courses.reduce((acc, course) => {
                                acc[course.location] = (acc[course.location] || 0) + 1;
                                return acc;
                              }, {} as Record<string, number>)).map(v => v as number))) * 100}%` 
                            }}
                          ></div>
                        </div>
                        <span className="text-sm font-bold text-gray-900">{count as number}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Blog & Haberler Tab */}
        {activeTab === 'blogs' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Blog & Haberler Yönetimi</h2>
              <button
                onClick={() => handleAdd('blog')}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Yeni Ekle
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {blogs.map((blog) => (
                  <div key={blog.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{blog.title}</h3>
                      <p className="text-sm text-gray-900 mt-1">{blog.excerpt}</p>
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-xs text-gray-900 font-medium">
                          {new Date(blog.publishedAt).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                          blog.type === 'news' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {blog.type === 'news' ? 'Haber' : 'Etkinlik'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit('blog', blog)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Düzenle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete('blog', blog.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Sil"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}


        {/* KA1 Kursları Tab */}
        {activeTab === 'ka1courses' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">KA1 Kursları Yönetimi</h2>
              <button
                onClick={() => handleAdd('ka1course')}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Yeni Ekle
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {ka1Courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 break-words min-w-0">
                          {course.title}
                        </h3>
                        {course.isApproved && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                            Onaylı
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-gray-900 mt-1 break-words whitespace-normal line-clamp-2 overflow-hidden [overflow-wrap:anywhere]">
                        {stripHtml(course.description || '')}
                      </p>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2">
                        <span className="text-sm text-gray-900 font-medium">📍 {course.location}</span>
                        <span className="text-sm text-gray-900 font-medium">⏱️ {course.duration}</span>
                        <span className="text-sm text-gray-900 font-medium">💰 {course.fee}</span>
                        <span className="text-sm text-gray-900 font-medium">👥 {course.currentParticipants}/{course.maxParticipants}</span>
                        <span className="text-sm text-gray-900 font-medium">📊 {course.level}</span>
                        {course.startDate && (
                          <span className="text-sm text-gray-900 font-medium">📅 {new Date(course.startDate).toLocaleDateString('tr-TR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          })}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 md:flex-col md:items-end flex-shrink-0">
                      <button
                        onClick={() => handleEdit('ka1course', course)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                        title="Düzenle"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleDelete('ka1course', course.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Sil"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* KA2 Projeleri Tab */}
        {activeTab === 'ka2projects' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">KA2 Projeleri Yönetimi</h2>
              <button
                onClick={() => handleAdd('ka2project')}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Yeni Ekle
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-6">
                {ka2Projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 rounded-lg p-6 overflow-hidden">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 break-words min-w-0">
                            {project.title}
                          </h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            project.type === 'KA210-VET' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-blue-100 text-blue-800'
                          }`}>
                            {project.type}
                          </span>
                        </div>
                        <p className="text-gray-900 mb-3 text-sm leading-relaxed line-clamp-2 break-words overflow-wrap-anywhere overflow-hidden">
                          {stripHtml(project.description || '')}
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm min-w-0">
                          <div className="min-w-0">
                            <span className="font-semibold text-gray-800">Partners:</span>
                            <span className="text-gray-900 ml-2 font-medium break-words [overflow-wrap:anywhere]">
                              {project.partnerCountries || '-'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-gray-800">Project Value:</span>
                            <span className="text-gray-900 ml-2 font-medium break-words [overflow-wrap:anywhere]">
                              {project.budget || '-'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:ml-4 flex-shrink-0 justify-start lg:justify-end">
                        <button
                          onClick={() => handleManageMeetings(project.id)}
                          className="px-3 py-2 text-sm font-medium text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors duration-200 flex items-center"
                          title="Manage Meetings"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Meetings
                        </button>
                        <button
                          onClick={() => handleManageDisseminations(project.id)}
                          className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 hover:bg-green-100 rounded-lg transition-colors duration-200 flex items-center"
                          title="Manage Disseminations"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                          </svg>
                          Disseminations
                        </button>
                        <button
                          onClick={() => handleEdit('ka2project', project)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                          title="Düzenle"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete('ka2project', project.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="Sil"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Project Activities</h4>
                        <ul className="space-y-1">
                          {project.activities.map((activity: string, index: number) => (
                            <li key={index} className="text-sm text-gray-900 flex items-center font-medium">
                              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                              {activity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Hero Yönetimi Tab */}
        {activeTab === 'hero' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">Hero Yönetimi</h2>
              <button
                onClick={() => router.push('/admin/hero')}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Hero Yönetimi
              </button>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                </svg>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Hero Yönetimi</h3>
                <p className="text-gray-500 mb-6">Ana sayfa hero bölümünü yönetmek için ayrı sayfaya gidin</p>
                <button
                  onClick={() => router.push('/admin/hero')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hero Yönetimine Git
                </button>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {modalType === 'blog' ? 'Blog/Haber' : 
                 modalType === 'ka1course' ? 'KA1 Kursu' : 
                 modalType === 'ka2project' ? 'KA2 Projesi' : ''} 
                {editingItem ? 'Düzenle' : 'Ekle'}
              </h3>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingItem(null);
                  setSelectedImages([]);
                  setImagePreviews([]);
                  setKa2DescriptionHtml('');
              ka2DescriptionEditor?.commands.setContent('', { emitUpdate: false });
                  // Refresh data when modal is closed
                  fetchData();
                }}
                className="text-gray-900 hover:text-gray-900"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6">
              <form key={formKey} onSubmit={(e) => {
                e.preventDefault();
                if (modalType === 'ka2project' || modalType === 'ka1course') {
                  const text = ka2DescriptionEditor?.getText()?.trim() || '';
                  if (!text) {
                    toast.error('Açıklama alanı boş olamaz!');
                    return;
                  }
                }
                const formData = new FormData(e.target as HTMLFormElement);
                const data = Object.fromEntries(formData.entries());
                handleSave(modalType, data, e);
              }}>
                {modalType === 'blog' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Başlık</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editingItem?.title || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Kısa Açıklama</label>
                      <textarea
                        name="content"
                        defaultValue={editingItem?.excerpt || editingItem?.content || ''}
                        rows={3}
                        placeholder="Haberin kısa özeti..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Detaylı İçerik</label>
                      <textarea
                        name="fullContent"
                        defaultValue={editingItem?.fullContent || ''}
                        rows={8}
                        placeholder="Haberin detaylı içeriği (HTML formatında yazabilirsiniz)..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Resimler</label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                        <input
                          type="file"
                          name="images"
                          multiple
                          accept="image/*"
                          className="hidden"
                          id="imageUpload"
                          onChange={handleImageSelect}
                        />
                        <label htmlFor="imageUpload" className="cursor-pointer">
                          <div className="flex flex-col items-center">
                            <svg className="w-12 h-12 text-gray-900 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="text-sm font-medium text-gray-900 mb-1">Resimleri seçmek için tıklayın</p>
                            <p className="text-xs text-gray-900">JPG, PNG, GIF formatları desteklenir</p>
                            <p className="text-xs text-blue-600 mt-2">Birden fazla resim seçebilirsiniz</p>
                          </div>
                        </label>
                      </div>
                      <div className="mt-3 flex justify-between items-center">
                        <p className="text-xs text-gray-900">
                          💡 <strong>İpucu:</strong> Haber için en az 3-4 resim eklemeniz önerilir. 
                          İlk resim ana görsel olarak kullanılır.
                        </p>
                        {imagePreviews.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              // Revoke all preview URLs to free memory
                              imagePreviews.forEach(url => URL.revokeObjectURL(url));
                              setSelectedImages([]);
                              setImagePreviews([]);
                            }}
                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                          >
                            Tümünü Temizle
                          </button>
                        )}
                      </div>
                      
                      {/* Image Previews */}
                      {(imagePreviews.length > 0 || existingImages.length > 0) && (
                        <div className="mt-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-3">
                            Resimler ({existingImages.length + imagePreviews.length})
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {/* Mevcut resimler */}
                            {existingImages.map((image: string, index: number) => (
                              <div key={`existing-${index}`} className="relative group">
                                <img
                                  src={image}
                                  alt={`Mevcut resim ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeExistingImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                                  title="Sil"
                                >
                                  ×
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                                  Mevcut Resim {index + 1}
                                </div>
                              </div>
                            ))}
                            {/* Yeni seçilen resimler */}
                            {imagePreviews.map((preview, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => removeImage(index)}
                                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                                >
                                  ×
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 rounded-b-lg">
                                  {selectedImages[index]?.name || `Resim ${index + 1}`}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Tür</label>
                      <select
                        name="type"
                        defaultValue={editingItem?.type || 'news'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                      >
                        <option value="news">Haber</option>
                        <option value="event">Etkinlik</option>
                      </select>
                    </div>
                  </>
                )}


                {modalType === 'ka1course' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Kurs Adı</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editingItem?.title || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Lokasyon</label>
                      <input
                        type="text"
                        name="location"
                        defaultValue={editingItem?.location || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Açıklama</label>
                      {/* Hidden input so existing FormData -> handleSave pipeline keeps working */}
                      <input type="hidden" name="description" value={ka2DescriptionHtml} />

                      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                        <div className="flex flex-wrap gap-2 px-2 py-2 border-b border-gray-200 bg-gray-50">
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().toggleBold().run()}
                            className={`px-2 py-1 text-xs rounded border ${
                              ka2DescriptionEditor?.isActive('bold')
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            Bold
                          </button>
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().toggleItalic().run()}
                            className={`px-2 py-1 text-xs rounded border ${
                              ka2DescriptionEditor?.isActive('italic')
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            Italic
                          </button>
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().toggleBulletList().run()}
                            className={`px-2 py-1 text-xs rounded border ${
                              ka2DescriptionEditor?.isActive('bulletList')
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            • List
                          </button>
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().toggleOrderedList().run()}
                            className={`px-2 py-1 text-xs rounded border ${
                              ka2DescriptionEditor?.isActive('orderedList')
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            1. List
                          </button>
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().toggleBlockquote().run()}
                            className={`px-2 py-1 text-xs rounded border ${
                              ka2DescriptionEditor?.isActive('blockquote')
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            Quote
                          </button>
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().setParagraph().run()}
                            className="px-2 py-1 text-xs rounded border bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                          >
                            Clear
                          </button>
                        </div>

                        <div className="bg-white">
                          {ka2DescriptionEditor ? (
                            <EditorContent editor={ka2DescriptionEditor} />
                          ) : (
                            <div className="min-h-[140px] px-3 py-2 text-sm text-gray-500">
                              Yükleniyor...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Seviye</label>
                      <select
                        name="level"
                        defaultValue={editingItem?.level || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      >
                        <option value="">Seviye Seçin</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Süre</label>
                        <input
                          type="number"
                          name="duration"
                          id="courseDuration"
                          defaultValue={editingItem?.duration ? editingItem.duration.replace(' DAYS', '') : ''}
                          placeholder="5"
                          min="1"
                          max="30"
                          onChange={() => (window as any).updateDailyProgramFromDuration()}
                          onBlur={() => (window as any).updateDailyProgramFromDuration()}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                          required
                        />
                        <p className="text-xs text-gray-500 mt-1">Enter number of days (e.g.: 5). Daily program fields will be automatically generated.</p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Ücret</label>
                        <input
                          type="text"
                          name="fee"
                          defaultValue={editingItem?.fee || ''}
                          placeholder="80 EURO PER DAY"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Maksimum Katılımcı</label>
                        <input
                          type="number"
                          name="maxParticipants"
                          defaultValue={editingItem?.maxParticipants || ''}
                          min="0"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Mevcut Katılımcı</label>
                        <input
                          type="number"
                          name="currentParticipants"
                          defaultValue={editingItem?.currentParticipants || ''}
                          min="0"
                          onInput={(e) => {
                            const target = e.target as HTMLInputElement;
                            const maxInput = document.querySelector('input[name="maxParticipants"]') as HTMLInputElement;
                            const maxValue = parseInt(maxInput?.value || '0');
                            const currentValue = parseInt(target.value || '0');
                            if (currentValue > maxValue) {
                              target.value = maxValue.toString();
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Start Date (Opsiyonel)</label>
                        <input
                          type="date"
                          name="startDate"
                          defaultValue={editingItem?.startDate ? editingItem.startDate.split('T')[0] : ''}
                          onChange={(e) => {
                            const startDate = e.target.value;
                            const endDateInput = e.target.form?.querySelector('input[name="endDate"]') as HTMLInputElement;
                            if (endDateInput && endDateInput.value && startDate) {
                              if (new Date(startDate) > new Date(endDateInput.value)) {
                                toast.error('Başlangıç tarihi, bitiş tarihinden sonra olamaz!');
                                e.target.value = '';
                              }
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">End Date (Opsiyonel)</label>
                        <input
                          type="date"
                          name="endDate"
                          defaultValue={editingItem?.endDate ? editingItem.endDate.split('T')[0] : ''}
                          onChange={(e) => {
                            const endDate = e.target.value;
                            const startDateInput = e.target.form?.querySelector('input[name="startDate"]') as HTMLInputElement;
                            if (startDateInput && startDateInput.value && endDate) {
                              if (new Date(endDate) < new Date(startDateInput.value)) {
                                toast.error('Bitiş tarihi, başlangıç tarihinden önce olamaz!');
                                e.target.value = '';
                              }
                            }
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Onay Durumu</label>
                      <select
                        name="isApproved"
                        defaultValue={editingItem?.isApproved ? 'true' : 'false'}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      >
                        <option value="true">Onaylı (Devlet Onaylı)</option>
                        <option value="false">Onaylı Değil</option>
                      </select>
                    </div>
                    <div className="mb-4">
                      <div id="dailyProgramContainer">
                        {/* Dynamic daily program fields will be inserted here */}
                      </div>
                    </div>
                  </>
                )}

                {modalType === 'ka2project' && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Proje Başlığı</label>
                      <input
                        type="text"
                        name="title"
                        defaultValue={editingItem?.title || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Proje Türü</label>
                      <select
                        name="type"
                        defaultValue={editingItem?.type || ''}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      >
                        <option value="">Tür Seçin</option>
                        <optgroup label="KA210 - Small-scale Partnerships">
                          <option value="KA210-VET">KA210-VET (VET)</option>
                          <option value="KA210-YOU">KA210-YOU (Youth)</option>
                          <option value="KA210-HED">KA210-HED (Higher Education)</option>
                          <option value="KA210-ADU">KA210-ADU (Adult Education)</option>
                          <option value="KA210-SCH">KA210-SCH (School)</option>
                        </optgroup>
                        <optgroup label="KA220 - Large-scale Partnerships">
                          <option value="KA220-VET">KA220-VET (VET)</option>
                          <option value="KA220-YOU">KA220-YOU (Youth)</option>
                          <option value="KA220-HED">KA220-HED (Higher Education)</option>
                          <option value="KA220-ADU">KA220-ADU (Adult Education)</option>
                          <option value="KA220-SCH">KA220-SCH (School)</option>
                        </optgroup>
                      </select>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Açıklama</label>
                      {/* Hidden input so existing FormData -> handleSave pipeline keeps working */}
                      <input type="hidden" name="description" value={ka2DescriptionHtml} />

                      <div className="border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                        <div className="flex flex-wrap gap-2 px-2 py-2 border-b border-gray-200 bg-gray-50">
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().toggleBold().run()}
                            className={`px-2 py-1 text-xs rounded border ${
                              ka2DescriptionEditor?.isActive('bold')
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            Bold
                          </button>
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().toggleItalic().run()}
                            className={`px-2 py-1 text-xs rounded border ${
                              ka2DescriptionEditor?.isActive('italic')
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            Italic
                          </button>
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().toggleBulletList().run()}
                            className={`px-2 py-1 text-xs rounded border ${
                              ka2DescriptionEditor?.isActive('bulletList')
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            • List
                          </button>
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().toggleOrderedList().run()}
                            className={`px-2 py-1 text-xs rounded border ${
                              ka2DescriptionEditor?.isActive('orderedList')
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            1. List
                          </button>
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().toggleBlockquote().run()}
                            className={`px-2 py-1 text-xs rounded border ${
                              ka2DescriptionEditor?.isActive('blockquote')
                                ? 'bg-blue-600 text-white border-blue-600'
                                : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-100'
                            }`}
                          >
                            Quote
                          </button>
                          <button
                            type="button"
                            onClick={() => ka2DescriptionEditor?.chain().focus().setParagraph().run()}
                            className="px-2 py-1 text-xs rounded border bg-white text-gray-800 border-gray-300 hover:bg-gray-100"
                          >
                            Clear
                          </button>
                        </div>

                        <div className="bg-white">
                          {ka2DescriptionEditor ? (
                            <EditorContent editor={ka2DescriptionEditor} />
                          ) : (
                            <div className="min-h-[140px] px-3 py-2 text-sm text-gray-500">
                              Yükleniyor...
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Lokasyon</label>
                      <input
                        type="text"
                        name="location"
                        defaultValue={editingItem?.location || ''}
                        placeholder="Multiple Countries"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Hedef Grup</label>
                      <input
                        type="text"
                        name="targetGroup"
                        defaultValue={editingItem?.targetGroup || ''}
                        placeholder="VET students and teachers"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Partnerler</label>
                        <input
                          type="text"
                          name="partners"
                          defaultValue={editingItem?.partnerCountries || ''}
                          placeholder="Germany, Greece, Turkiye"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-900 mb-2">Proje Değeri</label>
                        <input
                          type="text"
                          name="projectValue"
                          defaultValue={editingItem?.budget || ''}
                          placeholder="60.000 Euro"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                          required
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Proje Hedefleri</label>
                      <textarea
                        name="objectives"
                        defaultValue={editingItem?.objectives || ''}
                        rows={3}
                        placeholder="To improve VET quality and enhance employability skills"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-900 mb-2">Proje Aktiviteleri (Her satıra bir aktivite)</label>
                      <textarea
                        name="activities"
                        defaultValue={editingItem?.activities?.join('\n') || ''}
                        rows={4}
                        placeholder="Local Training Workshops&#10;International Training Workshop&#10;Online Platform Development"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-600 text-black"
                        required
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingItem(null);
                      setSelectedImages([]);
                      setImagePreviews([]);
                      setFormKey(prev => prev + 1); // Form'u reset et
                      setKa2DescriptionHtml('');
                      ka2DescriptionEditor?.commands.setContent('', { emitUpdate: false });
                      // Refresh data when modal is closed
                      fetchData();
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-900 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  >
                    {editingItem ? 'Güncelle' : 'Ekle'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* İletişim Bilgileri Tab */}
      {activeTab === 'contact' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">İletişim Bilgileri Yönetimi</h2>
            <p className="text-sm text-gray-600 mt-1">Anasayfadaki footer'da görünen iletişim bilgilerini düzenleyin</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Adres Bilgileri */}
            <div className="group relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm border border-blue-200 p-6 hover:shadow-md transition-all duration-200">
              <button
                onClick={() => setShowContactModal(true)}
                className="absolute top-4 right-4 p-2 text-blue-600 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{contactInfo.address.title}</h3>
              </div>
              <div className="space-y-2">
                {(() => {
                  try {
                    const parsed = JSON.parse(contactInfo.address.details || '[]');
                    return Array.isArray(parsed) ? parsed : [];
                  } catch {
                    return [];
                  }
                })().map((detail: string, index: number) => (
                  <p key={index} className="text-gray-700 font-medium text-sm leading-relaxed flex items-start">
                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                    {detail}
                  </p>
                ))}
              </div>
            </div>

            {/* Telefon Bilgileri */}
            <div className="group relative bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm border border-green-200 p-6 hover:shadow-md transition-all duration-200">
              <button
                onClick={() => setShowContactModal(true)}
                className="absolute top-4 right-4 p-2 text-green-600 hover:text-green-700 hover:bg-green-100 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{contactInfo.phone.title}</h3>
              </div>
              <div className="space-y-2">
                {(() => {
                  try {
                    const parsed = JSON.parse(contactInfo.phone.details || '[]');
                    return Array.isArray(parsed) ? parsed : [];
                  } catch {
                    return [];
                  }
                })().map((detail: string, index: number) => (
                  <p key={index} className="text-gray-700 font-medium text-sm leading-relaxed flex items-center">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-2 flex-shrink-0"></span>
                    <a href={`tel:${detail}`} className="hover:text-green-600 transition-colors">{detail}</a>
                  </p>
                ))}
              </div>
            </div>

            {/* E-posta Bilgileri */}
            <div className="group relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm border border-purple-200 p-6 hover:shadow-md transition-all duration-200">
              <button
                onClick={() => setShowContactModal(true)}
                className="absolute top-4 right-4 p-2 text-purple-600 hover:text-purple-700 hover:bg-purple-100 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">{contactInfo.email.title}</h3>
              </div>
              <div className="space-y-2">
                {(() => {
                  try {
                    const parsed = JSON.parse(contactInfo.email.details || '[]');
                    return Array.isArray(parsed) ? parsed : [];
                  } catch {
                    return [];
                  }
                })().map((detail: string, index: number) => (
                  <p key={index} className="text-gray-700 font-medium text-sm leading-relaxed flex items-center">
                    <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mr-2 flex-shrink-0"></span>
                    <a href={`mailto:${detail}`} className="hover:text-purple-600 transition-colors">{detail}</a>
                  </p>
                ))}
              </div>
            </div>

            {/* WhatsApp Widget */}
            <div className="group relative bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl shadow-sm border border-emerald-200 p-6 hover:shadow-md transition-all duration-200">
              <button
                onClick={() => setShowWhatsAppModal(true)}
                className="absolute top-4 right-4 p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors duration-200 opacity-0 group-hover:opacity-100"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center mr-3 shadow-sm">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900">WhatsApp Widget</h3>
              </div>
              <div className="space-y-2">
                <p className="text-gray-700 font-medium text-sm leading-relaxed flex items-center">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-2 flex-shrink-0"></span>
                  {whatsappSettings.phoneNumber}
                </p>
                <p className="text-gray-600 text-xs mt-2">
                  {whatsappSettings.isEnabled ? '✅ Active' : '❌ Disabled'}
                </p>
              </div>
            </div>
            </div>
          </div>
        </div>
      )}

      {/* İletişim Bilgileri Modal */}
      {showContactModal && (
      <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full mx-4 max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">İletişim Bilgilerini Düzenle</h3>
                <p className="text-gray-600 mt-1">Şirket iletişim bilgilerini güncelleyin</p>
              </div>
              <button
                onClick={() => setShowContactModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8">
            <form onSubmit={async (e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const data = Object.fromEntries(formData.entries());
              await handleContactSave(data);
            }}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Adres Bilgileri */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Adres Bilgileri</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                      <input
                        type="text"
                        name="addressTitle"
                        defaultValue={contactInfo.address.title}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Adres Detayları</label>
                      <textarea
                        name="addressDetails"
                        defaultValue={(() => {
                          try {
                            const parsed = JSON.parse(contactInfo.address.details || '[]');
                            return Array.isArray(parsed) ? parsed.join('\n') : '';
                          } catch {
                            return '';
                          }
                        })()}
                        rows={4}
                        placeholder="Her satıra bir adres satırı yazın..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Telefon Bilgileri */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">Telefon Bilgileri</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                      <input
                        type="text"
                        name="phoneTitle"
                        defaultValue={contactInfo.phone.title}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Telefon Numaraları</label>
                      <textarea
                        name="phoneDetails"
                        defaultValue={(() => {
                          try {
                            const parsed = JSON.parse(contactInfo.phone.details || '[]');
                            return Array.isArray(parsed) ? parsed.join('\n') : '';
                          } catch {
                            return '';
                          }
                        })()}
                        rows={4}
                        placeholder="Her satıra bir telefon numarası yazın..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* E-posta Bilgileri */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h4 className="text-lg font-semibold text-gray-900">E-posta Bilgileri</h4>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Başlık</label>
                      <input
                        type="text"
                        name="emailTitle"
                        defaultValue={contactInfo.email.title}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">E-posta Adresleri</label>
                      <textarea
                        name="emailDetails"
                        defaultValue={(() => {
                          try {
                            const parsed = JSON.parse(contactInfo.email.details || '[]');
                            return Array.isArray(parsed) ? parsed.join('\n') : '';
                          } catch {
                            return '';
                          }
                        })()}
                        rows={4}
                        placeholder="Her satıra bir e-posta adresi yazın..."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white resize-none"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-8 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setShowContactModal(false)}
                  disabled={isContactSaving}
                  className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  disabled={isContactSaving}
                  className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center">
                    {isContactSaving ? (
                      <svg className="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                    {isContactSaving ? 'Güncelleniyor...' : 'Güncelle'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      )}

      {/* Şifre Değiştirme Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/5 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-red-50 to-orange-50 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Şifre Değiştir</h3>
                  <p className="text-gray-600 mt-1">Güvenliğiniz için şifrenizi güncelleyin</p>
                </div>
                <button
                  onClick={() => setShowPasswordModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-white rounded-lg"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <form onSubmit={handlePasswordChange}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Mevcut Şifre</label>
                    <input
                      type="password"
                      name="currentPassword"
                      placeholder="Mevcut şifrenizi girin"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre</label>
                    <input
                      type="password"
                      name="newPassword"
                      placeholder="Yeni şifrenizi girin"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      En az 8 karakter, 1 büyük harf, 1 küçük harf, 1 rakam ve 1 özel karakter içermelidir
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Yeni Şifre (Tekrar)</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Yeni şifrenizi tekrar girin"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent placeholder-gray-500 text-gray-900 bg-white"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200 mt-6">
                  <button
                    type="button"
                    onClick={() => setShowPasswordModal(false)}
                    className="px-6 py-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-600 to-orange-600 rounded-lg hover:from-red-700 hover:to-orange-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1721 9z" />
                      </svg>
                      Şifre Değiştir
                    </span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Meeting Management Modal */}
      {showMeetingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-900">Meeting Yönetimi</h2>
              <button
                onClick={() => {
                  setShowMeetingModal(false);
                  setCurrentProjectMeetings([]);
                  setSelectedProjectId(null);
                  setEditingMeeting(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Add Meeting Button */}
              {!editingMeeting && (
                <button
                  onClick={handleAddMeeting}
                  className="w-full mb-6 flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Yeni Meeting Ekle
                </button>
              )}

              {/* Meeting Form */}
              {editingMeeting && (
                <form onSubmit={handleSaveMeeting} className="mb-6 bg-purple-50 p-6 rounded-lg border border-purple-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingMeeting.id ? 'Meeting Düzenle' : 'Yeni Meeting'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Başlık *</label>
                      <input
                        type="text"
                        name="meetingTitle"
                        defaultValue={editingMeeting.title}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Açıklama *</label>
                      <textarea
                        name="meetingDescription"
                        defaultValue={editingMeeting.description}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Fotoğraflar</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMeetingImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-gray-900"
                      />
                      
                      {/* Image Previews */}
                      {meetingImagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-4 gap-4">
                          {meetingImagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveMeetingImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingMeeting(null);
                        setMeetingImages([]);
                        setMeetingImagePreviews([]);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700"
                    >
                      {editingMeeting.id ? 'Güncelle' : 'Ekle'}
                    </button>
                  </div>
                </form>
              )}

              {/* Meetings List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Mevcut Meetingler ({currentProjectMeetings.length})</h3>
                {currentProjectMeetings.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-gray-600">Henüz meeting eklenmemiş</p>
                  </div>
                ) : (
                  currentProjectMeetings.map((meeting) => (
                    <div key={meeting.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{meeting.title}</h4>
                          <p className="text-gray-600 mb-3 line-clamp-2">{meeting.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {meeting.images?.length || 0} Fotoğraf
                            </span>
                            <span>
                              {new Date(meeting.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEditMeeting(meeting)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteMeeting(meeting.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Meeting Images */}
                      {meeting.images && meeting.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-6 gap-2">
                          {meeting.images.slice(0, 6).map((image: string, idx: number) => (
                            <img
                              key={idx}
                              src={image.startsWith('data:') || image.startsWith('http') 
                                ? image 
                                : `${BACKEND_BASE_URL}${image}`}
                              alt={`Meeting ${idx + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dissemination Management Modal */}
      {showDisseminationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center z-10">
              <h2 className="text-2xl font-bold text-gray-900">Dissemination Yönetimi</h2>
              <button
                onClick={() => {
                  setShowDisseminationModal(false);
                  setCurrentProjectDisseminations([]);
                  setSelectedDisseminationProjectId(null);
                  setEditingDissemination(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-6">
              {/* Add Dissemination Button */}
              {!editingDissemination && (
                <button
                  onClick={handleAddDissemination}
                  className="w-full mb-6 flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-green-600 to-teal-600 rounded-lg hover:from-green-700 hover:to-teal-700 transition-all duration-200"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Yeni Dissemination Ekle
                </button>
              )}

              {/* Dissemination Form */}
              {editingDissemination && (
                <form onSubmit={handleSaveDissemination} className="mb-6 bg-green-50 p-6 rounded-lg border border-green-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    {editingDissemination.id ? 'Dissemination Düzenle' : 'Yeni Dissemination'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Başlık *</label>
                      <input
                        type="text"
                        name="disseminationTitle"
                        defaultValue={editingDissemination.title}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Açıklama *</label>
                      <textarea
                        name="disseminationDescription"
                        defaultValue={editingDissemination.description}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">Fotoğraflar</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleDisseminationImageChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
                      />
                      
                      {/* Image Previews */}
                      {disseminationImagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-4 gap-4">
                          {disseminationImagePreviews.map((preview, index) => (
                            <div key={index} className="relative group">
                              <img
                                src={preview}
                                alt={'Preview ' + (index + 1)}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveDisseminationImage(index)}
                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingDissemination(null);
                        setDisseminationImages([]);
                        setDisseminationImagePreviews([]);
                      }}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                    >
                      {editingDissemination.id ? 'Güncelle' : 'Ekle'}
                    </button>
                  </div>
                </form>
              )}

              {/* Disseminations List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Mevcut Disseminationlar ({currentProjectDisseminations.length})</h3>
                {currentProjectDisseminations.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                    </svg>
                    <p className="text-gray-600">Henüz dissemination eklenmemiş</p>
                  </div>
                ) : (
                  currentProjectDisseminations.map((dissemination) => (
                    <div key={dissemination.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">{dissemination.title}</h4>
                          <p className="text-gray-600 mb-3 line-clamp-2">{dissemination.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              {dissemination.images?.length || 0} Fotoğraf
                            </span>
                            <span>
                              {new Date(dissemination.createdAt).toLocaleDateString('tr-TR')}
                            </span>
                          </div>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleEditDissemination(dissemination)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteDissemination(dissemination.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      {/* Dissemination Images */}
                      {dissemination.images && dissemination.images.length > 0 && (
                        <div className="mt-4 grid grid-cols-6 gap-2">
                          {dissemination.images.slice(0, 6).map((image: string, idx: number) => (
                            <img
                              key={idx}
                              src={image.startsWith('data:') || image.startsWith('http') 
                                ? image 
                                : `${BACKEND_BASE_URL}${image}`}
                              alt={`Dissemination ${idx + 1}`}
                              className="w-full h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Settings Modal */}
      {showWhatsAppModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-200 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <svg className="w-6 h-6 mr-2 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  WhatsApp Widget Settings
                </h2>
                <button
                  onClick={() => setShowWhatsAppModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveWhatsAppSettings} className="p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Phone Number (with country code)
                  </label>
                  <input
                    type="text"
                    name="phoneNumber"
                    defaultValue={whatsappSettings.phoneNumber}
                    placeholder="+905555555555"
                    className="w-full px-4 py-3 text-gray-900 placeholder:text-gray-500 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                    required
                  />
                  <p className="text-xs text-gray-600 mt-2 font-medium">Format: +countrycode + number (no spaces)</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Welcome Message
                  </label>
                  <textarea
                    name="welcomeMessage"
                    defaultValue={whatsappSettings.welcomeMessage}
                    placeholder="Hello! How can we help you?"
                    rows={3}
                    className="w-full px-4 py-3 text-gray-900 placeholder:text-gray-500 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all resize-none"
                    required
                  />
                </div>

                <div className="flex items-center bg-emerald-50 p-4 rounded-lg border border-emerald-200">
                  <input
                    type="checkbox"
                    name="isEnabled"
                    id="isEnabled"
                    defaultChecked={whatsappSettings.isEnabled}
                    className="w-5 h-5 text-emerald-600 border-2 border-gray-300 rounded focus:ring-2 focus:ring-emerald-500"
                  />
                  <label htmlFor="isEnabled" className="ml-3 text-sm font-semibold text-gray-900 cursor-pointer">
                    Enable WhatsApp Widget
                  </label>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowWhatsAppModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-800 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-semibold shadow-md hover:shadow-lg"
                >
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modern Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" onClick={() => setShowConfirmModal(false)}>
          {/* Backdrop with blur effect */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>
          
          {/* Modal Content */}
          <div 
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with icon */}
            <div className={`p-6 rounded-t-2xl ${
              confirmConfig.type === 'danger' ? 'bg-gradient-to-r from-red-500 to-red-600' :
              confirmConfig.type === 'warning' ? 'bg-gradient-to-r from-yellow-500 to-yellow-600' :
              'bg-gradient-to-r from-blue-500 to-blue-600'
            }`}>
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                  {confirmConfig.type === 'danger' ? (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  ) : confirmConfig.type === 'warning' ? (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  ) : (
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  )}
                </div>
                <h3 className="text-xl font-bold text-white">{confirmConfig.title}</h3>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <p className="text-gray-700 text-base leading-relaxed">
                {confirmConfig.message}
              </p>
            </div>

            {/* Footer with buttons */}
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
