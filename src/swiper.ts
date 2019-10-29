type direction = 'horizontal' | 'vertical'
type effect = 'slide' | 'fade'
type timer = null | number
interface Options {
	root: Element
	direction: direction
	loop: boolean
	auto: boolean
	delayed: number
	effect: effect
	callBack: Function
	disabledHand: boolean
	index: number
}
const fadeFloat: number = 0.05
const speed: number = 50
const time:Function = Date.now || function () {
  return +new Date()
}
class Swiper {
	private root: Element
	private direction: direction
	private loop: boolean
	private auto: boolean
	private delayed: number
	private effect: effect
	private startTime: number
	private callBack: Function
	private startingPoint: number
	private isTracking: boolean
	private captureClick: boolean
	private disabledHandSlideing: boolean
	private timer: timer
	private defaultIndex: number
	private slider: Element
	private children: HTMLCollection
	private length: number
	private scaleSize: number
	private index: number
	constructor(options: Options) {
		this.root = options.root
		this.direction = options.direction
		this.loop = options.loop
		this.auto = options.auto
		this.delayed = options.delayed
		this.effect = options.effect
		this.startTime = 0
		this.callBack = options.callBack
		this.startingPoint = 0
		this.isTracking = false
		this.captureClick = false
		this.disabledHandSlideing = !!options.disabledHand
		this.timer = null
		this.defaultIndex = this.loop ? -1 : 0
		this.slider = this.root.children[0]
		this.children = this.slider.children
		const children: HTMLCollection = this.children
		this.length = children.length
		const length: number = this.length
		const firstElement: Element = children[0]
		const { width, height } = firstElement.getBoundingClientRect()
		this.scaleSize = this.direction === 'horizontal' ? width : height

		this.initSetIndex(options.index)

		this.initFromEffect(this.effect)

		this.stopDraggable()

		if (this.auto) {
			this.timer = this.setInterval()
		}
		const will = false
		const _this = this
		const slider = this.slider
		slider.addEventListener('touchstart', ev => this.start(ev), will)
		slider.addEventListener('touchmove', ev => this.move(ev), will)
		slider.addEventListener('touchend', ev => this.end(ev), will)
		slider.addEventListener('mousedown', ev => this.start(ev), will)
		slider.addEventListener('mousemove', ev => this.move(ev), will)
		slider.addEventListener('mouseup', ev => this.end(ev), will)
		slider.addEventListener(
			'click',
			function(ev) {
				const e = ev || event
				if (_this.captureClick) {
					//On the PC side, default events are disabled in MouseDown events
					//For example, there are jump links in sliding elements, and if default events are not prohibited, jumps are made.
					e.preventDefault()
					//In the event capture phase,
					//When the mouse slides
					//Prohibit click events to extend inward
					e.stopPropagation()
				}
			},
			true
		)
	}
	private initFromEffect(effect: effect) {
		switch (effect) {
			case 'slide':
				this.ifEffectSlide()
				break
			case 'fade':
				this.ifEffectFade()
				break
			default:
				break
		}
	}
	private ifEffectSlide() {
		const children = this.children
		const length = this.length
		if (this.loop) {
			const first: Node = children[0].cloneNode(true)
			const last: Node = children[length - 1].cloneNode(true)
			this.slider.appendChild(first)
			this.slider.insertBefore(last, children[0])
		}
	}
	private ifEffectFade() {
		const children = this.children
		const { height } = children[0].getBoundingClientRect()
		const length = this.length
		for (let i = 0; i < length; i++) {
			children[i]['style'].transform = 'translate3d(0,' + -i * height + 'px,0)'
		}
		this.fadeMove(this.index, 1)
	}
	private initSetIndex(index: number) {
		//此处注释，初始是否要触发回调函数？
		index = Math.min(Math.abs(index), this.length - 1)
		if (this.effect === 'slide') {
			if (this.loop) {
				this.defaultIndex = -(index + 1)
			} else {
				this.defaultIndex = -index
			}
			this.slideMove(this.defaultIndex * this.scaleSize)
			//this._numericalConversion(this._defaultIndex);
		}

		// if (this.effect === 'fade') {
		// 	this._callBack(index)
		// }
		this.index = index
	}
	private stopDraggable(): void {
		//Prohibit dragging pictures while sliding on PC
		const list = this.root.getElementsByTagName('img')
		for (let i = 0; i < list.length; i++) {
			list[i].setAttribute('draggable', 'false')
		}
	}
	private setInterval(): timer {
		return window.setInterval(this.aotoplay.bind(this), this.delayed)
	}
	private clear() {
		window.clearInterval(this.timer)
	}
	private start(ev) {
		const e = ev || event
		if (e.type === 'mousedown') {
			//On the PC side, default events are disabled in MouseDown events
			//For example, there are jump links in sliding elements, and if default events are not prohibited, jumps are made.
			//360 Browser
			e.preventDefault()
		}
		const touches = e.touches
		const target = touches ? touches[0] : e
		this.startingPoint = this.direction === 'horizontal' ? target.clientX : target.clientY
		this.startTime = time()
		this.clear()
		this.isTracking = true
		this.captureClick = false
		if (this.disabledHandSlideing) return
	}
	private move(ev) {
		if (!this.isTracking) {
			//Disabled sliding after loosening the mouse
			return
		}
		const e = ev || event
		if (e.type === 'mousemove') {
			this.captureClick = true
		}
		//Default events are prohibited when sliding events occur on the mobile side(For example, click events)
		e.preventDefault()
		if (this.disabledHandSlideing) return
		const touches = e.changedTouches
		const target = touches ? touches[0] : e
		const moved = this.direction === 'horizontal' ? target.clientX - this.startingPoint : target.clientY - this.startingPoint
		this.clear()

		const scale = Math.max(0, 1 - Math.abs(moved / this.scaleSize))
		const index = this.index
		switch (this.effect) {
			case 'slide':
				this.moveFun(moved + this.defaultIndex * this.scaleSize, moved)
				break
			case 'fade':
				this.fadeProcess(moved, scale)
				break
			default:
				break
		}
	}
	private end(ev) {
		if (!this.isTracking) {
			return
		}
		this.isTracking = false
		if (this.disabledHandSlideing) return
		const e = ev || event
		const touches:Array<object> = e.changedTouches
		const target= touches ? touches[0] : e
		let moved: number = this.direction === 'horizontal' ? target.clientX - this.startingPoint : target.clientY - this.startingPoint
		const stopDuration: number = time() - this.startTime
		const enter: boolean = Math.abs(moved) > this.scaleSize / 2 || stopDuration < 300
		const scale: number = Math.max(0, 1 - Math.abs(moved / this.scaleSize))
		const loop: boolean = this.loop
		const oldIndex: number = this.index
		const length: number = this.length
		const min: number = this.length - 1
		const max: number = this.length + 1
		if (Math.abs(moved) === 0) {
			return
		}

		if (this.effect === 'fade') {
			if (enter) {
				const newIndex: number = this.setGetIndex(moved)
				const isToNext: number | null = loop ? oldIndex : null
				this.startMove(1 - scale, 1, fadeFloat, newIndex, isToNext).then(res => {
					if (this.auto) {
						this.clear()
						this.timer = this.setInterval()
					}
				})
			} else {
				let newIndex: number = this.index
				if (moved < 0) {
					newIndex += 1
					if (newIndex > min) {
						newIndex = 0
					}
				} else {
					newIndex -= 1
					if (newIndex < 0) {
						newIndex = min
					}
				}
				this.startMove(scale, 1, fadeFloat, this.index, newIndex).then(res => {
					if (this.auto) {
						this.clear()
						this.timer = this.setInterval()
					}
				})
			}
			return
		}
		if (enter) {
			const oldIndex: number = this.defaultIndex
			let bufferSpeed:number = speed/1.6;
			if (moved > 0) {
				if (this.loop) {
					this.defaultIndex += 1
					if (this.defaultIndex > 0) {
						this.defaultIndex = 0
					}
					if (oldIndex > 0 && this.defaultIndex > 0) {
						//Solve Occasionally present   bug
						return
					}
				} else {
					if (this.defaultIndex < 0) {
						this.defaultIndex += 1
					} else {
						moved /= 3
						bufferSpeed = 20
					}
				}
			}
			if (moved < 0) {
				if (this.loop) {
					this.defaultIndex -= 1
					if (this.defaultIndex <= -max) {
						this.defaultIndex = -max
						this.slideMove(this.defaultIndex * this.scaleSize)
					}
					if (oldIndex <= -max && this.defaultIndex <= -max) {
						//Solve Occasionally present   bug
						return
					}
				} else {
					if (Math.abs(this.defaultIndex) < min) {
						this.defaultIndex -= 1
					} else {
						moved /= 3
						bufferSpeed = 20
					}
				}
			}

			this.numericalConversion(this.defaultIndex)
			const nowDistance = moved + oldIndex * this.scaleSize
			const targetDistance = this.defaultIndex * this.scaleSize
			this.startMove(nowDistance, targetDistance,bufferSpeed).then(() => {
				if (loop) {
					if (this.defaultIndex <= -max) {
						//1，Solution in Cycle
						//2，Slide from the first to the first
						//3，The problem of momentary blankness caused by stopping manual sliding and triggering the timer
						this.defaultIndex = -1
						this.slideMove(this.defaultIndex * this.scaleSize)
					}
					if (this.defaultIndex >= 0) {
						this.defaultIndex = -length
						this.slideMove(this.defaultIndex * this.scaleSize)
					}
				}

				if (this.auto) {
					this.clear()
					this.timer = this.setInterval()
				}
			})
		} else {
			const bufferSpeed:number = speed/5;
			if (!this.loop) {
				const distance = this.defaultIndex * this.scaleSize + moved
				if (distance >= 0) {
					moved /= 3
				} else {
					if (distance <= this.scaleSize * -min) {
						moved /= 3
					}
				}
			}
			const nowDistance: number = this.defaultIndex * this.scaleSize + moved
			const targetDistance: number = nowDistance - moved
			this.startMove(nowDistance, targetDistance,bufferSpeed).then(() => {
				if (this.auto) {
					this.clear()
					this.timer = this.setInterval()
				}
			})
		}
	}
	private fadeProcess(moved, scale) {
		//Calculate the next subscript in the sliding process,
		//find a new coordinate,
		//and calculate the transparency of the current and transitional coordinates according to the sliding ratio.
		const min: number = this.length - 1
		const oldIndex: number = this.index
		let newIndex: number = this.index
		if (moved < 0) {
			newIndex += 1
			if (newIndex > min) {
				newIndex = 0
			}
		} else {
			newIndex -= 1
			if (newIndex < 0) {
				newIndex = min
			}
		}
		this.fadeMove(oldIndex, scale, newIndex)
	}
	private setGetIndex(moved: number): number {
		//This applies to non-added loops//fade status
		const loop: boolean = this.loop
		const oldIndex: number = this.index
		if (moved > 0) {
			this.index -= 1
			if (this.index < 0) {
				if (loop) {
					this.index = this.length - 1
				} else {
					this.index = 0
				}
			}
		}
		if (moved < 0) {
			this.index += 1
			if (this.index > this.length - 1) {
				if (loop) {
					this.index = 0
				} else {
					this.index = this.length - 1
				}
			}
		}
		if (oldIndex === this.index) {
			return this.index
		}
		this.callBack(this.index)
		return this.index
	}
	private moveFun(distance, moved) {
		if (!this.loop) {
			if (distance >= 0) {
				distance /= 3
				this.slideMove(distance)
			} else {
				const max:number = this.length - 1
				if (distance <= this.scaleSize * -max) {
					moved /= 3
					distance = this.scaleSize * -max + moved
				}
				this.slideMove(distance)
			}
			return
		}
		if (distance >= 0) {
			this.defaultIndex = -this.length
			this.slideMove(this.defaultIndex * this.scaleSize)
		} else if (distance <= -((this.length + 1) * this.scaleSize)) {
			this.defaultIndex = -1
			this.slideMove(this.defaultIndex * this.scaleSize)
		} else {
			this.slideMove(distance)
		}
	}
	moveTo(index: number): void {
		index = Math.abs(index)
		const max: number = this.length + 1
		const min: number = this.length - 1

		if (index > min) {
			index = min
		}
		const oldIndex: number = this.index
		const newIndex: number = (this.index = index)
		const length: number = this.length

		if (this.effect === 'fade') {
			if (newIndex === oldIndex) {
				this.startMove(0, 1, fadeFloat, newIndex)
			} else {
				this.callBack(newIndex)
				this.startMove(0, 1, fadeFloat, newIndex, oldIndex)
			}
			return
		}

		if (oldIndex === newIndex) return

		if (this.loop) {
			if (index === min) {
				index = -length
				const nowDistance: number = this.defaultIndex * this.scaleSize
				const targetDistance: number = index * this.scaleSize
				this.defaultIndex = index
				this.numericalConversion(this.defaultIndex)
				const s = Math.abs(oldIndex - Math.abs(this.defaultIndex)) * speed < 100 ? 100 : Math.abs(oldIndex - Math.abs(this.defaultIndex)) * speed

				this.startMove(nowDistance, targetDistance, s).then(() => {})
				return
			}
			if (index === 0) {
				if (this.defaultIndex === -max) {
					this.defaultIndex = -1
					this.slideMove(this.defaultIndex * this.scaleSize)
					return
				}
			}
			index = -index - 1

			const nowDistance = this.defaultIndex * this.scaleSize
			const targetDistance = index * this.scaleSize
			this.defaultIndex = index
			const disparity: number = Math.max(Math.abs(oldIndex - Math.abs(this.defaultIndex)), 3)
			const s: number = disparity * speed
			this.numericalConversion(this.defaultIndex)
			this.startMove(nowDistance, targetDistance, s).then(() => {})
		} else {
			index = -index
			const disparity: number = Math.max(Math.abs(oldIndex - Math.abs(index)), 3)
			const s: number = disparity * speed
			const nowDistance: number = this.defaultIndex * this.scaleSize
			const targetDistance: number = index * this.scaleSize
			this.defaultIndex = index
			this.callBack(Math.abs(index))
			this.startMove(nowDistance, targetDistance, s).then(() => {})
		}
	}
	private numericalConversion(index: number): void {
		// defaultIndex Convert to index
		let num: number
		if (this.loop) {
			switch (index) {
				case -1:
				case -(this.length + 1):
					num = 0
					break
				case 0:
					num = this.length - 1
					break
				default:
					num = Math.abs(index) - 1
					break
			}
			if (num !== this.index) {
				this.index = num
			}

			this.callBack(this.index)
		} else {
			num = Math.abs(index)
			if (num !== this.index) {
				this.index = num
				this.callBack(this.index)
			}
		}
	}
	private aotoplay() {
		const startplay = (): void => {
			const oldIndex: number = this.defaultIndex
			const max: number = this.length + 1
			if (this.loop) {
				this.defaultIndex -= 1
				if (this.defaultIndex <= -max) {
					this.defaultIndex = -max
				}
			} else {
				this.defaultIndex -= 1
				if (this.defaultIndex <= -this.length) {
					this.defaultIndex = 0
				}
			}
			this.numericalConversion(this.defaultIndex)
			const newSpeed: number = speed * Math.abs(Math.abs(oldIndex) - Math.abs(this.defaultIndex))
			const nowDistance: number = oldIndex * this.scaleSize
			const targetDistance: number = this.defaultIndex * this.scaleSize
			this.startMove(nowDistance, targetDistance, newSpeed).then(() => {
				if (this.loop) {
					if (this.defaultIndex <= -max) {
						this.defaultIndex = -1
						this.slideMove(this.defaultIndex * this.scaleSize)
					}
				}
			})
		}
		const fade_startplay = (): void => {
			const oldIndex = this.index
			this.index += 1
			if (this.index > this.length - 1) {
				this.index = 0
			}
			const newIndex: number = this.index
			this.callBack(newIndex)
			this.startMove(0, 1, fadeFloat, newIndex, oldIndex).then(res => {
				//console.log(this.index)
			})
		}
		switch (this.effect) {
			case 'slide':
				return startplay()
			case 'fade':
				return fade_startplay()
			default:
				break
		}
	}
	private slideMove(distance: number): void {
		const direction: string = this.direction
		const slider = this.slider
		if (direction === 'horizontal') {
			slider['style']['transform'] = 'translate3d(' + distance + 'px,0,0)'
		}
		if (direction === 'vertical') {
			slider['style']['transform'] = 'translate3d(0,' + distance + 'px,0)'
		}
		slider['style'].transition = null
	}
	private fadeMove(index: number, scale: number = 1, oldIndex?: number) {
		let length = this.length
		let list = this.children
		for (let i = 0; i < length; i++) {
			list[i]['style'].opacity = 0
			list[i]['style']['z-index'] = 0
		}
		list[index]['style']['opacity'] = scale
		list[index]['style']['z-index'] = 1
		if (typeof oldIndex === 'number') {
			list[oldIndex]['style'].opacity = 1 - scale
		}
	}
	private startMove(nowDistance: number, targetDistance: number, speed: number | any = 30, index?: number, oldIndex?: number) {
		let n:number = nowDistance
		const t:number = targetDistance
		let signal:Function
		const pro = new Promise(res => (signal = res))
		const step = () => {
			if (n < t) {
				n += speed
				if (n >= t) {
					n = t
				}
			} else if (n > t) {
				n -= speed
				if (n <= t) {
					n = t
				}
			}
			if (this.effect === 'slide') {
				this.slideMove(n)
			} else {
				this.fadeMove(index, n, oldIndex)
			}
			if (nowDistance > targetDistance) {
				if (n > t) {
					window.requestAnimationFrame(step)
				} else {
					signal()
				}
			}

			if (nowDistance < targetDistance) {
				if (n < t) {
					window.requestAnimationFrame(step)
				} else {
					signal()
				}
			}
		}
		window.requestAnimationFrame(step)
		return pro
	}
}

export default Swiper
