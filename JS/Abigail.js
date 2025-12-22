document.addEventListener('DOMContentLoaded', () => {
    const charContainer = document.getElementById('pixel-char-container');
    const charImg = document.getElementById('pixel-char');

    const assets = {
        right: [
            './imgs/Abigail/right/tile_2_1.png',
            './imgs/Abigail/right/tile_2_2.png',
            './imgs/Abigail/right/tile_2_3.png',
            './imgs/Abigail/right/tile_2_4.png'
        ],
        left: [
            './imgs/Abigail/left/tile_4_1.png',
            './imgs/Abigail/left/tile_4_2.png',
            './imgs/Abigail/left/tile_4_3.png',
            './imgs/Abigail/left/tile_4_4.png'
        ],
        amazing: ['./imgs/Abigail/amazing/tile_9_1.png'],
        laugh: [
            './imgs/Abigail/laugh/tile_8_1.png',
            './imgs/Abigail/laugh/tile_8_2.png'
        ],
        play: [
            './imgs/Abigail/play/tile_5_1.png',
            './imgs/Abigail/play/tile_5_2.png',
            './imgs/Abigail/play/tile_5_3.png',
            './imgs/Abigail/play/tile_5_4.png'
        ]
    };

    // 参数设置
    const walkSpeed = 2;       // 走路速度一帧两个像素
    const animSpeed = 200;     // 动画帧切换速度

    // 状态变量
    let posX = window.innerWidth / 5 * 4; // 初始位置
    let direction = 'right';          // 当前朝向
    let currentState = 'idle';        // 当前状态: idle, walk, act

    // 定时器引用
    let animInterval = null;
    let behaviorTimeout = null;
    let moveFrameId = null;
    // 1. 更新位置
    function updateRender() {
        charContainer.style.left = posX + 'px';
        charContainer.style.transform = 'translateX(-50%)'; // 居中锚点
    }

    // 2. 播放动画帧
    function playAnim(key) {
        if (animInterval) clearInterval(animInterval);

        let frames = assets[key];
        let index = 0;

        // 立即显示第一帧
        charImg.src = frames[0];

        // 如果只有一帧(如震惊)，就不需要循环
        if (frames.length > 1) {
            animInterval = setInterval(() => {
                index = (index + 1) % frames.length;
                charImg.src = frames[index];
            }, animSpeed);
        }
    }

    // 3. 停止所有动作
    function stopAll() {
        if (animInterval) clearInterval(animInterval);
        if (moveFrameId) cancelAnimationFrame(moveFrameId);
        currentState = 'idle';
        // 显示当前朝向的第一帧
        charImg.src = assets[direction][0];
    }
    function decideNextMove() {
        // 如果正在进行某种强制动作，暂不决策
        // 这里我们设计每次决策都会设定一个持续时间，时间到了再做下一次决策
        stopAll(); // 先停下当前的事

        // 🎲 随机数决定下一步做什么 (0.0 ~ 1.0)
        const rand = Math.random();

        // --- 行为权重分配 ---
        // 40% 几率：走路
        // 30% 几率：发呆站立
        // 30% 几率：大笑/震惊/演奏

        if (rand < 0.4) {
            // 走路
            doWalk();
        } else if (rand < 0.7) {
            // 发呆
            const waitTime = randomRange(1000, 2000); // 发呆 2-4秒
            console.log(`AI: 发呆 ${waitTime}ms`);
            behaviorTimeout = setTimeout(decideNextMove, waitTime);
        } else {
            // 特殊动作
            doSpecialAction();
        }
    }

    // 行为 A: 走路
    function doWalk() {
        currentState = 'walk';

        // 决定往哪边走
        // 如果靠左边太近，强制往右；靠右太近，强制往左；否则随机
        if (posX < 50) direction = 'right';
        else if (posX > window.innerWidth - 50) direction = 'left';
        else direction = Math.random() > 0.5 ? 'right' : 'left';

        playAnim(direction); // 播放走路动画

        const walkTime = randomRange(2000, 5000); // 走 2-5秒
        const startTime = Date.now();

        function step() {
            if (currentState !== 'walk') return;

            // 移动逻辑
            if (direction === 'right') {
                if (posX < window.innerWidth - 40) posX += walkSpeed;
                else {
                    direction = 'left'; // 撞墙调头
                    playAnim('left');
                }
            } else {
                if (posX > 40) posX -= walkSpeed;
                else {
                    direction = 'right'; // 撞墙调头
                    playAnim('right');
                }
            }
            updateRender();

            // 检查时间是否到了
            if (Date.now() - startTime < walkTime) {
                moveFrameId = requestAnimationFrame(step);
            } else {
                // 时间到，思考下一步
                decideNextMove();
            }
        }
        step();
    }

    // 行为 B: 特殊动作
    function doSpecialAction() {
        currentState = 'act';
        const actions = ['laugh', 'play', 'amazing'];
        // 随机选一个动作
        const choice = actions[Math.floor(Math.random() * actions.length)];

        playAnim(choice);

        // 动作持续时间
        let duration = 3000;
        if (choice === 'amazing') duration = 1500;

        behaviorTimeout = setTimeout(decideNextMove, duration);
    }

    // 辅助工具：生成随机整数范围
    function randomRange(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    charContainer.addEventListener('click', () => {
        clearTimeout(behaviorTimeout); // 打断当前的思考
        stopAll();
        playAnim('amazing'); // 播放震惊
        // 1秒后恢复正常思考
        setTimeout(decideNextMove, 1000);
    });

    // 窗口大小改变时重置位置防溢出
    window.addEventListener('resize', () => {
        if (posX > window.innerWidth) posX = window.innerWidth - 50;
        updateRender();
    });

    // ▶️ 启动 AI
    updateRender();
    decideNextMove();
});