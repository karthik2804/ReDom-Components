const { el, mount, text, list, setChildren, setStyle, setAttr } = redom

class Renderer {
    constructor() {
        this.data
        let unescape = function(str){ 
            return str.replace(/&#39;/g, "'").replace(/&quot/g, '"').replace(/&gt;/g, ">").replace(/&lt/g, "<").replace(/&amp/g, "&");
        }
        let inlineDefault = function(node) {
            return el(node.htmlTag, (node.text ? unescape(node.text) : ""))
        }.bind(this)
        let blockDefault = function(node) {
            return el(node.htmlTag, this.render(node.tokens))
        }.bind(this)
        let link = function(node) {
            return el("a", {href:node.href}, node.text)
        }
        let list = function(node) {
            return el(node.htmlTag, this.render(node.items))
        }.bind(this)
        let image = function(node) {
            return el("img", {src:node.href}, node.text || "" )
        }
        let codespan = function(node) {
            if (node.text.substring(0,3) == "img") {
                return el("img.w-100", {src:this.data[node.text[3] - 1]})
            }
            return el("codespan", node.text )
        }.bind(this)
        let text = function(node) {
            if (node.tokens) {
                return this.render(node.tokens)
            }
            return unescape(node.text)
        }.bind(this)
        let table = function(node) {
            let tableHeader = function(header) {
                return el("tr", node.tokens.header.map(function(k) {
                    return el("th", this.render(k))
                }.bind(this)))
            }.bind(this)
            let tableCells = function(cells) {
                return cells.map(function(k) {
                    return el("tr", k.map(function(item) {return el("td", this.render(item))}.bind(this)))
                }.bind(this))
            }.bind(this)
            return el("table", tableHeader(node.tokens.header), tableCells(node.tokens.cells))
        }.bind(this)
        this.tokenToRedom = new Map([["inlineDefault", inlineDefault], ["blockDefault", blockDefault], ["link", link], ["list", list],
            ["table", table], ["image", image], ["text", text], ["codespan", codespan]])
    }
    render(tree) {
        let temp = tree.map(function(k){
            if(k.tokens) {
               return this.tokenToRedom.has(k.type) ? this.tokenToRedom.get(k.type)(k) : this.tokenToRedom.get("blockDefault")(k)
            }
            else {
               return this.tokenToRedom.has(k.type) ? this.tokenToRedom.get(k.type)(k) : this.tokenToRedom.get("inlineDefault")(k)
            }
        }.bind(this))
        return temp
    }
}

class CropperToolbar {
    constructor(notifyParent) {
        this.cancelButton = el("button.btn.btn-link.input-group-btn", {onclick:function(e){e.stopPropagation();notifyParent("cancel")}}, "Cancel")
        this.cropButton = el("button.btn.btn-primary.input-group-btn", {onclick:function(e){e.stopPropagation();notifyParent("save")}}, "Crop")
        this.el = el("div.w-100.navbar.p-absolute", {style:"z-index:999;padding:0.5rem;background:rgba(255,255,255,0.8)"}, el("div.navbar-section",this.cancelButton), 
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

        this.image = el("img.w-100")
        this.resizeDiv = el("div.p-absolute", {style:"height:20px;width:20px;background:red;"})
        this.overlay = el("div.p-absolute", {style:"z-index:10;border:3px solid red;height:75px;width:100px;"}, el("div.p-relative.w-100.h-100", this.resizeDiv))
        setStyle(this.resizeDiv, {bottom:"-3px", right:"-3px"})
        this.overlayContainer = el("div.p-absolute", el("div.p-relative.w-100.h-100", this.overlay))
        this.toolbar = new CropperToolbar(this.onChildEvent.bind(this))
        this.el = el("div.w-100.p-relative")

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
        this.containerWidth = width
        this.containerHeight = height
        setStyle(this.overlayContainer, {top: this.image.offsetTop + 'px', left: this.image.offsetLeft + 'px',
            height: height + 'px', width: width + 'px' })
        let ratio = this.containerWidth/tempWidth
        this.currentX = this.currentX * ratio
        this.currentY = this.currentY * ratio
        this.overlayHeight = this.overlayHeight * ratio
        this.overlayWidth = this.overlayWidth * ratio
        setStyle(this.overlay, {width: this.overlayWidth + 'px', height: this.overlayHeight + 'px', 
                    left: this.currentX + 'px', top: this.currentY + 'px'})
    }
    loadImage(url) {    // Load image and set the container overlay to the same size
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
                this.containerWidth = width
                this.containerHeight = height
                setStyle(this.overlayContainer, {top: this.image.offsetTop + 'px', left: this.image.offsetLeft + 'px',
                    height: height + 'px', width: width + 'px' })
                this.overlayWidth = this.containerWidth * 0.8
                if (this.overlayWidth < this.containerHeight) {
                    this.overlayHeight = this.overlayWidth * 0.8
                }
                else {
                    this.overlayHeight = this.containerHeight * 0.8
                    this.overlayWidth = this.overlayHeight * 1.33
                }
                setStyle(this.overlay, {width: this.overlayWidth + 'px', height: this.overlayHeight + 'px', 
                    left: (this.containerWidth - this.overlayWidth)/2 + 'px', top: (this.containerHeight - this.overlayHeight)/2 + 'px'})
                this.currentX = parseInt(this.overlay.style.left , 10)
                this.currentY = parseInt(this.overlay.style.top , 10)
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
        ctx.drawImage(this.originalImg, this.currentX * ratio, this.currentY * ratio, this.overlayWidth * ratio, this.overlayHeight * ratio, 0,0,1200,900)
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

class ResizableColumns {
    constructor(child1, child2, start ,min, max, notifyParent = () => {}) {
        this.notifyParent = notifyParent
        let startX
        this.child1 = child1
        this.child2 = child2
        this.maxWidth = max
        this.resize = el("div.h-100.hide-lg.ew-resize.p-absolute", {style:"width:10px;right: -5px"})
        this.column1 = el("div.column.p-relative.col-" + (12 * start) + ".col-lg-12", this.resize, this.child1)
        this.column2 = el("div.column.hide-lg", this.child2)
        this.el = el("div.w-100.container.full-col", {style:"flex-grow:1;"}, el("div.h-100.w-100.columns.col-gapless", this.column1, this.column2))
        setStyle(this.column1, {"min-width": min + "%", "max-width": max + "%"})
        let startMoving = function(e) {
            startX = e.clientX
            document.body.addEventListener("mousemove", moving, false)
            document.body.addEventListener("mouseup", stopMoving, false)
        }.bind(this)
        let moving = function(e) {
            this.onChildEvent(e.clientX - startX)
            startX = e.clientX
        }.bind(this)
        let stopMoving = function(e) {
            document.body.removeEventListener("mousemove", moving, false)
            document.body.removeEventListener("mouseup", stopMoving, false)
        }.bind(this)
        this.resize.addEventListener("mousedown", startMoving, false)
    }
    update(number){
        number == 0 ? this.column1.classList.remove("hide-lg") : this.column1.classList.add("hide-lg")
        number == 0 ? this.column2.classList.add("hide-lg") : this.column2.classList.remove("hide-lg")
    }
    toggleMaxWidth (isScreenSmall) {
        if(isScreenSmall) {
            setStyle(this.column1, {"max-width": 100 + "%"})
        }
        else {
            setStyle(this.column1, {"max-width": this.maxWidth + "%"})
        }
    }
    onChildEvent(data) {
        setStyle(this.column1, {width: this.column1.getBoundingClientRect().width + data + 'px'})
        this.notifyParent("resize")
    }
}

class ListHeader {
    constructor(notifyParent) {
        this.add = el("a.btn.btn-link", {onclick:function(e){notifyParent("newDoc")}}, "New")
        this.searchInput = el("input.form-input", {type:"text", placeholder:"Search"})
        this.searchButton = el("button.btn.btn-primary.input-group-btn", "Search")
        this.el = el("div.w-100.navbar", {style:"padding:1rem"}, el("div.navbar-section", this.add),
         el("div.navbar-section", el("div.input-group.input-inline", this.searchInput, this.searchButton)))
    }
}

class DocumentsListItem {
    constructor(notifyParent) {
        this.index
        this.title = el("span.column", {style:"text-align:left"})
        this.delete = el("span.c-hand", {onclick:function(e){
            e.stopPropagation()
            notifyParent("deleteDocument", this.index)
        }.bind(this)}, "X")
        this.el = el("div.d-flex.c-hand", {style:"padding:0.5rem;",onclick: function(e) {
            notifyParent("loadDocument", this.index)
        }.bind(this)}, this.title, this.delete)
    }
    update(data, index) {
        this.index = index
        this.title.textContent = data
    }
}

class ListPane {
    constructor(notifyParent) {
        this.notifyParent = notifyParent
        this.header = new ListHeader(this.onChildEvent.bind(this))
        this.documentList = list("div.w-100", DocumentsListItem, null, this.onChildEvent.bind(this))
        this.el = el("div.w-100.h-100", {style:"text-align:center;background:#eeeeee"}, this.header, this.documentList)
    }
    update(data) {
        this.documentList.update(data)
    }
    onChildEvent(event, data) {
        switch(event) {
            case "newDoc":
                this.notifyParent("newDocument")    
            break
            case "loadDocument":
                this.notifyParent("loadDocument", data)    
            break
            case "deleteDocument":
                this.notifyParent("deleteDocument", data)    
            break
        }
    }
}

class ImageThumbnail {
    constructor(notifyParent) {
        this.index = null
        this.delete = el("div.p-absolute.d-flex", {style:"justify-content:center;align-items:center;color:white;font-size:0.8rem;border-radius:50%;width:20px;height:20px;background:red;top:0.75rem;right:0.75rem",
            onclick: function(e) {notifyParent("deleteImage", this.index)}.bind(this)}, "X")
        this.image = el("img", {style:"height:6rem;padding:1rem;", onclick: function(e){notifyParent("openImage", this.index)}.bind(this)})
        this.el = el("div.p-relative", this.image, this.delete)
    }
    update(data, index, items, context) {
        this.index = index
        this.image.src = data
    }
}

class ImageList {
    constructor(notifyParent) {
        this.images = []
        this.isCropperOpen = false
        this.index = null
        this.notifyParent = notifyParent
        this.addImage = el("button.btn.btn-primary", {style:"margin-right:1rem", onclick:function(e){notifyParent("addImage")}}, "Add Image")
        this.thumbnails = list(el("div.d-flex", {style:"flex-grow:1;width:90%;overflow-X:auto;"}), ImageThumbnail, null, this.onChildEvent.bind(this))
        this.el = el("div.d-flex.w-100", {style:"height:8rem;padding:1rem;align-items:center;justify-content:center"}, this.addImage, this.thumbnails)
    }
    update(event, data) {
        switch(event) {
            case "add":
                this.index = this.images.length
                this.notifyParent("openImage", data)
            break
            case "delete":
                if(this.isCropperOpen) {return}
                this.images.splice(data, 1)    
            break
            case "save":
                this.images[this.index] = data
                this.notifyParent("closeCropper")
            break
            case "clear":
                this.images = []
            break
            case "load":
                this.images = data
            break
            case "cropperStatus":
                this.isCropperOpen = data
            break
        }
        this.thumbnails.update(this.images)

    }
    onChildEvent(event, data) {
        switch(event){
            case "openImage":
                this.index = data
                this.notifyParent("openImage", this.images[data])
            break
            case "deleteImage":
                this.update("delete", data)
            break
        }
    }
}

class EditorPane {
    constructor(notifyParent) {
        this.notifyParent = notifyParent
        this.header = new EditorHeader()
        this.imageList = new ImageList(this.onChildEvent.bind(this))
        this.imageCropper = new ImageCropper(this.onChildEvent.bind(this))
        this.divider = el("div.divider.text-center.w-100", {"data-content":"Markdown"})
        this.textArea = el("textarea.w-100", {style:"padding:1rem;border:none;outline:none;flex-grow:1;resize:none;", autofocus: true, placeholder:"Write Something...", onkeyup: function(e) {
            if (e.code == "Enter" || e.code == "Period") {
                notifyParent("contentChange", this.textArea.value)
            }
        }.bind(this)})
        this.el = el("div.w-100.h-100.d-flex.flex-column.shadow-2", {style:"align-items:center"}, this.header, this.imageList, this.imageCropper,
        this.divider, this.textArea)
    }
    update(event,data) {
        switch(event){
            case "add":
                this.imageList.update("add", data)
            break
            case "resize":
                this.imageCropper.resize()
            break
            case "clear":
                this.textArea.value = ""
                this.imageList.update("clear")
            break
            case "load":
                this.textArea.value = data.markdown
                this.imageList.update("load", data.imageList)
                this.notifyParent("contentChange", this.textArea.value)
            break
        }
    }
    onChildEvent(event, data) {
        switch(event) {
            case "addImage":
                this.notifyParent("addImage")
            break
            case "openImage":
                this.imageCropper.loadImage(data)
                setChildren(this.el, [this.header, this.imageList, this.imageCropper, this.divider, this.textArea])
                this.imageList.update("cropperStatus", true)
            break
            case "saveImage":
                this.imageList.update("save", data)
                this.notifyParent("contentChange", this.textArea.value)
            break
            case "cancelImage":
                setChildren(this.el, [this.header, this.imageList, this.divider, this.textArea])
                this.imageList.update("cropperStatus", false)
            break
            case "closeCropper":
                setChildren(this.el, [this.header,this.imageList, this.divider, this.textArea])
                this.imageList.update("cropperStatus", false)
            break
        }
    }
}

class PreviewPane {
    constructor() {
        this.domTree = []
        this.el = el("div.w-100.h-100", {style:"padding:1rem;background:#eeeeee;overflow-y:auto"})
    }
    update(tree) {
        this.domTree = tree
        setChildren(this.el, this.domTree)
    }
}

class MobileTab {
    constructor(notifyParent) {
        this.index
        this.label = el("a")
        this.el = el("li.tab-item.c-hand", {onclick: function(e) {
            notifyParent(this.index)}.bind(this)}, this.label)
    }
    update(data, index, items, context) {
        this.index = index
        this.label.textContent = data
        index == context.active ? this.el.classList.add("active") : this.el.classList.remove("active")
    }
}

class MobileTabBar {
    constructor(notifyParent) {
        this.notifyParent = notifyParent
        this.data
        this.tabs = list("ul.tab.tab-block", MobileTab, null, this.onChildEvent.bind(this))
        this.el = el("div.w-100.shadow.show-lg", {style:"background:white"}, this.tabs)
    }
    update(data, active) {
        this.tabs.update(data, {active: active})
        this.data = data
    }
    onChildEvent(index) {
        console.log(index)
        this.update(this.data, index)
        this.notifyParent("toggleView", index)
    }
}

class EditorHeader {
    constructor(notifyParent) {
        this.publishButton = el("button.btn.btn-success.input-group-btn", "Publish")
        this.el = el("div.w-100.navbar", {style:"padding:1rem"}, el("div.navbar-section"),
         el("div.navbar-section", this.publishButton))
    }
}

class SimpleEditor {
    constructor(notifyParent) {
        this.index = 0
        this.documents = []
        this.documentIndex = null
        this.listItems = ["Write Something"]
        this.notifyParent = notifyParent
        this.loading = false
        
        this.list = new ListPane(this.onChildEvent.bind(this))
        this.editor = new EditorPane(this.onChildEvent.bind(this))
        this.preview = new PreviewPane(this.onChildEvent.bind(this))
        this.mobileTabBar = new MobileTabBar(this.onChildEvent.bind(this))
        this.mobileTabBar.update(["List", "Editor", "Preview"], 0)
        this.editorPreviewContainer = new ResizableColumns(this.editor, this.preview, 0.5,40, 60, this.onChildEvent.bind(this))
        this.workspace = el("div.h-100.d-flex.flex-column.shadow-1", this.editorPreviewContainer)
        this.listViewContainer = new ResizableColumns(this.list, this.workspace, 0.2, 20, 40, this.onChildEvent.bind(this))
        this.el = el("div.w-100.h-100.d-flex.flex-column", this.listViewContainer, this.mobileTabBar)

        this.renderer = new Renderer()

    }
    update() {
        let indexMap = [[0,0], [1,0], [1,1]]
        this.listViewContainer.update(indexMap[this.index][0])
        this.editorPreviewContainer.update(indexMap[this.index][1])
        this.mobileTabBar.update(["List", "Editor", "Preview"], this.index)
    }
    resize() {
        let isScreenSmall = document.body.getBoundingClientRect().width < 960   
        this.listViewContainer.toggleMaxWidth(isScreenSmall)
        this.editorPreviewContainer.toggleMaxWidth(isScreenSmall)
    }
    loadData(val) {
        this.documents = val || []
        if (val && val.length > 0) {
            this.listItems = val.map(function(k){
                return k.markdown.slice(0, 15) + "..."
            })
            this.onChildEvent("loadDocument", 0)
        }
        else {
            this.listItems = ["Write Something..."]
            this.list.update(this.listItems)
            this.documentIndex = 0
        }
    }
    saveDocument(val) {
        if(this.loading) {return}
        this.documents[this.documentIndex] = {
            author: "",
            imageList: this.editor.imageList.images,
            markdown: val
        }
        this.notifyParent("saveData", this.documents)
    }
    onChildEvent(event, data) {
        if(this.loading) {return}
        switch(event){
            case "toggleView":
                this.index = data
                this.update()
            break
            case "contentChange":
                this.renderer.data = this.editor.imageList.images
                this.preview.update(this.renderer.render(marked(data)))
                this.saveDocument(data)
                this.listItems[this.documentIndex] = data.slice(0,15) + "..."
                this.list.update(this.listItems)
            break
            case "resize":
                this.editor.update("resize")
            break
            case "addImage":
                let readImage = function(file) {
                    let input = file.target
                    let reader = new FileReader()
                    reader.onload = function() {
                        let dataURL = reader.result
                        this.editor.update("add", dataURL)
                    }.bind(this)
                    reader.readAsDataURL(input.files[0]); 
                }.bind(this)
                let file = el("input", {type:"file", accept:".jpg, .jpeg, .png", onchange: function(e){
                    readImage(e)
                }})
                file.click()
            break
            case "newDocument":
                this.documentIndex = this.documents.length
                this.editor.update("clear")
                this.listItems[this.documentIndex] = "Write Something..."
                this.list.update(this.listItems)
                setChildren(this.preview, [])
            break
            case "loadDocument":
                if(this.documentIndex == data) {return}
                this.loading = true
                this.documentIndex = data
                if (!this.documents[this.documentIndex]) {
                    this.listItems.splice(this.documentIndex, 1)
                }
                this.documentIndex = data
                this.editor.update("load", this.documents[this.documentIndex])
                this.list.update(this.listItems)
                this.renderer.data = this.editor.imageList.images
                this.preview.update(this.renderer.render(marked(this.documents[this.documentIndex].markdown)))
                this.index = 1
                this.update()
                this.loading = false
            break
            case "deleteDocument":
                if(this.documentIndex == data) {return}
                this.documents.splice(data,1)
                this.listItems.splice(data, 1)
                this.list.update(this.listItems)
                this.notifyParent("saveData", this.documents)
            break
        }
    }
}

class App {
    constructor() {
        this.indexDb

        this.editor = new SimpleEditor(this.onChildEvent.bind(this))
        this.el = el("div.w-100.h-100", this.editor)
        
        window.onresize = function(e) {this.editor.resize()}.bind(this)

        let dbReq = indexedDB.open('DocumentsData', 1)
        dbReq.onupgradeneeded = function(e) {
            this.indexDb = e.target.result
            this.indexDb.createObjectStore('Documents', {autoIncrement: true})
        }.bind(this)
        dbReq.onsuccess = function(event) {
            this.indexDb = event.target.result;
            this.loadData()
        }.bind(this)
        dbReq.onerror = function(event) {
            alert('error opening database ' + event.target.errorCode);
        }
        this.saveData = function(data) {
            let tx = this.indexDb.transaction(['Documents'], 'readwrite')
            let store = tx.objectStore('Documents')
            store.put(data, 1)
            tx.oncomplete = function() { console.log('stored data!') }
            tx.onerror = function(event) {
                alert('error storing note ' + event.target.errorCode)
            }
        }.bind(this)
        this.loadData = function() {
            let tx = this.indexDb.transaction(['Documents'], 'readonly')
            let store = tx.objectStore('Documents')
            let data
            let req = store.get(1)
            req.onsuccess = function(event) {
                data = event.target.result;
                if (!data) { data = []}
                this.editor.loadData(data)
            }.bind(this)
            req.onerror = function(event) {
                alert('error getting note 1 ' + event.target.errorCode);
            }
        }.bind(this)
    }
    onChildEvent(event, data) {
        switch(event) {
            case "saveData":
                this.saveData(data)
            break
        }
    }
}

let app = new App() 
mount(document.body, app)
app.editor.resize()
