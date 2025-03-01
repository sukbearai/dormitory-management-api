import type { HttpResponse } from '@/utils/request'
import type { DormRow } from '~~/types/database'
import { request } from '@/utils/request'

export interface DormitoryListResult {
  list: DormRow[]
  total: number
}

export function getDormitoryList() {
  return request<HttpResponse<DormRow[]>>('/api/admin/dormitory-list', {
    method: 'GET'
  })
}

export function createDormitory(data: {
  dorm_number: string
  capacity: number
  build_id: number
}) {
  return request<HttpResponse>('/api/admin/dormitory-create', {
    method: 'POST',
    data
  })
}

export function updateDormitory(data: {
  dorm_id: number
  dorm_number: string
  capacity: number
  build_id: number
}) {
  return request<HttpResponse>('/api/admin/dormitory-update', {
    method: 'POST',
    data
  })
}

export function deleteDormitory(dormId: number) {
  return request<HttpResponse>('/api/admin/dormitory-delete', {
    method: 'POST',
    data: { dormId }
  })
}