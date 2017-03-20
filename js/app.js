Vue.filter('showBeat', function(value) {
    if (!value) return '';
    filteredValue = ((value + 3) % 4) + 1
    return filteredValue;
})

Vue.component('metronome-box', {
    props: ['startMetronome', 'stopMetronome', 'isPlaying', 'beats', 'counter'],
    template: `
    <div id="metronomeBox">
        <input type="text" v-model="bpm" :value="beats">
        <button id="startButton" v-on:click="stopMetronome(bpm);startMetronome(bpm)">Start</button>
        <button id="stopButton" v-on:click="stopMetronome(bpm)">Stop</button> 
        <div v-if="counter > 4" id ="beatbox">
            <h3 :class="{accent: counter % 4 == 1 }">{{ counter | showBeat }}</h3>
        </div>
        <audio src="sounds/kick.wav"></audio>  
        <audio src="sounds/snare.wav"></audio>  
        <audio src="sounds/tink.wav"></audio>
    </div>`,
    data: function() {
        return {
            bpm: this.beats
        }
    }
})


app = new Vue({
    el: '#appContainer',
    data: {
        beats: 120,
        isPlaying: false,
        counter: 0,
        timerObj: {}
    },
    components: {},
    methods: {
        startMetronome: function(bpm) {
            if (!bpm || bpm == "") {
                bpm = this.beats;
            } else if (bpm > 300) {
                this.beats = 300
            } else if (bpm < 20) {
                this.beats = 20
            } else {
                this.beats = bpm
            }
            this.isPlaying = true;
            var audio = document.querySelector("audio");
            if (this.counter < 8) {
                if (this.counter < 4 && this.counter % 2 == 0) {
                    audio = document.querySelector("audio[src='sounds/tink.wav']");
                } else {
                    audio = null;
                }
                if (this.counter > 3 && this.counter < 8) {
                    audio = document.querySelector("audio[src='sounds/tink.wav']");
                }

            } else if (this.counter % 2 == 0) {
                audio = document.querySelector("audio[src='sounds/kick.wav']");
                if (this.counter % 4 != 0) {
                    audio.volume = 0.7;
                } else {
                    audio.volume = 1;
                }
            } else {
                audio = document.querySelector("audio[src='sounds/snare.wav']");
            }
            if (audio) {
                audio.currentTime = 0;
                audio.play();
            }

            this.counter++;
            timerObj = setTimeout(this.startMetronome, 60000 / bpm)
        },

        stopMetronome: function() {
            if (this.isPlaying) {
                clearInterval(timerObj);
            }
            this.isPlaying = false;
            this.counter = 0;
        },


    }
});