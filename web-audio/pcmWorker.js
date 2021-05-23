const quantumSize = 128

class TestProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'startIndexTime', defaultValue: 2 },
      { name: 'timeInterval', defaultValue: 1 },
      { name: 'maxTimeIndex', defaultValue: 10 }
    ];
  }

  constructor(options) {
    super(options)
    this.stopindex = 125 * options.parameterData.maxTimeIndex
    this.isContinuosStream = (options.parameterData.maxTimeIndex == 0)
    this.quantaPerFrame = 125 * options.parameterData.timeInterval
    if (this.isContinuosStream) {
      this.startIndex = 125 * options.parameterData.timeInterval
      this.frame = new Int16Array(quantumSize * this.quantaPerFrame)
    }
    else {
      this.startIndex = 125 * options.parameterData.startTimeIndex
      this.frame = new Int16Array(quantumSize * this.stopindex)
    }
    this.quantaCount = 0
    this.startCount = 0
    this.offsetCountIndex = 0
    this.started = false
    this.stopped = false
  }

  process(inputs, outputs, parameters) {
    if (this.stopped) {
      return
    }
    const offset = quantumSize * this.offsetCountIndex
    if (offset == 0) {
      this.port.postMessage(["start"])
    }
    if (this.startCount % 25 == 0) {
      this.port.postMessage(["timeUpdate"])
    }
    this.offsetCountIndex += 1
    this.startCount += 1
    if (this.isContinuosStream) {
      inputs[0][0].forEach((sample, idx) => this.frame[idx] = Math.floor(sample * 0x7fff))
      this.quantaCount++
      if (this.quantaCount === this.quantaPerFrame) {
        this.port.postMessage(["data", this.frame])
        this.quantaCount = 0
      }
    }
    else {
      inputs[0][0].forEach((sample, idx) => this.frame[offset + idx] = Math.floor(sample * 0x7fff))
      if (this.started) {
        this.quantaCount++
        if (this.quantaCount === this.quantaPerFrame) {
          this.port.postMessage(["data", this.frame.slice(0, offset + 128)])
          this.quantaCount = 0
        }
      }
      else {
        if (this.startCount === this.startIndex - 1) {
          this.quantaCount = this.quantaPerFrame - 1
          this.started = true
        }
      }
      if (this.startCount == this.stopindex) {
        this.port.postMessage(["stop"])
        this.stopped = true
      }
    }
    return true
  }
}

registerProcessor('pcm-worker', TestProcessor)