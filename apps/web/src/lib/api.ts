import {
    RegisterCreatorRequest,
    LoginRequest,
    CreatorProfile,
    CreatorAnalytics,
    CreateTierRequest
} from '@veil/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

async function fetcher<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error?.message || 'Something went wrong');
    }

    return data.data;
}

export const api = {
    auth: {
        register: (data: RegisterCreatorRequest) =>
            fetcher<{ token: string; creator: CreatorProfile }>('/creators/register', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        login: (data: LoginRequest) =>
            fetcher<{ token: string; creator: CreatorProfile }>('/creators/login', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
    },
    creators: {
        getAll: () => fetcher<CreatorProfile[]>('/creators'),
        getProfile: (username: string) =>
            fetcher<CreatorProfile>(`/creators/${username}`),
        getStats: (id: string) =>
            fetcher<CreatorAnalytics>(`/creators/${id}/stats`),
        createTier: (data: CreateTierRequest) =>
            fetcher<any>('/creators/tiers', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
    },
    payments: {
        initiate: (data: { creatorId: string; tierId: string }) =>
            fetcher<any>('/payments/initiate', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        verify: (data: { commitment: string; creatorId: string }) =>
            fetcher<any>('/payments/verify', {
                method: 'POST',
                body: JSON.stringify(data),
            }),
        getContent: (commitment: string, creatorId: string) =>
            fetcher<any[]>(`/payments/content/${commitment}?creatorId=${creatorId}`),
        proveAccess: (commitment: string, contentId: string, creatorId: string) =>
            fetcher<any>(`/payments/access/${commitment}`, {
                method: 'POST',
                body: JSON.stringify({ contentId, creatorId }),
            }),
    },
    content: {
        list: (params?: { creatorId?: string; type?: string; search?: string }) => {
            const query = new URLSearchParams(params as any).toString();
            return fetcher<any[]>(`/content?${query}`);
        },
        get: (id: string) => fetcher<any>(`/content/${id}`),
    },
};
