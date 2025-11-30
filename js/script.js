document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 功能一：新聞區塊「查看更多」按鈕邏輯
    // ==========================================
    // 1. 選取要觀察的按鈕
    const buttons = document.querySelectorAll(".read-more-btn");
    // 2. 當任一按鈕被點案的時候
    // forEach 是一個迴圈，意思是指：「對於清單裡的每一個 button，都做一次以下動作...」
    buttons.forEach(button => {

        button.addEventListener("click", function () {
            // 'this' 代表「現在被點到的這顆按鈕」
            // getAttribute("data-target") 會去讀取 HTML 裡寫的 data-target屬性 
            const targetId = this.getAttribute("data-target");
            const newsCard = document.getElementById(targetId);
            if (newsCard) {
                newsCard.classList.toggle("expanded");

            }
        });
    });


    // ==========================================
    // 功能二：About 區塊進場動畫
    // ==========================================
    // 1. 選取要觀察的物件 (海龜和鯨魚)
    const animals = document.querySelectorAll(".about .pic, .about .inner");

    // 2. 設定觀察器
    // 使用「Intersection Observer API」(交會觀察器)，像是裝了監視器
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // isIntersecting 是一個 true/false 的值
            // true 代表「東西跑進畫面裡了」
            // false 代表「東西還在畫面外」
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        // 3. 設定門檻 (Option)
        // threshold: 0.3 代表「當物件有 30% 的面積進入視窗」時，才算「看見了」，觸發上面的動作。
        // 如果設為 0，一碰到邊緣就會觸發；設為 1，要整隻都進來才觸發。
        threshold: 0.3 // 當物件出現 30% 時觸發
    });

    // 4. 開始監視
    // 告訴監視器 (observer) 要去盯著哪些東西 (animals)
    animals.forEach(animal => {
        observer.observe(animal);
    });


    // ==========================================
    // 功能三：卡片翻轉進場動畫
    // ==========================================

    // 1. 選取所有需要翻轉效果的卡片
    const cards = document.querySelectorAll(".card");
    cards.forEach((card, index) => {
        let delayTime = (index % 3) * 0.1;

        card.style.transitionDelay = `${delayTime}s`;
    });
    // 2. 設定觀察器 (Observer)
    const observerCards = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {
            // 如果卡片進入畫面 (isIntersecting 為 true)
            if (entry.isIntersecting) {
                // 幫這張卡片加上 'visible' class，觸發 CSS 的動畫
                entry.target.classList.add("visible");
            } else {
                entry.target.classList.remove("visible");
            }
        });
    }, {
        // 3. 設定門檻 (Option)
        threshold: 0.2 // 當物件出現 30% 時觸發
    });
    // 4. 開始監視
    cards.forEach(card => {
        observerCards.observe(card);
    });

    // ==========================================
    // 功能四：垃圾掉落動畫
    // ==========================================
    // 1. 抓取容器(垃圾)
    const trashContainer = document.querySelector('.trash-group'); // 
    const maxTrashCount = 50;

    // const trashItems = document.querySelectorAll('.trash-item[class*=" item"');
    // 2. 定義隨機整數函式 (用來算角度、距離)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    // 3. 定義隨機小數函式 
    function getRandomFloat(min, max) {
        return (Math.random() * (max - min) + min).toFixed(1);
    }
    // 4. 創造垃圾的函式
    function createTrash() {
        const img = document.createElement('img');
        const randomNum = getRandomInt(1, 11);
        img.src = `./Mockup/trash-item${randomNum}.png`
        img.classList.add("trash-item");

        const duration = getRandomFloat(1.5, 4.0);
        const xEnd = getRandomInt(-150, 150);
        const rEnd = getRandomInt(-360, 360);
        const yEnd = getRandomInt(70, 95);

        img.style.animationDuration = `${duration}s`;
        img.style.setProperty('--x-end', `${xEnd}px`);
        img.style.setProperty('--r-end', `${rEnd}deg`);
        img.style.setProperty('--y-end', `${yEnd}%`);

        // 5. 放到容器裡
        trashContainer.appendChild(img);

        // 6. 【效能控管】檢查數量
        if (trashContainer.children.length > maxTrashCount) {
            // 移除最舊的一個 (陣列中的第一個)
            trashContainer.removeChild(trashContainer.firstChild);
        }
    }

    // ==========================================
    // 設定觸發機制：當捲動到該區塊時才開始「倒垃圾」
    // ==========================================
    let isDumping = false; // 開關，避免重複啟動
    let dumpInterval;      // 計時器

    const actionSection = document.querySelector('.action'); // 抓取 action 區塊

    const trashObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isDumping) {
                // 1. 進入畫面：打開開關
                isDumping = true;

                // 2. 啟動計時器：每 0.3 秒產生一個垃圾 (你可以調整速度)
                dumpInterval = setInterval(createTrash, 300);

            } else if (!entry.isIntersecting && isDumping) {
                // (選用) 離開畫面時要暫停嗎？如果不暫停可以把下面這段註解掉
                // clearInterval(dumpInterval);
                // isDumping = false;
            }
        });
    }, { threshold: 0.3 });

    if (actionSection) {
        trashObserver.observe(actionSection);
    }



});


