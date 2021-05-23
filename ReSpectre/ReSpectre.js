class Avatar {
    constructor() {
        this.sizes = ["avatar-xs", "avatar-sm", ".", "avatar-lg", "avatar-xl"]
        this.type = 0 // 0 - only avatar, 1 - avatar with icon, 2 - avatar with presence
        this.img = el("img", {alt:""})
        this.el = el("figure.avatar.mr-2")
    }
    update(data) {
        this.type = data.type || 0
        this.img.src = data.src
        this.el.classList.add(this.sizes[data.size])
        setAttr(this.el, {"data-initial":data.alt_data || ""})
        if(this.type == 0){
            setChildren(this.el, [this.img])
        }
        else {
            if (this.type == 1) {
                this.icon = el("img", {src: data.iconSrc, class:"avatar-icon"})
            }
            else {
                this.icon = el("i", {class:"avatar-presence " + data.presence})
            }
            setChildren(this.el, [this.img, this.icon])
        }
        setStyle(this.el, {"background-color": data.background })
    }
}

class BreadCrumbItems {
    constructor(initData) {
        this.id = initData[1]
        this.value = null
        this.content =el("a", {href:"#", onclick:function(){
            initData[0](this.id, this.value)
        }.bind(this)})
        this.el = el("li" ,{class:"breadcrumb-item"}, this.content)
    }
    update(data) {
        this.value = data
        this.content.textContent = data;
    }
}

class Breadcrumb {
    constructor(notifyFn, id) {
        this.el = list("ul.breadcrumb", BreadCrumbItems, null, [notifyFn, id])
    }
    update(data) {
        this.el.update(data)
    }
}

class BarItems {
    constructor(initData) {
        this.isSmall = initData
        this.el = el("div", {class:"bar-item"})
    }
    update(data) {
        if(!this.isSmall) this.el.textContent = data[1]
        if(data[3]) {
            this.el.classList.add("tooltip")
            setAttr(this.el, {"data-tooltip" : data[3]})
        }
        setStyle(this.el, {width: data[0], background: data[2]})
    }
}

class Bar {
    constructor(isSmall) {
        this.el = list("div.bar" + (isSmall ? ".bar-sm" : ""), BarItems, null, isSmall)
    }
    update(data) {
        this.el.update(data)
    }
}

class Card {
    constructor() {
        this.image = el("img.img-responsive")
        this.title = el("div.card-title.h5")
        this.subtitle = el("div.card-subtitle.text-gray")
        this.header = el("div.card-header", this.title, this.subtitle)
        this.body = el("div.card-body")
        this.footer = el("div.card-footer")
        this.cardImage = el("div.card-image", this.image)
        this.el = el("div.card")
        this.order = [this.image, this.header, this.body, this.footer]
    }
    update(data) {
        this.title.textContent = data.title
        this.subtitle.textContent = data.subtitle
        this.body.textContent = data.body
        setChildren(this.footer, [data.footer])
        this.image.src = data.imgSrc
        setChildren(this.el, [this.order[data.order[0]], this.order[data.order[1]], this.order[data.order[2]], this.order[data.order[3]]])
    }
}

class Chips {
    constructor() {
        this.el = el("span.chip")
    }
    update(data) {
        setChildren(this.el, [data])
    }
}

class Empty {
    constructor() {
        this.icon = el("i.icon.icon-3x")
        this.title = el("p.empty-title.h5")
        this.subtitle = el("p.empty-subtitle")
        this.emptyAction = el("div.empty-action")
        this.el = el("div.empty", el("div.empty-icon", this.icon, this.title, this.subtitle, this.emptyAction))
    }
    update(data) {
        this.icon.classList.add(data.icon)
        this.title.textContent = data.title
        this.subtitle.textContent = data.subtitle
        setChildren(this.emptyAction, data.action)
    }
}

class PaginationItem {
    constructor(initData) {
        this.id = initData[1]
        this.value = null
        this.content =el("a", {href:"#", onclick:function(){
            if(this.el.classList.contains("disbaled")) {
                return
            }
            initData[0](this.id, this.value)
        }.bind(this)})
        this.el = el("li.page-item", this.content)
    }
    update(data) {
        this.value = data[0]
        this.content.textContent = data[0]
        if (data[1] == "disabled") {
            this.el.classList.add("disabled")
        }
        if (data[1] == "active") {
            this.el.classList.add("active")
        }
    }
}

class Pagination {
    constructor(notifyFn, id) {
        this.el = list("ul.pagination", PaginationItem, null, [notifyFn, id])
    }
    update(data) {
        this.el.update(data)
    }
}

class Popovers {
    constructor() {
        this.content = el("button.btn.btn-primary")
        this.popoverContaier = el("div.popover-container")
        this.el = el("div.popover", this.content, this.popoverContaier)
    }
    update(data) {
        this.content.textContent = data.content
        this.el.classList.add("popover-" + data.direction)
        setChildren(this.popoverContaier, [data.child])
    }
}

class StepItem {
    constructor() {
        this.content =el("a.tooltip", {href:"#"})
        this.el = el("li.step-item", this.content)
    }
    update(data) {
        this.content.textContent = data[0]
        setAttr(this.content, {"data-tooltip": data[1]})
        if (data[2] == "active") {
            this.el.classList.add("active")
        }
    }
}

class Steps {
    constructor(notifyFn) {
        this.el = list("ul.step", StepItem)
    }
    update(data) {
        this.el.update(data)
    }
}

class Tile {
    constructor(isCompact, hasImage, ) {
        this.isCompact = isCompact
        this.hasImage = hasImage
        if (hasImage) {
            this.img = el("img")
            this.icon = el("figure.avatar.avatar.lg", this.img)
        }
        else {
        this.i = el("i.icon.p-centered")
        this.icon = el("div.example-tile-icon", this.i)
        }
        this.title = el("p.tile-title")
        if (!isCompact) {
            this.subtitle = el("p.tile-subtitle")
        }
        else {
            this.subtitle = el("small.tile-subtitle.text-gray")
        }
        this.tileContent = el("div.tile-content", this.title, this.subtitle)
        this.action = el("div.tile-action")
        this.el = el("div.tile" + (isCompact ? ".tile-centered" : ""), el("div.tile-icon", this.icon), this.tileContent, this.action)
    }
    update(data) {
        this.title.textContent = data.title
        this.subtitle.textContent = data.subtitle
        if(this.hasImage) {
            this.img.src = data.src
        }
        else {
            this.i.classList.add(data.icon)
        }
        setChildren(this.action, [data.action])
    }
}

class Toast {
    constructor() {
        this.el = el("div.toast")
    }
    update(data) {
        setChildren(this.el, [data[0]])
        if (data[1]) {
            this.el.classList.add("toast-" + data[1])
        }
    }
}

class Modal {
    constructor() {
        this.sizes = ["modal-sm", ".", "modal-lg" ]
        this.isModalOpen = false
        this.title = el("div.modal-title.h5")
        this.header = el("div.modal-header", el("a.btn.btn-clear.float-right", {href:"#close", "aria-label": "Close", onclick: function(){this.toggleModal()}.bind(this)}), this.title)
        this.content = el("div.content")
        this.body = el("div.modal-body", this.content)
        this.footer = el("div.modal-footer")
        this.container = el("div.modal-container", this.header, this.body, this.footer)
        this.modal = el("div.modal", el("a.modal-overlay", {href:"#close", "aria-label":"Close", onclick: function(){this.toggleModal()}.bind(this)}), this.container)
        this.button = el("button.btn.btn-primary", {onclick: function() {
            this.toggleModal()
        }.bind(this)})
        this.el = el("div", this.button, this.modal)
    }
    update(data) {
        this.button.textContent = data.button
        this.title.textContent = data.title
        setChildren(this.content, [data.body])
        setChildren(this.footer, [data.footer])
        this.modal.classList.add(this.sizes[data.size])
    }
    toggleModal() {
        if(this.isModalOpen) {
            this.modal.classList.remove("active")
        }
        else {
            this.modal.classList.add("active")
        }
        this.isModalOpen = !this.isModalOpen
    }
}

class Panel {
    constructor() {
        this.header = el("div.panel-header") 
        this.nav = el("div.panel-nav") 
        this.body = el("div.panel-body") 
        this.footer = el("div.panel-footer") 
        this.el = el("div.panel", this.header, this.nav, this.body, this.footer)
    }
    update(data) {
        setChildren(this.header, [data.header])
        setChildren(this.nav, [data.nav])
        setChildren(this.body, [data.body])
        setChildren(this.footer, [data.footer])

    }
}

class TabItems {
    constructor(initData) {
        this.value = null
        this.id = initData[1]
        this.content = el("a", {onclick: function(){
            initData[0](this.id, this.value)
        }.bind(this)})
        this.el = el("li.tab-item", this.content)
    }
    update(data) {
        this.value = data[0]
        this.content.textContent = data[0]
        if(data[1]) {
            this.el.classList.add("active")
        }
        if(data[2]) {
            this.content.classList.add("badge")
            if( data[3]) {
                setAttr(this.content, {"data-badge": data[3]})
            }
        }
    }
}

class Tabs {
    constructor(notifyFn, id) {
        this.el = list("ul.tab.tab-block", TabItems, null, [notifyFn, id])
    }
    update(data) {
        this.el.update(data)
    }
}

class AccordionItem {
    constructor(initData) {
        this.index
        this.title = el("span")
        this.summary = el("summary.accordion-header.c-hand", (initData[1] ? el("i.icon.icon-arrow-right.mr-1"): ""), this.title)
        this.body = el("div.accordion-body")
        this.el = el("details.accordion", {onclick: function(e){
            initData[0](this.index, this.el.getAttribute("open"))
        }.bind(this)}, this.summary, this.body)
    }
    update(data, index, items, context) {
        this.index = index
        if (context.openIndex !=null && index != context.openIndex) {
            setAttr(this.el, {open:false})
        }
        if(data == null) {
            return
        }
        this.title.textContent = data[0]
        setChildren(this.body, [data[1]])
    }
}

class Accordions {
    constructor(isSingleOpen = false, useArrow = true) {
        this.isSingleOpen = isSingleOpen
        this.openID = null
        this.length
        this.el = list("div.accordion-container", AccordionItem, null, [this.toggleOpen.bind(this), useArrow])
    }
    update(data) {
        this.length = data.length
        this.el.update(data, {openIndex: null})
    }
    toggleOpen(id, isOpen) {
        console.log(id, isOpen)
        if(!this.isSingleOpen || isOpen == "") {
            return
        }
        this.openID = id
        this.el.update( new Array(this.length).fill(null), {openIndex: this.openID})
    }
}

class MenuItems {
    constructor(initData) {
        this.isVertical = initData[0]
        this.type = initData[1]
        this.id = null
        this.active = []
        if (this.type == 2) {
            this.label = el("span")
            this.input =  el("input" ,{type: "radio", name: this.id, onchange: function() {
                initData[3](this.id, this.content.textContent, this.input.checked)
            }.bind(this)})
            this.content = el("label.form-radio", this.input, el("i.form-icon"), this.label)
        }
        else if (this.type == 1) {
            this.label = el("span")
            this.input = el("input" ,{type: "checkbox", onchange: function() {
                initData[3](this.id, this.content.textContent, this.input.checked)
            }.bind(this)})
            this.content = el("label.form-checkbox", this.input, el("i.form-icon"), this.label)
        }
        else {
            this.content = el("a", {onclick: function() {
                initData[3](this.id, this.content.textContent)
            }.bind(this)})
        }
        if (this.isVertical) {
            this.el = el("li.menu-item.c-hand", this.content)
        }
        else {
            this.el = el("span.menu-item.c-hand", {style:"display: inline-block !important;"}, this.content)
        }
    }
    update(data,index, items, context) {
        this.id = index
        if (this.type == 2) {
            this.label.textContent = data
            if(index == context.active) {setAttr(this.input, {checked: true})}
        }
        else if (this.type == 1) {
            this.label.textContent = data
            if(context.active[index] == 1) {setAttr(this.input, {checked: true})}
        }
        else {
            this.content.textContent = data
            if(index == context.active) {this.content.classList.add("active")}
            else {this.content.classList.remove("active")}
        }
    }
}

class Menu {
    constructor(type, isVertical = true, id, notifyFn) {
        this.data = [[]]
        this.notifyFn = notifyFn
        this.title = el("h4", "Title")
        this.type = type
        this.id = id || null
        this.isVertical = isVertical
        this.el = (isVertical ? list("ul.menu", MenuItems, null, [isVertical, type, id, this.onChildEvent.bind(this)]): list("div.menu", MenuItems, null, [isVertical, type, id, this.onChildEvent.bind(this)]))
    }
    update(data, active) {
        this.data = data
        this.active = active
        this.el.update(data, {active: this.active})
    }
    onChildEvent(id, val, active) {
        if (this.type == 0) {
            this.active = id
        }
        if(active) {
            if(this.type == 1) {
                this.active[id] = 1
            }
            else {
                this.active = id
            }
        } 
        else {
            if(this.type == 1) {
                this.active[id] = 0
            }
        }
        this.notifyFn(id, val, active)
        this.update(this.data, this.active)     
    }
}