class EditorHeader {
    constructor(notifyParent) {
        this.el = el("div.w-100.navbar", {style:"padding:1rem"}, el("div.navbar-section"),
         el("div.navbar-section"))
    }
}

class EditorPane {
    constructor(notifyParent) {
        this.notifyParent = notifyParent
        this.imageList = new ImageList(this.onChildEvent.bind(this))
        this.imageCropper = new ImageCropper(this.onChildEvent.bind(this))
        this.divider = el("div.divider.text-center.w-100", {"data-content":"Type Markdown Below"})
        this.textArea = el("textarea.w-100", {style:"padding:1rem;border:none;outline:none;flex-grow:1;resize:none;", autofocus: true, placeholder:"Write Something...", onkeyup: function(e) {
            let kc = e.which || e.keyCode;
            if( !kc || kc == 229 ) {
                let ss = this.textArea.selectionStart - 1;
                let ssv = ss || 0;
                let char = this.textArea.value.substr(ssv,1);
                kc = char.charCodeAt(0);
            }
            // backspace, enter, space, del, period
            if( [8,13,32,46,190].indexOf(kc) > -1 ) {
                notifyParent("contentChange", this.textArea.value)
            }
        }.bind(this), onpaste: function(e) {
            console.log("paste event")
            let items = (e.clipboardData || e.originalEvent.clipboardData).items;
            for (let i in items) {
                let item = items[i];
                if (item.type && item.type.indexOf("image") === 0) {
                    let blob = item.getAsFile();
                    let reader = new FileReader();
                    reader.onload = function(event){
                        this.update("add", event.target.result)
                    }.bind(this);                 
                    reader.readAsDataURL(blob);
                    return
                }
            }
        }.bind(this)})
        this.el = el("div.w-100.h-100.d-flex.flex-column.shadow-2", {style:"align-items:center"}, this.imageList, this.imageCropper,
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
            case "hideTextArea":
                setStyle(this.textArea, {display:"none"})
            break
            case "unhideTextArea":
                setStyle(this.textArea, {display:""})
            break
        }
    }
    onChildEvent(event, data) {
        switch(event) {
            case "addImage":
                this.notifyParent("addImage")
                console.log("add")
            break
            case "openImage":
                this.imageCropper.loadImage(data)
                setChildren(this.el, [this.header, this.imageList, this.imageCropper, this.divider, this.textArea])
                this.imageList.update("cropperStatus", true)
                this.update("hideTextArea")
                break
            case "saveImage":
                let i = this.imageList.update("save", data)
                let val = this.textArea.selectionStart
                this.textArea.value = this.textArea.value.substr(0, val) +  "\`\`\`img"+ (i+1) +"\`\`\`" + this.textArea.value.substr(val, this.textArea.value.length)
                this.notifyParent("contentChange", this.textArea.value)
                this.update("unhideTextArea")
                break
            case "cancelImage":
                setChildren(this.el, [this.header, this.imageList, this.divider, this.textArea])
                this.imageList.update("cropperStatus", false)
                this.update("unhideTextArea")
                break
            case "closeCropper":
                setChildren(this.el, [this.header,this.imageList, this.divider, this.textArea])
                this.imageList.update("cropperStatus", false)
                this.update("unhideTextArea")
                break
        }
    }
}