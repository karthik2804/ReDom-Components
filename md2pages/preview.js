class PreviewHeader {
    constructor(notifyParent) {
        this.publishButton = el("button.btn.btn-success.input-group-btn", "Publish")
        this.settingButton = el("button.btn.btn-link", {onclick: function(e){
            notifyParent("toggleForm")
        }}, "Upload settings")
        this.el = el("div.w-100.navbar", {style:"padding:1rem"}, el("div.navbar-section", this.settingButton),
         el("div.navbar-section", {onclick: function(e) {
             notifyParent("publishData")
         }},this.publishButton))
    }
}

class PreviewForm {
    constructor(notifyParent) {
        this.repo = el("input.form-input", {id:"repo", placeholder:"<username>/<repo name>", value:"karthik2804/bug-free-waddle"})
        this.repoGroup = el("div.input-group", el("span.input-group-addon", "github.com/"), this.repo)
        this.file = el("input.form-input", {id:"file", placeholder:"Enter the file path", value:"index.html"})
        this.fileGroup = el("div.input-group", el("span.input-group-addon", "File Path"), this.file)
        this.token = el("input.form-input", {id:"token", placeholder:"Enter your token", value: ""})
        this.tokenGroup = el("div.input-group", el("span.input-group-addon", "Github Token"), this.token, this.verifyToken)
        this.saveDetailsInput = el("input", {type:"checkbox"})
        this.saveDetails = el("label.form-checkbox", this.saveDetailsInput, el("i.form-icon"), "Save token")
        this.confirmButton = el("button.btn-primary.btn.input-group-btn.w-100", {onclick: function(e) {
            notifyParent("confirmData", this.token.value)
        }.bind(this)},"Confirm")
        this.form = el("div.w-100.form-group", {style:"padding:2rem;"}, this.repoGroup, this.fileGroup, this.tokenGroup, this.saveDetails, this.confirmButton)
        this.el = el("div", {style:";overflow:hidden;max-height:0px;transition: max-height 0.25s linear"}, this.form)
    }
}

class PreviewPane {
    constructor(notifyParent) {
        this.data
        this.notifyParent = notifyParent
        this.formVisible = false
        this.verifiedToken = false

        this.domTree = []
        this.header = new PreviewHeader(this.onChildEvent.bind(this))
        this.form = new PreviewForm(this.onChildEvent.bind(this))
        this.content = el("div.w-100", {style:"padding:1rem;background:#eeeeee;overflow-y:auto;flex-grow:1"})
        this.el = el("div.w-100.h-100.d-flex.flex-column", this.header, this.form, this.content)
    }
    update(tree) {
        this.domTree = tree
        setChildren(this.content, this.domTree)
    }
    onChildEvent(event, data) {
        switch(event) {
            case "toggleForm":
                if (this.formVisible) {
                    setStyle(this.form, {"max-height": 0})
                }
                else {
                    setStyle(this.form, {"max-height": "500px"})
                }
                this.formVisible = !this.formVisible
            break
            case "confirmData":
                this.data = {    
                    repository: this.form.repo.value.trim(),
                    filePath: this.form.file.value.trim(),
                    authToken: this.form.token.value.trim()
                }
                if (this.form.repo.value.trim() == "") {
                    alert("enter repo name and try again")
                    return
                }
                if (data.filePath == "") {
                    alert ("empty file path")
                    return
                }
                fetch("https://api.github.com/repos/" + this.data.repository + "/collaborators", {
                    headers: {
                        Authorization: "token " + this.data.authToken,
                    }
                }).then(res => res.json()).then(function(data) {
                    console.log(data)
                    this.verifiedToken = (data.length > 0? true : false)
                    if (!this.verifiedToken) {
                        alert("invalid detail...please check")
                        return
                    }
                    alert("Data validated successfully")
                    this.onChildEvent("toggleForm")
                    }.bind(this))
            break
            case "publishData":
                if (!this.verifiedToken) {
                    alert("check upload settings for proper repo and token")
                }
                this.data.content = this.content.innerHTML
                this.notifyParent("publishData", this.data)
            break
        }
    }
}