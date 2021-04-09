const { el, setStyle, list, mount } = redom
class Header {
    constructor(parentHandle) {
        this.selected = el("span")
        this.confirm = el("button.h2.bn.bg-green.white.bn", {
            onclick: function () {
                parentHandle.onChildEvent("multiItemAction")
            }
        }, "confirm")
        this.el = el("div.w-100.h3.shadow-1.flex.justify-end.items-center.pa2", this.selected, this.confirm)
    }
    update(data) {
        
        this.selected.textContent = data
    }
}

class Li {
    constructor(parentHandle) {
        this.state = 1
        this.startX
        this.currentX

        this.action = el("div.absolute.w-100.h-100")
        this.middle = el("div.w-100.bg-blue.z-999")
        this.el = el("div.h3.w-100.flex.relative", { style: "height:50px;overflowX:hidden" }, this.action, this.middle)

        let startMoving = function (e) {
            e.preventDefault()
            if (parentHandle.selectedState == 1) {
                setStyle(this.middle, { transition: "none" })
            }
            this.width = this.el.getBoundingClientRect().width
            this.currentX = null
            this.startX = (e.clientX || e.pageX || e.touches && e.touches[0].clientX)
            if (parentHandle.selectedState == 1) {
                this.el.addEventListener("touchmove", moving, false)
            }
            this.el.addEventListener("touchend", stopMoving, false)
        }.bind(this)

        let moving = function (e) {
            this.currentX = ((e.clientX || e.pageX || e.touches && e.touches[0].clientX) - this.startX)
            setStyle(this.action, { background: (this.currentX > 0 ? "green" : "red") })
            setStyle(this.middle, { transform: "translateX(" + this.currentX + "px)" })
        }.bind(this)

        let stopMoving = function (e) {
            let displacementPercentage = Math.abs(this.currentX) / this.width
            if (displacementPercentage) {
                if (displacementPercentage >= 0.5) {
                    setStyle(this.middle, { transform: "translateX(" + (this.currentX > 0 ? "" : "-") + "100%)", transition: "all 0.25s ease" })
                    setStyle(this.el, { "max-height": "0px", transition: "all 0.5s ease 0.25s" })
                    parentHandle.onChildEvent("singleItemAction", [(this.currentX > 0 ? 2 : 3), this.index])
                }
                else if (displacementPercentage >= 0.25) {
                    setStyle(this.middle, { transform: "translateX(" + (this.currentX > 0 ? "" : "-") + "25%)", transition: "all 0.25s ease" })
                    parentHandle.selectedState = (this.currentX > 0 ? 2 : 3)
                    this.state = parentHandle.selectedState
                    parentHandle.selectedCount++
                }
                else {
                    setStyle(this.middle, { transform: "translateX(0px)", transition: "all 0.25s ease" })
                    parentHandle.selectedState = 1
                }
            }
            else {
                if (this.state > 1) {
                    setStyle(this.middle, { transform: "translateX(0px)", transition: "all 0.25s ease" })
                    this.state = 1
                    parentHandle.selectedCount--
                }
                else {
                    if (parentHandle.selectedCount > 0) {
                        this.state = parentHandle.selectedState
                        setStyle(this.middle, { transform: "translateX(" + (this.state < 3 ? "" : "-") + "25%)", transition: "all 0.25s ease" })
                        setStyle(this.action, { background: (this.state > 2 ? "red" : "green") })
                        parentHandle.selectedCount++
                    }
                }
            }
            if (parentHandle.selectedCount == 0) {
                parentHandle.selectedState = 1
            }
            console.log(parentHandle.selectedState, parentHandle.selectedCount)
            this.el.removeEventListener("touchend", stopMoving, false)
            this.el.removeEventListener("touchmove", moving, false)
        }.bind(this)

        this.el.addEventListener("touchstart", startMoving, false)
    }
    update(data, index) {
        console.log("here")
        setStyle(this.el, {"max-height": "500px", transition: "none"})
        setStyle(this.middle, {transition: "none", transform: "translateX(0px)"})
        this.middle.textContent = data
        this.index = index
        this.state = 1
    }
}

class App {
    constructor() {
        this.selectedState = 1
        this.selectedCount = 0
        this.data = [1, 2, 3, 4, 5 ,6]

        this.header = new Header(this)
        this.list = list("div", Li, null, this)
        this.el = el("div.w-100.h-100", this.header, this.list)
        this.list.update(this.data)
    }
    onChildEvent(event, data) {
        switch (event) {
            case "singleItemAction":
                if (data[0] > 1) {
                    console.log("deleting/archiving index:", data[1])
                    this.data.splice(data[1], 1)
                        console.log(this.data)
                        setTimeout(() => {
                            this.list.update(this.data)
                        }, 1000);
                }
                break
            case "multiItemAction":
                let counter = 0
                this.list.views.map(function (k, i) {
                    if (k.state == this.selectedState) {
                        this.data.splice(i - counter, 1)
                        counter++
                        setStyle(k.middle, { transform: "translateX(" + (this.selectedState < 3 ? "" : "-") + "100%)", transition: "all 0.25s ease" })
                        setStyle(k.el, { "max-height": "0px", transition: "all 0.5s ease 0.25s" })
                    }
                }.bind(this))
                setTimeout(() => {
                    this.list.update(this.data)
                }, 1000);
                this.selectedState = 1
                break
        }
    }
}

let app = new App()

mount(document.body, app)

