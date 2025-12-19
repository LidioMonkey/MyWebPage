/* --- 小鸡动态动作配置 --- */
// 这里的路径对应你上传的文件结构
const animConfig = {
    // 1. 行走动作 (Walking)
    'walk-left': [
        './imgs/chicken-pet/left/tile_1_1.png',
        './imgs/chicken-pet/left/tile_1_2.png',
        './imgs/chicken-pet/left/tile_1_3.png',
        './imgs/chicken-pet/left/tile_1_4.png'
    ],
    'walk-left-bottom': [
        './imgs/chicken-pet/left-bottom/tile_4_1.png',
        './imgs/chicken-pet/left-bottom/tile_4_2.png',
        './imgs/chicken-pet/left-bottom/tile_4_3.png',
        './imgs/chicken-pet/left-bottom/tile_4_4.png'
    ],
    'walk-right': [
        './imgs/chicken-pet/right/tile_2_1.png',
        './imgs/chicken-pet/right/tile_2_2.png',
        './imgs/chicken-pet/right/tile_2_3.png',
        './imgs/chicken-pet/right/tile_2_4.png'
    ],
    'walk-right-top': [
        './imgs/chicken-pet/right-top/tile_3_1.png',
        './imgs/chicken-pet/right-top/tile_3_2.png',
        './imgs/chicken-pet/right-top/tile_3_3.png',
        './imgs/chicken-pet/right-top/tile_3_4.png'
    ],

    // 2. 吃饭 (Eating)
    'eat': [
        './imgs/chicken-pet/eat/tile_7_1.png',
        './imgs/chicken-pet/eat/tile_7_2.png',
        './imgs/chicken-pet/eat/tile_7_3.png',
        './imgs/chicken-pet/eat/tile_7_4.png'
    ],

    // 3. 睡觉 (Sleeping)
    'sleep-left': [
        './imgs/chicken-pet/left-sleep/tile_5_1.png',
        './imgs/chicken-pet/left-sleep/tile_5_2.png'
    ],
    'sleep-right': [
        './imgs/chicken-pet/right-sleep/tile_5_3.png',
        './imgs/chicken-pet/right-sleep/tile_5_4.png'
    ],

    // 备用：如果有更细致的睡觉方向，可以在这里加
};

// 动画播放速度 (毫秒)
const FRAME_SPEED = 200; // 数字越大越慢

// 全局变量
let container, imgElement;
let animationTimer = null;
let currentAction = '';
let frameIndex = 0;
let lastDirection = 'left'; // 记录最后一次朝向，用于决定睡觉朝哪边

/* --- 1. 动画引擎：负责切换图片 --- */
function playAction(actionName) {
    // 如果动作没变，就不重置索引
    if (currentAction !== actionName) {
        currentAction = actionName;
        frameIndex = 0;
    }

    // 清除旧的定时器
    if (animationTimer) clearInterval(animationTimer);

    // 定义播放逻辑
    const frames = animConfig[actionName];
    if (!frames || frames.length === 0) {
        console.error("未找到动作配置:", actionName);
        return;
    }
    
    if (actionName.includes('sleep')) {
        // 如果动作名称里包含 "sleep" (比如 sleep-left 或 sleep-right)
        // 直接显示该动作数组的【最后一张图】
        imgElement.src = frames[frames.length - 1];

        // 并且直接 return，不启动下面的 setInterval 循环
        return;
    }

    // 立即显示第一帧
    imgElement.src = frames[frameIndex];

    // 开启循环播放
    animationTimer = setInterval(() => {
        frameIndex = (frameIndex + 1) % frames.length;
        imgElement.src = frames[frameIndex];
    }, FRAME_SPEED);
}

/* --- 2. 预加载图片 (优化体验，防止闪烁) --- */
function preloadImages() {
    for (let key in animConfig) {
        animConfig[key].forEach(path => {
            const img = new Image();
            img.src = path;
        });
    }
}

/* --- 3. AI 大脑：控制行动 --- */
function initAI() {
    // 创建 DOM 结构: <div class="container"><img /></div>
    container = document.createElement('div');
    container.className = 'chicken-pet-container';

    imgElement = document.createElement('img');
    imgElement.className = 'chicken-pet-img';
    // 默认初始状态
    imgElement.src = animConfig['walk-right'][0];

    container.appendChild(imgElement);
    document.body.appendChild(container);

    // 初始位置
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;
    container.style.left = x + 'px';
    container.style.top = y + 'px';

    // 随机数工具
    const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    // 核心决策函数
    function think() {
        // --- 阶段 A: 走路 ---

        // 1. 随机找个目标点
        const targetX = randomInt(50, window.innerWidth - 80);
        const targetY = randomInt(50, window.innerHeight - 80);

        // 2. 计算距离和方向
        const dx = targetX - x;
        const dy = targetY - y;
        const dist = Math.hypot(dx, dy);
        const speed = 80; // 移动速度 (像素/秒)
        const duration = dist / speed;

        // 3. 智能选择行走动画 (根据提供的四组素材)
        let moveAnim = '';

        if (dx > 0) {
            // 向右走
            if (dy < 0) {
                moveAnim = 'walk-right-top'; // 往右上走
            } else {
                moveAnim = 'walk-right';     // 往右下/正右走
            }
            lastDirection = 'right';
        } else {
            // 向左走
            if (dy > 0) {
                moveAnim = 'walk-left-bottom'; // 往左下走
            } else {
                moveAnim = 'walk-left';        // 往左上/正左走
            }
            lastDirection = 'left';
        }

        // 4. 执行移动
        playAction(moveAnim);

        // 设置 CSS 移动过渡
        container.style.transition = `top ${duration}s linear, left ${duration}s linear`;
        container.style.left = targetX + 'px';
        container.style.top = targetY + 'px';

        // 更新坐标
        x = targetX;
        y = targetY;

        // --- 阶段 B: 到达后休息 ---
        setTimeout(() => {
            // 停止移动过渡
            container.style.transition = 'none';

            // 随机选择下一个动作
            const rand = Math.random();
            let nextAction = '';
            let restTime = 0;

            if (rand < 0.5) {
                // 50% 概率吃饭
                nextAction = 'eat';
                restTime = 3000;
            } else {
                // 50% 概率睡觉 (根据刚才的朝向决定睡姿)
                if (lastDirection === 'right') {
                    nextAction = 'sleep-right';
                } else {
                    nextAction = 'sleep-left';
                }
                restTime = 5000; // 睡久一点
            }

            playAction(nextAction);

            // 休息结束后，再次思考
            setTimeout(think, restTime);

        }, duration * 1000); // 等待移动结束
    }

    // 启动 AI
    // think();
    setTimeout(think, 1000); // 延迟1秒启动
}

// 页面加载完成后启动
window.onload = function () {
    preloadImages(); // 先预加载图片
    initAI();        // 再启动小鸡

    // 如果你有其他 JS 逻辑，不要覆盖这一行
    console.log("小鸡已部署!");
};