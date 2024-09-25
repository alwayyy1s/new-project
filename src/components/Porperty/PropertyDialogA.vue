<template>
    <div class="dialog-container">
      <el-form @submit.prevent="updateNode" label-position="top">
        <el-form-item label="A节点名称">
          <el-input v-model="nodeName"></el-input>
        </el-form-item>
        <!-- 添加更多表单字段 -->
        <el-form-item label="节点描述">
          <el-input v-model="nodeDescription" type="textarea"></el-input>
        </el-form-item>
        <!-- 更多属性输入... -->
        <el-form-item>
          <el-button type="primary" @click="updateNode">保存</el-button>
          <el-button type="success" @click="closeDialog">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  
  const props = defineProps({
    node: {
      type: Object,
      required: true,
    },
  });
  
  const nodeName = ref(props.node.properties.name);
  const nodeDescription = ref(props.node.properties.description || ''); // 假设节点有描述属性
  
  const emit = defineEmits(['update:name', 'close']);
  
  const updateNode = () => {
    emit('update:name', nodeName.value);
    emit('update:description', nodeDescription.value); // 发送描述更新事件
  };
  
  const closeDialog = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .dialog-container {
    position: absolute;
    right: 10px;
    top: 10px;
    z-index: 1000;
    width: 300px;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    padding: 20px;
    /* 其他样式调整... */
  }
  
  /* 样式调整，例如关闭按钮的样式 */
  .el-button--text {
    color: #f56c6c;
    font-size: 14px;
  }
  </style>
  