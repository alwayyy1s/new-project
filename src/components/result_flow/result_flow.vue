<script setup>
import { onMounted, ref,watch} from 'vue'
import LogicFlow from "@logicflow/core";
import { DndPanel, SelectionSelect,Group ,Menu,Control} from "@logicflow/extension";
import "@logicflow/core/lib/style/index.css";
import "@logicflow/extension/lib/style/index.css";
import { ElMessage } from 'element-plus'
import {CaretRight,Check} from '@element-plus/icons-vue'
import startNode from '../Nodes/start/startNode.js';
import endNode from '../Nodes/end/endNode.js';
import node1 from '../Nodes/node1/node1.js'
import node2 from '../Nodes/node2/node2.js'
import Start from '../Porperty/Start.vue'
import End from '../Porperty/end.vue'
import smoothPolyline  from '../Edges/test.js'
import PropertyDialog from '../Porperty/PropertyDialog.vue'
import PropertyDialogA from '../Porperty/PropertyDialogA.vue'
import PropertyDialogB from '../Porperty/PropertyDialogB.vue'
import NodeMenu from '../Porperty/NodeMenu.vue';
import {useFormStore} from '@/stores/counter'
import {useWorkflowStore} from '@/stores/counter'
import WorkflowForm from './WorkflowForm.vue';
import {postGraphData} from '@/utils/Graph.js'


const formStore = useFormStore();
const workflowStore = useWorkflowStore();
const fromData =formStore.fromData
const showMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const showDialog = ref(false);
const showEnd =ref(false);
const selectedNode = ref({});
const container = ref(null); 
const lf= ref(null)
const isShowWorkflowForm = ref(false)
const graphData = ref(null)
// const patternItems = [
//     {
//       type: 'startNode',
//       label: '开始节点',  
//       icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAABQVJREFUWEfNWF1oHFUU/s5sUhVTyc5GUBqlpDObWol9UYr2webNIqQgQrA1LdZgsjNNpBZbsQHrTy2VaqXdnU2qVhEsgpW2CmkFSQtqffGvNBKT2QYLUhCzs9EoKN2ZI3d2NzvZ7M9ksxEH9mXvOd/55tw7557vEKp8moZ+vt120i0SuIWZwyBaDYcCAE8yMEmgyfrlDV/8uvW2v6oJQQtxajz8fSMtu7kTRJ0EtPvyJRqGg/NSHY9M9ajf+fIB4ItY4+DkWsm2uyChE4xmD/iomx3GFEk0Jf5nh5uY0ESglQDf47FNA4jaaUR/71evVCJYkVjIMHUmvASG7AYGvpWYTzmSdCYVUUbLBbg1llAcwkYGbwQgfgIhCeaopbfuK+dblpgcT5wA82M5QgAdS2nKsUpvW2xdjo13gqQ+AOvFOgGfJjW1oxRWSWJyPHEVzHe6IEwDSV3ZXw2hQp9QLLGXiV/J/n/N0tQVxXCLEpONiR8AWpvJFG9JaeETtSCVwwgaE5sJ9EFmZ/knSw/fVYg/j5gcN3eC8YYwtDS14hlcDGHZMDnr/6alqTu9WHMChwbNTezgtGvg4AFrh/r1YgJX8pWj5v2QcDGTOedF7wcxSyw4dKWN0s4wCM0gPGNF1MOVgGuxnt8hTtppWpcrJbPE5Jh5CIRdohykNPXeWgT1iyEb5pfZr3V2S11ioqJLNzZcFsWTQT1+SkJjfGwloW4Xk/P2dG/rJb8kypSSDwGkpQDWiRvCJRaMTfQQ0eBCsiXHxveBpBcATDI721J6q3jrqh/ZMM8CeChXmjLEDHNE3H3MvD+lhwf8oHuIiWL5GzNttXTlnB/fYjbBmPkcEQ4wcCGlqe0Uio+vYJZ+EcaSJN031bvqGz/gXmJZ+78hBbqs3paTfvwLbeRBcw0c/OjymLFvocaj5gYpgPMAxixNXeMXtAixrCtvt7Twu35xvHayYYq7924wbSTZMLsBvMXAJylN3eQXsDQxcQ9Sf1JTjvrFytkFDfMMAR3M0CkUmzjIRLvBOG7p6pN+wcoRExgEPJ/U1AN+8YSdHDPfAWE7GK+TbCQ+BvgRInotGVH2+AWqREzgODbap/vUC34xQ/HEQWbeDaZTJMfNj8B4dCmIEfMTST38XnXEjImXARqo9VaC6HK6/oYNf3TfYfklNmcrQ3Gzixnv1/LwA7joLAtsnu5uueqXVLae5g9/MJ5YT8yiao9amtrmF6jMGfvsunPTlpkdzUm/WDk72UhccnWCKBdChjn29WtikYnaKvXxsyD5Kykfn/mkbNPjiX71n4WSEvrAJjaFX33D8oY5VxIxDyT1sK8Wel7GCMetiP9yU0g8ZCT6GHwERMNWRHm4Fpc4QHTEiihPLzRLBVV/2FVSTM9aunKo6rYnaCSeIvAQE72aiih7F0Uqo6Dmtz3Zqvv/axQFMVdtsz0ihG0t5VqlTOblXInWWgC4qhuIul/oEsi2QpJzZVwJMTJbBjzq+7+Sb8VUeXHB61HhSyHj5sg2oKgaLz0i8KjxWso5r6AupcKzbVPp4+kFEUKllkMVAPPUt5dJxRGAq85tRF0hnB1DgflcIBA4XUkfiD6ebXQQ4UGhgDKBazCGyr1BVqVvKzK4G2PALD64wyq3f88/tR3cedNbzahTyDGJ6XOq47M1H3UWO4VC9tlpSZUCUIhZZZIUsGj188Nh6c/0V1N7Vs9UKrLF1v8FJ5yEXcWLNvkAAAAASUVORK5CYII=',
//     },
//     {
//       type: 'node1',
//       label: '用户任务1',
//       icon: 'data:image/png;base64,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',
//     },
//     {
//       type: 'node2',
//       label: '用户任务2',
//       icon: 'data:image/png;base64,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',
//     },
//     {
//       type: 'custom-node',
//       label: '用户任务3',
//       icon: 'data:image/png;base64,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',
//     },
//     {
//       type: 'endNode',
//       label: '结束节点',
//       icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAA+ZJREFUWEfNmF+oFHUUx7/nt3rpIeTO3MQMfLGZNRBS0JesBy1D8soVMyqKnrypO5tCPSRk4A1UsIcCb/tb/FMPgoJRkaXlg5ebgvmSiILi3d/US0Rl985chB5aunNidnZ2Z9bdnb17dZuFfdj9nT+fOef3O+fMj5DSD6WUC3MC6x9VazOCdSaqfOF5IEGTgjHpCdjOTvNWtw8+azDtk4mNRJkhCAyBeXGC45tE+JY9uujkjfOzgewYTCvaTxNjF8CvzMZBXZZOM2HUzRmXO9HvCEwrlvYT094Gg3cBXCHgEjP+ZBJ/+OvE3qNEWMTgNSB6Hoy+mB7jYydvvpMElwg2INVJBl6rGSIa85gPTz9SPo+Xl5fbOVhw/Fc9U/7nJYC3E7CqbgNXnJy5pp1uWzBdKm5QftOxzONJT9tsXZP2dgIfia45ltnSf8sFvah+BOOp0BAjs8K1lt7oBirU0aT9AoG/C38TcGrKMl9vZrMpmF5QH4HwdqjQ7sm6AY1mgokPuLns+4127gHTZGmQQGfrkaKNrmV83w1AKx1N/vIkYeZ6zQfRM42nNQ42zvP0W/YlUJBCBu1wLeNoKwd6YWIEQjA8j5z8spHZwMf3HJ12LOPVqH4MrOKIxL4AClddy1zdzpkm1TgBa32ZbtKtSfVTeFoZ8czEwDSpzhAw1Em0fJm5g9VPKoNHXSu7O3Iw6jHRpXIB9INQ/nf+Q4vvDi9xHmTEHj6sFvbNw28A5jNgu5Zp3gPWXyitFETXggU+51jZTUl7Zq4R8+3rUo0BeDbI0swK13qiUpJqqRwoqjeYcaL6594pyzzYC7ABqd5j4IDvSwCbJy3zmxiYVrT3E3PQDxnDTt78tBdgekFtAyHoJoRtTs78LAamy9IXAG0NuMQm13r8XC/ANPnzIMGr1E1m3uPmsx82gNlfAvzi/wpGtMfNGXGwgULpEBO9220qk6LrzWDd9C7zh0a5WCqB2pBQ2/y6VMMAjnW7+bsFi25+Yt46lc9+FUulP7+LDMaDVNLXrmVsSXLml4skmXCdZ/BB04hJ5Y/cG3y5aFTrld/vk7ftv6sT57Rzp7wII+0HwU6hWsp9frNPn+z7C8ACEP3u5IzHQtl4r5T2WYAHK/TA5ulqTZkzQAsD/VINCeBMsK/piJM3djYHizRxEI05OWP9g4Ly7epF+wKYn6twed6g+9ay6BAZcd0w9iBySu43YPSwAQljj+88nYNiNSypHK3DlKXyZaQGl8bXtxAulS+8IVwqrwjqcCm8VInWsNRdQzUrsNXGbxCzySQMwGMmcVuAJ5hwtacXd/e7A7Syl3gN1SuQRj//ARDQB0UouH96AAAAAElFTkSuQmCC',
//     },
//     {
//         label:'选区',
//         icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAAAXNSR0IArs4c6QAAAUdJREFUWEftV9ENwiAQPXAB7Q7GMWzX0TiDdgZjHcd2DNMd1AHsYWgCuTbFlFw/aANfDfCOxzt4PQQE2kSgvCAS881MVGwyxTZF/egHUw3kn9O21P10XCisXsfdRfevr3UqVnA22Pdhm5nvoZh0nK7nTKUOIgBSOhkbyCgxO64wp8TkCtpNKYCSLpwUtaLx+uMLIqYw17tBlKVRLLnXZ0C0incUk2iVNv0abzFCtqnmK0ZS5XuI+/OT2/MCHGJcAlx89DFfBf/ahQlGfcp3gaEzpoTcD/mcv12EdPg7BhsSMZdPTZFKGoP63KhUcglw8fOzi9ahSXNJ7qvM2LjjqouQDn+wt9JVCPqmbnKD5RLg4ud3K7k75uLnfytBSoVfqGxp7fA5/UqSrtLaYDgVbHwlkXfnqJ94sA9e7q3i4qOP+SoYFVuMYj+QKUM2eJOYrwAAAABJRU5ErkJggg==',
//         callback: () => {
//             if (lf.value && lf.value && lf.value.extension && lf.value.extension.selectionSelect) {
//             lf.value.extension.selectionSelect.openSelectionSelect();
//             lf.value.once('selection:selected', () => {
//             lf.value.extension.selectionSelect.closeSelectionSelect();
//             })
//         }
//     }


//   }]
// 监听图数据变化
watch(() => graphData.value, (newGraphData) => {
  if (newGraphData && lf.value) {
    console.log('Rendering new graph data:', newGraphData);
    lf.value.render(newGraphData);
  }
}, { deep: true });

// 挂载
onMounted(()=>{

    lf.value=new LogicFlow({
        container:container.value,
        plugins:[DndPanel,SelectionSelect,Group,Control,Menu],
        background:{
            backgroundColor:'#f5f5f5'
        },
        edgeType:'smoothPolyline',
        connectValidate: true,
        stopScrollGraph: true,
        stopMoveGraph: true,
        stopZoomGraph: true,
    })
    // lf.value.extension.dndPanel.setPatternItems(patternItems)
    lf.value.register(smoothPolyline)
    lf.value.register(startNode)
    lf.value.register(endNode)
    lf.value.register(node1)
    lf.value.register(node2)
    
    if (workflowStore.graphData['currentGraph']) {
    graphData.value = workflowStore.graphData['currentGraph']
    // 初始化你的工作流程图
    console.log('Initializing graph with data:', graphData.value)
    // 这里添加初始化图的逻辑
  }
    // 渲染
    console.log(graphData.value)
    lf.value.render(graphData.value)
    

    
    lf.value.on('blank:click', closeMenu);
    lf.value.on('custom-node-event:click',({ data}) => {
    showNodeMenu(data);
  })
    lf.value.on('node:dbclick', ({ data }) => {
      console.log(data)
    selectedNode.value = data;
    showDialog.value = true;
  });

    lf.value.on('connection:not-allowed',({msg})=>{
      if(msg){
        console.log(msg)
        ElMessage({
          message: msg,
        type: 'error',
        duration: 3000,
        appendTo:container.value,
        
        })
      }
    })
});

// 显示节点菜单
const showNodeMenu = (nodeData) => {
  selectedNode.value = nodeData;
  // 调整菜单位置，考虑节点的尺寸
  menuPosition.value = {
    x: nodeData.x +90,
    y: nodeData.y -70,
  };
  showMenu.value = true;
};
// 关闭节点菜单
const closeMenu = () => {
  showMenu.value = false;
};
// 添加子节点
const addChildNode = (type) => {
  const parentNode = selectedNode.value;
  const childNode = {
    type: type,
    x: parentNode.x+250 ,
    y: parentNode.y,
    properties: {
      nodeType: type,
    },
  };
  const childId = lf.value.addNode(childNode);
  console.log(childId)
  lf.value.addEdge({
    sourceNodeId: parentNode.id,
    targetNodeId: childId.id,
  });
  closeMenu();
};
// 运行
const run = () => {
  // 在这里添加您的运行逻辑
  showEnd.value=true;
  if (fromData){
  let prompt=fromData.system+','+fromData.user+','+"以下是需要处理的内容"+fromData.content
  console.log(prompt)
  sendPrompt(prompt).then(res=>{
  fromData.output=res
  console.log(res)
})
}
  console.log('运行按钮被点击');
};
// 保存
const save = async () => {
  console.log(graphData.value);
  isShowWorkflowForm.value=true
}
 const handleSaveWorkflow = async (formData) => {
  // 保存工作流的逻辑，更新后端数据库
  const task_data={title:formData['task_name'],showOption:false}
  console.log(task_data,graphData.value)
  const response=await postGraphData(task_data,graphData.value)
  console.log(response)
};
</script>

<template>
    
    <div class="logicflow-container">
    <div ref="container" id="container"></div>
    <node-menu
      v-if="showMenu"
      :position="menuPosition"
      :nodeData="selectedNode"
      @add-child="addChildNode"
      @close="closeMenu"
    />
    <div class="button-container">
      <el-button class="btn-run" type="primary" round @click="run" size="large" :icon="CaretRight">运行</el-button>
      <el-button class="btn-save" type="success" round @click="save" size="large" :icon="Check">保存</el-button>
    </div>
    <!-- 其他组件保持不变 -->
    <End v-if="showEnd" @close="showEnd = false" @update="UpdateEnd"   ></End>
    <div v-if="showDialog">
    <Start v-if="selectedNode.type==='startNode'"  @close="showDialog = false" @update="UpdateStart "></Start>
    <PropertyDialog v-if="selectedNode.type==='node1'"  @close="showDialog = false" @update="UpdateLLM " />
    <PropertyDialogA v-if="selectedNode.type==='node2'" :node="selectedNode" @close="showDialog = false" @update="handleUpdateName " />
    <PropertyDialogB v-if="selectedNode.type==='vuehtml3'" :node="selectedNode" @close="showDialog = false" @update="handleUpdateName " />
    
    </div>
    <WorkflowForm 
      v-if="isShowWorkflowForm" 
      @close="isShowWorkflowForm = false"
      @save="handleSaveWorkflow"
    />
  </div>
   


</template>

<style scoped>
.logicflow-container {
  width: 100%;
  height: 100%;
  position: relative;
}

#container {
  width: 100%;
  height: calc(100% - 60px); /* 减去按钮容器的高度 */
  border: none;
}
.button-container {
  position: absolute;
  bottom: 10px;
  right: 175px;
  display: flex;
  gap: 10px;
}

.btn-run, .btn-save, .btn-back {
  position: absolute;
  top: 5px;
}

.btn-run {
  right: 220px;
}

.btn-save {
  right: 120px;
}

.btn-back {
  right: 20px;
}

.lf-dndpanel {
  display: flex;
  flex-direction: row;
  
  
  height: 60px;
  left: 20px;
  
  padding: 10px;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.lf-dndpanel .lf-dnd-item {
  margin-right: 15px;
  transition: transform 0.2s;
}

.lf-dndpanel .lf-dnd-item:hover {
  transform: scale(1.1);
}

.lf-dndpanel .lf-dnd-item:last-child {
  margin-right: 0;
}

</style>