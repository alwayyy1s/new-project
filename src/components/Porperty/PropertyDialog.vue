<template>
    <div class="dialog-container">
      <div class="select">
      <p>模型</p>
      <el-select
        v-model="fromData.modelname"
        placeholder="Select"
        style="width: 200px"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      </div>
    <el-form :model="fromData" label-position="top">
    <el-form-item label="system">
        <el-input v-model="fromData.system" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <!-- 添加更多表单字段 -->
      <el-form-item label="user">
        <el-input v-model="fromData.user" type="textarea" :rows="3"></el-input>
      </el-form-item>
      <!-- 更多属性输入... -->
      <el-form-item>
        <el-button type="primary" @click.prevent="updateNode">保存</el-button>
        <el-button type="default" @click="closeDialog">关闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {useFormStore} from '@/stores/counter'
const formStore = useFormStore();
const fromData =formStore.fromData
const options = [
  {
    value: 'Option1',
    label: 'Gemini',
  },
  {
    value: 'Option2',
    label: 'Option2',
  }]

// const props = defineProps({
//   node: {
//     type: Object,
//     required: true,
//   },
// });

const from=ref({
  name:'',
  description:'',
})


const emit = defineEmits(['update', 'close']);

const updateNode = () => {
  emit('update', from.value);
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
.select{
  margin-bottom: 20px;
}
/* 样式调整，例如关闭按钮的样式 */
.el-button--text {
  color: #f56c6c;
  font-size: 14px;
}
</style>
