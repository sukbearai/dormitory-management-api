import { type HttpResponse, request } from '@/utils/request';

export interface UserInfo {
  real_name: string;
  contact: string;
}

interface UserPwd {
  oldPassword: string;
  newPassword: string;
}

interface UserListParams {
  page: number;
  pageSize: number;
  role?: string;
  keyword?: string;
}

export interface UserListItem {
  user_id: number;
  username: string;
  role: string;
  real_name: string;
  contact: string;
  created_at: string;
  updated_at: string;
}

interface UserListResponse {
  total: number;
  list: UserListItem[];
}

interface AddUserData {
  username: string;
  password: string;
  role: string;
  real_name?: string;
  contact?: string;
}

interface AddUserResponse {
  user_id: number;
  username: string;
  role: string;
}

interface UpdateUserData {
  userId: number;
  username: string;
  password?: string;
  role: string;
  real_name?: string;
  contact?: string;
}

interface DeleteUserData {
  userId: number;
}

export function saveUserInfo(data: UserInfo) {
  return request<HttpResponse>('/api/user/save-info', {
    method: 'POST',
    data
  });
}

export function updateUserPwd(data: UserPwd) {
  return request<HttpResponse>('/api/user/update-pwd', {
    method: 'POST',
    data
  });
}

export function getUserList(data: UserListParams) {
  return request<HttpResponse<UserListResponse>>('/api/admin/user-list', {
    method: 'POST',
    data
  });
}

export function addUser(data: AddUserData) {
  return request<HttpResponse<AddUserResponse>>('/api/admin/user-add', {
    method: 'POST',
    data
  });
}

export function updateUser(data: UpdateUserData) {
  return request<HttpResponse>('/api/admin/user-update', {
    method: 'POST',
    data
  });
}

export function deleteUser(data: DeleteUserData) {
  return request<HttpResponse>('/api/admin/user-delete', {
    method: 'POST',
    data
  });
}