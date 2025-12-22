// 音乐播放控制逻辑
const music = document.getElementById('bgm');
const btn = document.querySelector('.music-btn');
let isPlaying = false;

function ControllMusic() {
    var music = document.getElementById("bgm");
    var btn = document.querySelector(".music-btn");

    // 如果当前是暂停状态 播放音乐，并切换图标
    if (music.paused) {
        music.play();
        btn.classList.add("playing"); 
    }
    // 如果当前是播放状态 暂停音乐，并还原图标
    else {
        music.pause();
        btn.classList.remove("playing"); 
    }
}

document.getElementById('contactForm').addEventListener('submit', function (event) {
    // 1. 阻止表单默认的提交刷新行为
    event.preventDefault();

    // 2. 获取用户输入
    const name = this.querySelector('input[name="name"]').value;

    // 3. 弹出一个模拟成功的提示框
    alert(`Thanks, ${name}! \nYour message has been sent to the valley.\nI'll get back to you soon! 📨`);

    // 4. 清空表单
    this.reset();
});
