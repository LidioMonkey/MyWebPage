/* --- 小鸡 AI 逻辑 --- */
function initChicken() {
    // 1. 创建小鸡元素
    const chicken = document.createElement('div');
    chicken.classList.add('chicken-pet', 'idle');
    document.body.appendChild(chicken);

    // 初始位置：屏幕中间
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    chicken.style.left = currentX + 'px';
    chicken.style.top = currentY + 'px';

    // 2. 随机移动函数
    function walkRandomly() {
        // 随机生成下一个目标点 (保留 50px 边距，不让它走出屏幕)
        const targetX = Math.random() * (window.innerWidth - 100) + 50;
        const targetY = Math.random() * (window.innerHeight - 100) + 50;

        // 计算距离，决定走多久 (速度恒定)
        const dist = Math.hypot(targetX - currentX, targetY - currentY);
        const speed = 100; // 像素/秒
        const duration = dist / speed;

        // 决定朝向：如果目标在左边，就翻转图片
        if (targetX < currentX) {
            chicken.style.transform = "scaleX(-1) scale(2)"; // scale(2)是为了把小鸡放大一点，你可以改成 scale(1)
        } else {
            chicken.style.transform = "scaleX(1) scale(2)";
        }

        // 切换到走路状态
        chicken.classList.remove('idle');
        chicken.classList.add('walking');
        
        // 设置 CSS 过渡时间并移动
        chicken.style.transition = `top ${duration}s linear, left ${duration}s linear`;
        chicken.style.left = `${targetX}px`;
        chicken.style.top = `${targetY}px`;

        // 更新当前坐标
        currentX = targetX;
        currentY = targetY;

        // 等到达目的地后...
        setTimeout(() => {
            // 1. 停下来，变回站立状态
            chicken.classList.remove('walking');
            chicken.classList.add('idle');

            // 2. 休息 2~5 秒，然后开始下一次移动
            const restTime = Math.random() * 3000 + 2000;
            setTimeout(walkRandomly, restTime);

        }, duration * 1000); // 这里乘1000是因为 duration 是秒，setTimeout 是毫秒
    }

    // 启动！
    walkRandomly();
}

// 页面加载完成后召唤小鸡
window.onload = function() {
    // 如果你之前的 onload 里有代码，请保留，把 initChicken() 加进去
    initChicken();
};