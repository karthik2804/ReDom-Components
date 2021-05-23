contentData = {
    "Components" : {
        "Accordions" : 1,
        "Avatars" : '<div class="docs-content"><div class="container"><h3 class="s-title">Avatars</h3><p>Avatars are user profile pictures.</p><div><figure class="avatar mr-2 ." data-initial=""><img alt="" src="../../img/avatar-1.png"></figure>             <figure class="avatar mr-2 avatar-lg" data-initial=""><img alt="" src="../../img/avatar-1.png"><img src="../../img/avatar-1.png" class=" avatar-icon"></figure>             <figure class="avatar mr-2 avatar-xl" data-initial=""><img alt="" src="../../img/avatar-1.png"><i class=" avatar-presence online"></i></figure></div><p></p><pre class="code" data-lang="JavaScript"><code><p style="white-space: pre;">let avatar1 = new Avatar()'+
            '\r\navatar1.update({src:"./img/avatar-1.png", size: 0, background:"", altData:"YZ", type:0})              '+
            ''+
            '\r\n\r\nlet avatar2 = new Avatar()'+
            '\r\navatar2.update({src:"./img/avatar-1.png", size: 1, background:"", altData:"YZ", type:1,iconSrc:"./img/avatar-1.png"})              '+
            ''+
            '\r\n\r\nlet avatar3 = new Avatar()'+
            '\r\navatar3.update({src:"./img/avatar-1.png", size: 2, background:"", altData:"YZ", type:2,presence:"online"})</p></code></pre></div></div>',
        "Bars" : 2,
        "Breadcrumbs" : {},
        "Cards" : {},
        "Chips" : {},
        "Empty States" : {},
        "Menu" : {},
        "Modals" : {},
        "Pagination" : {},
        "Panels" : {},
        "Popovers" : {},
        "Steps" : {},
        "Tiles" : {},
        "Toasts" : {},
    },
}

class NavMenu {
    constructor() {
        this.title = el("h2")
        this.secondaryText = el("small.label.label-secondary.text-bold")
        this.logo 
        this.nav = new Accordions(true, false)
        this.brand = el("div.docs-brand", el("div.docs-logo", this.logo, this.title, this.secondaryText), this.nav)
        this.el = el("div.docs-sidebar.off-canvas-sidebar" ,{id:"sidebar"}, this.brand) 
    }
    update(data) {
        this.title.textContent = data.title 
        this.secondaryText.textContent = data.subTitle
        this.nav.update(data.accordinData)
    }
}

class Content {
    constructor() {
        this.el = el("div.off-canvas-content", "Content")
    }
    update(data) {
        this.el.innerHTML = data
    }
}

class Li {
    constructor(initData) {
        this.notifyParent = initData[0]
        this.el = el("li.menu-item.c-hand", {onclick: function() {
            this.notifyParent(this.el.textContent)
        }.bind(this)})
    }
    update(data) {
        this.el.textContent = data
    }
}

class List {
    constructor(notifyParent, id) {
        this.id = id
        this.notifyParent = notifyParent
        this.el = list("ul.menu.menu-nav", Li, null, [this.onChildEvent.bind(this)])
    }
    update(data) {
        this.el.update(data)
    }
    onChildEvent(id) {
        this.notifyParent("navMenu",  [this.id, id])
    }
}

class App {
    constructor() {
        this.navMenu =  new NavMenu()
        let accordingTitle = Object.keys(contentData)
        let accordinData = accordingTitle.map(function(k){
            let items = Object.keys(contentData[k])
            let list = new List(this.onChildEvent.bind(this), k)
            list.update(items)
            return [k, list]
        }.bind(this))
        this.navMenu.update({title:"ReSpectre", subTitle:"DOCS", accordinData:accordinData})
        this.content =  new Content()
        this.menuToggle = el("a.off-canvas-toggle.btn.btn-primary.btn-action", {href:"#sidebar"}, el("i.icon.icon-menu"))
        this.overlay =  el("a.off-canvas-overlay", {"href": "#close"})
        this.el = el("div.docs-container.off-canvas.off-canvas-sidebar-show", this.menuToggle,
             this.navMenu, this.overlay, this.content)
    }
    onChildEvent(event, data) {
        switch(event) {
            case "navMenu":
                console.log(event, data)
                this.content.update(contentData[data[0]][data[1]])
                break
        }
    }
}

let app = new App()

mount(document.body, app)