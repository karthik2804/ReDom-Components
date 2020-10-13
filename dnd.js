const { el, mount, text, list, setChildren, setStyle, setAttr } = redom

class DndItem {
    constructor(parentNotify) {
        this.parentNotify = parentNotify
        this.index = null
        this.el = el("div.item.h3.flex.items-center.justify-center", {draggable:true, style:"border:1px solid red", ondragstart: function(e){
            this.parentNotify("dragStart", this.index, e.clientY)
            e.stopPropagation()
        }.bind(this),
        ondragover: function(e) {
            this.parentNotify("dragMove", this.index, e.clientY)
            e.stopPropagation()
        }.bind(this),
        ondragend: function(e) {
            this.parentNotify("dragEnd", this.index)
        }.bind(this)})
    }
    update(data, i) {
        this.index = i
        this.el.textContent = data
    }
}

class DndList {
    constructor() {
        this.itemsLength = 0
        this.itemDragging  = null
        this.nextItem = this.prevItem = null
        this.itemY = null
        this.startY
        this.rect
        this.items = list("div", DndItem, null, this.onChlidEvent.bind(this))
        this.el = el("div.w-50.tc", this.items)
        this.itemHeight
        this.lastIndex = null
        this.content
    }
    update(data) {
        this.content = data
        this.itemsLength = data.length
        this.items.update(data)
    }
    onChlidEvent(event, index, data) {
        switch(event){
            case "dragStart":
                this.startY = this.items.views[index].el.getBoundingClientRect().y - data
                this.itemY = this.items.views[index].el.getBoundingClientRect().y
                this.itemDragging = index
                this.nextItem = index + 1
                setStyle(this.items.views[index], {opacity: 0})
                for (let i = 0; i < this.itemsLength; i++) {
                    setStyle(this.items.views[i], {transition:"all 0.3s linear"})
                }
                this.rect = this.el.getBoundingClientRect()
                this.itemHeight = this.rect.height / this.itemsLength
                this.lastIndex = this.itemDragging
                break
            case "dragMove":
                let positionIndex = Math.round(((data + this.startY) - this.rect.y)/this.itemHeight)
                positionIndex = (positionIndex >= 0 ? positionIndex : 0)
                if(this.lastIndex == positionIndex) {return}
                for (let i = 0; i < this.itemsLength; i++) {
                    if (i == this.itemDragging) {
                        continue
                    }
                    if (i > this.itemDragging) {
                        if(positionIndex >= i) {
                            setStyle(this.items.views[i], {transform:"translateY(-" + this.itemHeight + "px)"})
                        }
                        else {
                            setStyle(this.items.views[i], {transform:"translateY(0px)"})
                        }
                    }
                    else {
                        if(positionIndex <= i) {
                            setStyle(this.items.views[i], {transform:"translateY(+" + this.itemHeight + "px)"})
                        }
                        else {
                            setStyle(this.items.views[i], {transform:"translateY(0px)"})
                        }
                    }
                }
                this.lastIndex = positionIndex
                break
            case "dragEnd":
                this.content.splice(this.lastIndex, 0, this.content.splice(this.itemDragging, 1)[0])
                this.update(this.content)
                console.log(this.content)
                setStyle(this.items.views[index], {opacity: 0})
                for (let i = 0; i < this.itemsLength; i++) {
                    setStyle(this.items.views[i], {transform:"translateY(0px)", opacity:1, transition:"none"})
                }
                this.itemDragging = null
                break
        }
    }
}

class App {
    constructor() {
        this.dndList = new DndList()
        this.el = el("div.w-100.h-100.flex.justify-center.items-center", this.dndList)
        this.dndList.update([1,2,3,4])
    }
}

let app = new App()
mount(document.body, app)