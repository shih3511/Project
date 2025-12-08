document.addEventListener("DOMContentLoaded", function () {

    // ==========================================
    // 功能一：新聞區塊「查看更多」按鈕邏輯、 Action 手風琴動畫
    // ==========================================
    // 1. 選取要觀察的按鈕
    const buttons = document.querySelectorAll(".read-more-btn");
    // 2. 當任一按鈕被點案的時候
    buttons.forEach(button => {

        button.addEventListener("click", function () {
            // getAttribute("data-target") 會去讀取 HTML 裡寫的 data-target屬性 
            const targetId = this.getAttribute("data-target");
            const newsCard = document.getElementById(targetId);

            const btnText = button.querySelector("p");
            if (newsCard.classList.contains("expanded")) {
                // 收起
                newsCard.classList.remove("expanded");
                btnText.innerText = "查看更多";
            } else {
                //展開
                newsCard.classList.add("expanded");
                btnText.innerText = "收起"; 
            }
        });
    });

    const pTitles = document.querySelectorAll(".accordion-item .pTitle");
    console.log(pTitles);
    pTitles.forEach(pTitle => {
        pTitle.addEventListener("click" , function(){
            if(pTitle){
                pTitle.classList.toggle("show");
            }
        })
    });


    // ==========================================
    // 功能二：About 區塊進場動畫
    // ==========================================
    // 1. 選取要觀察的物件 (海龜和鯨魚)
    const animals = document.querySelectorAll(".about .pic, .about .inner");

    // 2. 設定觀察器
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // isIntersecting 是布林值
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        // 3. 設定門檻 (Option)
        threshold: 0.3 // 當物件出現 30% 時觸發
    });

    // 4. 開始監視
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
        threshold: 0.2 // 當物件出現 20% 時觸發
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
        const xEnd = getRandomInt(-180, 100);
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

    const actionSection = document.querySelector('.actionPart'); 

    const trashObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isDumping) {
                // 1. 進入畫面：打開開關
                isDumping = true;

                // 2. 啟動計時器：每 0.3 秒產生一個垃圾
                dumpInterval = setInterval(createTrash, 300);

            } 
        });
    }, { threshold: 0.3 });

    if (actionSection) {
        trashObserver.observe(actionSection);
    }



    // ==========================================
    // 功能五：數字捲動動畫 (1,100 萬噸)
    // ==========================================

    const numberElement = document.querySelector('.count-number');
    const actionSectionStat = document.querySelector('.actionPart'); 
    let hasCounted = false; // 開關：確保動畫只跑一次，不會重複跑

    // 定義動畫函式
    const animateValue = (obj, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);

            // 計算當前數值
            const currentVal = Math.floor(progress * (end - start) + start);

            //  toLocaleString() 自動加上千分位逗號 1,100)
            obj.innerHTML = currentVal.toLocaleString();

            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else {
                // 確保最後停在精準的數字
                obj.innerHTML = end.toLocaleString();
            }
        };
        window.requestAnimationFrame(step);
    };

    // 設定觀察器
    const numberObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 如果看到 action 區塊，且還沒跑過動畫
            if (entry.isIntersecting && !hasCounted && numberElement) {
                hasCounted = true; // 關閉開關，下次不跑了

                // 讀取 HTML 裡的 data-target="1100"
                const target = parseInt(numberElement.getAttribute('data-target'));

                // 執行動畫：從 0 跑到 1100，花費 2000毫秒 (2秒)
                animateValue(numberElement, 500, target, 2000);

                // 任務結束，停止觀察
                numberObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 }); // 當區塊出現 50% 時觸發

    // 開始監視
    if (actionSectionStat) {
        numberObserver.observe(actionSectionStat);
    }


    // ==========================================
    // 功能六：Chart.js 圓餅圖 (先跑軌道，再跑數據)
    // ==========================================

    const coralChart1 = document.getElementById('chartCoralArea');
    const coralChart2 = document.getElementById('chartCoralHome');

    if (coralChart1 && coralChart2) {

        //  1. 畫灰色背景軌道 
        const backgroundCirclePlugin = {
            id: 'backgroundCircle',
            beforeDraw(chart) {
                // 取得圖表的繪圖工具 (ctx) 和 尺寸資訊
                const { ctx, chartArea: { width, height } } = chart;
                const meta = chart.getDatasetMeta(0);

                // 確保圖表已經準備好數據
                if (!meta.data[0]) return;

                // 取得半徑資訊 (外圈半徑、內圈半徑)
                const outerRadius = meta.data[0].outerRadius;
                const innerRadius = meta.data[0].innerRadius;

                // 計算圓心位置
                const centerX = chart.getDatasetMeta(0).data[0].x;
                const centerY = chart.getDatasetMeta(0).data[0].y;

                // 開始畫灰色圓圈
                ctx.save();
                ctx.beginPath();
                // 畫在圓心，半徑取「內外半徑的中間值」
                ctx.arc(centerX, centerY, (outerRadius + innerRadius) / 2, 0, 2 * Math.PI);
                // 線條寬度 = 外半徑 - 內半徑 
                ctx.lineWidth = outerRadius - innerRadius;
                ctx.strokeStyle = '#e0e0e0'; //軌道顏色:淺灰
                ctx.stroke();
                ctx.restore();
            }
        };

        // --- 2. 定義共用設定 ---
        const commonOptions = {
            cutout: '75%',
            animation: {
                duration: 2000,
                easing: 'easeOutQuart',
                delay: 500 // 延遲 0.5 秒才開始跑數據，讓使用者先看到灰色軌道
            },
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            }
        };

        // --- 3. 初始化圖表 ---
        const coralObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {

                    // 產生圖表 1 (1%)
                    new Chart(coralChart1, {
                        type: 'doughnut',
                        data: {
                            labels: ['海洋面積', '其他'],
                            datasets: [{
                                data: [1, 99],
                                backgroundColor: [
                                    '#00478F',    // 數據顏色 : 深藍
                                    'transparent' // 【關鍵】剩餘部分設為透明，透出底下的灰色軌道
                                ],
                                borderWidth: 0,
                                borderRadius: 10 
                            }]
                        },
                        options: commonOptions,
                        plugins: [backgroundCirclePlugin]
                    });

                    // 產生圖表 2 (25%)
                    new Chart(coralChart2, {
                        type: 'doughnut',
                        data: {
                            labels: ['生物家園', '其他'],
                            datasets: [{
                                data: [25, 75],
                                backgroundColor: [
                                    '#ff6f61',    // 顏色:珊瑚紅
                                    'transparent' // 設為透明
                                ],
                                borderWidth: 0,
                                borderRadius: 10
                            }]
                        },
                        options: commonOptions,
                        plugins: [backgroundCirclePlugin] // 啟用外掛
                    });

                    coralObserver.disconnect();
                }
            });
        }, { threshold: 0.5 });

        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            coralObserver.observe(statsContainer);
        }
    }
    // ==========================================
    // 功能七：searchBar focus
    // ==========================================
    const searchBar = document.querySelector(".searchBar");
    if (searchBar) {
        searchBar.addEventListener("focus", function () {
            searchBar.classList.add("-on");
        });
        searchBar.addEventListener("blur", function () {
            searchBar.classList.remove("-on");
        });


        // 熱門搜索點按，文字進入input框中
        const tagBtns = document.querySelectorAll(".tag_btn");

        tagBtns.forEach((tagBtn) => {

            tagBtn.addEventListener("mousedown", function (e) {
                e.preventDefault();
            });

            tagBtn.addEventListener("click", function () {
                //把button中的文字放入searchBar中
                searchBar.value = tagBtn.value;
                searchBar.focus();
            });
        });
    }
    // ==========================================
    // 功能八：泡泡出現及軌跡
    // ==========================================

    const bubbleContainer = document.querySelector('.bubble-container'); 
    // 定義隨機小數函式(用來算泡泡出現的位置、大小) 

    if (bubbleContainer) {
        function createBubble() {
            const bubble = document.createElement('span');
            bubble.classList.add('bubble');
            // 泡泡大小(長寬相同)
            const size = Math.random() * 80 + 20;
            bubble.style.width = `${size}px`;
            bubble.style.height = `${size}px`;
            // 向左偏移
            const left = Math.random() * 70 + 10;
            bubble.style.left = `${left}%`;

            //  泡泡上升速度 (10秒 ~ 20秒)
            // 泡泡越小通常飄越慢，也可以設成反比，這裡先用純隨機
            const duration = Math.random() * 10 + 10;
            bubble.style.setProperty('--duration', `${duration}s`);

            //  加入容器
            bubbleContainer.appendChild(bubble);

            // 6. 清理
            setTimeout(() => {
                bubble.remove();
            }, duration * 1000);
        }
        setInterval(createBubble, 5000);
    }


    // ==========================================
    // 功能九： 漢堡動畫
    // ==========================================
    const hbSwitch = document.querySelector(".hb");
    const mainMenu = document.querySelector(".main-menu");
    if (hbSwitch) {
        hbSwitch.addEventListener("click", function () {
            hbSwitch.classList.toggle("switchFish");
            mainMenu.classList.toggle("switchFish")

        });
    }

    // ==========================================
    // 功能十：自動標示當前頁面
    // ==========================================
    
    // 1. 取得目前網頁的網址路徑
    const currentPath = window.location.pathname;
    
    // 2. 取得所有導覽列的連結
    const menuLinks = document.querySelectorAll('.main-menu a');

    menuLinks.forEach(link => {
        // 3. 比對連結的 href 是否包含當前的檔案名稱
        // 使用 getAttribute('href') 抓取 HTML 寫的相對路徑 (例如 biology.html)
        const linkHref = link.getAttribute('href');

        // 判斷邏輯：
        // A. 如果網址路徑「包含」這個連結的檔名 (例如 /biology.html 包含 biology.html)
        // B. 或是處理首頁的特殊情況 (網址是 / 或 /index.html 時，對應 index.html)
        
        if (currentPath.includes(linkHref) && linkHref !== "") {
            link.classList.add('active');
        } 
        // 特殊處理首頁：如果目前路徑以 / 結尾 (代表在首頁)，且連結是 index.html
        else if (currentPath.endsWith('/') && linkHref === 'index.html') {
            link.classList.add('active');
        }
    });
    
});


