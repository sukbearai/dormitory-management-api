<template>
  <div class="page">
    <Breadcrumb :items="['用户中心', '用户管理']" />
    <a-card :header-style="{ display: 'none' }" :body-style="{ paddingTop: '20px' }" class="general-card" style="margin-top: 16px;">
      <!-- 顶部区域 -->
      <div class="flex justify-between mb-6">
        <a-button type="primary" @click="openAddDialog">
          <template #icon>
            <icon-plus />
          </template>
          新增用户
        </a-button>
      </div>
      <!-- 表格 -->
      <a-table :loading="loading" :data="userList" :pagination="pagination" @page-change="onPageChange" class="mt-4">
        <template #columns>
          <a-table-column title="用户名" data-index="username" />
          <a-table-column title="姓名" data-index="real_name" />
          <a-table-column title="角色" data-index="role">
            <template #cell="{ record }">
              {{ displayRole(record.role) }}
            </template>
          </a-table-column>
          <a-table-column title="联系方式" data-index="contact" />
          <a-table-column title="创建时间" data-index="created_at">
            <template #cell="{ record }">
              {{ formatDate(record.created_at) }}
            </template>
          </a-table-column>
          <a-table-column title="操作" align="center">
            <template #cell="{ record }">
              <a-space>
                <a-button type="text" size="small" @click="openEditDialog(record)">
                  编辑
                </a-button>
                <a-popconfirm content="确认删除该用户吗？" @ok="handleDelete(record)">
                  <a-button type="text" status="danger" size="small">
                    删除
                  </a-button>
                </a-popconfirm>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>

      <!-- 新增/编辑对话框 -->
      <a-modal
        v-model:visible="dialogVisible"
        :title="isEdit ? '编辑用户' : '新增用户'"
        @ok="handleSubmit"
        @cancel="closeDialog"
      >
        <!-- 对话框内容保持不变 -->
        <a-form ref="formRef" :model="formData" :rules="rules" layout="vertical">
          <a-form-item field="username" label="用户名">
            <a-input v-model="formData.username" placeholder="请输入用户名" />
          </a-form-item>
          <a-form-item v-if="!isEdit" field="password" label="密码">
            <a-input-password v-model="formData.password" placeholder="请输入密码" />
          </a-form-item>
          <a-form-item field="role" label="角色">
            <a-select v-model="formData.role" placeholder="请选择角色">
              <a-option value="student">学生</a-option>
              <a-option value="maintenance">维修人员</a-option>
              <a-option value="dorm_staff">宿管人员</a-option>
              <a-option value="admin">管理员</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="real_name" label="姓名">
            <a-input v-model="formData.real_name" placeholder="请输入姓名" />
          </a-form-item>
          <a-form-item field="contact" label="联系方式">
            <a-input v-model="formData.contact" placeholder="请输入联系方式" />
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
  </div>
</template>
  
  <script lang="ts" setup>
  import { ref, reactive } from 'vue'
  import { Message } from '@arco-design/web-vue'
  import type { TableData } from '@arco-design/web-vue'
  import { formatDate } from '@/utils/date'
  import Breadcrumb from '@/components/breadcrumb/index.vue'
  import { useRequest } from 'vue-hooks-plus';
  import { getUserList, addUser, updateUser, deleteUser } from '@/api/user-center'
  
  interface UserForm {
    username: string
    password: string
    role: string
    real_name: string
    contact: string
  }

  interface UserRecord {
  user_id: number
  username: string
  role: RoleType
  real_name: string
  contact: string
  password?: string
  created_at: string
  updated_at: string
}

  type RoleType = 'admin' | 'student' | 'maintenance' | 'dorm_staff'
  
  const roleMap: Record<RoleType, string> = {
    admin: '管理员',
    student: '学生',
    maintenance: '维修人员',
    dorm_staff: '宿管人员'
  }

    // 表格数据
  const userList = ref<TableData[]>([])
  const pagination = reactive({
    total: 0,
    current: 1,
    pageSize: 10
  })
  
  // 表单相关
  const formRef = ref()
  const dialogVisible = ref(false)
  const isEdit = ref(false)
  const currentId = ref<number>()
  const formData = reactive<UserForm>({
    username: '',
    password: '',
    role: '',
    real_name: '',
    contact: ''
  })
  
  const rules = {
    username: [{ required: true, message: '请输入用户名' }],
    password: [{ required: !isEdit.value, message: '请输入密码' }], 
    role: [{ required: true, message: '请选择角色' }],
    real_name: [{ required: true, message: '请输入姓名' }],
    contact: [
      { required: true, message: '请输入联系方式' },
      {
        match: /^1[3-9]\d{9}$/,
        message: '请输入正确的手机号码'
      }
    ]
  }

  const { loading, refresh: refreshUserList } = useRequest(() => getUserList({
    page: 1,
    pageSize: 10,
    role: undefined,
    keyword: undefined
  }), {
    onSuccess(res) {
      if(res.code === 200) {
        userList.value = res.data.list
        pagination.total = res.data.total
      }
    }
  })
  

  // 添加用户
const { run: submitAddUser } = useRequest(addUser, {
  manual: true,
  onSuccess(res) {
    if (res.code === 200) {
      Message.success(res.message)
      closeDialog()
      refreshUserList()
    } else {
      Message.error(res.message)
    }
  },
  onError(error) {
    console.error('提交失败:', error)
    Message.error('提交失败')
  }
})

// 编辑用户
const { run: submitUpdateUser } = useRequest(updateUser, {
  manual: true,
  onSuccess(res) {
    if (res.code === 200) {
      Message.success(res.message)
      closeDialog()
      refreshUserList()
    } else {
      Message.error(res.message)
    }
  },
  onError(error) {
    console.error('更新失败:', error)
  }
})

// 删除用户
const { run: submitDeleteUser } = useRequest(deleteUser, {
  manual: true,
  onSuccess(res) {
    if (res.code === 200) {
      Message.success(res.message)
      refreshUserList()
    }
  },
  onError(error) {
    console.error('删除失败:', error)
  }
})
   
  function displayRole(role: RoleType) {
    return roleMap[role] || ''
  }

  // 分页变化
  const onPageChange = (current: number) => {
    pagination.current = current
  }
  
  // 打开新增对话框
  const openAddDialog = () => {
    isEdit.value = false
    Object.assign(formData, {
      username: '',
      password: '',
      role: '',
      real_name: '',
      contact: ''
    })
    dialogVisible.value = true
  }
  
  // 打开编辑对话框
  const openEditDialog = (record: UserRecord) => {
    isEdit.value = true
    currentId.value = record.user_id
    Object.assign(formData, {
      username: record.username,
      password: record.password,
      role: record.role,
      real_name: record.real_name,
      contact: record.contact
    })
    dialogVisible.value = true
  }
  
  // 关闭对话框
  const closeDialog = () => {
    dialogVisible.value = false
    formRef.value?.resetFields()
  }
  
  // 提交表单
  const handleSubmit = async () => {
  const values = await formRef.value?.validate()
  
  // 校验错误
  if (values) {
    // formRef.value?.resetFields()
    dialogVisible.value = true
    return false
  }

  if (isEdit.value && currentId.value) {
    submitUpdateUser({
      userId: currentId.value,
      username: formData.username,
      role: formData.role,
      real_name: formData.real_name,
      contact: formData.contact
    })
  } else {
    const { username, password, role, real_name, contact } = formData
    submitAddUser({
      username,
      password,
      role,
      real_name,
      contact
    })
  }
}
  
  // 删除用户
  const handleDelete = async (record: UserRecord) => {
    submitDeleteUser({ userId: record.user_id })
  }
  </script>
  
  <style scoped>
  .page {
    padding: 0 20px 20px;
  }
  </style>