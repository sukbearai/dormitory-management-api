<template>
    <a-modal
      v-model:visible="_visible"
      title="发布通知"
      @before-ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
      >
        <a-form-item field="building_id" label="发送楼栋">
          <a-select
            v-model="form.building_id"
            placeholder="请选择楼栋"
            allow-clear
          >
            <a-option
              v-for="building in buildingList"
              :key="building.build_id"
              :value="building.build_id"
            >
              {{ building.building_name }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="title" label="通知标题">
          <a-input
            v-model="form.title"
            placeholder="请输入通知标题"
          />
        </a-form-item>
        <a-form-item field="content" label="通知内容">
          <a-textarea
            v-model="form.content"
            placeholder="请输入通知内容"
            :auto-size="{ minRows: 3, maxRows: 5 }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, computed, onMounted } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import { createNotification } from '@/api/notification'
  import { getBuildingList } from '@/api/building'
  import type { BuildingRow } from '~~/types/database'
  
  const props = defineProps<{
    visible: boolean
  }>()
  
  const emit = defineEmits(['update:visible', 'success'])
  
  const _visible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  })
  
  const formRef = ref()
  const buildingList = ref<BuildingRow[]>([])
  
  const form = reactive({
    building_id: '',
    title: '',
    content: ''
  })
  
  const rules = {
    building_id: [
      { required: true, message: '请选择楼栋' }
    ],
    title: [
      { required: true, message: '请输入通知标题' }
    ],
    content: [
      { required: true, message: '请输入通知内容' }
    ]
  }
  
  const fetchBuildingList = async () => {
    try {
      const res = await getBuildingList()
      if (res.code === 200) {
        buildingList.value = res.data || []
      }
    }
    catch (err) {
      Message.error('获取楼栋列表失败')
    }
  }
  
  const handleSubmit = async () => {
    try {
      const res = await formRef.value.validate()
      if (res) {
        return false
      }
  
      await createNotification({
        title: form.title,
        content: form.content,
        building_id: Number(form.building_id)
      })
  
      Message.success('发布通知成功')
      emit('success')
      emit('update:visible', false)
      // 重置表单
      form.building_id = ''
      form.title = ''
      form.content = ''
    }
    catch (error) {
      Message.error('发布通知失败')
      return false
    }
  }
  
  onMounted(() => {
    fetchBuildingList()
  })
  </script>