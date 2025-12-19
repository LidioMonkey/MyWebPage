// 1. 动态内容：打字机效果 [cite: 22]
const titles = ["正在寻找实习...", "热衷于像素艺术...", "Bug 制造者 (划掉)...", "全栈开发练习生"];
let tIndex = 0;
let charIndex = 0;
const typeWriterSpan = document.getElementById("typewriter");

// 音乐播放控制逻辑
const music = document.getElementById('bgm');
const btn = document.querySelector('.music-btn');
let isPlaying = false;

function toggleMusic() {
    if (isPlaying) {
        music.pause();
        btn.classList.remove('playing');
        // 暂停时小鸡变睡觉符号? 可选
        btn.querySelector('.music-icon').innerText = '😴';
    } else {
        music.play().catch(e => console.log("需要用户交互才能播放"));
        btn.classList.add('playing');
        // 播放时变成音符? 可选
        btn.querySelector('.music-icon').innerText = '🎵';
    }
    isPlaying = !isPlaying;
}

