<template>
    <a-modal
      v-model:visible="_visible"
      title="新增维修申请"
      @before-ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit="handleSubmit"
      >
        <a-form-item field="student_id" label="学生">
          <a-select
            v-model="form.student_id"
            placeholder="请选择学生"
            allow-clear
          >
            <a-option
              v-for="student in studentList"
              :key="student.user_id"
              :value="student.user_id"
            >
              {{ student.real_name }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="dorm_id" label="宿舍">
          <a-select
            v-model="form.dorm_id"
            placeholder="请选择宿舍"
            allow-clear
          >
            <a-option
              v-for="dorm in dormList"
              :key="dorm.dorm_id"
              :value="dorm.dorm_id"
            >
              {{ dorm.building_name }} - {{ dorm.dorm_number }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="description" label="维修描述">
          <a-textarea
            v-model="form.description"
            placeholder="请输入维修描述"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import { createRepair } from '@/api/dormitory-repair'
  import { getDormitoryList } from '@/api/dormitory'
  import { getUserList, UserListItem } from '@/api/user-center'
  import type { DormRow } from '~~/types/database'
  
  const props = defineProps<{
    visible: boolean
  }>()
  
  const emit = defineEmits(['update:visible', 'success'])
  
  const _visible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  })
  
  const formRef = ref()
  const dormList = ref<DormRow[]>([])
  const studentList = ref<UserListItem[]>([] as any)
  
  const form = reactive({
    student_id: '',
    dorm_id: '',
    description: ''
  })
  
  const rules = {
    student_id: [
      { required: true, message: '请选择学生' }
    ],
    dorm_id: [
      { required: true, message: '请选择宿舍' }
    ],
    description: [
      { required: true, message: '请输入维修描述' }
    ]
  }
  
  // 获取宿舍列表
  const fetchDormList = async () => {
    try {
      const res = await getDormitoryList()
      if (res.code === 200) {
        dormList.value = res.data || []
      }
    } catch (err) {
      Message.error('获取宿舍列表失败')
    }
  }
  
  // 获取学生列表
  const fetchStudentList = async () => {
    try {
      const { data } = await getUserList({
        role: 'student',
        page: 1,
        pageSize: 100
      })
      studentList.value = data.list || []
    } catch (err) {
      Message.error('获取学生列表失败')
    }
  }
  
  const handleSubmit = async () => {
    try {
      const res = await formRef.value.validate()
      if (res) {
        return false
      }
  
      await createRepair({
        studentId: Number(form.student_id),
        dormId: Number(form.dorm_id),
        description: form.description
      })
  
      Message.success('创建维修申请成功')
      emit('success')
      emit('update:visible', false)
      // 重置表单
      form.student_id = ''
      form.dorm_id = ''
      form.description = ''
    } catch (error) {
      Message.error('操作失败')
      return false
    }
  }
  
  onMounted(() => {
    fetchDormList()
    fetchStudentList()
  })
  </script>