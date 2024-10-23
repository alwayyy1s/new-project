<template>
  <div class="container">
    <div class="header">
      <svg t="1720579404531" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3201" width="200" height="200"><path d="M678.528 642.304c0 17.6-14.4 32-32 32h-268.992a32 32 0 0 1-32-32V381.696a32 32 0 0 1 32-32h268.992c17.6 0 32 14.4 32 32v260.608z" fill="#101317" p-id="3202"></path><path d="M1015.552 512.128a502.656 502.656 0 0 0-503.68-503.68 502.208 502.208 0 0 0-356.096 147.264 502.016 502.016 0 0 0-147.328 356.416 500.288 500.288 0 0 0 146.816 356.736 499.584 499.584 0 0 0 356.544 146.688c277.312-2.816 503.744-226.24 503.744-503.424z m-947.968 0a444.288 444.288 0 0 1 444.288-444.544c246.976 0 447.296 200.128 447.296 444.544 0 244.032-200.32 444.416-447.296 444.416a442.304 442.304 0 0 1-444.288-444.416z" fill="#101317" p-id="3203"></path></svg>
      <h3>开始</h3>
    </div>
  

    <div class="add" @click="handleClick" >
      <svg v-if="props.showCross" t="1724750019594" class="icon add-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1054" width="200" height="200"><path d="M873.753974 149.961384A511.715358 511.715358 0 1 0 149.676742 874.038616 511.715358 511.715358 0 0 0 873.753974 149.961384zM831.537457 828.623878a447.750939 447.750939 0 1 1-633.247756-633.247756 447.750939 447.750939 0 0 1 633.247756 633.247756z" fill="#2c2c2c" p-id="1055"></path><path d="M767.573037 480.01779H543.697568V256.142321a31.98221 31.98221 0 0 0-63.96442 0v223.875469H255.857679a31.98221 31.98221 0 0 0 0 63.96442h223.875469V767.857679a31.98221 31.98221 0 0 0 63.96442 0V543.98221H767.573037a31.98221 31.98221 0 0 0 0-63.96442z" fill="#2c2c2c" p-id="1056"></path></svg>
    </div>

</div>


</template>

<script setup>
import { ref,defineEmits} from 'vue';

const props=defineProps(['showCross'])
const emit=defineEmits(['customEvent'])
const handleClick=()=>{
  emit('customEvent')

}

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  position: relative;
  padding-top: 20px
}

.header {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;   
  border-radius: 15px;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
  background: #fff;
  width: 135px;
  height: 70px;
}

.header:hover {
  transform: scale(0.98);
  box-shadow: 0 4px 12px rgba(246, 240, 240, 0.15);
}
.icon {
  width: 20px;
  height: 20px;
  padding-left: 20px;
}

.add {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  flex-grow: 0;   
  margin-left: -15px;
  background: transparent;
  z-index: 1000; 
  cursor: pointer;
}

.add-icon {
  width: 24px;
  height: 24px;
}

h3 {
  font-size: 20px;
  font-weight: 500;
  color: #333;
}



</style>