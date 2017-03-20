Vue.filter('showBeat', function(value) {
    if (!value) return '';
    filteredValue = ((value + 3) % 4) + 1
    return filteredValue;
})

Vue.component('metronome-box', {
    props: ['startMetronome', 'stopMetronome', 'updateMetronome', 'sounds', 'isPlaying', 'beats', 'counter', 'beatObj'],
    template: `
    <div id="metronomeBox">
        
        <div id="beatsBox">
            Beats per Minute: <input type="text" v-model="bpm" :value="beats"  v-on:keyup.enter="updateMetronome(bpm, snd1, snd2, snd3, snd4)"> 
            <button id="startButton" v-on:click="updateMetronome(bpm, snd1, snd2)">Start</button>
            <button id="stopButton" v-on:click="stopMetronome(bpm)">Stop</button>
        </div>
        <div id="soundBox">
        <!--
            <select v-for="(item,index) in beatObj" v-model="snd1" v-on:change="updateMetronome(snd1, snd2)">
                <option v-for="item in sounds" :value="'sounds/' + item +'.wav'">{{ item }}</option>         
            </select>
        -->
            <div class="soundSelector"  :class="{active: counter % 4 == 1 && counter > 8 }">
            <p>1. beat</p>
                <select v-model="snd1" v-on:change="updateMetronome(bpm, snd1, snd2, snd3, snd4)">
                    <option v-for="item in sounds" :value="'sounds/' + item +'.wav'">{{ item }}</option>         
                </select>
            </div>
            <div class="soundSelector"  :class="{active: counter % 4 == 2 && counter > 8 }">
            <p>2. beat</p>
                <select v-model="snd2" v-on:change="updateMetronome(bpm, snd1, snd2, snd3, snd4)">
                    <option v-for="item in sounds" :value="'sounds/' + item +'.wav'">{{ item }}</option>       
                </select>
            </div>
            <div class="soundSelector"  :class="{active: counter % 4 == 3 && counter > 8 }">
            <p>3. beat</p>
                <select v-model="snd3" v-on:change="updateMetronome(bpm, snd1, snd2, snd3, snd4)">
                    <option v-for="item in sounds" :value="'sounds/' + item +'.wav'">{{ item }}</option>       
                </select>
            </div>
            <div class="soundSelector"  :class="{active: counter % 4 == 0 && counter > 8 }">
            <p>4. beat</p>
                <select v-model="snd4" v-on:change="updateMetronome(bpm, snd1, snd2, snd3, snd4)">
                    <option v-for="item in sounds" :value="'sounds/' + item +'.wav'">{{ item }}</option>       
                </select>
            </div>

        </div> 
        <div v-if="counter > 4" id ="beatbox">
            <h3 :class="{accent: counter % 4 == 1 }">{{ counter | showBeat }}</h3>
        </div>
        <audio v-for="item in sounds" :src="'sounds/' + item +'.wav'"></audio> 
    </div>`,
    data: function() {
        return {
            bpm: this.beats,
            snd1: this.beatObj.sound1,
            snd2: this.beatObj.sound2,
            snd3: this.beatObj.sound3,
            snd4: this.beatObj.sound4,
        }
    }
})


app = new Vue({
    el: '#appContainer',
    data: {
        sounds: ["boom", "clap", "hihat", "kick1", "kick2", "openhat", "ride", "snare", "tink", "tom"],
        beatObj: {
            sound1: 'sounds/kick1.wav',
            sound2: 'sounds/snare.wav',
            sound3: 'sounds/kick1.wav',
            sound4: 'sounds/snare.wav',
        },
        beats: 120,
        isPlaying: false,
        counter: 0,
        timerObj: {}
    },
    components: {},
    methods: {
        startMetronome: function(bpm, sound1, sound2, sound3, sound4) {
            var audio = document.querySelector("audio");
            /* Counting in... */
            if (this.counter < 8) {
                if (this.counter < 4 && this.counter % 2 == 0) {
                    audio = document.querySelector("audio[src='sounds/tink.wav']");
                } else {
                    audio = null;
                }
                if (this.counter > 3 && this.counter < 8) {
                    audio = document.querySelector("audio[src='sounds/tink.wav']");
                }
                /* Each beats are set */
            } else if (this.counter % 4 == 0) {
                audio = document.querySelector("audio[src='" + this.beatObj.sound1 + "']");
                audio.volume = 1;
            } else if (this.counter % 4 == 1) {
                audio = document.querySelector("audio[src='" + this.beatObj.sound2 + "']");
                audio.volume = 0.8;
            } else if (this.counter % 4 == 2) {
                audio = document.querySelector("audio[src='" + this.beatObj.sound3 + "']");
                audio.volume = 0.8;
            } else {
                audio = document.querySelector("audio[src='" + this.beatObj.sound4 + "']");
                audio.volume = 0.8;
            }
            if (audio) {
                audio.currentTime = 0; //restart sound if .wav is still playing
                audio.play();
            }

            this.counter++;
            this.isPlaying = true;
            timerObj = setTimeout(this.startMetronome, 60000 / this.beats)
        },

        updateMetronome: function(bpm, sound1, sound2, sound3, sound4) {
            if (sound1) {
                this.beatObj.sound1 = sound1;
            }
            if (sound2) {
                this.beatObj.sound2 = sound2;
            }
            if (sound3) {
                this.beatObj.sound3 = sound3;
            }
            if (sound4) {
                this.beatObj.sound4 = sound4;
            }
            if (!bpm || bpm == "") {
                bpm = this.beats;
            } else if (bpm > 300) { //preventing insane tempo
                this.beats = 300
            } else if (bpm < 20) { // preventing too slow
                this.beats = 20
            } else if (bpm > 19 && bpm < 301) {
                this.beats = bpm
            }
            if (!this.isPlaying) {
                this.startMetronome(bpm, sound1, sound2, sound3, sound4);
            }
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