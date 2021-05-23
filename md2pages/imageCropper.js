class CropperToolbar {
    constructor(notifyParent) {
        this.cancelButton = el("button.btn.btn-link.input-group-btn", {onclick:function(e){e.stopPropagation();notifyParent("cancel")}}, "Cancel")
        this.cropButton = el("button.btn.btn-primary.input-group-btn", {onclick:function(e){e.stopPropagation();notifyParent("save")}}, "Crop")
        this.el = el("div.w-100.navbar.p-absolute", {style:"z-index:999;top:0;padding:0.5rem;background:rgba(255,255,255,0.8)"}, el("div.navbar-section",this.cancelButton), 
            el("div.navbar-section", this.cropButton, this.saveButton))
    }
}

class ImageCropper {
    constructor(notifyParent) {
        this.notifyParent = notifyParent
        this.moved = false
        this.showMenu = true
        this.newImage = true
        this.srcUrl, this.editedUrl
        this.touchStartTime
        this.mode = 0 // 0 - edit mode; 1 - preview mode
        this.containerWidth, this.containerHeight, this.overlayHeight = 75, this.overlayWidth = 100
        this.startx, this.statrtY
        this.currentX = this.currentY = 0
        this.offsetArray = [0,0]

        this.image = el("img.w-100")
        this.resizeDiv = el("div.p-absolute", {style:"height:20px;width:20px;background:red;"})
        this.overlay = el("div.p-absolute", {style:"z-index:10;border:3px solid red;height:75px;width:100px;"}, el("div.p-relative.w-100.h-100", this.resizeDiv))
        setStyle(this.resizeDiv, {bottom:"-3px", right:"-3px"})
        this.overlayContainer = el("div.p-absolute", el("div.p-relative.w-100.h-100", this.overlay))
        this.toolbar = new CropperToolbar(this.onChildEvent.bind(this))
        this.el = el("div.w-100.p-relative d-flex", {style:"align-items:center;justify-content:center;background:#000000"})

        let toggleNav = function(e) {
            if(!this.moved) {
                    this.showMenu = !this.showMenu
                    this.showMenu ? this.toolbar.el.classList.remove("hide") : this.toolbar.el.classList.add("hide")
            }
        }.bind(this)

        let toggleMode = function(e) {
                e.preventDefault()
                if (this.mode == 0) {
                    this.onChildEvent("crop")
                }
                this.onChildEvent("toggleMode")
                this.update()
            }.bind(this)

        this.overlay.addEventListener("contextmenu", function(e) {e.preventDefault()})
        this.overlayContainer.addEventListener("contextmenu", function(e) {e.preventDefault()})
        this.image.addEventListener("contextmenu", function(e) {e.preventDefault()})
        this.el.addEventListener("click", toggleNav, false)
        this.el.addEventListener("contextmenu", toggleMode, false)

        let startMoving = function(e) {
            if (e.clientX && e.button != 0) {return}
            this.moved = false
            this.startX = (e.clientX || e.pageX || e.touches && e.touches[0].clientX)
            this.startY = (e.clientY || e.pageY || e.touches && e.touches[0].clientY)
            this.currentX = parseInt(this.overlay.style.left, 10 ) || 0
            this.currentY = parseInt(this.overlay.style.top, 10 ) || 0
            this.leftOffset = this.overlayContainer.offsetLeft
            this.topOffset = this.overlayContainer.offsetTop
            this.overlayContainer.addEventListener("touchend", stopMoving, false)
            this.overlayContainer.addEventListener("mouseup", stopMoving, false)
            this.overlayContainer.addEventListener("mouseleave", stopMoving, false)
            this.overlayContainer.addEventListener("mousemove", moving, false)
            this.overlayContainer.addEventListener("touchmove", moving, false)
        }.bind(this)
        let moving = function(e) {
            this.moved = true
            e.preventDefault()
            let tempX = this.currentX + ((e.clientX || e.pageX || e.touches && e.touches[0].clientX) - this.startX)
            let tempY = this.currentY + ((e.clientY || e.pageY || e.touches && e.touches[0].clientY) - this.startY)
            setStyle(this.overlay, {top: (tempY < 0 ? "0px" : (tempY + this.overlayHeight > this.containerHeight ? (this.containerHeight - this.overlayHeight) + 'px' : tempY + 'px')),
                left: (tempX < 0 ? "0px" : (tempX + this.overlayWidth > this.containerWidth ? (this.containerWidth - this.overlayWidth) + 'px' : tempX + 'px'))})
        }.bind(this)
        let stopMoving = function(e) {
            this.currentX = parseInt(this.overlay.style.left, 10 ) || 0
            this.currentY = parseInt(this.overlay.style.top, 10 ) || 0
            this.overlayContainer.removeEventListener("touchend", stopMoving, false)
            this.overlayContainer.removeEventListener("mouseup", stopMoving, false)
            this.overlayContainer.removeEventListener("mouseleave", stopMoving, false)
            this.overlayContainer.removeEventListener("mousemove", moving, false)
            this.overlayContainer.removeEventListener("touchmove", moving, false)
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
            setStyle(this.overlay, {width: (tempWidth < 100 ? '100px' : (tempWidth + this.currentX > this.containerWidth ? (this.containerWidth - this.currentX) + 'px' : tempWidth + 'px' ))})
            setStyle(this.overlay, {height: parseInt(this.overlay.style.width, 10) * 0.75 + 'px'})
            }
        }.bind(this)
        let stopResizing = function(e) {
            this.overlayWidth = parseInt(this.overlay.style.width, 10)
            this.overlayHeight = this.overlayWidth * 0.75
            this.overlayContainer.removeEventListener("touchend", stopResizing, false)
            this.overlayContainer.removeEventListener("mouseup", stopResizing, false)
            this.overlayContainer.removeEventListener("mousemove", resizeMoving, false)
            this.overlayContainer.removeEventListener("touchmove", resizeMoving, false)
        }.bind(this)
        this.overlay.addEventListener("mousedown", startMoving, false)
        this.overlay.addEventListener("touchstart", startMoving, false)
        this.resizeDiv.addEventListener("mousedown", startResize, false)
        this.resizeDiv.addEventListener("touchstart", startResize, false)
    }
    update() {     // Use edited Image if in preview and original in edit mode
        if(this.mode) {
            setChildren(this.el, [ this.toolbar, this.image,])
            this.image.src = this.editedURL
        }
        else {
            this.image.src = this.srcUrl
            setChildren(this.el, [this.toolbar, this.overlayContainer, this.image])
        }
    }
    resize() {  // resize for the crop box
        let tempWidth = this.containerWidth
        let height = this.image.height
        let width = this.image.width
        let imageRatio = width/height
        this.containerWidth = this.el.getBoundingClientRect().width >= width ? width : this.el.getBoundingClientRect().width
        this.containerHeight = height
        if (imageRatio > 1.33) {
            this.containerHeight = height * (imageRatio/1.33) 
            this.image.classList.add("w-100")
            this.image.classList.remove("h-100")
            this.offsetArray[0] = (this.containerHeight - height)/2
        }
        else {
            this.containerHeight = width * 0.75
            this.image.classList.add("h-100")
            this.image.classList.remove("w-100")
            this.offsetArray[1] = (this.containerWidth - (height - this.containerHeight) * imageRatio)/2
        }
        setStyle(this.el, {height: this.containerHeight + 'px'})
        setStyle(this.overlayContainer, {height: this.containerHeight + 'px', width: this.containerWidth + 'px' })
        let ratio = this.containerWidth/tempWidth
        this.currentX = this.currentX * ratio
        this.currentY = this.currentY * ratio
        this.overlayHeight = this.overlayHeight * ratio
        this.overlayWidth = this.overlayWidth * ratio
        setStyle(this.overlay, {width: this.overlayWidth + 'px', height: this.overlayHeight + 'px', 
                    left: this.currentX + 'px', top: this.currentY + 'px'})
    }
    loadImage(url) {    // Load image and set the container overlay to the same size
        setStyle(this.el, {"padding-left":0 + 'px', "padding-right":0 + 'px'})
        this.offsetArray = [0,0]
        this.srcUrl = url
        this.editedURL = null
        this.image.src = url
        this.newImage = true
        let img = new Image()
        img.src = this.srcUrl
        this.originalImg = new Image()
        this.originalImg.src = this.srcUrl
        this.hiddenCanvas = el("canvas")
        this.image.onload = function() {
            if(this.newImage) {
                let height = this.image.height
                let width = this.image.width
                this.containerWidth = this.el.getBoundingClientRect().width >= width ? width : this.el.getBoundingClientRect().width
                this.containerHeight = height
                let ratio = width/height
                if (ratio > 1.33) {
                    this.containerHeight = height * (ratio/1.33) 
                    this.image.classList.add("w-100")
                    this.image.classList.remove("h-100")
                    this.offsetArray[0] = (this.containerHeight - height)/2
                }
                else if (ratio == 1) {
                    setStyle(this.el, {"padding-left":(width-width*0.75)/2 + 'px', "padding-right":(width-width*0.75)/2 + 'px'})
                    this.containerHeight = width*0.75
                    this.offsetArray[1] = (width-width*0.75)/2
                }
                else {
                    this.containerHeight = width * 0.75
                    this.image.classList.add("h-100")
                    this.image.classList.remove("w-100")
                    this.offsetArray[1] = (this.containerWidth - (height - this.containerHeight) * ratio)/2
                }
                console.log(this.containerWidth, this.containerHeight, width, height)
                console.log(this.offsetArray)
                setStyle(this.overlayContainer, {height: this.containerHeight + 'px', width: this.containerWidth + 'px' })
                setStyle(this.el, {height: this.containerHeight + 'px'})
                this.overlayWidth = this.containerWidth
                this.overlayHeight = this.containerHeight
                
                setStyle(this.overlay, {width: this.overlayWidth + 'px', height: this.overlayHeight + 'px', left: '0px', top: '0px'})
                this.currentX = 0
                this.currentY = 0
                this.newImage = false
            }
        }.bind(this)
        setChildren(this.el, [this.toolbar, this.overlayContainer, this.image])
        this.mode = 0
    }
    crop() {
        let ctx = this.hiddenCanvas.getContext('2d')
        this.hiddenCanvas.height = 900
        this.hiddenCanvas.width = 1200
        let ratio = this.originalImg.height/this.containerHeight
        console.log((this.currentX - this.offsetArray[1]), (this.overlayWidth + this.offsetArray[1]))
        ctx.drawImage(this.originalImg, (this.currentX - this.offsetArray[1]) * ratio,
        (this.currentY - this.offsetArray[0]) * ratio,
        (this.overlayWidth) * ratio,
        (this.overlayHeight + this.offsetArray[0] * 2) * ratio,
        0,
        0,
        1200,
        900)
        this.editedURL = this.hiddenCanvas.toDataURL("image/jpeg")
    }
    onChildEvent(event) {
        switch(event) {
            case "crop":
                this.crop()
            break
            case "toggleMode":
                this.mode = !this.mode
            break
            case "save":
                if(!this.editedURL) {this.crop()}
                this.notifyParent("saveImage", this.editedURL)
            break
            case "cancel":
                this.notifyParent("cancelImage")
            break
        }   
    }
}