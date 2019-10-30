

<p align="center"><img width="200" src="http://jiangbei.online/images/logo200.png"/></p>

<h2 align="center">small-swiper</h2>
<p  align="center">small-swiper 是一个javascript的轮播图的实现。同时支持移动端h5和PC端。当然，您也可以基于此库实现基于其它任何javascript框架的组件</p>
<p  align="center">small-swiper is the implementation of a JavaScript carousel graph. It supports both mobile H5 and PC. Of course, you can also implement components based on any other JavaScript framework based on this library</p>

## Routine

```html

<script src="dist/index.min.js"></script>

```


## ES6

```javascript
npm install small-swiper --save-dev

import Swiper from "small-swiper"

```


### Usage method

```html
<div id="root">
	<div>
		<div><img src="img/parcel.png"/></div>
		<div><img src="img/webpack.png"/></div>
		<div><img src="img/vue.png"/></div>
		<div><img src="img/react.png"/> </div>
	</div>
</div>
<div id="btns">
	<button>To 0</button>
	<button>To 1</button>
	<button>To 2</button>
	<button>To 3</button>
</div>

```



* 1.horizontal direction

```scss
#root{
	height: 500px;
	width: 100%;
	overflow: hidden;
	background: moccasin;
	img{
		align-items: center;
		display: block;
		height: 500px;
		max-width:100%;
	}
	>div{
		height: 500px;
		width: 100%;
		display: flex; 
		>div{
			flex-shrink:0;
			height:  500px;
			width: 100%;
			line-height: 500px;
			text-align: center;
			display: flex;
			justify-content: center;
		}
	}
}
```


```javascript
window.onload = function(){
	const swiper = new Swiper({
		root:document.querySelector("#root"),
		loop:true,
		auto:false,
		delayed:2000,
		effect:"slide",
		direction:"vertical",
		index:0,
		disabledHand:false,
		callBack(index){
			console.log("html",index)
			document.title = "I am"+index+"page"
		}
	})
	const btnList = document.getElementById("btns").getElementsByTagName("button");
	
	[].slice.call(btnList).forEach((dom,i)=>{
		(function (i){
			dom.onclick = function(){
				swiper.moveTo(i)
			}
		})(i)
	})
}

```

* 2.vertical direction

```scss
#root{
	height: 500px;
	width: 100%;
	overflow: hidden;
	background: moccasin;
	img{
		align-items: center;
		display: block;
		height: 500px;
		max-width:100%;
	}
	>div{
		height: 500px;
		width: 100%;
		>div{
			height:  500px;
			width: 100%;
			line-height: 500px;
			text-align: center;
			display: flex;
			justify-content: center;
		}
	}
}


```


```javascript
window.onload = function(){
	const swiper = new Swiper({
		root:document.querySelector("#root"),
		loop:true,
		auto:false,
		delayed:2000,
		effect:"slide",
		direction:"vertical",
		index:0,
		callBack(index){
			console.log("html",index);
			document.title = "I am"+index+"page"
		}
	})
}

```

* 3.Fade in and fade out

```scss
#root{
	height: 500px;
	width: 100%;
	overflow: hidden;
	img{
		display: block;
		height: 500px;
		width: 100%;
	}
	>div{
		height: 500px;
		width: 100%;
		position: relative;
		>div{
			height:  500px;
			width: 100%;
			position: relative;
			left: 0;
			top: 0;
		}
	}
}

```


```javascript
window.onload = function(){
	const swiper = new Swiper({
		root:document.querySelector("#root"),
		effect:"fade",
		loop:false,
		auto:true,
		direction:"horizontal",
		index:0,
		callBack:function(index){
			console.log("html",index)
		}
	})
}
```

[github地址](https://github.com/atJiangBei/small-swiper)  

[具体实现请看关联](https://atjiangbei.github.io/2019/04/04/%E6%89%8B%E5%8A%A8%E5%AE%9E%E7%8E%B0%E4%B8%80%E4%B8%AA%E6%BB%91%E5%8A%A8%E8%BD%AE%E6%92%AD%E5%9B%BE.html)  

[关联](https://atjiangbei.github.io/)  

[以此实现的vue组件](https://github.com/atJiangBei/solar-vue)  
