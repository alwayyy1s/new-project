<template>
  <div class="workflow-form-overlay" @click.self="cancel">
    <el-card class="workflow-form">
      <template #header>
        <div class="form-header">
          <h2>保存工作流</h2>
          <el-button link @click="cancel">
            <i class="el-icon-close"></i>
          </el-button>
        </div>
      </template>
      
      <el-form :model="formData" label-position="top">
        <el-form-item label="工作流名称" required>
          <el-input 
            v-model="formData.task_name" 
            placeholder="请输入工作流名称"
            maxlength="50"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      
      <div class="form-actions">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveWorkflow">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive } from 'vue';
import { ElMessage } from 'element-plus';

const emit = defineEmits(['close', 'save']);

const formData = reactive({
  task_name: '',
});

const cancel = () => {
  emit('close');
};

const saveWorkflow = () => {
  if (!formData.task_name.trim()) {
    ElMessage.warning('请输入工作流名称');
    return;
  }
  
  console.log('保存工作流:', formData);
  
  ElMessage.success('工作流保存成功');
  emit('save', formData);
  emit('close');
};
</script>

<style scoped>
.workflow-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.workflow-form {
  width: 400px;
  max-width: 90%;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.form-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #303133;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

.form-actions button {
  margin-left: 10px;
}

:deep(.el-form-item__label) {
  font-weight: bold;
}
</style>