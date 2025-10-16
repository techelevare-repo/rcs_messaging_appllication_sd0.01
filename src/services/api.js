const API_BASE_URL = 'http://localhost:5001/api';

class VisionAPI {
    constructor() {
        this.token = localStorage.getItem('vision_token');
    }

    setToken(token) {
        this.token = token;
        localStorage.setItem('vision_token', token);
    }

    removeToken() {
        this.token = null;
        localStorage.removeItem('vision_token');
    }

    // Update token from localStorage on each request
    updateToken() {
        this.token = localStorage.getItem('vision_token');
    }

    async request(endpoint, options = {}) {
        // Update token from localStorage before each request
        this.updateToken();

        const url = `${API_BASE_URL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        if (this.token) {
            config.headers.Authorization = `Bearer ${this.token}`;
        }

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    // Token invalid or expired: clear and propagate
                    this.removeToken();
                }
                throw new Error(data.message || 'Request failed');
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Add HTTP method convenience functions
    async get(endpoint) {
        return this.request(endpoint, { method: 'GET' });
    }

    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    }

    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    }

    async delete(endpoint) {
        return this.request(endpoint, { method: 'DELETE' });
    }

    // Authentication methods
    async register(userData) {
        return this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify(userData),
        });
    }

    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });

        if (response.success && response.token) {
            this.setToken(response.token);
        }

        return response;
    }

    async getCurrentUser() {
        return this.request('/auth/me');
    }

    logout() {
        this.removeToken();
    }

    // Vision processing methods
    async detectLicensePlate(imageFile) {
        // Update token from localStorage before request
        this.updateToken();

        const formData = new FormData();
        formData.append('image', imageFile);

        const headers = {};
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const response = await fetch(`${API_BASE_URL}/vision/license-plate`, {
            method: 'POST',
            headers: headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Detection failed');
        }

        return response.json();
    }

    async detectGesture(imageFile) {
        this.updateToken();
        const formData = new FormData();
        formData.append('image', imageFile);

        const headers = {};
        if (this.token) headers['Authorization'] = `Bearer ${this.token}`;

        const response = await fetch(`${API_BASE_URL}/vision/gesture`, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 401) this.removeToken();
            throw new Error(errorData.message || 'Gesture detection failed');
        }

        return response.json();
    }

    async getDetectionHistory(modelType = null) {
        const params = modelType ? `?modelType=${modelType}` : '';
        return this.request(`/vision/history${params}`);
    }

    async getDashboardStats() {
        return this.request('/vision/stats');
    }

    // File upload method
    async uploadImage(imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await fetch(`${API_BASE_URL}/upload/image`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Upload failed');
        }

        return response.json();
    }
}

export default new VisionAPI();