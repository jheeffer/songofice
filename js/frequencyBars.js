
window.FrequencyBars = class FrequencyBars {
    
    #canvas;
    #analyser;
    #requestID;
    #dataArray;

    constructor(settings) {
        this.#canvas = settings.canvas 
        this.#analyser = settings.analyser
        this.initDraw();
    }

    initDraw() {
        const canvasCtx = this.#canvas.getContext("2d");
        
        this.#analyser.fftSize = 2048;
        const bufferLength = this.#analyser.frequencyBinCount / 8;
        const maxFreq = (this.#analyser.context.sampleRate / 2) / 8;
        const binWidth = maxFreq / bufferLength;

        // See comment above for Float32Array()
        const dataArray = new Uint8Array(bufferLength);

        const WIDTH = this.#canvas.width;
        const HEIGHT = this.#canvas.height;
        canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

        const draw = () => {
        
            this.#requestID = requestAnimationFrame(draw);
    
            this.#analyser.getByteFrequencyData(dataArray);
    
            canvasCtx.fillStyle = "rgb(0, 0, 0)";
            canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);
    
            const barWidth = (WIDTH / bufferLength) * 2.5;
            let x = 0;
    
            for (let i = 0; i < bufferLength; i++) {
                const barHeight = dataArray[i];
    
                const lowerLimit = i * binWidth
                const upperLimit = (i+1) * binWidth
                const midWay = (i+0.5) * binWidth
                canvasCtx.fillStyle = "rgb(255,255,255)";
                canvasCtx.fillText(lowerLimit.toFixed(0), x, 10, barWidth)
                canvasCtx.fillStyle = "rgb(" + (barHeight + 100) + ",50,50)";
                canvasCtx.fillRect(
                    x,
                    HEIGHT - barHeight / 2,
                    barWidth,
                    barHeight / 2
                );
    
                x += barWidth + 1;
            }
        }

        draw();
    }

    cancelDraw() {
        cancelAnimationFrame(this.#requestID)
    }

}