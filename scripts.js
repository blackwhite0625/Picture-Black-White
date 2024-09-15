document.addEventListener('DOMContentLoaded', function () { 
    // 檢查用戶登錄狀態
    const authControls = document.getElementById('auth-controls');
    const uploadLink = document.getElementById('upload-link');
    const studioLink = document.getElementById('studio-link');
    const loggedInUserEmail = localStorage.getItem('loggedInUser');
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const loggedInUser = users.find(user => user.email === loggedInUserEmail);
    const isLoggedIn = !!loggedInUser;

    if (authControls) {
        if (isLoggedIn) {
            authControls.innerHTML = '<a href="#" id="logout-btn" class="nav-button white-button">登出</a>';
            if (uploadLink) uploadLink.href = 'upload.html';
            if (studioLink) studioLink.href = 'studio.html';
        } else {
            authControls.innerHTML = '<a href="login.html" class="nav-button white-button">登錄</a> <a href="register.html" class="nav-button white-button">註冊</a>';
            if (uploadLink) uploadLink.href = 'not-logged-in.html';
            if (studioLink) studioLink.href = 'not-logged-in.html';
        }
    }

    // 登出功能
    document.getElementById('logout-btn')?.addEventListener('click', function () {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html'; 
    });

    // 上傳作品功能
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', function (event) {
            event.preventDefault(); 

            const title = document.getElementById('title').value.trim();
            const fileInput = document.getElementById('file');
            const description = document.getElementById('description').value.trim();
            const minPrice = parseInt(document.getElementById('min-price').value, 10);
            const maxPrice = parseInt(document.getElementById('max-price').value, 10);

            if (isNaN(minPrice) || isNaN(maxPrice) || minPrice < 50 || maxPrice > 10000 || minPrice >= maxPrice) {
                alert("請確認價格範圍正確（最低價需小於最高價，且範圍需在 50 至 10000 之間）");
                return;
            }

            const file = fileInput.files[0];
            if (!file) {
                alert("請選擇一個圖片文件");
                return;
            }

            // 檢查檔案類型
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (!allowedTypes.includes(file.type)) {
                alert("不支援的檔案類型，請選擇 JPG、PNG 或 GIF 圖片。");
                return;
            }

            // 檢查檔案大小
            const maxFileSize = 10 * 1024 * 1024; // 10MB
            if (file.size > maxFileSize) {
                alert("檔案大小超過限制，最大允許檔案大小為 10MB。");
                return;
            }

            // 檢查圖片解析度
            const img = new Image();
            const url = URL.createObjectURL(file);

            img.onload = function() {
                // 解析度限制
                const maxResolution = 10000; // 最大解析度（像素）
                if (img.width > maxResolution || img.height > maxResolution) {
                    alert('圖片解析度過大。最大解析度為10000X10000  像素。');
                    URL.revokeObjectURL(url);
                    return;
                }

                const reader = new FileReader();
                reader.onload = function (e) {
                    const imageSrc = e.target.result;
                    const priceRange = `${minPrice} ~ ${maxPrice} TWD`;

                    let artworks = JSON.parse(localStorage.getItem('artworks')) || [];
                    artworks.push({
                        title: title,
                        imageSrc: imageSrc,
                        description: description,
                        priceRange: priceRange,
                        username: loggedInUser ? loggedInUser.username : '未登錄用戶'
                    });

                    localStorage.setItem('artworks', JSON.stringify(artworks));

                    uploadForm.reset();
                    fileInput.value = ''; 

                    window.location.href = 'studio.html'; 
                };

                reader.onerror = function (error) {
                    console.error('FileReader error:', error);
                    alert('文件讀取錯誤，請重試。');
                };

                reader.readAsDataURL(file);
                URL.revokeObjectURL(url);
            };

            img.onerror = function() {
                alert('圖片無法讀取，請檢查檔案是否損壞或格式不支援。');
                URL.revokeObjectURL(url);
            };

            img.src = url;
        });
    }

    // 登錄功能
    document.getElementById('login-form')?.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value.trim();

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            localStorage.setItem('loggedInUser', user.email); 
            window.location.href = 'index.html'; 
        } else {
            alert('電子郵件或密碼不正確');
        }
    });

    // 註冊功能
    document.getElementById('register-form')?.addEventListener('submit', function (event) {
        event.preventDefault();

        const email = document.getElementById('register-email').value.trim();
        const username = document.getElementById('register-username').value.trim();
        const password = document.getElementById('register-password').value.trim();
        const confirmPassword = document.getElementById('confirm-password').value.trim();

        let users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            alert('此電子郵件已經被註冊');
            return;
        }

        if (password === confirmPassword) {
            users.push({ email, username, password });
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('loggedInUser', email); 
            window.location.href = 'index.html'; 
        } else {
            alert('密碼不匹配');
        }
    });

    // 顯示所有作品
    const galleryContent = document.getElementById('gallery-content');
    if (galleryContent) {
        const artworks = JSON.parse(localStorage.getItem('artworks')) || [];
        galleryContent.innerHTML = ''; 

        artworks.forEach((artwork, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.classList.add('gallery-item');

            galleryItem.innerHTML = `
                <a href="details.html?id=${index}">
                    <img src="${artwork.imageSrc}" alt="${artwork.title}">
                    <p>${artwork.title}</p>
                    <p class="price">價格範圍: ${artwork.priceRange}</p>
                    <p class="username">上傳者: ${artwork.username}</p>
                </a>
            `;
            galleryContent.appendChild(galleryItem);
        });

        if (!galleryContent.children.length) {
            galleryContent.innerHTML = `<p>目前沒有作品。</p>`;
        }
    }

    // 搜尋功能
    document.getElementById('search-button')?.addEventListener('click', function () {
        const query = document.getElementById('search').value.toLowerCase().trim();

        if (!query) {
            alert('請輸入搜尋關鍵字');
            return;
        }

        const artworks = JSON.parse(localStorage.getItem('artworks')) || [];

        const results = artworks.filter(artwork =>
            artwork.title.toLowerCase().includes(query) || artwork.description.toLowerCase().includes(query)
        );

        if (results.length > 0) {
            localStorage.setItem('searchResults', JSON.stringify(results));
            const searchParams = new URLSearchParams({ query });
            window.location.href = `search.html?${searchParams.toString()}`;
        } else {
            alert('沒有找到符合的作品。');
        }
    });
});
