class Renderer {
    constructor() {
        this.data
        let unescape = function(str){ 
            return str.replace(/&#39;/g, "'").replace(/&quot/g, '"').replace(/&gt;/g, ">").replace(/&lt/g, "<").replace(/&amp/g, "&");
        }
        let inlineDefault = function(node) {
            return el(node.htmlTag, (node.text ? unescape(node.text) : ""))
        }.bind(this)
        let blockDefault = function(node) {
            return el(node.htmlTag, this.render(node.tokens))
        }.bind(this)
        let link = function(node) {
            return el("a", {href:node.href}, node.text)
        }
        let list = function(node) {
            return el(node.htmlTag, this.render(node.items))
        }.bind(this)
        let image = function(node) {
            return el("img", {src:node.href}, node.text || "" )
        }
        let codespan = function(node) {
            if (node.text.substring(0,3) == "img") {
                return el("img.w-100", {src:this.data[node.text[3] - 1]})
            }
            return el("codespan", node.text )
        }.bind(this)
        let text = function(node) {
            if (node.tokens) {
                return this.render(node.tokens)
            }
            return unescape(node.text)
        }.bind(this)
        let table = function(node) {
            let tableHeader = function(header) {
                return el("tr", node.tokens.header.map(function(k) {
                    return el("th", this.render(k))
                }.bind(this)))
            }.bind(this)
            let tableCells = function(cells) {
                return cells.map(function(k) {
                    return el("tr", k.map(function(item) {return el("td", this.render(item))}.bind(this)))
                }.bind(this))
            }.bind(this)
            return el("table", tableHeader(node.tokens.header), tableCells(node.tokens.cells))
        }.bind(this)
        this.tokenToRedom = new Map([["inlineDefault", inlineDefault], ["blockDefault", blockDefault], ["link", link], ["list", list],
            ["table", table], ["image", image], ["text", text], ["codespan", codespan]])
    }
    render(tree) {
        let temp = tree.map(function(k){
            if(k.tokens) {
               return this.tokenToRedom.has(k.type) ? this.tokenToRedom.get(k.type)(k) : this.tokenToRedom.get("blockDefault")(k)
            }
            else {
               return this.tokenToRedom.has(k.type) ? this.tokenToRedom.get(k.type)(k) : this.tokenToRedom.get("inlineDefault")(k)
            }
        }.bind(this))
        return temp
    }
}