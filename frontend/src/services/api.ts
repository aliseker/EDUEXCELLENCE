class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = 'https://localhost:7166/api';
    // Get token from localStorage on initialization
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
    }
  }

  setToken(token: string) {
    this.token = token;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', token);
    }
  }

  clearToken() {
    this.token = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('adminData');
      localStorage.removeItem('adminLoggedIn');
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Her istekte token'ı localStorage'dan al
    const currentToken = typeof window !== 'undefined' 
      ? localStorage.getItem('accessToken') 
      : this.token;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(currentToken && { Authorization: `Bearer ${currentToken}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        // Rate limiting hatası için özel mesaj
        if (response.status === 429) {
          throw new Error('Çok fazla deneme yaptınız. 15 dakika sonra tekrar deneyin.');
        }
        
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      // 204 No Content veya boş response için boş obje döndür
      if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    return this.request<{
      token: string;
      expiresAt: string;
      admin: {
        id: number;
        email: string;
        firstName: string;
        lastName: string;
        phoneNumber?: string;
        isSuperAdmin: boolean;
        lastLoginAt?: string;
      };
    }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async validateToken(token: string) {
    return this.request<{ valid: boolean; admin: any }>('/auth/validate', {
      method: 'POST',
      body: JSON.stringify(token),
    });
  }

  async logout(token: string) {
    return this.request('/auth/logout', {
      method: 'POST',
      body: JSON.stringify(token),
    });
  }

  // Course endpoints
  async getCourses() {
    return this.request<Array<{
      id: number;
      title: string;
      description: string;
      fee: string;
      duration: string;
      startDate: string;
      endDate: string;
      location: string;
      category: string;
      level: string;
      maxParticipants: number;
      currentParticipants: number;
      isApproved: boolean;
      imageUrl?: string;
      learningOutcomes: string[];
      dailyPrograms: string[];
      createdAt: string;
      updatedAt?: string;
    }>>('/courses');
  }

  async getCourseById(id: number) {
    return this.request(`/courses/${id}`);
  }

  async getUpcomingCourses() {
    return this.request('/courses/upcoming');
  }

  async getCoursesByCategory(category: string) {
    return this.request(`/courses/category/${category}`);
  }

  async getApprovedCourses() {
    return this.request('/courses/approved');
  }

  async createCourse(courseData: any) {
    return this.request('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  }

  async updateCourse(id: number, courseData: any) {
    return this.request(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...courseData, id }),
    });
  }

  async deleteCourse(id: number) {
    return this.request(`/courses/${id}`, {
      method: 'DELETE',
    });
  }

  // Blog endpoints
  async getBlogs() {
    return this.request<Array<{
      id: number;
      title: string;
      excerpt: string;
      fullContent: string;
      category: string;
      type: string;
      author: string;
      imageUrl?: string;
      readTime: number;
      isFeatured: boolean;
      publishedAt: string;
      images: string[];
      createdAt: string;
      updatedAt?: string;
    }>>('/blogs');
  }

  async getBlogById(id: number) {
    return this.request(`/blogs/${id}`);
  }

  async getBlogsByType(type: string) {
    return this.request(`/blogs/type/${type}`);
  }

  async getFeaturedBlogs() {
    return this.request('/blogs/featured');
  }

  async getBlogsByCategory(category: string) {
    return this.request(`/blogs/category/${category}`);
  }

  async createBlog(blogData: any) {
    return this.request('/blogs', {
      method: 'POST',
      body: JSON.stringify(blogData),
    });
  }

  async updateBlog(id: number, blogData: any) {
    return this.request(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...blogData, id }),
    });
  }

  async deleteBlog(id: number) {
    return this.request(`/blogs/${id}`, {
      method: 'DELETE',
    });
  }

  // Hero endpoints
  async getActiveHero() {
    return this.request<{
      id: number;
      title: string;
      description?: string;
      items: Array<{
        id: number;
        text: string;
        heroId: number;
      }>;
      createdAt: string;
      updatedAt: string;
    }>('/hero/active');
  }

  async getHeroes() {
    return this.request<Array<{
      id: number;
      title: string;
      description?: string;
      items: Array<{
        id: number;
        text: string;
        heroId: number;
      }>;
      createdAt: string;
      updatedAt: string;
    }>>('/hero');
  }

  async getHeroById(id: number) {
    return this.request(`/hero/${id}`);
  }

  async createHero(heroData: {
    title: string;
    description?: string;
    items: Array<{ text: string }>;
    isActive?: boolean;
  }) {
    return this.request('/hero', {
      method: 'POST',
      body: JSON.stringify(heroData),
    });
  }

  async updateHero(id: number, heroData: {
    id: number;
    title: string;
    description?: string;
    items: Array<{ id: number; text: string }>;
  }) {
    return this.request(`/hero/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ...heroData, id }),
    });
  }

  async deleteHero(id: number) {
    return this.request(`/hero/${id}`, {
      method: 'DELETE',
    });
  }

  async setActiveHero(id: number) {
    return this.request(`/hero/${id}/activate`, {
      method: 'POST',
    });
  }

  // Health check
  async healthCheck() {
    return this.request<{
      status: string;
      message: string;
      timestamp: string;
    }>('/health');
  }
}

export const apiService = new ApiService();
export default apiService;
