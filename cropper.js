const { el, mount, text, list, setChildren, setStyle, setAttr } = redom

class CropperToolBar {
    constructor(notifyParent) {
        this.openImage = el("button.bn.bg-blue.white.pa2", "Open")
        this.cropImage = el("button.bn.h-100.pa2", {onclick: function(e){
            notifyParent("crop")
        }}, "Crop")
        this.download = el("button.bn.h-100.pa2.bg-green", "Download")
        this.zoomIn = el("button.bn.w3.h-100.pa2.mr2", {onclick: function(e){
            notifyParent("zoom", 1)
        }}, "+")
        this.zoomOut = el("button.bn.w3.h-100.pa2.mr2", {onclick: function(e){
            notifyParent("zoom", 0)
        }}, "-")
        this.el = el("div.w-100.h3.flex.justify-between", this.openImage, el("div",this.zoomOut, this.zoomIn), el("div", this.cropImage, this.download))
    }
}

class CropperOverlay {
    constructor() {
        this.el = el("div.absolute", {style:"border:3px solid red;height:75px;width:100px;"})
    }
}

class Cropper {
    constructor() {
        this.containerHeight, this.containerWidth
        this.overlayHeight = 75, this.overlayWidth = 100
        this.startX = this.startY = null
        this.leftOffset = this.rightOffset = null
        this.currentX = this.currentY = 0
        this.hiddenCanvas = el("canvas")
        this.toolbar = new CropperToolBar(this.onchildEvent.bind(this))
        this.image = el("img")
        this.overlay = new CropperOverlay()
        this.overlayContainer = el("div.absolute", el("div.relative.w-100.h-100", this.overlay))
        this.el = el("div.h-100.w-100.relative.", this.toolbar, this.overlayContainer, this.image, this.hiddenCanvas)

        let startMoving = function(e) {
            this.startX = (e.clientX || e.pageX || e.touches && e.touches[0].clientX)
            this.startY = (e.clientY || e.pageY || e.touches && e.touches[0].clientY)
            this.currentX = parseInt(this.overlay.el.style.left, 10 ) || 0
            this.currentY = parseInt(this.overlay.el.style.top, 10 ) || 0
            this.leftOffset = this.overlayContainer.offsetLeft
            this.topOffset = this.overlayContainer.offsetTop
            this.overlayContainer.addEventListener("mousemove", moving, true)
            this.overlayContainer.addEventListener("touchmove", moving, true)
            this.overlayContainer.addEventListener("touchend", stopMoving, true)
            this.overlayContainer.addEventListener("mouseup", stopMoving, true)
        }.bind(this)
        let moving = function(e) {
            e.preventDefault()
            let tempX = this.currentX + ((e.clientX || e.pageX || e.touches && e.touches[0].clientX) - this.startX)
            let tempY = this.currentY + ((e.clientY || e.pageY || e.touches && e.touches[0].clientY) - this.startY)
            setStyle(this.overlay.el, {top: (tempY < 0 || (tempY + this.overlayHeight) > this.containerHeight ? this.overlay.el.style.top : tempY + 'px'),
                left: (tempX < 0 || (tempX + this.overlayWidth) > this.containerWidth ? this.overlay.el.style.left : tempX + 'px')})
        }.bind(this)
        let stopMoving = function(e) {
            this.currentX = parseInt(this.overlay.el.style.left, 10 ) || 0
            this.currentY = parseInt(this.overlay.el.style.top, 10 ) || 0
            this.overlayContainer.removeEventListener("mousemove", moving, true)
            this.overlayContainer.removeEventListener("mouseup", stopMoving, true)
            this.overlayContainer.removeEventListener("touchmove", moving, true)
            this.overlayContainer.removeEventListener("touchend", stopMoving, true)
        }.bind(this)
        let resize = function(e) {
            e.preventDefault()
            this.onchildEvent("zoom", e.deltaY > 0)
        }.bind(this)
        this.overlay.el.addEventListener("mousedown", startMoving, true)
        this.overlay.el.addEventListener("touchstart", startMoving, true)
        this.overlay.el.addEventListener("wheel", resize, true)
    }
    loadImage(url) {
        this.image.src = url
        this.image.onload = function() {
            let height = this.image.height
            let width = this.image.width
            this.containerWidth = width
            this.containerHeight = height
            setStyle(this.overlayContainer, {top: this.image.offsetTop + 'px', left: this.image.offsetLeft + 'px',
                height: height + 'px', width: width + 'px' })
        }.bind(this)
    }
    crop() {
        let img = new Image()
        img.src = "./jamie-street-uNNCs5kL70Q-unsplash.jpg"
        let ctx = this.hiddenCanvas.getContext('2d')
        this.hiddenCanvas.height = 900
        this.hiddenCanvas.width = 1200
        let ratio = img.height/this.containerHeight
        img.onload = function() {
        ctx.drawImage(img, this.currentX * ratio, this.currentY * ratio, this.overlayWidth * ratio, this.overlayHeight * ratio, 0,0,1200,900)
        let dataUrl = this.hiddenCanvas.toDataURL("image/jpeg")
        console.log(dataUrl)
        }.bind(this)
    }
    onchildEvent(event, data) {
        switch(event) {
            case "zoom":
                console.log(data)
                let tempWidth = (data > 0 ? this.overlayWidth + 10 : this.overlayWidth -10)
                let tempHeight = (data > 0 ? this.overlayHeight + 7.5: this.overlayHeight - 7.5)
                if(tempHeight > 75 && tempWidth > 100) {
                if ((tempHeight + this.currentY) <= this.containerHeight && (tempWidth + this.currentX) <= this.containerWidth) {
                    this.overlayWidth = tempWidth
                    this.overlayHeight = tempHeight
                    setStyle(this.overlay.el, {width: this.overlayWidth + 'px', height: this.overlayHeight + 'px'})
                }
            }
                break
            case "crop":
                this.crop()
                break
        }
    }
}

class App {
    constructor() {
        this.cropper = new Cropper()
        this.el = el("div.w-100.h-100", this.cropper)
    }
    update() {
        this.cropper.loadImage('./jamie-street-uNNCs5kL70Q-unsplash.jpg')
    }
}

let app = new App()
mount(document.body, app)

app.update()