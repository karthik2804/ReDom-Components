const { el, mount, text, list, setChildren, setStyle, setAttr, svg } = redom

const RATIO = window.devicePixelRatio;
const WIDTH = RATIO * 320;
const HEIGHT = RATIO * 100;
const IDLE_AMPLITUDE = 0.1;
const PLAY_AMPLITUDE = 0.6;

const LOW_FPS = 30;
const DISABLE_ANIMATION_LOW_FPS_THRESHOLD = 3;


let lastFPSCheckAt = 0
let lowFPSCount = 0
let framesInLastSecond = []

const model = {
    data: {
        icons: {
            "recordMic": {
                path: "M431.666,239.934c0-8.284-6.716-15-15-15s-15,6.716-15,15c0,80.32-65.346,145.666-145.666,145.666 s-145.666-65.346-145.666-145.666c0-8.284-6.716-15-15-15s-15,6.716-15,15c0,91.809,70.8,167.383,160.666,175.018V482h-33.199 c-8.284,0-15,6.716-15,15s6.716,15,15,15h96.4c8.284,0,15-6.716,15-15s-6.716-15-15-15H271v-67.048 C360.866,407.316,431.666,331.742,431.666,239.934z M256,0c-43.707,0-79.266,35.559-79.266,79.267v160.667c0,43.708,35.559,79.266,79.266,79.266 c43.708,0,79.268-35.559,79.268-79.267V79.267C335.268,35.559,299.708,0,256,0z M305.268,239.934 c0,27.166-22.102,49.267-49.268,49.267c-27.165,0-49.266-22.101-49.266-49.267V79.267C206.734,52.101,228.835,30,256,30 c27.166,0,49.268,22.101,49.268,49.267V239.934z", classNames: ".h-50.w-50"
            },
            "stopRec": {
                path: "M432,0H80C35.888,0,0,35.888,0,80v352c0,44.112,35.888,80,80,80h352c44.112,0,80-35.888,80-80V80 C512,35.888,476.112,0,432,0z M472,432c0,22.056-17.944,40-40,40H80c-22.056,0-40-17.944-40-40V80c0-22.056,17.944-40,40-40h352 c22.056,0,40,17.944,40,40V432z",
                classNames: ".h-50.w-50"
            },
            "play": {
                path: "M476.091,231.332c-1.654-3.318-4.343-6.008-7.662-7.662L24.695,1.804C16.264-2.41,6.013,1.01,1.8,9.442 c-1.185,2.371-1.801,4.986-1.8,7.637v443.733c-0.004,9.426,7.633,17.07,17.059,17.075c2.651,0.001,5.266-0.615,7.637-1.8 L468.429,254.22C476.865,250.015,480.295,239.768,476.091,231.332z",
                classNames: ".h-50.w-50"
            }
        }
    }
}

class SvgIcon {
    constructor(name) {
    this.el = svg(
        "svg" + model.data.icons[name].classNames,
        svg("symbol", { id: name, viewBox: "0 0 512 512" }, svg("path", { d:model.data.icons[name].path})),
        svg("use", { xlink: { href: "#" + name } })
        )
    }
}

class Curve {
    constructor(color, ctx, speed, baseAmplitude) {
        this.color = color
        this.ctx = ctx
        this.speed = speed
        this.baseAmplitude = baseAmplitude
        this.tick = 0
        this.respawn()
    }
    respawn() {
        this.amplitude = 0.3 + Math.random() * 0.7;
        this.seed = Math.random();
        this.openClass = (5 + Math.random() * 4) | 0;
    }
    equation(i) {
        const y =
          ((-1 *
            Math.abs(Math.sin(this.tick)) *
            this.baseAmplitude *
            this.amplitude *
            HEIGHT) /
            2) *
          (1 / (1 + this.openClass * i ** 2) ** 2);
        if (Math.abs(y) < 0.001) {
          this.respawn();
        }
        return y;
    }
    _draw(direction) {
        this.tick += this.speed * (1 - 0.5 * Math.sin(this.seed * Math.PI));
        const ctx = this.ctx;
        ctx.beginPath();
    
        const xBase = WIDTH / 2 + (-WIDTH / 4 + this.seed * (WIDTH / 2));
        const yBase = HEIGHT / 2;
    
        let x;
        let y;
        let xInit;
    
        let i = -3;
        while (i <= 3) {
          x = xBase + (i * WIDTH) / 4;
          y = yBase + direction * this.equation(i);
          xInit = xInit || x;
          ctx.lineTo(x, y);
          i += 0.01;
        }
    
        const h = Math.abs(this.equation(0));
        const gradient = ctx.createRadialGradient(
          xBase,
          yBase,
          h * 2,
          xBase,
          yBase,
          h * 0.3
        );
        gradient.addColorStop(0, `rgba(${this.color.join(',')},0.1)`);
        gradient.addColorStop(1, `rgba(${this.color.join(',')},0.05)`);
    
        ctx.fillStyle = gradient;
    
        ctx.lineTo(xInit, yBase);
        ctx.closePath();
    
        ctx.fill();
    }
    draw() {

        this._draw(-1);
        this._draw(1);
      }
}

class CanvasWave {
    constructor() {
        this.amplitude = IDLE_AMPLITUDE
        this.colors = [[89, 203, 183],[177, 181, 229],[248, 144, 150]]
        this.speed = 0.1
        this.shouldDraw = false
        this.el = el("canvas.absolute", {style:"height:100px;width:100%;"})
        this.el.width = WIDTH
        this.el.height = HEIGHT
        this.el.style.width = `${WIDTH / RATIO}px`;
        this.el.style.height = `${HEIGHT / RATIO}px`;
        this.ctx = this.el.getContext('2d')
        this.curves = this.colors
      .reduce((arr, color) => [...arr, color, color], [])
      .map(function(color) {
          return new Curve(color,this.ctx,this.speed,2 * IDLE_AMPLITUDE)
            }.bind(this)
        );
        this.draw()
    }
    clear() {
        this.ctx.globalCompositeOperation = 'destination-out';
        this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
        this.ctx.globalCompositeOperation = 'lighter';
      }
    
    draw() {
        if (lowFPSCount >= DISABLE_ANIMATION_LOW_FPS_THRESHOLD) {
          return;
        }
    
        this.clear();
        const baseAmplitude =
          this.curves[0].baseAmplitude * 0.9 + this.amplitude * 0.1;
        for (const curve of this.curves) {
          curve.baseAmplitude = baseAmplitude;
          curve.draw();
        }
    
        if (this.shouldDraw || Math.abs(baseAmplitude - this.amplitude) > 0.01) {
          requestAnimationFrame(this.draw.bind(this));
        }
    
        const now = performance.now();
        framesInLastSecond.push(now);
        if (now - lastFPSCheckAt < 1000) return;
        lastFPSCheckAt = now;
        const index = framesInLastSecond
          .slice()
          .reverse()
          .findIndex(t => now - t > 1000);
        if (index === -1) {
          return;
        }
    
        framesInLastSecond = framesInLastSecond.slice(
          framesInLastSecond.length - index - 1
        );
        if (framesInLastSecond.length < LOW_FPS) {
          lowFPSCount++;
        }
      }
    
      play() {
        this.amplitude = PLAY_AMPLITUDE;
        this.shouldDraw = true;
        this.draw();
      }
    
      idle() {
        this.shouldDraw = false;
        this.amplitude = IDLE_AMPLITUDE;
        framesInLastSecond = [];
      }
}

class Recorder {
    constructor(type, id, notifyFn) {
        this.type = type
        this.id = id
        this.notifyFn = notifyFn
        this.icon = (this.type == 0 ? new SvgIcon("recordMic") : new SvgIcon("play"))
        setStyle(this.icon, {fill: (this.type == 0 ? "#ff4f5e" : "#B7D43F")})
        this.button = el("button.w3.h3.flex.justify-center.items-center.bn.br-100.bg-white.toggle-btn", {onclick: function(e) {
            this.notifyFn("toggleRecState", id,this.isWavePlaying)
        }.bind(this)}, this.icon)
        this.buttonBackground = el("div.w3.background.absolute")
        setStyle(this.buttonBackground, {background: (this.type == 0 ? "linear-gradient(90deg, #f89096, #b1b4e5)" : "linear-gradient(270deg,#88d1f1,#b1b5e5)")})
        this.canvas = new CanvasWave()
        this.isWavePlaying = false
        this.el = el("div.relative.w-100.flex.items-center.justify-center.recorder", this.canvas, this.button, this.buttonBackground)
    }
    update(state) {
        console.log(state)
        if (state === 1) {
            this.isWavePlaying = true
            this.canvas.play()
            this.icon = new SvgIcon("stopRec")
            setStyle(this.icon, {fill: "#ff4f5e"})
            setStyle(this.buttonBackground, {background: (this.type == 0 ? "linear-gradient(270deg,#88d1f1,#b1b5e5)" : "linear-gradient(90deg, #f89096, #b1b4e5)")})
        }
        else {
            this.isWavePlaying = false
            this.canvas.idle()
            this.icon = (this.type == 0 ? new SvgIcon("recordMic") : new SvgIcon("play"))
            setStyle(this.icon, {fill: (this.type == 0 ? "#ff4f5e" : "#B7D43F")})
            setStyle(this.buttonBackground, {background: (this.type == 0 ? "linear-gradient(90deg, #f89096, #b1b4e5)" : "linear-gradient(270deg,#88d1f1,#b1b5e5)")})
        }
        setChildren(this.button, [this.icon])
    }
    onmount() {
        let buttonDim = this.button.getBoundingClientRect()
        setStyle(this.buttonBackground, {height:buttonDim.height + 20+ "px", width:buttonDim.width + 20 + "px" })
    }
}

class App {
    constructor() {
        this.recorder = new Recorder(0, 0,this.onChildEvent.bind(this))
        this.player = new Recorder(1, 1,this.onChildEvent.bind(this))
        this.el = el("div.w-100.h-100.flex.items-center-justify-center.flex-column", el("div.w-100.h-50.flex", el("h3.pa2", "Recorder"), this.recorder), el("div.w-100.h-50.flex", el("h3.pa2", "Player"), this.player))
        console.log(this.recorder)
    }
    resize() {
        this.recorder.resize()
        this.player.resize()
    }
    onChildEvent(event, id, state) {
        switch(event) {
            case "toggleRecState":
                if (state) {
                    (id == 0 ? this.recorder.update(0) : this.player.update(0))
                    console.log("Ending rec " + id)
                }
                else {
                    (id == 0 ? this.recorder.update(1) : this.player.update(1))
                    console.log("Starting Recording" + id)
                }
                break
        }
    } 
}

let app = new App
mount(document.body, app)

setStyle(document.body, {margin: 0, padding: 0, width:"100%", height: "100%", "box-sizing": "border-box", "overflow-x": "hidden"})
setStyle(document.documentElement, {margin: 0, padding: 0, width:"100%", height: "100%","box-sizing": "border-box"})
