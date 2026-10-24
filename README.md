# Song of Ice

A small browser experiment that listens to the sound of ice (the "song" of a frozen lake, e.g. when you throw a stone or tap on it), detects the pitch, and turns it into a rough estimate of ice thickness and load capacity.

> **Safety warning:** This is a hobby/experimental project. The estimates are crude heuristics and have not been validated. **Never rely on them to decide whether ice is safe to walk or skate on.** Follow local ice-safety guidance.

## How it works

1. Audio comes from either a bundled sample or your microphone.
2. The signal goes through a 80 Hz high-pass filter, then pitch detection using [aubio.js](https://github.com/qjanrey/aubiojs) (loaded from unpkg).
3. Detected frequencies above 170 Hz are averaged into a running mean (reset each time playback or recording starts).
4. From the mean frequency `f`, the page shows:
   - **Frequency:** `f` in Hz
   - **Thickness:** `34300 / f` (speed of sound in cm/s divided by the frequency)
   - **Max weight:** `(thickness / 10)² × 6` kg
5. A live frequency-bar visualisation is drawn on a canvas ([js/frequencyBars.js](js/frequencyBars.js)).

The formulas live in `updateFrequency()` in [index.html](index.html). Units shown in the UI are as labelled in the code and should be treated as approximate.

## Running it

There is no build step or dependency install. Because the page uses an ES module script, microphone access and sample loading, serve it over HTTP rather than opening the file directly:

```bash
cd songofice
python3 -m http.server 8000
# open http://localhost:8000
```

Microphone capture requires a secure context (`localhost` or HTTPS) and permission from the browser. An internet connection is needed to load aubio.js from unpkg.

## Usage

- **Sample picker:** choose a bundled recording (`22`, `35`, `45`, `60`, `80`, `120`, or the lake-noises MP3) and press play on the audio control.
- **Pitch method:** pick an aubio algorithm (`default`, `schmitt`, `fcomb`, `mcomb`, `specacf`, `yin`, `yinfft`, `yinfast`). Different methods behave differently on noisy ice sounds.
- **Record the Song of Ice:** capture from your microphone and see live results.

## Project layout

```
index.html                 UI, pitch detection (PitchDetector class), thickness maths
js/frequencyBars.js        Canvas frequency-bar visualiser
samples/                   Example recordings (WAV/MP3)
```

## Known limitations

- Uses the deprecated `ScriptProcessorNode`; it works in current browsers but may be removed in the future.
- The thickness formula is the wavelength of sound in air at 343 m/s, not a validated model of flexural waves in ice.
- Results depend heavily on background noise, microphone quality and the chosen pitch method.
