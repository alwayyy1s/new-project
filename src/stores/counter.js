import { ref } from 'vue';
import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', () => {
  const fromData = ref({
    content: '',
    modelname: '',
    system:'',
    user: '',
    output: ''
  });

  function saveFormData() {
    localStorage.setItem('formData', JSON.stringify(fromData.value));
  }

  function loadFormData() {
    // 从LocalStorage加载表单数据
    const storedData = localStorage.getItem('formData');
    if (storedData) {
      fromData.value = JSON.parse(storedData);
    }
  }

  function clearFormData() {
    // 清空表单数据
    localStorage.removeItem('formData');
  }

  return { fromData, saveFormData, loadFormData, clearFormData };
});
