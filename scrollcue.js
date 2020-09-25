const { el, mount, text, list, setChildren, setStyle, setAttr } = redom

class ScrollCue {
    constructor(autoplayPeriod = null) {
        this.autoplayPeriod = autoplayPeriod
        this.items = []
        this.index = 0
        this.length = 0
        this.container = el("div.container.h-100.relative", {style:"overflow-y:scroll;"})
        this.el = el("div.w-100.h-100", this.container)
    }
    onmount() {
        setChildren(this.container, this.items)
        setStyle(this.container, {"padding-top": this.el.getBoundingClientRect().height/2 - this.items[0].getBoundingClientRect().height/2 - parseInt(window.getComputedStyle(this.items[0]).marginTop) + "px"})
        setStyle(this.container, {"padding-bottom": this.el.getBoundingClientRect().height/2 - this.items[this.items.length - 1].getBoundingClientRect().height/2 - parseInt(window.getComputedStyle(this.items[this.length - 1]).marginTop) + "px"})
        if (this.autoplayPeriod) {
          setInterval(function(){
            this.incIndex()
          }.bind(this), this.autoplayPeriod)
        }
    }
    update() {
    }
    addItem(handle) {
        this.items.push(handle)
        this.length++
    }
    addMultipleItems(handles) {
        this.items = this.items.concat(handles)
        this.length += handles.length
    }
    incIndex() {
    this.changeIndex(this.index + 1)
    }
    decIndex() {
      this.changeIndex(this.index - 1)
    }
    changeIndex(num) {
        if(num === this.index) {
            return
        }
        let oldIndex = this.index
        if (num > this.length - 1) {
            this.index = this.length -1
        }
        else if (num < 0 ) {
            this.index = 0
        }
        else {
            this.index = num
        }
        let destinationDistance = this.items[this.index].offsetTop - this.items[oldIndex].offsetTop
        console.log()
        this.container.scroll({
          left:0,
          top:this.items[this.index].offsetTop - (this.el.getBoundingClientRect().height/2 - this.items[this.index].getBoundingClientRect().height/2),
          behavior: 'smooth'
          })
        console.log(this.items[this.index].offsetTop)
        this.items[oldIndex].classList.remove("activeCue")
        this.items[this.index].classList.add("activeCue")
    }
}

class App {
    constructor() {
        this.heading = el("h1.pa5.cue activeCue", "test")
        this.subtitle = el("h2.pa5.cue", "trial")
        this.content = el("p.pa5.cue", "This is a ReDom Component")
        this.content1 = el("p.pa5.cue", "This is a ReDom test")
        this.ScrollCue = new ScrollCue(3000)
        this.ScrollCue.addMultipleItems([this.heading, this.subtitle, this.content, this.content1])
        this.el = el("div.w-100.h-100", this.ScrollCue)
    }
}

let app = new App
mount(document.body, app)

document.body.addEventListener("keyup", function(e){
  console.log(e.key)
  switch(e.key) {
    case "ArrowUp":
      app.ScrollCue.decIndex()
      break
    case "ArrowDown":
    case " ":
      app.ScrollCue.incIndex()
      break
  }
})