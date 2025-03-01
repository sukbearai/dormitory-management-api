<template>
    <a-modal
      v-model:visible="_visible"
      :title="type === 'checkin' ? '学生入住' : '学生调宿'"
      @before-ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit="handleSubmit"
      >
        <template v-if="type === 'checkin'">
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
        </template>
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
      </a-form>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import { studentCheckin, changeStudentDorm } from '@/api/student-dorm'
  import { getDormitoryList } from '@/api/dormitory'
  import { getUserList } from '@/api/user-center'
  import type { StudentDormInfo } from '@/api/student-dorm'
  import type { DormRow } from '~~/types/database'
  
  const props = defineProps<{
    visible: boolean
    type: 'checkin' | 'change'
    student?: StudentDormInfo | null
  }>()
  
  const emit = defineEmits(['update:visible', 'success'])
  
  const _visible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  })
  
  const formRef = ref()
  const studentList = ref<any[]>([])
  const dormList = ref<DormRow[]>([])
  
  const form = reactive({
    student_id: '',
    dorm_id: ''
  })
  
  const rules = {
    student_id: [
      { required: true, message: '请选择学生' }
    ],
    dorm_id: [
      { required: true, message: '请选择宿舍' }
    ]
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
  
  const handleSubmit = async () => {
    try {
      const res = await formRef.value.validate()
      if (res) {
        return false
      }
  
      if (props.type === 'checkin') {
        await studentCheckin({
          studentId: Number(form.student_id),
          dormId: Number(form.dorm_id)
        })
      } else {
        await changeStudentDorm({
          studentId: props.student?.student_id || 0,
          newDormId: Number(form.dorm_id)
        })
      }
  
      Message.success(props.type === 'checkin' ? '入住成功' : '调宿成功')
      emit('success')
      emit('update:visible', false)
      // 重置表单
      form.student_id = ''
      form.dorm_id = ''
    } catch (error) {
      Message.error('操作失败')
      return false
    }
  }
  
  onMounted(() => {
    if (props.type === 'checkin') {
      fetchStudentList()
    }
    fetchDormList()
  })
  </script>