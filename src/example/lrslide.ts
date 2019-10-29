import Swiper from './../main.ts'
type swiper = Swiper

const swiper:swiper = new Swiper({
	root: document.getElementById('root'),
	loop: false,
	auto: false,
	delayed: 2000,
	effect: 'slide',
	direction: 'horizontal', //"horizontal""vertical"
	index: 0, //默认第一张
	disabledHand: false, //禁止手动滑动
	callBack(index) {
		console.log('html', index)
		document.title = '我是第' + index + '页'
	}
})
const btnList = document.getElementById('btns').getElementsByTagName('button')

;[].slice.call(btnList).forEach((dom, i) => {
	;(function(i) {
		dom.onclick = function() {
			swiper.moveTo(i)
		}
	})(i)
})
