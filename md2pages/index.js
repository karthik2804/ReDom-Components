class MD2Pages {
  constructor() {
    this.index = 0
    this.renderer = new Renderer()

    this.mobileTabBar = new MobileTabBar(this.onChildEvent.bind(this))
    this.mobileTabBar.update(["Editor", "Preview"], 0)
    this.editor = new EditorPane(this.onChildEvent.bind(this))
    this.preview = new PreviewPane(this.onChildEvent.bind(this))
    this.editorPreviewContainer = new ResizableColumns(this.editor, this.preview, 0.5,40, 60, this.onChildEvent.bind(this))
    this.workspace = el("div.d-flex.flex-column", {style: "flex-grow: 1"}, this.editorPreviewContainer)
    this.el = el("div.w-100.h-100.d-flex.flex-column", this.workspace, this.mobileTabBar)
  }
  onChildEvent(event, data) {
    switch(event) {
      case "toggleView":
        this.index = data
        this.mobileTabBar.update(["Editor", "Preview"], this.index)
        this.editorPreviewContainer.update(this.index)
      break
      case "contentChange":
        this.renderer.data = this.editor.imageList.images
        this.preview.update(this.renderer.render(marked(data)))
      break
      case "resize":
          this.editor.update("resize")
      break
      case "addImage":
        let readImage = function(file) {
          let input = file.target
          let reader = new FileReader()
          reader.onload = function() {
              let dataURL = reader.result
              this.editor.update("add", dataURL)
          }.bind(this)
          reader.readAsDataURL(input.files[0]); 
        }.bind(this)
        let file = el("input", {type:"file", accept:".jpg, .jpeg, .png", onchange: function(e){
        readImage(e)
        }})
        file.click()
      break
      case "publishData":
        console.log(data)
        let url = "https://api.github.com/repos/" + data.repository + "/contents/" + data.filePath
        let content = `<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="utf-8">
            <title>title</title>
            <link rel="stylesheet" href="style.css">
            <script src="script.js"></script>
          </head>
          <body>
            ${data.content}
          </body>
        </html>`
        upload(url, data.authToken, content)
      break
    }
  }
  resize() {
    let isScreenSmall = document.body.getBoundingClientRect().width < 960   
    this.editorPreviewContainer.toggleMaxWidth(isScreenSmall)
  }
}

class App {
  constructor() {
    this.md2pages = new MD2Pages()
    this.el = el("div.w-100.h-100", this.md2pages)

    window.onresize = function(e) {this.md2pages.resize()}.bind(this)
  }
}

let app = new App()
mount(document.body, app)
// app.editor.resize()

function upload(url, token, content) {
  fetch(url, {
      body: "{\"path\": \"hello.txt\", \"message\": \"Initial Commit\", \"committer\": {\"name\": \"Karthik\", \"email\": \"raams.karthik@gmail.com\"}, \
            \"content\": \""+ btoa(content)+ "\", \"branch\": \"master\"}",
      headers: {
        Authorization: "token " + token,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "PUT"
    }).then((res) => {
      if(res.ok) {
        alert("pushed successfully")
      }
      else {
        alert("something went wrong")
      }
    })

}