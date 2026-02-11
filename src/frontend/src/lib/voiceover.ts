export class VoiceoverController {
  private utterance: SpeechSynthesisUtterance | null = null;

  speak(
    text: string,
    voice?: SpeechSynthesisVoice,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onPause?: () => void;
      onResume?: () => void;
    }
  ) {
    this.stop();

    this.utterance = new SpeechSynthesisUtterance(text);
    if (voice) {
      this.utterance.voice = voice;
    }

    if (callbacks?.onStart) this.utterance.onstart = callbacks.onStart;
    if (callbacks?.onEnd) this.utterance.onend = callbacks.onEnd;
    if (callbacks?.onPause) this.utterance.onpause = callbacks.onPause;
    if (callbacks?.onResume) this.utterance.onresume = callbacks.onResume;

    window.speechSynthesis.speak(this.utterance);
  }

  pause() {
    window.speechSynthesis.pause();
  }

  resume() {
    window.speechSynthesis.resume();
  }

  stop() {
    window.speechSynthesis.cancel();
    this.utterance = null;
  }
}
