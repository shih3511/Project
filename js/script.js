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
    const animals = document.querySelectorAll(".about .pic");

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
    cards.forEach((card , index) => {
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
            }else{
                entry.target.classList.remove("visible");
            }
        });
    }, {
        // 3. 設定門檻 (Option)
        threshold: 0.4 // 當物件出現 30% 時觸發
    });
    // 4. 開始監視
    cards.forEach(card => {
        observerCards.observe(card);
    });

    // ==========================================
    // 功能四：圖文進場動畫
    // ==========================================
    const aboutPics = document.getElementById("aboutPic");
    const aboutTxts = document.getElementById("aboutTxt");



});


