<template>
    <div id="about">
        <!-- 主体 -->
        <button id="originTrigger" class="btn btn-success">原序列</button>
        <button id="dftTrigger" class="btn btn-default">傅里叶序列</button>
        <button id="idftTrigger" class="btn btn-primary">逆变换序列</button>
        <div id="body">
            <div id="drawingPanel">
                <canvas id="drawingCanvas" @mousedown="drawingMouseDown" @mousemove="drawingMouseMove" @mouseup="drawingMouseUp"></canvas>
                <ol id="drawingList">
                    <li v-for="item in listItems.drawingListItems" :key="item" v-html="item"></li>
                </ol>
            </div>
            <div id="idftPanel">
                <canvas id="idftCanvas"></canvas>
                <ol id="idftList">
                    <li v-for="item in listItems.idftListItems" :key="item" v-html="item"></li>
                </ol>
            </div>
            <div id="control">
                <input id="slider" type="range" step="1" min="1" :max="max_terms" v-model="terms_val" @change="sliderChanged">
                <input type="text" id="terms" disabled="disabled" v-model="terms_val">
            </div>
            <canvas id="displayCanvas"></canvas>
        </div>
    </div>
</template>

<script>
import {Complex, dft, idft, getMinComplex} from '../assets/js/mathUtils.js'
export default {
    name: 'about',
    data() {
        return {
            max_terms: 1,

            mouseIsDown: false,     // 鼠标是否被按下
            mouseX: 0,
            mouseY: 0,
            a: [],          // 原序列
            a_ft: [],       // 傅里叶序列
            a_ift: [],      // 反傅里叶序列
            terms_val: 0,   // 傅里叶序列的项数

            slider: null,
            terms: null,
            drawingList: null,
            idftList: null,
            originTrigger: null,
            dftTrigger: null,
            idftTrigger: null,
            drawingCanvas: null,
            displayCanvas: null,
            idftCanvas: null,

            drawingCtx: null,
            displayCtx: null,
            idftCtx: null,

            listItems: {
                drawingListItems: [],
                idftListItems: []
            }
        }
    },
    methods: {
        sliderChanged(e) {
            let a_ft_copy = [].concat(this.a_ft);        // 拷贝傅里叶序列
            let expandNum = e.target.value;              // 获取输入框项数

            let removeNum = this.a_ft.length - expandNum;     // 需要除去的项数
            for (let i = 0; i < removeNum; i++) {
                a_ft_copy.splice(getMinComplex(a_ft_copy)[1], 1);
            }

            let new_idft = idft(a_ft_copy);       // 根据截取到的信号进行反变换

            // 绘制IDFT
            idftList.innerHTML = '';
            this.idftCtx.clearRect(0, 0, parseInt(idftCanvas.getAttribute('width')), parseInt(idftCanvas.getAttribute('height')));
            this.idftCtx.beginPath();
            for (let i = 0; i < new_idft.length; i++) {
                this.idftCtx.lineTo(new_idft[i].real + parseInt(idftCanvas.getAttribute('width'))/2, new_idft[i].imaginary + parseInt(idftCanvas.getAttribute('width'))/2);
                this.listItems.idftListItems.push('<li>a<sup>\"</sup><sub>' + i + '</sub> = ' + new_idft[i].real.toFixed(0) + '+' + new_idft[i].imaginary.toFixed(0) + 'i' + '</li>');
            }
            this.idftCtx.stroke();
        },
        drawingMouseDown(e) {
            this.mouseIsDown = true;
            this.a = [];     // 清空原序列
            drawingList.innerHTML = '';
            this.drawingCtx.clearRect(0, 0, parseInt(drawingCanvas.getAttribute('width')), parseInt(drawingCanvas.getAttribute('height')));
            this.drawingCtx.beginPath();
        },
        drawingMouseMove(e) {
            this.mouseX = e.offsetX;
            this.mouseY = e.offsetY;
            if (this.mouseIsDown) {
                this.listItems.drawingListItems.push('<li>a<sub>' + drawingList.children.length + '</sub> = ' + (this.mouseX - parseInt(drawingCanvas.getAttribute('width'))/2) + '+' + (this.mouseY - parseInt(drawingCanvas.getAttribute('height'))/2) + 'i' + '</li>');
                this.drawingCtx.lineTo(this.mouseX, this.mouseY);
                this.a.push(new Complex(this.mouseX - parseInt(drawingCanvas.getAttribute('width'))/2, this.mouseY - parseInt(drawingCanvas.getAttribute('height'))/2));
            }
            this.drawingCtx.stroke();
        },
        drawingMouseUp(e) {
            this.mouseIsDown = false;

            // 计算傅里叶变换后的序列
            this.a_ft = dft(this.a);

            // 更新控件(Vue)
            this.terms_val = this.a_ft.length;
            this.max_terms = this.a_ft.length;

            // 绘制幅度谱
            let maxLength = this.a_ft[0].getLength();
            this.displayCtx.clearRect(0, 0, parseInt(displayCanvas.getAttribute('width')), parseInt(displayCanvas.getAttribute('height')));
            for (let i = 0; i < this.a.length; i++) {
                this.displayCtx.fillRect(i*parseInt(displayCanvas.getAttribute('width'))/this.a.length + parseInt(displayCanvas.getAttribute('width'))/this.a.length/4, parseInt(displayCanvas.getAttribute('height')), parseInt(displayCanvas.getAttribute('width'))/2/this.a.length, -(this.a_ft[i].getLength()/maxLength*parseInt(displayCanvas.getAttribute('height'))*0.8));
            }

            this.a_ift = idft(this.a_ft);
            // 绘制IDFT
            idftList.innerHTML = '';
            this.idftCtx.clearRect(0, 0, parseInt(idftCanvas.getAttribute('width')), parseInt(idftCanvas.getAttribute('height')));
            this.idftCtx.beginPath();
            for (let i = 0; i < this.a_ft.length; i++) {
                this.idftCtx.lineTo(this.a_ift[i].real + parseInt(idftCanvas.getAttribute('width'))/2, this.a_ift[i].imaginary + parseInt(idftCanvas.getAttribute('width'))/2);
                this.listItems.idftListItems.push('<li>a<sup>\'</sup><sub>' + i + '</sub> = ' + this.a_ift[i].real.toFixed(0) + '+' + this.a_ift[i].imaginary.toFixed(0) + 'i' + '</li>');
            }
            this.idftCtx.stroke();
        },
    },
    mounted() {
        // 控件
        this.slider = document.getElementById('slider');            // 滑动条
        this.terms = document.getElementById('terms');              // 滑条旁边的数值显示
        this.drawingList = document.getElementById('drawingList');  // 原序列显示
        this.idftList = document.getElementById('idftList');        // 逆变换序列显示
        this.originTrigger = document.getElementById('originTrigger');
        this.dftTrigger = document.getElementById('dftTrigger');
        this.idftTrigger = document.getElementById('idftTrigger');
        this.drawingCanvas = document.getElementById('drawingCanvas');
        this.displayCanvas = document.getElementById('displayCanvas');
        this.idftCanvas = document.getElementById('idftCanvas');

        this.originTrigger.onclick = function(e){
            if (drawingList.style.display == 'none')
                drawingList.style.display = 'inline-block';
            else
                drawingList.style.display = 'none';
        };
        this.idftTrigger.onclick = function(e){
            if (idftList.style.display == 'none')
                idftList.style.display = 'inline-block';
            else
                idftList.style.display = 'none';
        };

        // 初始化Canvas
        this.drawingCanvas.setAttribute('height', '480px');
        this.drawingCanvas.setAttribute('width', '480px');
        this.drawingCanvas.style.border = '1px solid #666';

        this.displayCanvas.setAttribute('height', '120px');
        this.displayCanvas.setAttribute('width', '480px');
        this.displayCanvas.style.border = '1px solid #666';

        this.idftCanvas.setAttribute('height', '480px');
        this.idftCanvas.setAttribute('width', '480px');
        this.idftCanvas.style.border = '1px solid #666';

        this.drawingCtx = drawingCanvas.getContext('2d');
        this.displayCtx = displayCanvas.getContext('2d');
        this.idftCtx = idftCanvas.getContext('2d');

        this.drawingCtx.fillStyle = '#e8b004';
        this.drawingCtx.strokeStyle = '#e8b004';
        this.drawingCtx.lineWidth = 2;

        this.displayCtx.fillStyle = '#1781b5';
        this.displayCtx.strokeStyle = '#1781b5';
        this.displayCtx.lineWidth = 2;

        this.idftCtx.fillStyle = '#2376b7';
        this.idftCtx.strokeStyle = '#2376b7';
        this.idftCtx.lineWidth = 2;
    }
}
</script>

<style scoped>
canvas, #drawingList, #idftList{
    background-color: #d8e3e7;
    border-radius: 5px;
    box-shadow: 1px 1px 2px 0px RGBA(128, 128, 128, 0.7);
    color: #222;
}
#slider{width: 30%;}
#terms{width: 60px;}
#drawingPanel, #idftPanel{
    display: inline-block;
}
#drawingList, #idftList{
    display: none;
    height: 480px; width: 120px;
    overflow-y: scroll;
    border: 1px solid #666;
}
#drawingList::-webkit-scrollbar, #idftList::-webkit-scrollbar { width: 10px; }
#drawingList::-webkit-scrollbar-thumb, #idftList::-webkit-scrollbar-thumb {
    background-color:#666;
    border-radius: 5px;
}
input[type=range]{
    display: inline-block;
    margin-top: 8px;
    outline: none; 
    -webkit-appearance: none;   /*清除系统默认样式*/  
    background:  #CCC;  
    background-size: 30% 100%;
    height: 4px;
    border-radius: 2px;  
}

input[type=range]::-webkit-slider-thumb {  
    -webkit-appearance: none;   /*清除系统默认样式*/  
    height: 20px; width: 20px;
    background: #666; 
    border-radius: 50%;  
    border: solid 1px #222; 
}
</style>
