import { api } from '../client';
import { ApiResponse } from '../types';

export type FeedbackType = 'Bug' | 'Feature' | 'Improvement' | 'Question' | 'Other';
export type FeedbackPriority = 'Low' | 'Medium' | 'High' | 'Critical';
export type FeedbackStatus = 'Open' | 'InProgress' | 'Resolved' | 'Closed' | 'Rejected';

export interface FeedbackCreateInput {
  Title: string;
  Description?: string;
  Type?: FeedbackType;
  Priority?: FeedbackPriority;
  PageUrl?: string;
  UserAgent?: string;
  Screenshots?: File[];
}

export interface FeedbackUpdateInput {
  Id: number;
  Title?: string;
  Description?: string | null;
  Type?: FeedbackType;
  Priority?: FeedbackPriority;
  Status?: FeedbackStatus;
  AdminNotes?: string;
}

export const feedbackService = {
  create: async (input: FeedbackCreateInput): Promise<any> => {
    const formData = new FormData();
    formData.append('Title', input.Title);
    if (input.Description) formData.append('Description', input.Description);
    if (input.Type) formData.append('Type', input.Type);
    if (input.Priority) formData.append('Priority', input.Priority);
    if (input.PageUrl) formData.append('PageUrl', input.PageUrl);
    if (input.UserAgent) formData.append('UserAgent', input.UserAgent);
    if (input.Screenshots && input.Screenshots.length > 0) {
      input.Screenshots.slice(0, 5).forEach((file) => {
        formData.append('Screenshots', file);
      });
    }

    const response = await api.post<ApiResponse<any>>('/Feedbacks', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data?.data ?? response.data;
  },

  update: async (input: FeedbackUpdateInput): Promise<any> => {
    const response = await api.put<ApiResponse<any>>('/Feedbacks', input);
    return response.data?.data ?? response.data;
  },
};
