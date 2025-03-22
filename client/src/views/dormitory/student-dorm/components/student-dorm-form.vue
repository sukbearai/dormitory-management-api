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

      <a-form-item field="building_id" label="楼栋">
        <a-select
          v-model="form.building_id"
          placeholder="请选择楼栋"
          allow-clear
          @change="handleBuildingChange"
          value-key="build_id"
        >
          <a-option
            v-for="building in buildingList"
            :key="building.build_id"
            :value="building.build_id"
            :label="building.building_name"
          >
            {{ building.building_name }}
          </a-option>
        </a-select>
      </a-form-item>

      <a-form-item field="dorm_id" label="宿舍">
        <a-select
          v-model="form.dorm_id"
          placeholder="请选择宿舍"
          allow-clear
          :disabled="!form.building_id"
        >
          <a-option
            v-for="dorm in filteredDormList"
            :key="dorm.dorm_id"
            :value="dorm.dorm_id"
          >
            {{ dorm.dorm_number }}
          </a-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { Message } from '@arco-design/web-vue'
import { studentCheckin, changeStudentDorm } from '@/api/student-dorm'
import { getDormitoryList } from '@/api/dormitory'
import { getBuildingList } from '@/api/building'
import { getUserList } from '@/api/user-center'
import type { StudentDormInfo } from '@/api/student-dorm'
import type { DormRow } from '~~/types/database'
import type { BuildingRow } from '~~/types/database'

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
const buildingList = ref<BuildingRow[]>([])

const form = reactive({
  student_id: '',
  building_id: '',
  dorm_id: ''
})

const rules = {
  student_id: [
    { required: true, message: '请选择学生' }
  ],
  building_id: [
    { required: true, message: '请选择楼栋' }
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

// 获取楼栋列表
const fetchBuildingList = async () => {
  try {
    const res = await getBuildingList()
    if (res.code === 200) {
      buildingList.value = res.data || []
    }
  } catch (err) {
    Message.error('获取楼栋列表失败')
  }
}

// 获取宿舍列表
const fetchDormList = async () => {
  try {
    const res = await getDormitoryList()
    if (res.code === 200) {
      dormList.value = res.data || []

      // 如果是调宿场景，设置当前楼栋和宿舍
      if (props.type === 'change' && props.student) {
        const currentDorm = res.data.find((dorm: DormRow) => dorm.dorm_id === props.student?.dorm_id)
        if (currentDorm) {
          // 等待楼栋列表加载完成后再设置值
          await fetchBuildingList()
          const building = buildingList.value.find(b => b.build_id === currentDorm.build_id)
          if (building) {
            form.building_id = building.build_id as unknown as string
            form.dorm_id = currentDorm.dorm_id as unknown as string
          }
        }
      }
    }
  } catch (err) {
    Message.error('获取宿舍列表失败')
  }
}

// 根据选中的楼栋筛选宿舍
const filteredDormList = computed(() => {
  if (!form.building_id) return []
  return dormList.value.filter(dorm => dorm.build_id === Number(form.building_id))
})

// 处理楼栋变化
const handleBuildingChange = () => {
  form.dorm_id = ''
}

// 监听弹窗显示状态
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 弹窗打开时，重新获取数据
    fetchBuildingList()
    fetchDormList()
    if (props.type === 'checkin') {
      fetchStudentList()
    }
  } else {
    // 弹窗关闭时，重置表单
    form.student_id = ''
    form.building_id = ''
    form.dorm_id = ''
  }
})

const handleSubmit = async () => {
  console.log(form)
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
  } catch (error) {
    console.error('操作失败:', error)
    // Message.error('操作失败')
    return false
  }
}

onMounted(() => {
  fetchBuildingList()
  fetchDormList()
  if (props.type === 'checkin') {
    fetchStudentList()
  }
})
</script>