// API client for fetching data from NestJS backend
const API_BASE_URL = process.env.API_URL || 'http://localhost:3000/api';
const ASSET_URL = process.env.ASSET_URL || 'https://rus-assets.fra1.cdn.digitaloceanspaces.com';
const BASE_URL = process.env.BASE_URL || 'https://link.renturstatus.com';

export interface Campaign {
  id: string;
  title: string;
  description?: string;
  content?: string;
  thumbnail?: string;
  option?: string;
  slug?: string;
}

export interface Product {
  id: string;
  title: string;
  description?: string;
  image?: string;
  price?: number;
  slug?: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description?: string;
  image?: string;
  date?: string;
}

export interface SocialGood {
  id: string;
  title: string;
  description?: string;
  image?: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  photo?: string;
}

export interface Voucher {
  id: string;
  title: string;
  description?: string;
  image?: string;
}

export interface Coupon {
  id: string;
  slug?: string;
  title?: string;
  description?: string;
  image?: string;
}

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

async function fetchFromApi<T>(endpoint: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data for link pages
    });

    if (!response.ok) {
      return null;
    }

    const result: ApiResponse<T> = await response.json();

    if (result.success && result.data) {
      return result.data;
    }

    return null;
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

export async function getCampaign(idOrSlug: string): Promise<Campaign | null> {
  // Try by ID first, then by slug
  let campaign = await fetchFromApi<Campaign>(`/campaign/${idOrSlug}`);

  if (!campaign) {
    campaign = await fetchFromApi<Campaign>(`/campaign/slug/${idOrSlug}`);
  }

  return campaign;
}

export async function getProduct(idOrSlug: string): Promise<Product | null> {
  let product = await fetchFromApi<Product>(`/product/${idOrSlug}`);

  if (!product) {
    product = await fetchFromApi<Product>(`/product/slug/${idOrSlug}`);
  }

  return product;
}

export async function getEvent(slug: string): Promise<Event | null> {
  return fetchFromApi<Event>(`/event/${slug}`);
}

export async function getSocialGood(id: string): Promise<SocialGood | null> {
  return fetchFromApi<SocialGood>(`/socialgood/${id}`);
}

export async function getUserBySlug(slug: string): Promise<User | null> {
  return fetchFromApi<User>(`/user/slug/${slug}`);
}

export async function getVoucher(id: string): Promise<Voucher | null> {
  return fetchFromApi<Voucher>(`/voucher/${id}`);
}

export async function getCoupon(idOrSlug: string): Promise<Coupon | null> {
  let coupon = await fetchFromApi<Coupon>(`/coupon/${idOrSlug}`);

  if (!coupon) {
    coupon = await fetchFromApi<Coupon>(`/coupon/slug/${idOrSlug}`);
  }

  return coupon;
}

export async function trackReferralClick(refCode: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/campaign/referral/${refCode}/click`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    return response.ok;
  } catch (error) {
    console.error(`Error tracking referral click:`, error);
    return false;
  }
}

export { ASSET_URL, BASE_URL };

