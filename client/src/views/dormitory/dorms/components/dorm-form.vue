<template>
    <a-modal
      v-model:visible="_visible"
      :title="dorm ? '编辑宿舍' : '新增宿舍'"
      @before-ok="handleSubmit"
    >
      <a-form
        ref="formRef"
        :model="form"
        :rules="rules"
        @submit="handleSubmit"
      >
        <a-form-item field="dorm_number" label="宿舍号">
          <a-input
            v-model="form.dorm_number"
            placeholder="请输入宿舍号"
          />
        </a-form-item>
        <a-form-item field="build_id" label="所属楼栋">
          <a-select
            v-model="form.build_id"
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
        <a-form-item field="capacity" label="容量">
          <a-input-number
            v-model="form.capacity"
            placeholder="请输入容量"
            :min="1"
            :max="8"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, reactive, computed, onMounted, watch } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import { createDormitory, updateDormitory } from '@/api/dormitory'
  import { getBuildingList } from '@/api/building'
  import type { DormRow, BuildingRow } from '~~/types/database'
  
  const props = defineProps<{
    visible: boolean
    dorm?: DormRow | null
  }>()
  
  const emit = defineEmits(['update:visible', 'success'])
  
  const _visible = computed({
    get: () => props.visible,
    set: (value: boolean) => emit('update:visible', value)
  })
  
  const formRef = ref()
  const buildingList = ref<BuildingRow[]>([])
  
  const form = reactive({
    dorm_number: '',
    build_id: '',
    capacity: 4
  })
  
  const rules = {
    dorm_number: [
      { required: true, message: '请输入宿舍号' }
    ],
    build_id: [
      { required: true, message: '请选择楼栋' }
    ],
    capacity: [
      { required: true, message: '请输入容量' }
    ]
  }
  
  // 监听编辑时的数据
  watch(() => props.dorm, (dorm) => {
    if (dorm) {
      form.dorm_number = dorm.dorm_number
      form.build_id = dorm.build_id as unknown as string
      form.capacity = dorm.capacity
    } else {
      form.dorm_number = ''
      form.build_id = ''
      form.capacity = 4
    }
  }, { immediate: true })
  
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
  
  const handleSubmit = async () => {
    try {
      const res = await formRef.value.validate()
      if (res) {
        return false
      }
  
      if (props.dorm) {
        await updateDormitory({
          dorm_id: props.dorm.dorm_id,
          dorm_number: form.dorm_number,
          build_id: Number(form.build_id),
          capacity: form.capacity
        })
      } else {
        await createDormitory({
          dorm_number: form.dorm_number,
          build_id: Number(form.build_id),
          capacity: form.capacity
        })
      }
  
      Message.success(props.dorm ? '更新成功' : '创建成功')
      emit('success')
      emit('update:visible', false)
    } catch (error) {
      Message.error('操作失败')
      return false
    }
  }
  
  onMounted(() => {
    fetchBuildingList()
  })
  </script>