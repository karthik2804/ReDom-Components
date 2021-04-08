const { el, setStyle, list, mount } = redom
class Header {
    constructor() {
        this.selected = el("span")
        this.el = el("div.w-100.h3.shadow-1")
    }
    update(data) {
        this.selected.textContent = data
    }
}

class Li {
    constructor(notifyParent) {
        this.selected = false
        let moved = 1

        this.action = el("div.absolute.w-100.h-100")
        this.middle = el("div.w-100.bg-blue.z-999")
        this.el = el("div.h3.w-100.mv2.flex.relative", { style: "height:50px;overflowX:hidden" }, this.action, this.middle)

        let startMoving = function (e) {
            e.preventDefault()
            moved = false
            if (!this.selected) {
                setStyle(this.middle, { transform: "translateX(0px)", transition: "none" })
            }
            this.width = this.el.getBoundingClientRect().width
            this.startX = (e.clientX || e.pageX || e.touches && e.touches[0].clientX)
            this.el.addEventListener("touchmove", moving, false)
            this.el.addEventListener("touchend", stopMoving, false)
        }.bind(this)

        let moving = function (e) {
            let mode = notifyParent("getMode")
            console.log("current mode is", mode)
            if (mode > 1) {
                return
            }
            moved = true
            this.tempX = ((e.clientX || e.pageX || e.touches && e.touches[0].clientX) - this.startX)

            setStyle(this.action, { background: (this.tempX > 0 ? "green" : "red") })
            setStyle(this.middle, { transform: "translateX(" + this.tempX + "px)" })

            if (Math.abs(this.tempX) >= this.width / 2) {
                stopMoving()
            }
        }.bind(this)

        let stopMoving = function (e) {
            if (!moved) {
                if (this.selected) {
                    notifyParent("removeElement", this.index)
                    setStyle(this.middle, { transform: "translateX(0px)", transition: "all 0.25s ease" })
                    this.selected = false
                }
                else {
                    if (this.selected = notifyParent("addElement", this.index)) {
                        let mode = notifyParent("getMode")
                        setStyle(this.action, { background: (mode > 2 ? "red" : "green") })
                        setStyle(this.middle, { transform: "translateX(" + (mode > 2 ? "-" : "") + "25%)", transition: "all 0.25s ease" })
                    }
                }
                return
            }
            moved = false
            if (Math.abs(this.tempX) >= this.width / 2) {
                setStyle(this.middle, { transform: "translateX(" + (this.tempX > 0 ? "" : "-") + "100%)", transition: "all 0.25s ease" })
                setStyle(this.el, { height: "0px", transition: "all 0.5s ease 0.25s" })
            }
            else {
                if (Math.abs(this.tempX) < this.width / 4) {
                    setStyle(this.middle, { transform: "translateX(0px)", transition: "all 0.25s ease" })
                    notifyParent("switchmode", 1)
                }
                else {
                    setStyle(this.middle, { transform: "translateX(" + (this.tempX > 0 ? "" : "-") + "25%)", transition: "all 0.25s ease" })
                    notifyParent("switchMode", (this.tempX > 0 ? 2 : 3))
                    this.selected = notifyParent("addElement", this.index)
                }
            }
            this.el.removeEventListener("touchend", stopMoving, false)
            this.el.removeEventListener("touchmove", moving, false)
        }.bind(this)

        this.el.addEventListener("touchstart", startMoving, false)
    }
    update(data, index) {
        this.middle.textContent = data
        this.index = index
    }
}

class App {
    constructor() {
        this.mode = 1
        this.selected = []

        this.header = new Header()
        this.list = list("div", Li, null, this.onChildEvent.bind(this))
        this.el = el("div.w-100.h-100", this.header, this.list)
        this.list.update([1, 2, 3, 4])
    }
    onChildEvent(event, data) {
        switch (event) {
            case "getMode":
                return this.mode
                break
            case "switchMode":
                this.mode = data
                console.log("switched mode", this.mode)
                break
            case "addElement":
                if (this.mode > 1) {
                    this.selected.push(data)
                    console.log("selectedItems are: ", this.selected)
                    return true
                }
                break
            case "removeElement":
                if (this.mode > 1) {
                    this.selected = this.selected.filter(x => x != data)
                    console.log("selectedItems are: ", this.selected)
                    if (this.selected.length == 0) { this.mode = 1 }
                    return true
                }
                break
        }
    }
}

let app = new App()

mount(document.body, app)

