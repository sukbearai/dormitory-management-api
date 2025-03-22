import type { HttpResponse } from '@/utils/request'
import type { BuildingRow } from '~~/types/database'
import { request } from '@/utils/request'

export function getBuildingList() {
  return request<HttpResponse<BuildingRow[]>>('/api/admin/building-list', {
    method: 'GET',
  })
}

export function createBuilding(data: {
  building_name: string
  staff_id: number | null
}) {
  return request<HttpResponse>('/api/admin/building-create', {
    method: 'POST',
    data,
  })
}

export function deleteBuilding(buildId: number) {
  return request<HttpResponse>('/api/admin/building-delete', {
    method: 'POST',
    data: { buildId },
  })
}
