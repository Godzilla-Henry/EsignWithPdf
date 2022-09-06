<template>
    <div class="preview-pdf">
        <div class="container" style="text-align: center;">
            <h1>PDF ESign</h1>
            <div class="row">
                <div class="col-md-6">
                    <h5>PDF 檔案檢視</h5>
                    <div style="height: 350px; overflow-y: scroll; border: 1px dashed black; margin-bottom: 20px;">
                        <canvas
                            v-for="page in pdfPages"
                            :key="page"
                            :id="'pdfCanvas' + page"
                        ></canvas>
                    </div>
                    <h5>電子簽章</h5>
                    <small style="color: red;">詳細閱讀後在最後一頁簽名。</small>
                    <div style="margin-bottom: 10px;">
                        <vue-esign 
                            ref="esign" 
                            :height="400" 
                            :isCrop="isCrop" 
                            :lineWidth="lineWidth" 
                            :lineColor="lineColor"
                            style="border: 1px solid black;"
                        />
                    </div>
                    <div>
                        <button 
                            type="button" 
                            class="btn btn-secondary" 
                            @click="handleReset"
                            style="margin: 0 20px;"
                        >清空</button>
                        <button 
                            type="button" 
                            class="btn btn-primary" 
                            @click="handleGenerate"
                            style="margin: 0 20px;"
                        >確定</button>
                    </div>
                </div>
                <div class="col-md-6">
                    <h5>產出文件檔案</h5>
                    <div style="border: 1px dashed black;">
                        <canvas id="fabricCanvas" width="612" height="740"></canvas>
                    </div>
                    <button 
                        type="button" 
                        class="btn btn-success" 
                        @click="download"
                        style="margin: 10px 20px;"
                    >下載</button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
const PDFJS = require("pdfjs-dist");
PDFJS.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.5.207/pdf.worker.js";
import { fabric } from 'fabric'
let canvas = null;

import { jsPDF } from "jspdf";

export default {
    data() {
        return {
            pdfPages: [], // PDF頁數
            pdfWidth: "", // PDF寬度
            pdfSrc: "", // PDF位址
            pdfDoc: "", // PDF内容
            pdfScale: 1.0, // 放大倍數

            lineWidth: 6,
            lineColor: '#000000',
            bgColor: '',
            resultImg: '',
            isCrop: false,

        };
    },
    mounted() {
        this.getPdfUrl();
        canvas = new fabric.Canvas('fabricCanvas');
    },
    methods: {
        // pdf位址
        getPdfUrl() {
            this.pdfSrc =
            "https://raw.githubusercontent.com/mozilla/pdf.js/ba2edeae/web/compressed.tracemonkey-pldi-09.pdf";
            this.loadFile(this.pdfSrc);
        },
        loadFile(url) {
            // 使用promise取得pdf
            let loadingTask = PDFJS.getDocument(url);
            loadingTask.promise.then(pdf => {
                this.pdfDoc = pdf;
                this.pdfPages = pdf.numPages;
                this.$nextTick(() => { 
                    this.renderPage(1); // 渲染第一頁
                });
            });
        },
        // PDF 渲染頁面
        renderPage(num) {
            const that = this;
            this.pdfDoc.getPage(num).then(page => {
                let canvas = document.getElementById("pdfCanvas" + num);
                let ctx = canvas.getContext("2d");
                let dpr = window.devicePixelRatio || 1;
                let bsr =
                    ctx.webkitBackingStorePixelRatio ||
                    ctx.mozBackingStorePixelRatio ||
                    ctx.msBackingStorePixelRatio ||
                    ctx.oBackingStorePixelRatio ||
                    ctx.backingStorePixelRatio ||
                    1;
                let ratio = dpr / bsr;
                let viewport = page.getViewport({ scale: this.pdfScale });
                canvas.width = viewport.width * ratio;
                canvas.height = viewport.height * ratio;

                canvas.style.width = viewport.width + "px";
                that.pdfWidth = viewport.width + "px";
                canvas.style.height = viewport.height + "px";

                ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

                // 將 PDF 頁面渲染到 canvas 上下文中
                let renderContext = {
                    canvasContext: ctx,
                    viewport: viewport
                };
                page.render(renderContext);
                if (this.pdfPages > num) {
                    this.renderPage(num + 1);
                }
            });
        },
        // Canvas 轉 image
        convertCanvasToImage(canvas) {
            var image = new Image();
            image.src = canvas.toDataURL("image/png");
            return image;
        },
        print(){
            let pdfCanvas  = document.getElementById("pdfCanvas" + 14);
            let imgUrl = this.convertCanvasToImage(pdfCanvas);
            console.log(imgUrl.src);
            fabric.Image.fromURL(imgUrl.src, (img, err) => {
                if(err) {
                    canvas.setBackgroundColor('rgba(85, 107, 198, 0.6)', 
                    canvas.renderAll.bind(canvas))
                }else {
                    canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
                        scaleX: canvas.width / img.width,
                        scaleY: canvas.height / img.height,
                        crossOrigin: 'anonymous' // 使用圖片跨域時配置
                    });
                }
            });

            let imgSign = this.resultImg;
            fabric.Image.fromURL(imgSign, (img, err) => {
                if(!err) {
                    img.set({
                        left: 300, // 左上角位置
                        top: 500, // 左上角位置
                        hasControls: false, // 设置为false时，选中的时候不出现旋转缩放标识
                        hasBorders: false, // 设置为false时，选中的时候不出现边框
                        selectable: false, // 不能被选择
                        selection: false, // 不会出现被选中的效果
                        crossOrigin: 'anonymous' // 使用圖片跨域時配置
                    });
                    img.scaleToHeight(300);
                    img.scaleToWidth(300);
                    canvas.add(img);
                }
            })
        },
        
        // 清空
        handleReset () {
            this.$refs.esign.reset();
            canvas.clear();
        },
        handleGenerate () {
            this.$refs.esign
            .generate()
            .then(res => {
                this.resultImg = res;
                this.print();
                console.log(this.resultImg);
                console.log(this.base64ImgtoFile(res));
            })
            .catch(err => {
                alert(err) // 未簽字時執行 'Not Signned'
            })
        },
        // base64轉檔案
        base64ImgtoFile(dataurl, fileName='file') {
            const arr = dataurl.split(",");
            const mime = arr[0].match(/:(.*?);/)[1];
            const suffix = mime.split('/')[1]
            const bstr = atob(arr[1]);
            let n = bstr.length;
            var u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], `${fileName}.${suffix}`, { type: mime });
        },

        // 檔案下載
        download(){
            var imgData = canvas.toDataURL("image/jpeg", 1.0);
            var doc = new jsPDF("p", "mm", "a4");

            var width = doc.internal.pageSize.getWidth();
            var height = doc.internal.pageSize.getHeight();

            doc.addImage(imgData, 'JPEG', 0, 0, width, height);
            doc.save("download.pdf");
        },
    }
};
</script>

<style lang="css" scoped>
    .container{
        padding: 10px 20px;
    }
</style>

