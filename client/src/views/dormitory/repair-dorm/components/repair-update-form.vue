<template>
    <a-modal
      v-model:visible="_visible"
      title="更新维修状态"
      @before-ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit="handleSubmit"
      >
        <a-form-item field="status" label="维修状态">
          <a-select
            v-model="form.status"
            placeholder="请选择维修状态"
          >
            <a-option value="pending">待处理</a-option>
            <a-option value="in_progress">处理中</a-option>
            <a-option value="completed">已完成</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="maintenance_id" label="维修人员">
          <a-select
            v-model="form.maintenance_id"
            placeholder="请选择维修人员"
            allow-clear
          >
            <a-option
              v-for="staff in maintenanceList"
              :key="staff.user_id"
              :value="staff.user_id"
            >
              {{ staff.real_name }}
            </a-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import { updateRepair } from '@/api/dormitory-repair'
  import { getUserList, UserListItem } from '@/api/user-center'
  import type { RepairInfo } from '@/api/dormitory-repair'
  
  const props = defineProps<{
    visible: boolean
    repairInfo?: RepairInfo
  }>()
  
  const emit = defineEmits(['update:visible', 'success'])
  
  const _visible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  })
  
  const formRef = ref()
  const maintenanceList = ref<UserListItem[]>([] as any)
  
  const form = reactive({
    status: '' as 'pending' | 'in_progress' | 'completed',
    maintenance_id: ''
  })
  
  const rules = {
    status: [
      { required: true, message: '请选择维修状态' }
    ],
    maintenance_id: [
      { required: true, message: '请选择维修状态' }
    ]
  }
  
  // 获取维修人员列表
  const fetchMaintenanceList = async () => {
    try {
      const { data } = await getUserList({
        role: 'maintenance',
        page: 1,
        pageSize: 100
      })
      maintenanceList.value = data.list || []
    } catch (err) {
      Message.error('获取维修人员列表失败')
    }
  }
  
  const handleSubmit = async () => {
    try {
      const res = await formRef.value.validate()
      if (res) {
        return false
      }
  
      await updateRepair({
        repairId: props.repairInfo?.repair_id || 0,
        status: form.status,
        maintenanceId: form.maintenance_id ? Number(form.maintenance_id) : undefined
      })
  
      Message.success('更新维修状态成功')
      emit('success')
      emit('update:visible', false)
      // 重置表单
      form.status = 'pending'
      form.maintenance_id = ''
    } catch (error) {
      Message.error('操作失败')
      return false
    }
  }
  
  onMounted(() => {
    fetchMaintenanceList()
    if (props.repairInfo) {
      form.status = props.repairInfo.status
      form.maintenance_id = props.repairInfo.maintenance_name || ''
    }
  })
  </script>