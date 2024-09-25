import { PolylineEdge, PolylineEdgeModel, h } from '@logicflow/core';

// 获取平滑的多段线形状
function getSmoothPolylineShape({ pointsList, points, borderRadius, ...oth }) {
  if (pointsList.length <= 2) {
    return h('polyline', { points, ...oth });
  }
  const newPoints = getSmoothPolylinePoints(pointsList, borderRadius);
  return h('g', {}, h('path', { d: getSmoothPath(newPoints), fill: 'none', ...oth }));
}

// 获取平滑多段线的点列表
function getSmoothPolylinePoints(pointList, borderRadius) {
  const result = [{ start: pointList[0], end: pointList[1] }];
  for (let i = 1; i < pointList.length - 1; i++) {
    const start = movePointBTowardsPointA(pointList[i - 1], pointList[i], borderRadius);
    const end = movePointBTowardsPointA(pointList[i + 1], pointList[i], borderRadius);

    result[result.length - 1].end = { ...start };
    result.push(
      { start, end, control: pointList[i] },
      { start: end, end: pointList[i + 1] }
    );
  }
  return result;
}

// 将点B向点A移动指定距离
function movePointBTowardsPointA(pointA, pointB, offset) {
  const vectorAB = { x: pointA.x - pointB.x, y: pointA.y - pointB.y };
  const distanceAB = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
  const scaleFactor = Math.min(offset, distanceAB / 2) / distanceAB;
  return {
    x: pointB.x + vectorAB.x * scaleFactor,
    y: pointB.y + vectorAB.y * scaleFactor,
  };
}

// 获取平滑路径
function getSmoothPath(points) {
  const { start } = points[0];
  let path = `M ${start.x} ${start.y}`;
  points.forEach(({ end, control }) => {
    path += (control ? ` Q ${control.x} ${control.y} ` : ' L') + ` ${end.x} ${end.y}`;
  });
  return path;
}

class SmoothPolylineEdgeModel extends PolylineEdgeModel {
  static extendKey = 'smoothPolyline';
  constructor(data, graphModel) {
    super(data, graphModel);
    this.borderRadius = 8;
  }
  getEdgeStyle() {
    const style = super.getEdgeStyle();
    style.stroke = 'blue';
    style.strokeDasharray = '4 4';
    return style;
  }
  setAttributes(){
    this.isAnimation=true
  }
  getEdgeAnimationStyle() {
    const style = super.getEdgeAnimationStyle();
    style.stroke = 'blue';
    style.animationDuration = '30s';
    style.animationDirection = 'reverse';
    return style;
  }
  getTextStyle() {
    const style = super.getTextStyle();
    style.color = '#3451F1';
    style.fontSize = 20;
    style.background && (style.background.fill = '#F2F131');
    return style;
  }
  getOutlineStyle() {
    const style = super.getOutlineStyle();
    style.stroke = 'none';
    style.hover && (style.hover.stroke = 'red');
    return style;
  }
}

class SmoothPolylineEdgeView extends PolylineEdge {
  getEdge() {
    const { model } = this.props;
    const { pointsList, points, borderRadius, isAnimation, arrowConfig } = model;
    const style = model.getEdgeStyle();
    const animationStyle = model.getEdgeAnimationStyle();
    const {
      strokeDasharray, stroke, strokeDashoffset,
      animationName, animationDuration,
      animationIterationCount, animationTimingFunction,
      animationDirection,
    } = animationStyle;

    return getSmoothPolylineShape({
      pointsList, points, borderRadius,
      ...style, ...arrowConfig,
      ...(isAnimation ? {
        strokeDasharray, stroke,
        style: {
          strokeDashoffset, animationName, animationDuration,
          animationIterationCount, animationTimingFunction, animationDirection,
        },
      } : {}),
    });
  }
}

export default {
  type: SmoothPolylineEdgeModel.extendKey,
  view: SmoothPolylineEdgeView,
  model: SmoothPolylineEdgeModel,
};
