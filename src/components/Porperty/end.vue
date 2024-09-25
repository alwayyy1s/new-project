<template>
    <div class="dialog-container">
      <el-form  label-position="top">
        <el-form-item label="结果">
          <el-input v-model="fromData.output" type="textarea" :rows="5"></el-input>
        </el-form-item>
        <!-- 添加更多表单字段 -->
        <!-- 更多属性输入... -->
        <el-form-item>
          <el-button type="primary" @click.prevent="updateNode">保存</el-button>
          <el-button type="default" @click.prevent="closeDialog">关闭</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import {useFormStore} from '@/stores/counter'
const formStore = useFormStore();
const fromData =formStore.fromData

//   const props = defineProps({
//     node: {
//       type: Object,
//       required: true,
//     },
//   });
  
  const from =ref({
    output:'',

  })
  
  const emit = defineEmits(['update', 'close']);
  
  const updateNode = () => {
    emit('update:name', from.value);
  };
  
  const closeDialog = () => {
    emit('close');
  };
  </script>
  
  <style scoped>
  .dialog-container {
  position: absolute;
  right: 10px;
  top: 150px;
  z-index: 1000;
  height: 450px;
  width: 400px;
  background-color: white;
  border-radius: 6px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
  color: rgb(71, 84, 103);
  /* 其他样式调整... */
}
  
  /* 样式调整，例如关闭按钮的样式 */
  .el-button--text {
    color: #f56c6c;
    font-size: 14px;
  }
  </style>
  