<template>
    <div class="home">

        <div id="canvases">
            <canvas ref="originCanvas" id="originCanvas"></canvas>
            <canvas ref="mixedCanvas" id="mixedCanvas"></canvas>
            <canvas ref="idftCanvas" id="idftCanvas"></canvas>
        </div>
        <div id="title">
            <h1>离散傅里叶变换</h1>
        </div>

        <div class="col-md-6 col-sm-12">
            <router-link v-bind:to="'/wave'">
                <img src="../assets/f.jpg" alt="wave" class="col-md-6 col-sm-6 col-xs-12">
            </router-link>
            <div class="col-md-6 col-sm-6 col-xs-12 intro">
                <h3><router-link v-bind:to="'/wave'">一维信号</router-link></h3>
                <p>傅立叶变换(Fourier Transform)是一种分析信号的方法，它可以分析信号的成分，并利用这些成分合成信号。<br>许多波形可作为信号的成分，比如正弦波、方波、锯齿波等，傅立叶变换就是用正弦波作为信号的成分。</p>
            </div>

        </div>
        <div class="col-md-6 col-sm-12">
            <router-link v-bind:to="'/contour'">
                <img src="../assets/m.jpg" alt="contour" class="col-md-6 col-sm-6 col-xs-12">
            </router-link>
            <div class="col-md-6 col-sm-6 col-xs-12 intro">
                <h3><router-link v-bind:to="'/contour'">二维轮廓</router-link></h3>
                <p>二维离散傅里叶变换是将图像从空间域转换到频域的变换方法，在图像增强、图像去噪、图像边缘检测、图像特征提取、图像压缩等等应用中都起着极其重要的作用。</p>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HelloWorld',
    data () {
        return {
            originCanvas: null,
            mixedCanvas: null,
            idftCanvas: null,

            originCtx: null,
            mixedCtx: null,
            idftCtx: null,

            time: 0,
        }
    },
    methods: {
        func1(x) {
            return 50*Math.sin(x/20);
        },
        func2(x) {
            return 50*Math.sin(x/10);
        },
        render() {
            requestAnimationFrame(this.render);
            this.originCtx.clearRect(0, 0, parseInt(this.originCanvas.getAttribute('width')), parseInt(this.originCanvas.getAttribute('height')));
            this.mixedCtx.clearRect(0, 0, parseInt(this.mixedCanvas.getAttribute('width')), parseInt(this.mixedCanvas.getAttribute('height')));
            this.idftCtx.clearRect(0, 0, parseInt(this.idftCanvas.getAttribute('width')), parseInt(this.idftCanvas.getAttribute('height')));
            
            this.originCtx.beginPath();
            for (let i = 0; i < parseInt(this.originCanvas.getAttribute('width')); i++)
                this.originCtx.lineTo(i, this.func1(i+this.time) + 64);
            this.originCtx.stroke();

            this.originCtx.font="40px Arial";
            this.originCtx.fillText('+', 150, 170);

            this.originCtx.beginPath();
            for (let i = 0; i < parseInt(this.originCanvas.getAttribute('width')); i++)
                this.originCtx.lineTo(i, this.func2(i+this.time) + 256);
            this.originCtx.stroke();

            this.mixedCtx.beginPath();
            for (let i = 0; i < parseInt(this.mixedCanvas.getAttribute('width')); i++)
                this.mixedCtx.lineTo(i, this.func1(i+this.time) + this.func2(i+this.time) + parseInt(this.mixedCanvas.getAttribute('height')) >> 1);
            this.mixedCtx.stroke();

            this.idftCtx.beginPath();
            for (let i = 0; i < parseInt(this.idftCanvas.getAttribute('width')); i++)
                this.idftCtx.lineTo(i, this.func1(i+this.time) + 64);
            this.idftCtx.stroke();

            this.idftCtx.font="40px Arial";
            this.idftCtx.fillText('+', 150, 170);

            this.idftCtx.beginPath();
            for (let i = 0; i < parseInt(this.idftCanvas.getAttribute('width')); i++)
                this.idftCtx.lineTo(i, this.func2(i+this.time) + 256);
            this.idftCtx.stroke();

            this.time += 1;
        }
    },
    mounted() {
        this.originCanvas = this.$refs.originCanvas;
        this.mixedCanvas = this.$refs.mixedCanvas;
        this.idftCanvas = this.$refs.idftCanvas;

        this.originCanvas.setAttribute('width', parseInt(window.innerWidth / 5) + 'px');
        this.originCanvas.setAttribute('height', '360px');
        this.mixedCanvas.setAttribute('width', parseInt(window.innerWidth / 3) + 'px');
        this.mixedCanvas.setAttribute('height', '360px');
        this.idftCanvas.setAttribute('width', parseInt(window.innerWidth / 5) + 'px');
        this.idftCanvas.setAttribute('height', '360px');

        this.originCtx = this.originCanvas.getContext('2d');
        this.mixedCtx = this.mixedCanvas.getContext('2d');
        this.idftCtx = this.idftCanvas.getContext('2d');

        this.originCtx.strokeStyle = '#222';
        this.originCtx.lineWidth = 2;
        this.mixedCtx.strokeStyle = '#222';
        this.mixedCtx.lineWidth = 2;
        this.idftCtx.strokeStyle = '#222';
        this.idftCtx.lineWidth = 2;

        this.render();
    }
}
</script>

<style>
#title{
    background-color: rgba(21, 165, 201, 0.6);
    color: #FFF;
    position: absolute;
    top: 52px; left: 0px;
    width: 100%; height: 360px;
}
.intro{
    text-align: left;
}
.intro p{
    color: #787878;
}
#canvases{
    text-align: center;
    z-index: 0;
}
.jumbotron{
    background-color: rgba(7, 142, 151, 0.363);
    color: #FFF;
    height: 500px; width: 100%;
    z-index: 1;
}
#originCanvas{
    float: left;
}
#idftCanvas{
    float: right;
}
</style>
