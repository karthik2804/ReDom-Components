const { el, mount, text, list, setChildren, setStyle, setAttr } = redom

let testData = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur venenatis tincidunt augue, nec ultricies nulla facilisis quis. Etiam varius fringilla pulvinar. Nam ac mauris volutpat, feugiat ante sed, porta magna. Vestibulum et commodo nisl. Curabitur a ex elementum, tristique dui eget, maximus ligula. Ut vel elit vitae dui pellentesque convallis a quis justo. Aenean ut ligula elit. In scelerisque libero et pharetra sagittis. Duis non nunc est. Suspendisse et enim ante.
Integer id rutrum massa. Nullam id elit consequat, luctus magna vel, consectetur eros. Aenean eget posuere felis. Mauris hendrerit purus nibh. Fusce et elementum nunc, at tristique lorem. Nunc aliquam leo at tristique vestibulum. In hac habitasse platea dictumst. Cras vel lorem vitae augue tristique egestas.
Quisque eu porta mauris, in venenatis magna. Sed nec bibendum est. Vestibulum ligula turpis, euismod eleifend rutrum quis, aliquet et mauris. Phasellus vulputate consectetur ligula, non congue ipsum congue et. In ligula nunc, pellentesque non purus et, egestas ornare mi. Vivamus pharetra lorem ex, at dignissim dolor congue et. In aliquet mi a urna aliquet, eget interdum diam efficitur. Morbi nulla lacus, venenatis quis risus at, laoreet auctor arcu. Sed sodales ultricies maximus. Proin auctor vitae ipsum a efficitur.`

class ScrollCue {
    constructor(content, autoplayPeriod = null) {
      this.content = content
      this.autoplayPeriod = autoplayPeriod
      this.items = []
      this.lineIndex = 0
      this.wordIndex = 0
      this.oldWord = null
      this.wordLineIndex = []
      this.length = 0
      this.container = el("div.container.w-100.h-100.relative.flex.items-center.flex-column.", {style:"overflow-y:scroll;"})
      this.el = el("div.w-100.h-100", this.container)
      this.charactersPerLine
      this.usableScreen =  false
      this.autoplay
    }
    seperateParagraphs(data) {
      data = data.split("\n")
      let words = data.map(function(line) {
        return line.split(" ")}
      )
      return words
    }
    createLines(paragraph) {
      let lines = []
      let temp = []
      let currentLength = 0 
      let wordsPerLine = (this.wordLineIndex.length == 0 ? 0 : this.wordLineIndex[this.wordLineIndex.length -1])
      let numberOfWords = paragraph.length
      for (let i = 0; i < numberOfWords; i ++) {
        if (currentLength + paragraph[i].length <= this.charactersPerLine) {
          temp.push(el("span", paragraph[i] + " "))
          wordsPerLine++
          currentLength = currentLength + paragraph[i].length + 1
        }
        else {
          this.wordLineIndex.push(wordsPerLine)
          lines.push(temp)
          temp = []
          currentLength = paragraph[i].length + 1 
          temp.push(el("span", paragraph[i] + " "))
          wordsPerLine++
        }
      }
      if( lines.length != paragraph.length) {
        this.wordLineIndex.push(wordsPerLine)
        lines.push(temp)
      }
      return lines
    }
    createItems(data) {
      let content =  data.map(function(line) {
        let temp = el("p.cue")
        setChildren(temp, line)
        return temp
      })
      return content
    }
    setFontSize() {
      let fontSizes = [72, 60, 42, 32, 24, 16]
      let usableFonts = fontSizes.map(function(k,i) {
        return (this.container.getBoundingClientRect().width /getTextWidth("W", "bold " + k + "pt arial") >= 18 ? i : undefined)
      }.bind(this))
      usableFonts = usableFonts.filter(function(k) {
        return k != undefined
      })
      if (usableFonts.length == 0) {
        console.log("screen too small")
        this.usableScreen = false
        return
      }
      console.log("Using font size : " + fontSizes[usableFonts[0]] + "px")
      this.usableScreen = true
      setStyle(this.container, {"font-size": fontSizes[usableFonts[0]] + "px"})
      let maxCharPerLine = this.container.getBoundingClientRect().width /getTextWidth("W", "bold " + fontSizes[usableFonts[0]] + "pt arial")
      this.charactersPerLine = (maxCharPerLine > 24 ? 24 : parseInt(maxCharPerLine))
    }
    onmount() {
      this.setFontSize()
      if(!this.usableScreen) {
        return
      }
      this.paragraphs = this.seperateParagraphs(this.content)
      this.lines = this.paragraphs.map(function(paragraph) {
        return this.createLines(paragraph)
      }.bind(this))
      let temp = []
      this.lines.forEach(paragraph => {
        paragraph.forEach(word => {
          temp.push(word)
        });
      });
      this.lines = temp
      temp = null
      let test = this.createItems(this.lines)
      this.addMultipleItems(test)
      setChildren(this.container, this.items)
      setStyle(this.container, {"padding-top": this.el.getBoundingClientRect().height/2 - this.items[0].getBoundingClientRect().height/2 - parseInt(window.getComputedStyle(this.items[0]).marginTop) + "px"})
      setStyle(this.container, {"padding-bottom": this.el.getBoundingClientRect().height/2 - this.items[this.items.length - 1].getBoundingClientRect().height/2 - parseInt(window.getComputedStyle(this.items[this.length - 1]).marginTop) + "px"})
      this.items[this.lineIndex].classList.add("activeCue")
      if (this.autoplayPeriod) {
        this.autoplay = setInterval(function() {
          this.incWord()
        }.bind(this), this.autoplayPeriod)
      }
    }
    updateWordHighlight(oldWord, newWord) {
      newWord.classList.add("activeCueWord")
      if(oldWord) {
        oldWord.classList.remove("activeCueWord")
      }
    }
    addItem(handle) {
        this.items.push(handle)
        this.length++
    }
    addMultipleItems(handles) {
        this.items = this.items.concat(handles)
        this.length += handles.length
    }
    incWord() {
      if (this.wordIndex == this.wordLineIndex[this.wordLineIndex.length - 1]) {
        return
      }
      this.wordIndex += 1
      let newWord
      if (this.wordIndex > this.wordLineIndex[this.lineIndex]) {
        this.changeIndex(this.lineIndex + 1)
      }
      newWord = this.lines[this.lineIndex][this.wordIndex - 1 - (this.wordLineIndex[this.lineIndex - 1] || 0)]
      this.updateWordHighlight(this.oldWord, newWord)
      this.oldWord = newWord
    }
    decWord() {
      if (this.wordIndex == 1) {
        return
      }
      this.wordIndex -= 1
      let newWord
      if (this.wordIndex <= this.wordLineIndex[this.lineIndex] - this.lines[this.lineIndex].length) {
        this.changeIndex(this.lineIndex - 1)
      }
      newWord = this.lines[this.lineIndex][this.wordIndex - 1 - (this.wordLineIndex[this.lineIndex - 1] || 0)]
      this.updateWordHighlight(this.oldWord, newWord)
      this.oldWord = newWord
    }
    incIndex() {
      if (this.lineIndex < this.length -1 ) {
        this.changeIndex(this.lineIndex + 1)
        this.wordIndex = (this.wordLineIndex[this.lineIndex - 1] || 0) + 1  
        let newWord = this.lines[this.lineIndex][0]
        this.updateWordHighlight(this.oldWord, newWord)
        this.oldWord = newWord
      }
    }
    decIndex() {
      if (this.lineIndex == 0) {
        return
      }
      this.changeIndex(this.lineIndex - 1)
      this.wordIndex = (this.wordLineIndex[this.lineIndex - 1] || 0) + 1  
      let newWord = this.lines[this.lineIndex][0]
      this.updateWordHighlight(this.oldWord, newWord)
      this.oldWord = newWord
    }
    changeIndex(num) {
      this.oldLineIndex = this.lineIndex
      if(num === this.lineIndex) {
          return
      }
      let oldIndex = this.lineIndex
      if (num > this.length - 1) {
          this.lineIndex = this.length -1
      }
      else if (num < 0 ) {
          this.lineIndex = 0
      }
      else {
          this.lineIndex = num
      }
      this.items[oldIndex].classList.remove("activeCue")
      this.items[this.lineIndex].classList.add("activeCue")
      this.container.scroll({
        left:0,
        top:this.items[this.lineIndex].offsetTop - (this.el.getBoundingClientRect().height/2 - this.items[this.lineIndex].getBoundingClientRect().height/2),
        behavior: 'smooth'
        })
    }
}

class App {
    constructor() {
        this.ScrollCue = new ScrollCue(testData, 600)
        this.el = el("div.w-100.h-100", this.ScrollCue)
    }
}

let app = new App
mount(document.body, app)

document.body.addEventListener("keyup", function(e){
  switch(e.key) {
    case "ArrowUp":
      app.ScrollCue.decIndex()
      break
    case "ArrowDown":
    case " ":
      app.ScrollCue.incIndex()
      break
    case "ArrowRight":
      app.ScrollCue.incWord()
      break
    case "ArrowLeft":
      app.ScrollCue.decWord()
      break
    case "A":
    case "a":
      clearInterval(app.ScrollCue.autoplay)
      break
  }
})

function getTextWidth(text, font) {
  // re-use canvas object for better performance
  var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
  var context = canvas.getContext("2d");
  context.font = font;
  var metrics = context.measureText(text);
  return metrics.width;
}