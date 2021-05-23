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
        console.log("here", number)
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

class MobileTab {
    constructor(notifyParent) {
        this.index
        this.label = el("a")
        this.el = el("li.tab-item.c-hand", {
            onclick: function (e) {
                notifyParent(this.index)
            }.bind(this)
        }, this.label)
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
        this.el = el("div.w-100.shadow.show-lg", { style: "background:white" }, this.tabs)
    }
    update(data, active) {
        this.tabs.update(data, { active: active })
        this.data = data
    }
    onChildEvent(index) {
        this.update(this.data, index)
        this.notifyParent("toggleView", index)
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
                return this.index
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