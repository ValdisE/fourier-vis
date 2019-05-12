<template>
    <div id="signal">
        <div class="col-md-2">
            <label for="wave-type">选择波形：</label>
            <select name="" id="wave-type">
                <option value="0">方波</option>
                <option value="0">三角波</option>
                <option value="0">锯齿波</option>
            </select>
            <canvas ref="waveInputCanvas" @mousedown="waveInputMouseDown" @mousemove="waveInputMouseMove" @mouseup="waveInputMouseUp"></canvas>
        </div>
        <div class="col-md-4">
            <p>预览:</p>
            <canvas ref="previewCanvas"></canvas>
        </div>
        <div class="col-md-4">
            <p>模拟信号：</p>
            <canvas ref="idftCanvas"></canvas>
        </div>
    </div>
</template>

<script>
import {Complex, dft, idft, getMinComplex} from '../assets/js/mathUtils.js'

export default {
    name: 'signal',
    data() {
        return {
            mouseX: 0,
            mouseY: 0,
            mouseIsDown: false,

            waveInputCanvas: null,
            previewCanvas: null,
            idftCanvas: null,

            waveInputCtx: null,
            previewCtx: null,
            idftCtx: null,

            originPoints: new Array(128),
            dftPoints: null,
            idftPoints: null,
        }
    },
    methods: {
        waveInputMouseDown(e) {
            this.mouseIsDown = true;
            // 清空输入
            this.waveInputCtx.clearRect(0, 0, parseInt(this.waveInputCanvas.getAttribute('width')), parseInt(this.waveInputCanvas.getAttribute('height')));
            this.initOriginPoints();

            this.waveInputCtx.beginPath();
            this.waveInputCtx.moveTo(0, parseInt(this.waveInputCanvas.getAttribute('height')) >> 1);
            this.originPoints[0].real = parseInt(this.waveInputCanvas.getAttribute('height')) >> 1;
        },
        waveInputMouseMove(e) {
            this.mouseX = e.offsetX;
            this.mouseY = e.offsetY;
            if (this.mouseIsDown) {
                this.originPoints[this.mouseX].real = this.mouseY;
                this.updateWaveInputCanvas();
            }
        },
        waveInputMouseUp(e) {
            this.mouseIsDown = false;
            
            // 执行变换和反变换
            this.dftPoints = dft(this.originPoints);
            this.idftPoints = idft(this.dftPoints);

            this.originPoints[parseInt(this.waveInputCanvas.getAttribute('width'))-1].real = parseInt(this.waveInputCanvas.getAttribute('height'))/2;

            this.updateIdftCanvas();
            this.updatePreviewCanvas();
        },
        // 每当信号输入更新就调用一次，更新预览画布(previewCanvas)
        updatePreviewCanvas() {
            this.previewCtx.clearRect(0, 0, parseInt(this.previewCanvas.getAttribute('width')), parseInt(this.previewCanvas.getAttribute('height')));
            this.previewCtx.beginPath();
            let lnth = this.originPoints.length;
            for (let i = 0; i < lnth; i++) {
                this.previewCtx.lineTo(i, this.originPoints[i].real);
            }
            for (let i = 0; i < lnth; i++) {
                this.previewCtx.lineTo(i + parseInt(this.waveInputCanvas.getAttribute('width')), this.originPoints[i].real);
            }
            this.previewCtx.stroke();
        },
        initOriginPoints() {
            this.originPoints = new Array(128);
            for (let i = 0; i < this.originPoints.length; i++) {
                this.originPoints[i] = new Complex(64, 0);
            }
        },
        updateWaveInputCanvas() {
            this.waveInputCtx.clearRect(0, 0, parseInt(this.waveInputCanvas.getAttribute('width')), parseInt(this.waveInputCanvas.getAttribute('height')));
            this.waveInputCtx.beginPath();
            for (let i = 0; i < this.originPoints.length; i++) {
                this.waveInputCtx.lineTo(i, this.originPoints[i].real);
            }
            this.waveInputCtx.stroke();
        },
        updateIdftCanvas() {
            this.idftCtx.clearRect(0, 0, parseInt(this.idftCanvas.getAttribute('width')), parseInt(this.idftCanvas.getAttribute('height')))
            this.idftCtx.beginPath();
            for (let i = 0; i < this.idftPoints.length; i++) {
                this.idftCtx.lineTo(i, this.idftPoints[i].real);
            }
            for (let i = 0; i < this.idftPoints.length; i++) {
                this.idftCtx.lineTo(i + parseInt(this.waveInputCanvas.getAttribute('width')), this.idftPoints[i].real);
            }
            this.idftCtx.stroke();
        }
    },
    mounted() {
        // 初始化Canvas及上下文
        this.waveInputCanvas = this.$refs.waveInputCanvas;
        this.previewCanvas = this.$refs.previewCanvas;
        this.idftCanvas = this.$refs.idftCanvas;

        this.waveInputCanvas.setAttribute('height', '128px');
        this.waveInputCanvas.setAttribute('width', '128px');
        this.previewCanvas.setAttribute('height', '128px');
        this.previewCanvas.setAttribute('width', '256px');
        this.idftCanvas.setAttribute('height', '128px');
        this.idftCanvas.setAttribute('width', '256px');

        this.waveInputCtx = this.waveInputCanvas.getContext('2d');
        this.previewCtx = this.previewCanvas.getContext('2d');
        this.idftCtx = this.idftCanvas.getContext('2d');

        this.waveInputCtx.strokeStyle = '#000';
        this.previewCtx.strokeStyle = '#000';
        this.idftCtx.strokeStyle = '#000';

        this.waveInputCtx.lineWidth = 2;
        this.previewCtx.lineWidth = 2;
        this.idftCtx.lineWidth = 2;

        this.waveInputCtx.beginPath();
        this.waveInputCtx.moveTo(0, parseInt(this.waveInputCanvas.getAttribute('height'))/2);
        this.waveInputCtx.lineTo(parseInt(this.waveInputCanvas.getAttribute('width')), parseInt(this.waveInputCanvas.getAttribute('height'))/2);
        this.waveInputCtx.stroke();

        this.previewCtx.beginPath();
        this.previewCtx.moveTo(0, parseInt(this.previewCanvas.getAttribute('height'))/2);
        this.previewCtx.lineTo(parseInt(this.previewCanvas.getAttribute('width')), parseInt(this.previewCanvas.getAttribute('height'))/2);
        this.previewCtx.stroke();

        this.idftCtx.beginPath();
        this.idftCtx.moveTo(0, parseInt(this.idftCanvas.getAttribute('height'))/2);
        this.idftCtx.lineTo(parseInt(this.idftCanvas.getAttribute('width')), parseInt(this.idftCanvas.getAttribute('height'))/2);
        this.idftCtx.stroke();

        this.initOriginPoints();
    }
}




// function FFT(size) {
//     this.size = size | 0;
//     if (this.size <= 1 || (this.size & this.size - 1) !== 0) throw new Error('FFT size must be a power of two and bigger than 1');

//     this._csize = size << 1;

//     // NOTE: Use of `var` is intentional for old V8 versions
//     var table = new Array(this.size * 2);
//     for (var i = 0; i < table.length; i += 2) {
//         var angle = Math.PI * i / this.size;
//         table[i] = Math.cos(angle);
//         table[i + 1] = -Math.sin(angle);
//     }
//     this.table = table;

//     // Find size's power of two
//     var power = 0;
//     for (var t = 1; this.size > t; t  <<= 1) {
//         power++;
//     } 
//     // Calculate initial step's width:
//     //   * If we are full radix-4 - it is 2x smaller to give inital len=8
//     //   * Otherwise it is the same as `power` to give len=4
//     this._width = power % 2 === 0 ? power - 1 : power;

//     // Pre-compute bit-reversal patterns
//     this._bitrev = new Array(1 << this._width);
//     for (var j = 0; j < this._bitrev.length; j++) {
//     this._bitrev[j] = 0;
//     for (var shift = 0; shift < this._width; shift += 2) {
//         var revShift = this._width - shift - 2;
//         this._bitrev[j] |= (j >>> shift & 3) << revShift;
//     }
//     }

//     this._out = null;
//     this._data = null;
//     this._inv = 0;
// }
</script>

<style scoped>
    canvas{
        background-color: #d8e3e7;
        border-radius: 5px;
        box-shadow: 1px 1px 2px 0px RGBA(128, 128, 128, 0.7);
        color: #222;
    }
</style>



