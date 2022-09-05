<template>
    <div>
        <vue-esign 
            ref="esign" 
            :width="400" 
            :height="400" 
            :isCrop="isCrop" 
            :lineWidth="lineWidth" 
            :lineColor="lineColor"
            style="border: 1px solid black;"
        />
        <button @click="handleReset">清空</button> 
        <button @click="handleGenerate">確定</button>
        <div>
            <img :src="resultImg" width="400" height="400">
        </div>
    </div>
</template>

<script>
export default {
    name: 'Vue2EsignEsign',
    data() {
        return {
            lineWidth: 6,
            lineColor: '#000000',
            bgColor: '',
            resultImg: '',
            isCrop: false
        };
    },
    mounted() {
        
    },
    methods: {
        handleReset () {
            this.$refs.esign.reset()
        },
        handleGenerate () {
            this.$refs.esign
            .generate()
            .then(res => {
                this.resultImg = res;
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
    },
};
</script>

<style lang="css" scoped>

</style>