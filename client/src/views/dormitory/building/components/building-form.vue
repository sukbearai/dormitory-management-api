<template>
  <a-modal
    v-model:visible="_visible"
    :title="'新增楼栋'"
    @before-ok="handleSubmit"
  >
    <a-form
      ref="formRef"
      :model="form"
      :rules="rules"
      @submit="handleSubmit"
    >
      <a-form-item field="building_name" label="楼栋名称">
        <a-input
          v-model="form.building_name"
          placeholder="请输入楼栋名称"
        />
      </a-form-item>
      <a-form-item field="staff_id" label="宿管员">
        <a-select
          v-model="form.staff_id"
          placeholder="请选择宿管员"
          allow-clear
        >
          <a-option
            v-for="staff in staffList"
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
import { ref, reactive, computed,onMounted } from 'vue'
import { Message } from '@arco-design/web-vue'
import { createBuilding } from '@/api/building'
import { getUserList, UserListItem } from '@/api/user-center'

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits(['update:visible', 'success'])

const _visible = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

const formRef = ref()
const staffList = ref<UserListItem[]>([])

const form = reactive({
  building_name: '',
  staff_id: ''
})

const rules = {
  building_name: [
    { required: true, message: '请输入楼栋名称' }
  ],
  staff_id: [
    { required: true, message: '请选择宿管人员' }
  ]
}

const fetchStaffList = async () => {
  try {
    const { data } = await getUserList({ 
      page: 1,
      pageSize: 100,
      role: 'dorm_staff'
    })
    staffList.value = data.list || []
  } catch (err) {
    Message.error('获取宿管员列表失败')
  }
}

const handleSubmit = async () => {
  try {
    const res = await formRef.value.validate()
    if(res) {
      return false
    }
    await createBuilding({
      building_name: form.building_name,
      staff_id: Number(form.staff_id)
    })
    Message.success('创建成功')
    emit('success')
    emit('update:visible', false)
    // 重置表单
    form.building_name = ''
    form.staff_id = ''
  } catch (error) {
    Message.error('操作失败')
    return false
  }
}

onMounted(() => {
  fetchStaffList()
})
</script>