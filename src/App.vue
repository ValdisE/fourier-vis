<template>
    <div id="app">
        <!-- 导航 -->
        <nav id="navbar" class="navbar">
            <div class="container">
                <div class="navbar-header">
                    <div class="navbar-brand">Learning Fourier</div>
                </div>
                <ul class="nav navbar-nav navbar-right">
                    <li><router-link v-bind:to="'/'">主页</router-link></li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">傅里叶变换<span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><router-link v-bind:to="'/wave'">1D</router-link></li>
                            <li><router-link v-bind:to="'/contour'">2D</router-link></li>
                        </ul>
                    </li>
                    <li class="dropdown">
                        <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">联系作者<span class="caret"></span></a>
                        <ul class="dropdown-menu">
                            <li><a href="https://weibo.com/572331192">微博</a></li>
                            <li><a href="https://blog.csdn.net/sinat_36461778">CSDN</a></li>
                        </ul>
                    </li>
                </ul>
            </div>
        </nav>
        <router-view></router-view>
    </div>
</template>

<script>
export default {
    name: 'app',
}
</script>
<!-- css格式 -->
<style>
*{margin: 0; padding: 0}
::selection{background-color: #222; color: #DDD;}
body{background-color: #d0dfe6}
#navbar{background-color: #FFF}
#app {
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
}

body::-webkit-scrollbar, #idftList::-webkit-scrollbar { width: 10px; }
body::-webkit-scrollbar-thumb, #idftList::-webkit-scrollbar-thumb {
    background-color:#375a5d;
    border-radius: 5px;
}
</style>
