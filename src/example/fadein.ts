import Swiper from './../main.ts'

const swiper = new Swiper({
	root: document.querySelector('#root'),
	effect: 'fade',
	delayed: 2000,
	loop: true,
	auto: false,
	direction: 'horizontal', //"horizontal""vertical"
	index: 0, //默认第一张
	disabledHand: false,
	callBack: function(index) {
		console.log('html', index)
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
const list = document.getElementById('list').getElementsByTagName('div')
;[].slice.call(list).forEach((dom, i) => {
	;(function(i) {
		dom.onclick = function() {
			console.log(i)
		}
	})(i)
})
