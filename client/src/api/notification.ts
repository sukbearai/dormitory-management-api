import type { HttpResponse } from '@/utils/request'
import type { NotificationInfo } from '~~/types/database'
import { request } from '@/utils/request'

export interface CreateNotificationParams {
  title: string
  content: string
  building_id: number
}

export function createNotification(data: CreateNotificationParams) {
  return request<HttpResponse>('/api/dormitory/notification-create', {
    method: 'POST',
    data,
  })
}

export function getNotificationList() {
  return request<HttpResponse<NotificationInfo[]>>('/api/dormitory/notification-list', {
    method: 'GET',
  })
}

export function deleteNotification(notification_id: number) {
  return request<HttpResponse>('/api/dormitory/notification-delete', {
    method: 'POST',
    data: { notification_id },
  })
}
