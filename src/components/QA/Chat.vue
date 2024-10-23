<template>
    <div class="app-container" >
      <div class="chat-container" :style="{ width: chatWidth + 'px' }">
        <!-- 聊天消息区域 -->
        <div class="chat-box">
          <!-- 聊天消息列表 -->
          <div class="chat-messages" ref="chatMessages">
            <div v-for="(message, index) in currentConversation.messages" :key="index" v-memo="[message.text, message.file]" class="message-wrapper">
              <div :class="['message', message.sender === 'user' ? 'user-message' : 'ai-message']">
                  <div class="message-content" v-if="message.sender === 'user'">{{ message.text }}</div>
                  <div class="message-content" v-else v-html="parseStyleTags(message.text)" @click="handleLinkClick" ></div>
              </div>
              <div v-if="message.file" :class="['file-message', message.sender==='user'?'user-file':'ai-file']" @click="viewFile(message.file)">
                <div class="file-icon">
                    <!-- 用户文件图标 -->
                <i v-if="message.sender === 'user'" class="iconfont icon-yonghu-wenjianjia"></i>
                  <!-- AI 文件图标 -->
                <i v-else class="iconfont icon-kapai-wenjian"></i>
                  </div>
                  <!-- 文件信息 -->
                <div class="file-info">
                      <span class="file-name">{{ message.file.name }}</span>
                      <span class="file-size">{{ formatFileSize(message.file.size) }}</span>
                  </div>  
                </div>
            </div>
            <div v-if="isTyping" class="typing-indicator">AI正在输入...</div>
          </div>
          <!-- 新增: 新建对话按钮 -->
          <div class="new-chat-button">
        <button @click="newConversation">
          <i class="iconfont icon-tianjia"></i>
          新建对话</button>
            </div>
      <!-- 输入区域 -->
          <div class="input-area">
            <div class="message-form">
              <!-- 文件上传 -->
              <div class="file-upload">
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="onFileSelected" 
                  class="file-input"
                />
                <span class="file-icon iconfont icon-weibiaoti--" @click="fileUpload"></span> 
              </div>
              <!-- 输入框 -->
        <textarea 
          v-model="userInput"
          @input="adjustTextareaHeight"
          @keydown.enter.exact.prevent="sendMessage"
          placeholder="请输入内容"
          class="input-field"
          rows="1"
          ref="inputField"
        ></textarea>
        <!-- 发送按钮 -->
        <button 
        @click="isTyping ? stopAIResponse() : sendMessage()" 
        class="send-button" 
        :disabled="!userInput.trim() && !selectedFile && !isTyping"
      >
        <span class="icon iconfont" :class="isTyping ? 'icon-zanting' : 'icon-fasong'"></span>
      </button>
      </div>
      <!-- 文件预览 -->
      <div v-if="selectedFile" class="file-preview">
        <div class="file-icon">
          <span class="iconfont icon-weibiaoti--"></span>
        </div>
        <div class="file-info">
          <div class="file-name">{{ selectedFile.name }}</div>
          <div class="file-size">PDF, {{ formatFileSize(selectedFile.size) }}</div>
        </div>
        <button @click="removeFile" class="remove-file-btn">
          <span class="iconfont icon-chahao"></span>
        </button>
      </div>
      </div>
      </div>
      
   <!-- 调整窗口大小分割线-->
    </div>
    <div class="resizer" @mousedown="startResize" v-if="resultWindowVisible"></div>
    <!-- 结果窗口 -->
    <resultWindow v-model="resultWindowVisible" 
    :resultUrl="resultUrl" 
    @close="closeResultWindow"
    :style="{ width: resultWidth + 'px' }">
  </resultWindow>
    </div>

    
</template>
  
<script setup>
import { ref, onMounted, nextTick, computed ,onUnmounted,watch} from 'vue'
import resultWindow from './resultWindow.vue'
import deal from '@/utils/deal'
import {useWorkflowStore} from '@/stores/counter.js'
import { useConversationStore } from '@/stores/counter'
import axios from 'axios';
// const conversations = ref([
//   {
//     title: '初始对话',
//     messages: [{ sender: 'ai', text: '你好！我能为你做些什么？' ,}]
//   }
// ])
const conversationStore = useConversationStore()
const currentConversation = computed(() => conversationStore.currentConversation)
const workflowStore = useWorkflowStore();
const userInput = ref('')
const selectedFile = ref(null)
const chatMessages = ref(null)
const inputField = ref(null)
const aiResponse = ref(null) 
const aiMessage = ref(null)
const isTyping = ref(false)
const stopTyping = ref(false)
const fileInput = ref(null);
const resultWindowVisible = ref(false)
const resultUrl = ref('')

const chatWidth = ref(1000)
const resultWidth = ref(0)

// 处理超链接点击事件
const handleLinkClick = (event) => {
  if (event.target.classList.contains('workflow-link')) {
    event.preventDefault();
    const url = event.target.dataset.url;
    console.log(url)

    // 确保图数据已经存储在 Pinia store 中
    if (aiResponse.value && aiResponse.value.workflow && aiResponse.value.workflow.graph_data) {
      workflowStore.updateGraphData('currentGraph', aiResponse.value.workflow.graph_data);
    console.log('Graph data in store:', workflowStore.graphData['currentGraph']);
  }

    

    // 使用 nextTick 确保数据更新后再打开结果窗口
    nextTick(() => {
    resultUrl.value = url;
    resultWindowVisible.value = true;
    chatWidth.value = 1000;
    resultWidth.value = 500;
      
    });
  }
  
};
// 关闭结果窗口
const closeResultWindow = () => {
resultWindowVisible.value = false
chatWidth.value = 1000
resultWidth.value = 0
}
// 开始调整窗口大小
const startResize = (e) => {
e.preventDefault()
window.addEventListener('mousemove', resize)
window.addEventListener('mouseup', stopResize)
}
// 调整窗口大小
const resize = (e) => {
const newChatWidth = e.clientX
const newResultWidth = window.innerWidth - e.clientX
if (newChatWidth > 200 && newResultWidth > 200) { // 设置最小宽度
  chatWidth.value = newChatWidth
  resultWidth.value = newResultWidth
}
}
// 停止调整窗口大小
const stopResize = () => {
window.removeEventListener('mousemove', resize)
window.removeEventListener('mouseup', stopResize)
}
// 新建对话
const newConversation = () => {
conversationStore.createNewConversation()
}
// 发送消息
const sendMessage = async () => {
if (!userInput.value.trim()) return;

const userMessage = userInput.value.trim();
const newMessage = {
  sender: 'user',
  text: userMessage,
  file: selectedFile.value
};

// currentConversation.value.messages.push(newMessage);
conversationStore.addMessage(newMessage)
await nextTick();
userInput.value = '';
scrollToBottom();

// 获取AI响应
try {
  aiResponse.value= await deal(selectedFile.value, userMessage);
  console.log(aiResponse.value)
  console.log(typeof aiResponse.value.workflow.node_description)
  isTyping.value = true;
  stopTyping.value = false;

  // if (typeof  aiResponse.value.response === 'object') {
  //     aiResponse.value.response = aiResponse.value.response.join('')
  // }
  // 初始化AI消息
  aiMessage.value = {
      sender: 'ai',
      text: '',
  };
  // 将AI消息添加到当前对话中
  currentConversation.value.messages.push(aiMessage.value);
  let formattedNodeDescription = '';
  // 格式化 node_description
if (aiResponse.value.workflow && aiResponse.value.workflow.node_description) {
      formattedNodeDescription = formatNodeDescription(aiResponse.value.workflow.node_description);
      
    }
  //得到AI所有消息
  const aiMessages = aiResponse.value.workflow.description+formattedNodeDescription+aiResponse.value.workflow.flow_url
  // 流式效果输出AI响应
  for (let char of aiMessages) {
    if (stopTyping.value) break;
    aiMessage.value.text += char;
    
    await new Promise(resolve => setTimeout(resolve, 10)); // 控制输出速度
    await nextTick();
    scrollToBottom();
  }
  currentConversation.value.messages.push({sender:'ai',text:aiResponse.value.tool_output.response});
  //接收文件信息
  if (aiResponse.value.workflow.flow_url) {
    aiMessage.value.file = aiResponse.value.file
    await nextTick();
    scrollToBottom();
  }
  
  isTyping.value = false;
  stopTyping.value = false;
  clearSelectedFile()
  if(aiResponse.value.workflow.graph_data){ 
    const graph_data=aiResponse.value.workflow.graph_data
    workflowStore.updateGraphData('currentGraph',graph_data)
    console.log(workflowStore.graphData['currentGraph'])

    nextTick()
}
  // // console.log(graph_data)
  // workflowStore.updateGraphData(graph_data.task['title'],graph_data.graph_data)
  // workflowStore.updateWorkflowCard(graph_data.task['title'],graph_data.task)
}catch (error) {
  console.error('获取AI响应时出错:', error);
  // 可以在这里添加错误处理逻辑，比如显示错误消息给用户

}
  // console.log(aiResponse)

};
// 格式化 node_description
const formatNodeDescription = (nodeDescription) => {
  if (typeof nodeDescription === 'string') {
    // 如果是字符串，直接返回
    return `工作流程节点描述：\n\n${nodeDescription}`;
  } else if (typeof nodeDescription === 'object' && nodeDescription !== null) {
    // 如果是对象，按之前的方式处理
    let formattedText = '工作流程节点描述：\n\n';
    for (const [nodeKey, nodeValue] of Object.entries(nodeDescription)) {
      formattedText += `• **${nodeKey}**: ${nodeValue}\n\n`;
    }
    return formattedText;
  } else {
    // 如果既不是字符串也不是对象，返回错误信息
    console.warn('无效的 node_description 格式:', nodeDescription);
    return '无法显示工作流程节点描述。';
  }
};
const stopAIResponse = () => {
stopTyping.value = true;
isTyping.value = false;
};
// 监听当前对话索引的变化
watch(() => conversationStore.currentConversationIndex, () => {
scrollToBottom()
})
// 滚动到底部
const scrollToBottom = () => {
if (chatMessages.value) {
  chatMessages.value.scrollTop = chatMessages.value.scrollHeight;
}
};

const onFileSelected = (event) => {
  selectedFile.value = event.target.files[0]
}
// 调整输入框高度
const adjustTextareaHeight = () => {
  const textarea = inputField.value
  textarea.style.height = 'auto'
  textarea.style.height = textarea.scrollHeight + 'px'
}


// 格式化文件大小
const formatFileSize = (bytes) => {
  if (bytes < 1024) return bytes + ' B'
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB'
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + ' MB'
  else return (bytes / 1073741824).toFixed(1) + ' GB'
}
// 文件上传
const fileUpload = () => {
  if (fileInput.value)
  fileInput.value.click()
}
//删除文件
const removeFile = () => {
  clearSelectedFile()
};
//   const viewFile = (file) => {
//   //   if (file.path==='http://0.0.0.0:8020/html_file') {
//   //   // const url=file.path
//   //   // window.open(url, '_blank')
//   //   resultUrl.value = file.path
//   //   resultWindowVisible.value = true
//   // }
//   // else{
//   //   downloadFile(file.path)
//   //   resultUrl.value = file.path
//   //   resultWindowVisible.value = true
//   // }
// 查看文件
const viewFile = (file) => {

resultUrl.value = file.path
resultWindowVisible.value = true
chatWidth.value = 1000
resultWidth.value =500
}
// 清除文件的处理函数
const clearSelectedFile = () => {
selectedFile.value = null;
if (fileInput.value) {
  fileInput.value.value = '';
}
};
// 下载文件的处理函数
const downloadFile = (path) => {
  const url = `http://0.0.0.0:8020${path}`; // 设置下载文件的后端URL
  // 发送GET请求获取文件
  axios({
    url: url,
    method: 'GET',
    responseType: 'blob', // 设置响应类型为blob，用于下载文件
  }).then(response => {
    // 创建一个链接元素用于下载
    const link = document.createElement('a');
    // 创建一个blob对象，并设置文件的mime类型
    const blob = new Blob([response.data], { type: 'application/octet-stream' });
    // 创建一个指向blob的URL
    const href = window.URL.createObjectURL(blob);
    link.href = href;
    link.download = 'processed_file.txt'; // 设置下载文件名
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // 释放blob URL
    window.URL.revokeObjectURL(href);
  }).catch(error => {
    console.error('下载失败:', error);
  });
}
// 解析ai回复消息的样式标签
const parseStyleTags = (text) => {
  if (typeof text !== 'string') {
    console.warn('parseStyleTags 收到了非字符串类型的输入:', text);
    return String(text); // 尝试将输入转换为字符串
  }
return text
  .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  .replace(/\*(.*?)\*/g, '<em>$1</em>')
  .replace(/__(.*?)__/g, '<u>$1</u>')
  .replace(/~~(.*?)~~/, '<del>$1</del>')
  .replace(/\n/g, '<br>')// 添加这一行来处理换行
  .replace(/```(.*?)```/g, '<pre>$1</pre>')
  .replace(/\[workflow url="(.*?)"](.*?)\[\/workflow]/g, (match, url, content) => 
    `<a href="#" class="workflow-link" data-url="${url}">${content}</a>`
  );
};
onMounted(() => {
  adjustTextareaHeight()
})
// 卸载事件
onUnmounted(() => {
window.removeEventListener('mousemove', resize)
window.removeEventListener('mouseup', stopResize)
})
</script>

<style scoped>
/* 整体布局 */
.app-container {
  display: flex;
  justify-content: center;
  overflow: hidden;
  height: 100vh;
  

}
.workflow-link {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
}
/* 整体布局 */
.chat-container {
display: flex;
flex-direction: column;
overflow-y: auto;
height: 100vh;
background-color: #f3f4f6;
  /* 添加内边距 */
}
.resizer {
width: 8px;
background-color: #e0e0e0;
cursor: col-resize;
transition: background-color 0.3s;
z-index: 1000;
}

.resizer:hover {
background-color: #007AFF;
}
.chat-box {
flex-grow: 1;
display: flex;
flex-direction: column;
/* background-color: #ffffff; */
border-radius: 8px;
box-shadow: 0 0 1px rgba(0, 0, 0, 0.3); /* 四边都有阴影效果 */
margin: 20px;
overflow: hidden;
}

/* 聊天消息区域 */
.chat-messages {
flex-grow: 1;
overflow-y: auto;
padding: 20px;
display: flex;
flex-direction: column;
background-color: #f5f5f5;
}

.message-wrapper {
display: flex;
flex-direction: column;
margin-bottom: 20px;
}

.message {
max-width: 80%;
padding: 12px 16px;
border-radius: 12px;
line-height: 1.5;
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.user-message {
background-color: #007AFF;
color: white;
margin-left: auto;
border-bottom-right-radius: 4px;
margin-bottom: 6px;
}

.ai-message {
background-color: white;
color: #333;
margin-right: auto;
border-bottom-left-radius: 4px;
margin-bottom: 6px;
}

/* AI 消息内容样式 */
.ai-message .message-content {
font-size: 15px;
}

.ai-message .message-content strong {
line-height: 1.2;
font-weight: 600;
color: #333;
}

.ai-message .message-content em {
font-style: italic;
color: #555;
}

.ai-message .message-content u {
text-decoration: underline;
color: #333;
}

.ai-message .message-content del {
text-decoration: line-through;
color: #777;
}

.ai-message .message-content pre {
background-color: #f0f0f0;
border-radius: 6px;
padding: 12px;
overflow-x: auto;
font-family: 'Courier New', Courier, monospace;
font-size: 14px;
margin: 10px 0;
}

.ai-message .message-content code {
background-color: #f0f0f0;
padding: 2px 4px;
border-radius: 4px;
font-family: 'Courier New', Courier, monospace;
font-size: 14px;
}

.message-content {
word-wrap: break-word;
white-space: pre-wrap;
}

.typing-indicator {
padding: 10px;
font-style: italic;
color: #666;
}

/* 文件消息样式 */
.user-file, .ai-file {
width: 180px;
display: flex;
align-items: center;
background-color: #f0f0f0;
border-radius: 10px;
padding: 10px;
}

.user-file {
margin-left: auto;
}

.ai-file {
margin-right: auto;
}

.file-message:hover {
cursor: pointer;
}

/* 图标样式 */
.iconfont {
font-size: 24px;
}

/* 文件预览样式 */
.file-preview {
display: flex;
align-items: center;
background-color: #f0f0f0;
border-radius: 8px;
padding: 8px 12px;
margin-top: 10px;
max-width: 210px;
}

.file-icon {
width: 40px;
height: 40px;
border-radius: 8px;
display: flex;
align-items: center;
justify-content: center;
}

.file-icon .iconfont {
color: black;
}

.file-upload .iconfont {
cursor: pointer;
color: #666;
}

.send-button .iconfont {
color: white;
}

.file-info {
display: flex;
flex-direction: column;
flex-grow: 1;
overflow: hidden;
}

.file-name {
font-size: x-small;
font-weight: bold;
white-space: nowrap;
overflow: hidden;
text-overflow: ellipsis;
margin-bottom: 2px;
}

.file-size {
font-size: 12px;
color: #666;
}

.remove-file-btn {
background: none;
border: none;
cursor: pointer;
font-size: 18px;
color: #666;
padding: 0;
margin-left: 8px;
}

.remove-file-btn:hover {
color: #ff0000;
}
/* 新建对话按钮 */
.new-chat-button button{
display: inline-flex;
          align-items: center;
          padding: 8px 16px;
          background-color: #f0f0f0;
          border: none;
          border-radius: 20px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: background-color 0.3s ease;
          margin-bottom: 5px;
          margin-left: 10px;
}
.button:hover {
          background-color: #e0e0e0;
      }

.button-icon {
margin-right: 8px;
font-size: 18px;
      }
/* 输入区域样式 */
.input-area {
padding: 10px;
border-top: 1px solid #e0e0e0;
background-color: #ffffff;
}

.message-form {
display: flex;
margin-bottom: -13px;
padding: 5px 10px;
}

.input-field {
flex-grow: 1;
border: none;
background-color: transparent;
resize: none;
font-size: 16px;
padding: 10px;
max-height: 100px;
overflow-y: auto;
}

.input-field:focus {
outline: none;
}

.send-button {
background-color: #3498db;
color: white;
border: none;
border-radius: 50%;
width: 36px;
height: 36px;
cursor: pointer;
display: flex;
align-items: center;
justify-content: center;
transition: background-color 0.3s;
}

.send-button:hover:not(:disabled) {
background-color: #2980b9;
}

.send-button:disabled {
background-color: #bdc3c7;
cursor: not-allowed;
}

.file-upload {
position: relative;
margin-right: 10px;
}

.file-input {
display: none;
}


</style>