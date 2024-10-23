import { ref, computed } from 'vue';
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

export const useWorkflowStore = defineStore('workflow', () => {
  const graphData = ref({});
  const workflowCard = ref({});
  function updateGraphData(key,newGraphData) {
  graphData.value[key]=newGraphData
  }
  
  function updateWorkflowCard(key,newWorkflowCard) {
    workflowCard.value[key]=newWorkflowCard
  }
  function deleteWorkflowCard(title) {
    delete workflowCard.value[title]
    delete graphData.value[title]
  }

  return { graphData, workflowCard, updateGraphData, updateWorkflowCard,deleteWorkflowCard };
},
{
  persist:true
}
);

export const useConversationStore = defineStore('conversation', () => {
  const conversations = ref([]);
  const currentConversationIndex = ref(0);

  // 确保总是有一个默认对话
  if (conversations.value.length === 0) {
    conversations.value.push({
      title: '新对话',
      date: new Date(),
      messages: [{ sender: 'ai', text: '你好！我能为你做些什么？' ,}]
    });
  }

  const currentConversation = computed(() => {
    return conversations.value[currentConversationIndex.value] || conversations.value[0];
  });

  function createNewConversation() {
    conversations.value.push({
      title: `对话 ${conversations.value.length + 1}`,
      date: new Date(),
      messages: [{ sender: 'ai', text: '你好！我能为你做些什么？' }]
    });
    // 设置为当前对话索引
    currentConversationIndex.value = conversations.value.length - 1;
  }

  function addMessage(message) {
    if (currentConversation.value) {
      currentConversation.value.messages.push(message);
       // 如果是用户消息，更新对话标题
       if (message.sender === 'user') {
        updateConversationTitle(message.text);
      }
    }
  }

  function updateConversationTitle(userMessage) {
    const maxTitleLength = 20; // 设置标题最大长度
    let newTitle = userMessage.trim();
    
    // 如果消息长度超过最大长度，截取并添加省略号
    if (newTitle.length > maxTitleLength) {
      newTitle = newTitle.substring(0, maxTitleLength) + '...';
    }
    
    currentConversation.value.title = newTitle;
  }
  function setCurrentConversationIndex(index) {
    if (index >= 0 && index < conversations.value.length) {
      currentConversationIndex.value = index;
    }
  }
  function deleteConversation(index) {
    if (index >= 0 && index < conversations.value.length) {
      conversations.value.splice(index, 1);
      
      // 如果删除的是当前对话,将当前对话索引设置为最后一个对话
      if (index === currentConversationIndex.value) {
        currentConversationIndex.value = conversations.value.length - 1;
      } else if (index < currentConversationIndex.value) {
        // 如果删除的对话在当前对话之前,需要调整当前对话索引
        currentConversationIndex.value--;
      }
      
      // 如果删除后没有对话了,创建一个新的默认对话
      if (conversations.value.length === 0) {
        createNewConversation();
      }
    }
  }
  return {
    conversations,
    currentConversationIndex,
    currentConversation,
    createNewConversation,
    addMessage,
    setCurrentConversationIndex,
    deleteConversation
  };
});