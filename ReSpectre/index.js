let placeholderText = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent risus leo, dictum in vehicula sit amet, feugiat tempus tellus. Duis quis sodales risus. Etiam euismod ornare consequat."

class Avatar {
    constructor(data) {
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
    constructor(notifyFn) {
        this.el = list("ul.pagination", PaginationItem, null, notifyFn)
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
        this.id = null
        this.content = el("a", {onclick: function(){
            initData[0](this.id)
        }.bind(this)})
        this.el = el("li.tab-item", this.content)
    }
    update(data, index) {
        this.id = index
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
        this.notifyFn = notifyFn
        this.id = id
        this.el = list("ul.tab.tab-block", TabItems, null, [this.onChildEvent.bind(this)])
    }
    update(data) {
        this.el.update(data)
    }
    onChildEvent(id) {
        this.notifyFn(this.id, id)
    }
}

class AccordionItem {
    constructor(initData) {
        this.index
        this.title = el("span")
        this.summary = el("summary.accordion-header", el("i.icon.icon-arrow-right.mr-1"), this.title)
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
    constructor(isSingleOpen = false) {
        this.isSingleOpen = isSingleOpen
        this.openID = null
        this.length
        this.el = list("div.accordion-container", AccordionItem, null, [this.toggleOpen.bind(this)])
    }
    update(data) {
        this.length = data.length
        this.el.update(data, {openIndex: null})
    }
    toggleOpen(id, isOpen) {
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
            this.el = el("li.menu-item", this.content)
        }
        else {
            this.el = el("span.menu-item", {style:"display: inline-block !important;"}, this.content)
        }
    }
    update(data,index, items, context) {
        this.id = index
        if (this.type == 2) {
            this.label.textContent = data[0]
            if(index == context.active) {setAttr(this.input, {checked: true})}
        }
        else if (this.type == 1) {
            this.label.textContent = data[0]
            if(context.active[index] == 1) {setAttr(this.input, {checked: true})}
        }
        else {
            this.content.textContent = data[0]
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
        console.log("before update", this.active)
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

class App {
    constructor() {
        this.avatar0 = new Avatar()
        this.avatar0.update({src:"./img/avatar-1.png", size: 2, background:"", altData:"YZ", type:0})
        this.avatar1 = new Avatar()
        this.avatar1.update({src:"./img/avatar-1.png", size: 3, background:"", altData:"YZ", type:1, iconSrc:"./img/avatar-1.png"})
        this.avatar2 = new Avatar()
        this.avatar2.update({src:"./img/avatar-1.png", size: 4, background:"", altData:"YZ", type:2, presence:"online"})
        this.avatar = el("div", el("h4", "Avatar"), this.avatar0, this.avatar1, this.avatar2, avatarDoc)

        this.breadcrumb1 = new Breadcrumb(test, "nav")
        this.breadcrumb1.update(["Home", "Settings", "Change Avatar"])
        this.breadcrumb2 = new Breadcrumb(test, "nav")
        this.breadcrumb2.update(["Home", "Settings"])
        this.breadcrumbs = el("div", el("h4", "Breadcrumbs"), this.breadcrumb1, this.breadcrumb2, breadcrumbDoc)
        
        this.bar1 = new Bar(false)
        this.bar1.update([["25%","25%","","area 1"], ["50%","50%","#2087ae","area 2"]])
        this.bar2 = new Bar(true)
        this.bar2.update([["50%","50%","","small bar"]])        
        this.bar = el("div", el("h4", "Bar"), this.bar1, el("br"), this.bar2, barDoc)

        this.card1 = new Card() 
        this.card1.update({imgSrc:"./img/card-image.jpg", title: "Google", subtitle:"Software and hardware", body:"Organize the world’s information and make it universally accessible and useful.", footer: el("button.btn.btn-primary", "Search"), order:[0,1,2,3]})
        this.card2 = new Card() 
        this.card2.update({imgSrc:"./img/card-image.jpg", title: "Google", subtitle:"Software and hardware", body:"Organize the world’s information and make it universally accessible and useful.", footer: el("button.btn.btn-primary", "Search"), order:[1,0,2,3]})
        this.card3 = new Card() 
        this.card3.update({imgSrc:"./img/card-image.jpg", title: "Google", subtitle:"Software and hardware", body:"Organize the world’s information and make it universally accessible and useful.", footer: el("button.btn.btn-primary", "Search"), order:[1,2,0]})
        this.card4 = new Card() 
        this.card4.update({imgSrc:"./img/card-image.jpg", title: "Google", subtitle:"Software and hardware", body:"Organize the world’s information and make it universally accessible and useful.", footer: el("button.btn.btn-primary", "Search"), order:[,1,2,3]})
        this.card = el("div", el("h4", "Card"), el("div.columns",el("div.column.col-3.col-md-6.col-sm-12", this.card1),el("div.column.col-3.col-md-6.col-sm-12", this.card2),el("div.column.col-3.col-md-6.col-sm-12", this.card3),el("div.column.col-3.col-md-6.col-sm-12", this.card4)), cardDoc)

        this.chips1 = list("div", Chips)
        this.chips1.update([el("span", "Crime"), el("span", "Biography", el("a.btn.btn-clear", {href:"#", "aria-label":"Close", role:"button"})), 
        [el("img.avatar.avatar-sm", {src:"./img/avatar-1.png"}),el("span", "Steve Rogers"), el("a.btn.btn-clear", {href:"#", "aria-label":"Close", role:"button"})]])
        this.chips = el("div", el("h4" , "Chips"), this.chips1, chipsDoc)

        this.empty1 = new Empty()
        this.empty1.update({icon:"icon-people", title:"You have no new messages", subtitle:"Click the button to start a Conversation", action: el("button.btn.btn-primary", "Send a message")})
        this.empty = el("div", el("h4", "Empty"), this.empty1, emptyDoc)
        
        this.pagination1 = new Pagination([test, "pagination"])
        this.pagination1.update([["prev", "disabled"], ["1","active"],["2",""],["3",""],["...","disabled"],["9",""],["Next",""]])
        this.pagination2 = new Pagination([test, "pagination"])
        this.pagination2.update([["prev", ""], ["1",""],["...","disabled"],["4",""],["5","active"],["6",""],["...","disabled"],["9",""],["Next",""]])
        this.pagination = el("div", el("h4", "Pagination"), this.pagination1, this.pagination2, paginationDoc)  

        this.popover1 = new Popovers()
        this.popoverCard1 = new Card()
        this.popoverCard1.update({imgSrc:"./img/card-image.jpg", title: "Google", subtitle:"Software and hardware", body:"Organize the world’s information and make it universally accessible and useful.", footer: el("button.btn.btn-primary", "Search"), order:[0,1,2,3]})
        this.popover1.update({content: "Right popover", direction: "right", child: this.popoverCard1})
        this.popover2 = new Popovers()
        this.popoverCard2 = new Card()
        this.popoverCard2.update({imgSrc:"./img/card-image.jpg", title: "Google", subtitle:"Software and hardware", body:"Organize the world’s information and make it universally accessible and useful.", footer: el("button.btn.btn-primary", "Search"), order:[0,1,2,3]})
        this.popover2.update({content: "Top popover", direction: "top", child: this.popoverCard2})
        this.popover3 = new Popovers()
        this.popoverCard3 = new Card()
        this.popoverCard3.update({imgSrc:"./img/card-image.jpg", title: "Google", subtitle:"Software and hardware", body:"Organize the world’s information and make it universally accessible and useful.", footer: el("button.btn.btn-primary", "Search"), order:[0,1,2,3]})
        this.popover3.update({content: "Bottom popover", direction: "bottom", child: this.popoverCard3})
        this.popover4 = new Popovers()
        this.popoverCard4 = new Card()
        this.popoverCard4.update({imgSrc:"./img/card-image.jpg", title: "Google", subtitle:"Software and hardware", body:"Organize the world’s information and make it universally accessible and useful.", footer: el("button.btn.btn-primary", "Search"), order:[0,1,2,3]})
        this.popover4.update({content: "Left popover", direction: "left", child: this.popoverCard4})
        this.popover = el("div", el("h4", "Popover"), el("div.columns", el("div.column.col-3", this.popover1), el("div.column.col-3", this.popover2), el("div.column.col-3", this.popover3), el("div.column.col-3", this.popover4)), popoverDoc)

        this.steps1 = new Steps()
        this.steps1.update([["Step 1", "Step 1"], ["Step 2", "Step 2"], ["Step 3", "Step 3", "active"], ["Step 4", "Step 4"]])
        this.steps2 = new Steps()
        this.steps2.update([["Step 1", "Step 1"], ["Step 2", "Step 2", "active"], ["Step 3", "Step 3"], ["Step 4", "Step 4"]])
        this.steps = el("div", el("h4", "Steps"), this.steps1, this.steps2, stepsDoc)

        this.tile = new Tile(false, true)
        this.tile.update({title:"The Avengers", subtitle:"Earth's Mightiest Heroes joined forces to take on thre...", action: el("button.btn.btn-primary", "Join"), src:"./img/avatar-1.png"})
        this.compactTile = new Tile(true, false)
        this.compactTile.update({title:"spectre-docs.pdf", subtitle:"14MB · Public · 1 Jan, 2017", action: el("button.btn.btn-link", el("i.icon.icon-more-vert")), icon: "icon-mail"})
        this.tiles = el("div", el("h4", "Tiles"), this.tile, this.compactTile, tileDoc)

        this.toast1 = new Toast()
        this.toast1.update([el("span", "Toast success"), "success"])
        this.toast2 = new Toast()
        this.toast2.update([el("span", "Toast error"), "error"])
        this.toast3 = new Toast()
        this.toast3.update([el("span", "Toast warning"), "warning"])
        this.toast4 = new Toast()
        this.toast4.update([el("span", "Toast primary"), "primary"])
        this.toast = el("div", el("h4", "Toast"), this.toast1, this.toast2, this.toast3, this.toast4, toastDoc)

        this.modal1= new Modal()
        this.modal1.update({button:"Small Modal", title:"Modal Title", body:el("p", placeholderText), footer: el("button.btn.btn-primary", "Share"), size: 0})
        this.modal2 = new Modal()
        this.modal2.update({button:"Normal Modal", title:"Modal Title", body:el("p", placeholderText), footer: el("button.btn.btn-primary", "Share"), size: 1})
        this.modal3 = new Modal()
        this.modal3.update({button:"Large Modal", title:"Modal Title", body:el("p", placeholderText), footer: el("button.btn.btn-primary", "Share"), size: 2})
        this.modal = el("div", el("h4", "Modal"), this.modal1, this.modal2, this.modal3, modalDoc)

        this.tabs = new Tabs(test, "tabnav")
        this.tabs.update([["Music",true],["Playlists",false],["store",false,true,"9"]])
        this.tab = el("div", el("h4", "Tab"), el("div.column.col-6.col-mx-auto", this.tabs), tabDoc)

        this.accordions = new Accordions(true)
        this.accordions.update([["Elements", el("ul", el("li", "Element 1"), el("li", "Element 2"))], ["Components", el("ul", el("li", "Component 1"), el("li", "Component 2"))]])
        this.accordion = el("div", el("h4", "Accordions"), this.accordions, accordionDoc)

        this.panel = new Panel()
        this.tabs1 = new Tabs(test, "tabnav")
        this.tabs1.update([["Music",true],["Playlists",false],["store",false,true,"9"]])
        this.panel.update({header: el("h5", "Comments"), nav: this.tabs1, body:  el("span", placeholderText), footer : el("button.btn.btn-primary", "share")})
        this.panels = el("div" , el("h4", "Panel"), el("div.column.col-6",this.panel), panelDoc)

        this.menu1 = new Menu(0, true, "menu", test)
        this.menu1.update([["test"], ["trial"]], 1)
        this.menu2 = new Menu(1, true, "menu", test)
        this.menu2.update([["test"], ["trial"]], [1])
        this.menu3 = new Menu(2, true, "menu", test)
        this.menu3.update([["test"], ["trial"]], 1)
        this.menu4 = new Menu(0, false, "menu", test)
        this.menu4.update([["test"], ["trial"]], 1)
        this.menu5 = new Menu(1, false, "menu", test)
        this.menu5.update([["test"], ["trial"]], [1])
        this.menu6 = new Menu(2, false, "menu", test)
        this.menu6.update([["test"], ["trial"]], 1)
        this.menu = el("div", el("h4", "Menu"), el("div.columns", el("div.column.col-6", this.menu1), el("div.column.col-6", this.menu4), el("div.column.col-6", this.menu2), el("div.column.col-6", this.menu5), el("div.column.col-6", this.menu3), el("div.column.col-6", this.menu6)), menuDoc)

        this.el = el("div", this.avatar, this.breadcrumbs, this.bar, this.barSm, this.card, this.chips, this.empty, this.pagination,
            this.popover, this.steps, this.tiles, this.toast, this.modal, this.tab, this.accordion, this.panels, this.menu) 
    }
}

function test(id, val) {
    console.log(id, val)
}

let app = new App()

setStyle(document.body, {margin: 0, padding: "1rem", width:"100%", height: "100%", "box-sizing": "border-box"})
setStyle(document.documentElement, {margin: 0, padding: 0, width:"100%", height: "100%","box-sizing": "border-box"})

mount(document.body, app)