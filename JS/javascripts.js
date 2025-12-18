// 1. 动态内容：打字机效果 [cite: 22]
const titles = ["正在寻找实习...", "热衷于像素艺术...", "Bug 制造者 (划掉)...", "全栈开发练习生"];
let tIndex = 0;
let charIndex = 0;
const typeWriterSpan = document.getElementById("typewriter");

function type() {
    if (charIndex < titles[tIndex].length) {
        typeWriterSpan.textContent += titles[tIndex].charAt(charIndex);
        charIndex++;
        setTimeout(type, 100);
    } else {
        setTimeout(erase, 2000);
    }
}

function erase() {
    if (charIndex > 0) {
        typeWriterSpan.textContent = titles[tIndex].substring(0, charIndex - 1);
        charIndex--;
        setTimeout(erase, 50);
    } else {
        tIndex = (tIndex + 1) % titles.length;
        setTimeout(type, 500);
    }
}
document.addEventListener('DOMContentLoaded', () => {
    type();
    // 触发技能条动画
    document.querySelectorAll('.progress-fill').forEach(bar => {
        // 使用 class 中的 p-80 等类名来模拟动态加载
        if(bar.classList.contains('p-80')) bar.style.width = '80%';
        if(bar.classList.contains('p-70')) bar.style.width = '70%';
        if(bar.classList.contains('p-60')) bar.style.width = '60%';
    });
});

// 2. 交互元素一：史莱姆点击小游戏 
let exp = 0;
const slimeBtn = document.getElementById('slimeBtn');
const scoreDisplay = document.getElementById('score');
const gameMsg = document.getElementById('gameMsg');

if (slimeBtn) {
    slimeBtn.addEventListener('click', () => {
        exp += 10;
        scoreDisplay.textContent = exp;
        
        // 简单的游戏反馈
        const randomMsg = ["暴击!", "史莱姆受损!", "经验+10"];
        gameMsg.textContent = randomMsg[Math.floor(Math.random() * randomMsg.length)];
        
        if (exp >= 100) {
            gameMsg.textContent = "升级了！ Level Up! 🌟";
            gameMsg.style.color = "red";
        }
    });
}

// 3. 交互元素二：模态框 (Modal) 
const modal = document.getElementById('projectModal');
const mTitle = document.getElementById('m-title');
const mDesc = document.getElementById('m-desc');
const mTech = document.getElementById('m-tech');

const projects = {
    'p1': { title: '智能食谱 API', desc: '这是一个允许用户上传食材并自动生成食谱的后端系统。', tech: 'Java, Spring Boot, MySQL' },
    'p2': { title: '复古博客', desc: '模仿90年代风格的博客前端，全响应式设计。', tech: 'HTML5, CSS Grid, Flexbox' },
    'p3': { title: 'JS 网页小游戏', desc: '一个基于 Canvas 的网页射击游戏。', tech: 'JavaScript, HTML Canvas' }
};

function openModal(id) {
    if (projects[id]) {
        mTitle.textContent = projects[id].title;
        mDesc.textContent = projects[id].desc;
        mTech.textContent = projects[id].tech;
        modal.classList.remove('hidden');
    }
}

function closeModal() {
    modal.classList.add('hidden');
}

// 4. 表单验证 
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    // Name 验证
    const name = document.getElementById('c-name');
    const nameErr = document.getElementById('nameError');
    if (name.value.trim().length < 2) {
        nameErr.textContent = "名字太短了！(Need 2+ chars)";
        isValid = false;
    } else {
        nameErr.textContent = "";
    }

    // Email 验证
    const email = document.getElementById('c-email');
    const emailErr = document.getElementById('emailError');
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value)) {
        emailErr.textContent = "请输入有效的冒险家地址！";
        isValid = false;
    } else {
        emailErr.textContent = "";
    }

    if (isValid) {
        alert("信件已由猫头鹰寄出！(模拟发送成功)");
        form.reset();
    }
});