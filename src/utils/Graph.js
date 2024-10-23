import axios from 'axios'
// 获取工作流卡片数据
async function getWorkCardData(){
    const response =await axios({
        url:'http://0.0.0.0:8020/get_all_cards',
        method:'get',
    
    })
    return response.data

}
// 获取工作流图数据
async function getGraphData(task_name){
    const response =await axios({
        url:'http://0.0.0.0:8020/get_graph_by_taskname',
        method:'get',
        params:{
            task_name:task_name
        }
    })
    return response.data
}
// 保存工作流图数据
async function postGraphData(task_data,graph_data){
    const response =await axios({
        url:'http://0.0.0.0:8020/save_graph/',
        method:'post',
        headers:{
            'Content-Type': 'application/json'
        },
        data:{
            task:task_data,
            data:graph_data
        }
    })
    return response.data
}
// 删除工作流图数据
async function deleteGraphData(task_name){
    const response =await axios({
        url:'http://0.0.0.0:8020/delete_alldata/',
        method:'delete',
        params:{
            task_name:task_name
        }
    })
    return response.data
}
export  {getWorkCardData,getGraphData,postGraphData,deleteGraphData}
