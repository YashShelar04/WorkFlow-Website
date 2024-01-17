(function(){
    const fehBody = document.body;
    const workDurationInput = document.getElementById('work-duration');
    const restDurationInput = document.getElementById('rest-duration');
    const timerTime = document.getElementById('feh-timer-time');
    const circleProgress = document.querySelector('.circle-progress');

    let workDuration = parseInt(workDurationInput.value) * 60;
    let restDuration = parseInt(restDurationInput.value) * 60;
    let remainingTime = workDuration;
    let isPaused = true;
    let isWorking = true;
    let intervalId;

    const completedSessionsElement = document.getElementById('feh-completed-sessions');
    let completedSessions =0;

    window.addEventListener('load', () => {
        fehBody.classList.add('page-loaded');
    });

    const startBtn = document.getElementById("start-btn");
    startBtn.addEventListener("click", () => {
        isPaused = false;
        fehBody.classList.add('timer-running');
        if (isWorking) {
            fehBody.classList.remove('timer-paused');
        } else {
            fehBody.classList.add('rest-mode');
            fehBody.classList.remove('timer-paused');
        }

        if (!intervalId) {
            intervalId = setInterval(updateTimer, 1000);
        }
    });

    const pauseBtn = document.getElementById('pause-btn');
    pauseBtn.addEventListener('click', () => {
        isPaused = true;

        fehBody.classList.remove('timer-running');
        fehBody.classList.add('timer-paused');
    });

    const btnToggleSettings = document.getElementById('feh-toggle-settings');
    const btnCloseSettings = document.getElementById('feh-close-settings');

    function setBodySettings() {
        fehBody.classList.contains('settings-active') ? fehBody.classList.remove('settings-active') : fehBody.classList.add('settings-active');
    }

    function toggleSettings() {
        if (event.type === 'click') {
            setBodySettings();
        } else if (event.type === 'keydown' && event.keyCode === 27) {
            fehBody.classList.remove('settings-active');
        }
    }

    btnToggleSettings.addEventListener('click', toggleSettings);
    btnCloseSettings.addEventListener('click', toggleSettings);
    document.addEventListener('keydown', toggleSettings);

    workDurationInput.addEventListener('click',()=>{
        workDuration=parseInt(workDurationInput.value)*60;
        if(isWorking){
            remainingTime=workDuration;
            updateProgress();
        }
    });
    restDurationInput.addEventListener('change',()=>{
        restDuration=parseInt(restDurationInput.value)*60;
        if(isWorking){
            remainingTime=workDuration;
            updateProgress();
        }
    })

    function updateTimer() {
        let playAlarm;
        const workFinished =new Audio("/music/success-fanfare-trumpets-6185.mp3");
        const restFinished = new Audio("/music/error-when-entering-the-game-menu-132111.mp3");

        if (!isPaused) {
            remainingTime--;

            if (remainingTime <= 0) {
                isWorking = !isWorking;
                remainingTime = isWorking ? workDuration : restDuration;

                if (!isWorking) {
                    fehBody.classList.add('rest-mode');
                    fehBody.classList.remove('timer-running');

                    completedSessions++;
                    completedSessionsElement.textContent=completedSessions;
                } else {
                    fehBody.classList.remove('rest-mode');
                    fehBody.classList.remove('timer-running');
                }

                playAlarm=isWorking?restFinished:workFinished;
                playAlarm.play();

                isPaused = false;
                fehBody.classList.remove('timer-work-active');
            }

            document.title =timerTime.textContent=formatTime(remainingTime);
            updateProgress()
            console.log(remainingTime);
        }
    }

    function updateProgress() {
        const radius = 45;
        const circumference = 2 * Math.PI * radius;
        const totalDuration = isWorking ? workDuration : restDuration;
        const dashOffset = circumference * remainingTime / totalDuration;

        circleProgress.style.strokeDashoffset = dashOffset;
        timerTime.textContent = formatTime(remainingTime);
    }

    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2,"0")}:${remainingSeconds.toString().padStart(2,"0")}`;
    }
    updateProgress();
})();


// Music player logic
const musicContainer = document.querySelector('.music-container')
const playBtn= document.querySelector('#play')
const prevBtn = document.querySelector('#prev')
const nextBtn = document.querySelector('#next')
const audio = document.querySelector('#audio')
const progress = document.querySelector('.progress')
const progressContainer = document.querySelector('.progress-container')
const title =document.querySelector('#title')
const cover = document.querySelector('#cover')

// song titles
const songs =['campfire','ambient']

// keep track of songs
let songIndex = 0

// Initially load song info DOM
loadSong(songs[songIndex])

// Update song details
function loadSong(songs){
    title.innerText = songs
    audio.src = `mp3s/${songs}.mp3`
    cover.src= `images/${songs}.jpg`
}

function playSong(){
    musicContainer.classList.add('play')
    playBtn.querySelector('i.fas').classList.remove('fa-play')
    playBtn.querySelector('i.fas').classList.add('fa-pause')

   audio.play()
}

function pauseSong(){
    musicContainer.classList.remove('play')
    playBtn.querySelector('i.fas').classList.add('fa-play')
    playBtn.querySelector('i.fas').classList.remove('fa-pause')

    audio.pause()
} 



function prevSong(){
    songIndex--
    if(songIndex<0){
        songIndex = songs.length-1
    }

    loadSong(songs[songIndex])
    playSong()
}

function nextSong(){
    songIndex++
    if(songIndex>songs.length-1){
        songIndex = 0
    }

    loadSong(songs[songIndex])
    playSong()
}

function updateProgress(e){
    const {duration,currentTime} = e.srcElement
    const progressPercent = (currentTime / duration)*100
    progress.style.width = `${progressPercent}%`
}

function setProgress(e){
    const width = this.clientWidth
    const clickX =e.offsetX
    const duration =audio.duration

    audio.currentTime =(clickX/width)*duration
}


playBtn.addEventListener('click',()=>{
    const isPlaying = musicContainer.classList.contains('play')

    if(isPlaying){
        pauseSong()
    }else{
        playSong()
    }
})

prevBtn.addEventListener('click',prevSong)
nextBtn.addEventListener('click',nextSong)

audio.addEventListener('timeupdate',updateProgress)

progressContainer.addEventListener('click',setProgress)

audio.addEventListener('ended',nextSong)

