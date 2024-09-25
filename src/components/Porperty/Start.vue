<template>
  <div class="dialog-container">
    <el-form :model="fromData" label-position="top">
      <el-form-item label="输入内容" >
        <el-input v-model="fromData.content" type="textarea"  :rows="4"></el-input>
      </el-form-item>
      <p>或</p>
    <el-upload
        class="upload-demo"
        drag
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
      >
        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
        <div class="el-upload__text">
          Drop file here or <em>click to upload</em>
        </div>
        <template #tip>
          <div class="el-upload__tip">
            pdf/docs files with a size less than 500kb
          </div>
        </template>
      </el-upload>
      
      <!-- 更多属性输入... -->
      <el-form-item>
        <el-button type="primary" @click.prevent="saveFormData">保存</el-button>
        <el-button type="default" @click="closeDialog">关闭</el-button>
        <el-button type="default" @click="clearFormData">清空</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { UploadFilled } from '@element-plus/icons-vue'
import {useFormStore} from '@/stores/counter'
const formStore = useFormStore();
const fromData =formStore.fromData
const emit = defineEmits(['update', 'close']);
const saveFormData = () => {
  emit('update', fromData.value);
  formStore.saveFormData();
};
const clearFormData = () => {
  fromData.content=''
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
