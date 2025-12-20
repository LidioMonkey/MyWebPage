// 音乐播放控制逻辑
const music = document.getElementById('bgm');
const btn = document.querySelector('.music-btn');
let isPlaying = false;

function toggleMusic() {
    var music = document.getElementById("bgm");
    var btn = document.querySelector(".music-btn");

    // 如果当前是暂停状态 -> 播放音乐，并切换图标
    if (music.paused) {
        music.play();
        btn.classList.add("playing"); // 添加类名，CSS会把图换成 music-on
    }
    // 如果当前是播放状态 -> 暂停音乐，并还原图标
    else {
        music.pause();
        btn.classList.remove("playing"); // 移除类名，CSS还原为 music-off
    }
}

