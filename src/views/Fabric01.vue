<template>
    <div>
        <canvas id="canvas" width="600" height="400"></canvas>
    </div>
</template>

<script>
import { fabric } from 'fabric'
let canvas = null
export default {
    name: 'Vue2EsignFabric01',

    data() {
        return {
            
        };
    },

    mounted() {
        canvas = new fabric.Canvas('canvas')
        
        let imgUrl = "https://cdn2.ettoday.net/images/2364/2364428.jpg";
        fabric.Image.fromURL(imgUrl, (img, err) => {
            if(err) {
                canvas.setBackgroundColor('rgba(85, 107, 198, 0.6)', 
                canvas.renderAll.bind(canvas))
            }else {
                canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                    scaleX: canvas.width / img.width,
                    scaleY: canvas.height / img.height,
                    crossOrigin: 'anonymous' // 使用的图片跨域时，配置此参数
                });
            }
        });

        let rect = new fabric.Rect({
            width: 100,
            height: 100,
            fill: 'pink', // 背景颜色
            stroke: 'red', // 边框颜色
            strokeWidth: 4, // 边框宽度
        });

        canvas.add(rect)
    },

    methods: {
        
    },
};
</script>

<style lang="css" scoped>
</style>