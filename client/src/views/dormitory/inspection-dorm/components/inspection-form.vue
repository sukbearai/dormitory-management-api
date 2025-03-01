<template>
    <a-modal
      v-model:visible="_visible"
      title="新增检查记录"
      @before-ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit="handleSubmit"
      >
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
        <a-form-item field="inspection_time" label="检查时间">
          <a-date-picker
            v-model="form.inspection_time"
            show-time
            style="width: 100%"
          />
        </a-form-item>
        <a-form-item field="result" label="检查结果">
          <a-select
            v-model="form.result"
            placeholder="请选择检查结果"
            allow-clear
          >
            <a-option value="优秀">优秀</a-option>
            <a-option value="良好">良好</a-option>
            <a-option value="合格">合格</a-option>
            <a-option value="不合格">不合格</a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="remarks" label="备注">
          <a-textarea
            v-model="form.remarks"
            placeholder="请输入备注信息"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import { createInspection } from '@/api/dormitory-inspection'
  import { getDormitoryList } from '@/api/dormitory'
  import type { DormRow } from '~~/types/database'
  import { useUserStore } from '@/store'
  
  const props = defineProps<{
    visible: boolean
  }>()
  
  const emit = defineEmits(['update:visible', 'success'])
  
  const _visible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  })
  const userStore = useUserStore()
  const formRef = ref()
  const dormList = ref<DormRow[]>([])
  
  const form = reactive({
    dorm_id: '',
    inspection_time: '',
    result: '',
    remarks: ''
  })
  
  const rules = {
    dorm_id: [
      { required: true, message: '请选择宿舍' }
    ],
    inspection_time: [
      { required: true, message: '请选择检查时间' }
    ],
    result: [
      { required: true, message: '请选择检查结果' }
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
  
  const handleSubmit = async () => {
    try {
      const res = await formRef.value.validate()
      if (res) {
        return false
      }
  
      await createInspection({
        dormId: Number(form.dorm_id),
        staffId: userStore.userInfo.userId!,
        inspectionTime: form.inspection_time,
        result: form.result,
        remarks: form.remarks
      })
  
      Message.success('创建检查记录成功')
      emit('success')
      emit('update:visible', false)
      // 重置表单
      form.dorm_id = ''
      form.inspection_time = ''
      form.result = ''
      form.remarks = ''
    } catch (error) {
      Message.error('操作失败')
      return false
    }
  }
  
  onMounted(() => {
    fetchDormList()
  })
  </script>