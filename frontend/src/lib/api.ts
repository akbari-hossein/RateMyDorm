import type {
  ApiError,
  AuthResponse,
  Building,
  Comment,
  Student,
  University,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
const MEDIA_BASE = API_URL.replace(/\/api\/?$/, "");

export function getMediaUrl(path: string | null): string | null {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${MEDIA_BASE}${path.startsWith("/") ? path : `/${path}`}`;
}

class ApiClient {
  private token: string | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    path: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: Record<string, string> = {
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    if (
      options.body &&
      !(options.body instanceof FormData) &&
      !headers["Content-Type"]
    ) {
      headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      let error: ApiError = { detail: response.statusText };
      try {
        error = await response.json();
      } catch {
        // response body may not be JSON
      }
      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  }

  authTelegram(initData: string) {
    return this.request<AuthResponse>("/students/auth/telegram/", {
      method: "POST",
      body: JSON.stringify({ initData }),
    });
  }

  getUniversities() {
    return this.request<University[]>("/universities/");
  }

  getUniversity(id: number) {
    return this.request<University>(`/universities/${id}/`);
  }

  getBuildings() {
    return this.request<Building[]>("/buildings/");
  }

  getBuilding(id: number) {
    return this.request<Building>(`/buildings/${id}/`);
  }

  getStudent(id: number) {
    return this.request<Student>(`/students/${id}/`);
  }

  getComments() {
    return this.request<Comment[]>("/comments/");
  }

  getComment(id: number) {
    return this.request<Comment>(`/comments/${id}/`);
  }

  updateStudent(id: number, data: Partial<Student>) {
    return this.request<Student>(`/students/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  createComment(data: {
    content: string;
    building_id: number;
    rating: number;
    image?: File;
  }) {
    const formData = new FormData();
    formData.append("content", data.content);
    formData.append("building_id", String(data.building_id));
    formData.append("rating", String(data.rating));
    if (data.image) {
      formData.append("image", data.image);
    }

    return this.request<Comment>("/comments/create/", {
      method: "POST",
      body: formData,
    });
  }
}

export const api = new ApiClient();

export function formatApiError(error: unknown): string {
  if (!error || typeof error !== "object") {
    return "Something went wrong. Please try again.";
  }

  const err = error as ApiError;

  if (typeof err.error === "string") return err.error;
  if (typeof err.detail === "string") return err.detail;

  const messages: string[] = [];
  for (const [key, value] of Object.entries(err)) {
    if (Array.isArray(value)) {
      messages.push(`${key}: ${value.join(", ")}`);
    } else if (typeof value === "string") {
      messages.push(value);
    }
  }

  return messages.length > 0
    ? messages.join(". ")
    : "Something went wrong. Please try again.";
}

export function averageRating(comments: Comment[]): number | null {
  if (comments.length === 0) return null;
  const sum = comments.reduce((acc, c) => acc + c.rating, 0);
  return Math.round((sum / comments.length) * 10) / 10;
}

export function genderLabel(gender: Building["gender"]): string {
  return gender === "F" ? "Female" : "Male";
}

export function displayName(student: Student): string {
  const fullName = [student.first_name, student.last_name]
    .filter(Boolean)
    .join(" ");
  return fullName || student.username || "Student";
}
