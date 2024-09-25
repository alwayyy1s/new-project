import { HtmlNode, HtmlNodeModel } from '@logicflow/core';
import { createApp, h } from 'vue';
import startNode from './startNode.vue';

class VueHtmlNode extends HtmlNode {
  constructor(props) {
    super(props);
    this.isMounted = false;
    this.nodeData = props.model.getProperties();
    this.r = h(startNode,{
      onCustomEvent: this.handleCustomEvent.bind(this)
    });
    this.app = createApp({
      render: () => this.r
    }); 
  }


  setHtml(rootEl) {
    if (!this.isMounted) {
      this.isMounted = true;
      const node = document.createElement('div');
      rootEl.appendChild(node);
      this.app.mount(node);
    }
    } 
   // 自定义事件处理程序
  handleCustomEvent() {
    const nodeData= this.props.model
    console.log('Custom event triggered:',nodeData);
    // 可以在这里触发 LogicFlow 的事件或者进行其他操作
    this.props.model.graphModel.eventCenter.emit('custom-node-event:click',{
    data:nodeData,
    });
  }
  }

class VueHtmlNodeModel extends HtmlNodeModel {
  setAttributes() {
    this.width =170;
    this.height = 150;
    this.text.editable=false
    // this.properties = {
    //   title: '任务1',
    //   content: '节点内容...'
    // };
  }

  getConnectedSourceRules() {
    const rules = super.getConnectedSourceRules();
    rules.push({
      message: '不能连自己',
      validate: (source, target) => source && target && source.id !== target.id
    });
    return rules;
  }

  getConnectedTargetRules() {
    const rules = super.getConnectedTargetRules();
    rules.push({
      message: '不能连自己',
      validate: (source, target) => source && target && source.id !== target.id
    });
    return rules;
  }

  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = 'none';
    style.hover.stroke = 'none';
    return style;
  }
  getDefaultAnchor() {
    const { id, x, y, width, height } = this
    const anchors = []
    anchors.push({
      x: x - width / 2,
      y: y- height/2+53,
      id: `${id}_incomming`,
      edgeAddable: false,
      type: 'incomming'
    })
    anchors.push({
      x: x -width / 2+135,
      y:y- height/2+53,
      id: `${id}_outgoing`,
      type: 'outgoing'
    })
    return anchors
  }

  getAnchorStyle(anchorInfo) {
    const style = super.getAnchorStyle(anchorInfo);
    style.stroke = '#555';
    style.fill = '#fff';
    return style;
  }
}

export default {
  type: 'startNode',
  model: VueHtmlNodeModel,
  view: VueHtmlNode
};
