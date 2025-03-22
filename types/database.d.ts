import type { RowDataPacket } from 'mysql2'

export interface NotificationRow extends RowDataPacket {
  notification_id: number
  title: string
  content: string
  staff_id: number
  building_id: number
  created_at: Date
  updated_at: Date
}

export interface NotificationInfo extends NotificationRow {
  staff_name: string
  building_name: string
}

interface DormDetailInfo extends RowDataPacket {
  dorm_id: number
  dorm_number: string
  building_name: string
  capacity: number
  students: StudentRow[]
}

export interface StudentRow extends RowDataPacket {
  student_id: number
  student_number: string
  name: string
  gender: number
  phone: string
  dorm_id: number
}

export interface BaseRow extends RowDataPacket {
  created_at?: Date
  updated_at?: Date
}

interface CountResult extends RowDataPacket {
  count: number
}

interface OccupancyRecord extends RowDataPacket {
  month: string
  count: number
}

interface RepairStatusCount extends RowDataPacket {
  status: 'pending' | 'in_progress' | 'completed'
  count: number
}

interface UserIdResult extends RowDataPacket {
  user_id: number
}

interface UserPasswordResult extends RowDataPacket {
  password: string
}

export interface UserRow extends BaseRow {
  user_id: number
  username: string
  password: string
  role: 'admin' | 'student' | 'maintenance' | 'dorm_staff'
  real_name: string | null
  contact: string | null
}

export interface BuildingRow extends BaseRow {
  build_id: number
  building_name: string
  staff_id: number | null
}

export interface DormRow extends BaseRow {
  dorm_id: number
  dorm_number: string
  capacity: number
  build_id: number | null
}

export interface RepairRow extends BaseRow {
  repair_id: number
  student_id: number | null
  dorm_id: number | null
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  maintenance_id: number | null
}

export interface StudentDormRow extends BaseRow {
  id: number
  student_id: number
  dorm_id: number
}

export interface DormInspectionRow extends BaseRow {
  inspection_id: number
  dorm_id: number
  staff_id: number
  inspection_time: Date
  result: string
  remarks: string | null
}

export interface LateReturnRow extends BaseRow {
  late_id: number
  student_id: number
  dorm_id: number
  return_time: Date
  reason: string | null
}

export interface UserLoginResult extends RowDataPacket {
  user_id: number
  username: string
  password: string
  role: UserRow['role']
  real_name: string | null
}

export interface DormInfoResult extends RowDataPacket {
  dorm_number: string
  building: string
}

export interface UserListResult extends RowDataPacket { total: number }
