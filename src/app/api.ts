/* eslint-disable no-useless-catch */
import axios, { type  AxiosInstance, type AxiosResponse } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "http://localhost:8000/api/v1",
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
})

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: Record<string, string[]>;
  meta: {
    pagination: {
      count: number;
      current_page: number;
      links: {
        first: string;
        last: string;
        next: string | null;
        prev: string | null;
      };
      per_page: number;
      total: number;
      total_pages: number;
    };
    status: number;
    timestamp: string;
  };
}

export interface ApiError {
    message?: string;
    success?: boolean;
    data?: null;
    errors?: Record<string, string[]>;
    meta?: {
        timestamp: string;
        status: number;
    };
}

// Request interceptor
api.interceptors.request.use((config) => {
    const AccessToken = localStorage.getItem("token") ?? sessionStorage.getItem("token");
    if (AccessToken) {
        config.headers.Authorization = `Bearer ${AccessToken}`;
    }
    return config;
});

// Response interceptor
api.interceptors.response.use(
    (response) => response, 
    (error) => {
        if (!error.response) throw error;

        const { status, data } = error.response as { status: number; data: ApiError };

        if (status === 401) {
            localStorage.removeItem('token');
        }

        throw data;
    }
);

// Unified data fetching functions
export const getData = async (url: string) => {
    const response = await api.get(url);
    return response.data;
};
// Unified data fetching functions
export const getDatawithMetaData = async <T>(url: string): Promise<ApiResponse<T>> => {
    const response = await api.get<ApiResponse<T>>(url);
    return response.data;
};

api.interceptors.request.use((config) => {
    const AccessToken = localStorage.getItem("token") ?? sessionStorage.getItem("token");
    if (AccessToken) {
        config.headers.Authorization = `Bearer ${AccessToken}`;
    }
    return config;
});

export const postData = async <T>(url: string, data: object): Promise<AxiosResponse<T>> => {
   
    
    const response = await api.post(url, data); // Use api instead of axios
    return response.data;
};
export const postBlobData = async <T>(url: string, data: object): Promise<AxiosResponse<T>> => {
    const response = await api.post(url, data, {
        responseType: 'blob'  // Add blob response type
    });
    return response;
};  
export const patchData = async <T>(url: string, data?: object): Promise<AxiosResponse<T>> => {
    const response = await api.patch(url, data);
    return response;
};
export const postLogin = async <T>(url: string, data: object): Promise<AxiosResponse<T>> => {
   
    
    const response = await axios.post(url, data); // Use api instead of axios
    return response;
};
export const putData = async <T>(url: string, data: object): Promise<AxiosResponse<T>> => {
    
    
    
        const response = await api.put(url, data); // Use the api instance for PUT requests
        return response;

};
export const deleteData = async <T>(url: string): Promise<AxiosResponse<T>> => {
  
        const response = await api.delete(url);  // Use the api instance for DELETE requests
        return response;
 
};


export interface ApiError {
    message?: string;
    success?: boolean;
    data?: null;
    errors?: Record<string, string[]>;
    meta?: {
        timestamp: string;
        status: number;
    };
}
export const uploadMultimedia = async <T>(url: string, data: object): Promise<AxiosResponse<T>> => {
  

   
    // Retrieve the token from localStorage or sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('Bearer Token:', token);
    try {
        const response = await axios.post(url, data, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            },
        });
        return response;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Error response:', error.response);
        } else {
            console.error('Unexpected error:', error);
        }
        throw error; // Re-throw the error if you want to handle it later
    }

 
};
export const updateMultimedia = async <T>(url: string, data: FormData): Promise<AxiosResponse<T>> => {
    // Retrieve the token from localStorage or sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }
    console.log('Bearer Token:', token);
  
    try {
      const response = await axios.post(url, data, {
        headers: {
            'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
      });
      return response;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error('Error response:', {
          status: error.response?.status,
          data: error.response?.data,
        });
      } else {
        console.error('Unexpected error:', error);
      }
      throw error; // Re-throw the error if you want to handle it later
    }
  };

  export const getLogout = async (url:string) => {
    localStorage.removeItem('userData');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    sessionStorage.removeItem('userData');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('username');
 
  try {
    const response = await api.get(url);
    return response;
} catch (error) {
    throw error;  
}
}
