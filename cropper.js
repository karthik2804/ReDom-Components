const { el, mount, text, list, setChildren, setStyle, setAttr } = redom

class CropperToolBar {
    constructor(notifyParent) {
        this.openImage = el("button.bn.bg-blue.white.pa.h-100.mr2", {onclick: function(e){
            notifyParent("openImage")
        }}, "Open")
        this.mode = el("button.bn.bg-blue.white.pa2.h-100.mr2", {onclick: function(e){
            notifyParent("toggleMode")
        }}, "Edit")
        this.cropImage = el("button.bn.h-100.pa2.mr2", {onclick: function(e){
            notifyParent("crop")
        }}, "Crop")
        this.download = el("button.bn.h-100.pa2.bg-green", {onclick: function(e) {
            notifyParent("downloadImage")
        }}, "Download")
        this.el = el("div.w-100.h3.flex.justify-around",el("div", this.openImage, this.mode, this.cropImage, this.download))
    }
    update(mode) {
        if (mode) {
            this.mode.textContent = "Preview"
            setAttr(this.cropImage, {disabled:true})
        }
        else {
            setAttr(this.cropImage, {disabled:false})
            this.mode.textContent = "Edit"    
        }
    }
}

class CropperOverlay {
    constructor() {
        this.resizeDiv = el("div.absolute", {style:"height:20px;width:20px;background:red;"})
        this.el = el("div.absolute", {style:"border:3px solid red;height:75px;width:100px;"}, el("div.relative.w-100.h-100", this.resizeDiv))
        setStyle(this.resizeDiv, {bottom:"-10px", right:"-10px"})
    }
}

class Cropper {
    constructor() {
        this.newImage = true
        this.srcUrl
        this.editedURL 
        this.mode = 0 // 0 - edit mode; 1 - preview mode
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
        this.el = el("div.h-100.w-100.relative.", this.toolbar, el("div.tc.w-100", el("h3.gray", "Open image to crop")))
        let startMoving = function(e) {
            this.startX = (e.clientX || e.pageX || e.touches && e.touches[0].clientX)
            this.startY = (e.clientY || e.pageY || e.touches && e.touches[0].clientY)
            this.currentX = parseInt(this.overlay.el.style.left, 10 ) || 0
            this.currentY = parseInt(this.overlay.el.style.top, 10 ) || 0
            this.leftOffset = this.overlayContainer.offsetLeft
            this.topOffset = this.overlayContainer.offsetTop
            this.overlayContainer.addEventListener("touchend", stopMoving, false)
            this.overlayContainer.addEventListener("mouseup", stopMoving, false)
            this.overlayContainer.addEventListener("mouseleave", stopMoving, false)
            this.overlayContainer.addEventListener("mousemove", moving, false)
            this.overlayContainer.addEventListener("touchmove", moving, false)
        }.bind(this)
        let moving = function(e) {
            e.preventDefault()
            let tempX = this.currentX + ((e.clientX || e.pageX || e.touches && e.touches[0].clientX) - this.startX)
            let tempY = this.currentY + ((e.clientY || e.pageY || e.touches && e.touches[0].clientY) - this.startY)
            setStyle(this.overlay.el, {top: (tempY < 0 ? "0px" : (tempY + this.overlayHeight > this.containerHeight ? (this.containerHeight - this.overlayHeight) + 'px' : tempY + 'px')),
                left: (tempX < 0 ? "0px" : (tempX + this.overlayWidth > this.containerWidth ? (this.containerWidth - this.overlayWidth) + 'px' : tempX + 'px'))})
        }.bind(this)
        let stopMoving = function(e) {
            this.currentX = parseInt(this.overlay.el.style.left, 10 ) || 0
            this.currentY = parseInt(this.overlay.el.style.top, 10 ) || 0
            this.overlayContainer.removeEventListener("touchend", stopMoving, false)
            this.overlayContainer.removeEventListener("mouseup", stopMoving, false)
            this.overlayContainer.removeEventListener("mouseleave", stopMoving, false)
            this.overlayContainer.removeEventListener("mousemove", moving, false)
            this.overlayContainer.removeEventListener("touchmove", moving, false)
        }.bind(this)
        let resize = function(e) {
            e.preventDefault()
            this.onchildEvent("zoom", e.deltaY > 0)
        }.bind(this)
        let startResize = function(e) {
            e.preventDefault()
            e.stopPropagation()
            this.startX = (e.clientX || e.pageX || e.touches && e.touches[0].clientX)
            this.startY = (e.clientY || e.pageY || e.touches && e.touches[0].clientY)
            this.overlayContainer.addEventListener("touchend", stopResizing, false)
            this.overlayContainer.addEventListener("mouseleave", stopResizing, false)
            this.overlayContainer.addEventListener("mouseup", stopResizing, false)
            this.overlayContainer.addEventListener("mousemove", resizeMoving, false)
            this.overlayContainer.addEventListener("touchmove", resizeMoving, false)
        }.bind(this)
        let resizeMoving = function(e) {
            let tempWidth = this.overlayWidth + (e.clientX || e.pageX || e.touches && e.touches[0].clientX) - this.startX
            let tempHeight = tempWidth * 0.75
            if (tempHeight + this.currentY <= this.containerHeight) {
            setStyle(this.overlay.el, {width: (tempWidth < 100 ? '100px' : (tempWidth + this.currentX > this.containerWidth ? (this.containerWidth - this.currentX) + 'px' : tempWidth + 'px' ))})
            setStyle(this.overlay.el, {height: parseInt(this.overlay.el.style.width, 10) * 0.75 + 'px'})
            }
        }.bind(this)
        let stopResizing = function(e) {
            this.overlayWidth = parseInt(this.overlay.el.style.width, 10)
            this.overlayHeight = this.overlayWidth * 0.75
            this.overlayContainer.removeEventListener("touchend", stopResizing, false)
            this.overlayContainer.removeEventListener("mouseup", stopResizing, false)
            this.overlayContainer.removeEventListener("mousemove", resizeMoving, false)
            this.overlayContainer.removeEventListener("touchmove", resizeMoving, false)
        }.bind(this)
        this.overlay.el.addEventListener("mousedown", startMoving, false)
        this.overlay.el.addEventListener("touchstart", startMoving, false)
        this.overlay.resizeDiv.addEventListener("mousedown", startResize, false)
        this.overlay.resizeDiv.addEventListener("touchstart", startResize, false)
        this.overlay.el.addEventListener("wheel", resize, false)
    }
    update() {
        let startTouch = function(e) {
            e.preventDefault()
            this.image.src = this.srcUrl
        }.bind(this)
        let stopTouch = function(e) {
            this.image.src = this.editedURL
        }.bind(this)
        if(this.mode) {
            setChildren(this.el, [ this.toolbar, this.image,])
            this.image.src = this.editedURL
            this.image.addEventListener("mousedown", startTouch, true)
            this.image.addEventListener("touchstart", startTouch, true)
            this.image.addEventListener("touchend", stopTouch, true)
            this.image.addEventListener("mouseup", stopTouch, true)
        }
        else {
            this.image.src = this.srcUrl
            setChildren(this.el, [this.toolbar, this.overlayContainer, this.image])
            this.image.removeEventListener("mousedown", startTouch, true)
            this.image.removeEventListener("touchstart", startTouch, true)
            this.image.removeEventListener("mouseup", stopTouch, true)
            this.image.removeEventListener("touchend", stopTouch, true)
        }
    }
    loadImage(url) {
        this.srcUrl = url
        this.editedURL = null
        this.image.src = url
        this.newImage = true
        this.image.onload = function() {
                if(this.newImage) {
                let height = this.image.height
                let width = this.image.width
                this.containerWidth = width
                this.containerHeight = height
                setStyle(this.overlayContainer, {top: this.image.offsetTop + 'px', left: this.image.offsetLeft + 'px',
                    height: height + 'px', width: width + 'px' })
                this.overlayWidth = this.containerWidth * 0.8
                this.overlayHeight = this.overlayWidth * 0.75
                setStyle(this.overlay.el, {width: this.overlayWidth + 'px', height: this.overlayHeight + 'px', 
                    left: (this.containerWidth - this.overlayWidth)/2 + 'px', top: (this.containerHeight - this.overlayHeight)/2 + 'px'})
                this.currentX = parseInt(this.overlay.el.style.left , 10)
                this.currentY = parseInt(this.overlay.el.style.top , 10)
                this.newImage = false
            }
        }.bind(this)
        setChildren(this.el, [this.toolbar, this.overlayContainer, this.image])
        this.mode = 0
        this.toolbar.update(this.mode)
    }
    crop() {
        let img = new Image()
        img.src = this.srcUrl
        let ctx = this.hiddenCanvas.getContext('2d')
        this.hiddenCanvas.height = 900
        this.hiddenCanvas.width = 1200
        let ratio = img.height/this.containerHeight
        img.onload = function() {
        ctx.drawImage(img, this.currentX * ratio, this.currentY * ratio, this.overlayWidth * ratio, this.overlayHeight * ratio, 0,0,1200,900)
        this.editedURL = this.hiddenCanvas.toDataURL("image/jpeg")
        console.log(this.editedURL)
        this.onchildEvent("toggleMode")
        }.bind(this)
    }
    onchildEvent(event, data) {
        switch(event) {
            case "crop":
                this.crop()
                break
            case "toggleMode":
                if(!this.editedURL) {
                    return
                }
                this.mode = !this.mode
                this.update()
                this.toolbar.update(this.mode)
                break
            case "downloadImage":
                let link = el("a", {download:"cropped", href:this.editedURL})
                link.click()
                break
            case "openImage":
                let readImage = function(file) {
                    let input = file.target
                    let reader = new FileReader()
                    reader.onload = function() {
                        let dataURL = reader.result
                        this.srcUrl = dataURL
                        this.loadImage(this.srcUrl)
                    }.bind(this)
                    reader.readAsDataURL(input.files[0]); 
                }.bind(this)
                let file = el("input", {type:"file", accept:".jpg, .jpeg, .png", onchange: function(e){
                    readImage(e)
                }})
                file.click()
                break
        }   
    }
}

class App {
    constructor() {
        this.cropper = new Cropper()
        this.el = el("div.w-100.h-100", this.cropper)
    }
}

let app = new App()
mount(document.body, app)
