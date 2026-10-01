// Cập nhật trạng thái UI
function updateStatus(msg, isProcessing = false) {
    const statusText = document.getElementById('status-text');
    const statusBar = document.getElementById('status');

    if (statusText && statusBar) {
        statusText.innerText = msg;

        if (isProcessing) {
            statusBar.classList.add('processing');
        } else {
            statusBar.classList.remove('processing');
        }
    }
}

// Chuyển đổi link Scribd gốc sang link Embed
document.getElementById('btnEmbed').addEventListener('click', async () => {
    updateStatus("Đang kiểm tra URL...", true);

    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    const url = tab.url;

    const match = url.match(/scribd\.com\/(?:document|doc)\/(\d+)/);

    if (match) {
        const embedUrl = `https://www.scribd.com/embeds/${match[1]}/content`;

        updateStatus("Đang chuyển sang bản Embed...", false);

        chrome.tabs.update(tab.id, {
            url: embedUrl
        });

    } else if (url.includes('/embeds/')) {

        updateStatus("Đã ở chế độ Embed!", false);

    } else {

        updateStatus("Lỗi: Không phải link tài liệu Scribd", false);

        alert(
            "Vui lòng mở một tài liệu Scribd hợp lệ (có chứa /document/ hoặc /doc/)"
        );
    }
});


// Chạy script xử lý trang và in PDF
document.getElementById('btnPrint').addEventListener('click', async () => {

    let [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true
    });

    if (!tab.url.includes("scribd.com")) {
        alert("Extension này chỉ hoạt động trên Scribd!");
        return;
    }

    updateStatus("Đang tải toàn bộ trang...", true);

    chrome.scripting.executeScript({
        target: {
            tabId: tab.id
        },
        func: runScribdPrintSetup

    }, () => {

        updateStatus("Xong! Đang mở hộp thoại in.", false);

    });
});


// Script được tiêm trực tiếp vào trang Scribd
// (mọi hàm phụ phải nằm BÊN TRONG hàm này vì func được serialize khi tiêm)
function runScribdPrintSetup() {

    // 1. Xóa các banner, popup cookies, quảng cáo
    const cookieSelectors = [
        '[class*="cookie"]',
        '[class*="consent"]',
        '[class*="banner"]',
        '[class*="notice"]',
        '.cc-window',
        '#onetrust-banner-sdk'
    ];

    cookieSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
    });


    // 2. Xóa các thanh công cụ UI
    document
        .querySelectorAll('.toolbar_top, .toolbar_bottom')
        .forEach(tb => tb.remove());


    // 3. Chuẩn bị document scroller
    document.querySelectorAll('.document_scroller').forEach(scroller => {
        scroller.setAttribute('data-scribd-print-root', 'true');
        scroller.style.position = 'static';
        scroller.style.overflow = 'visible';
        scroller.style.height = 'auto';
        scroller.style.maxHeight = 'none';
    });


    // 4. Đo kích thước THẬT của từng trang, đặt khổ giấy khớp từng trang,
    //    và loại bỏ mọi thứ khác ngoài các trang khỏi bản in.
    function applyPrintLayout() {
        const pages = Array.from(document.querySelectorAll('.outer_page'));

        if (pages.length === 0) {
            return;
        }

        // Dọn dấu cũ nếu chạy lại
        document
            .querySelectorAll(
                '[data-print-hide], [data-print-chain], [data-print-first], [data-print-size]'
            )
            .forEach(el => {
                el.removeAttribute('data-print-hide');
                el.removeAttribute('data-print-chain');
                el.removeAttribute('data-print-first');
                el.removeAttribute('data-print-size');
            });

        // 4a. Chuỗi tổ tiên của các trang (từ cha trang lên tới <html>)
        const pageSet = new Set(pages);
        const chain = new Set();

        pages.forEach(page => {
            let node = page.parentElement;
            while (node && !chain.has(node)) {
                chain.add(node);
                node = node.parentElement;
            }
        });

        // 4b. Ẩn mọi phần tử anh em không chứa trang (spacer, footer, nút,
        //     phần tử cuối tài liệu...) -> hết trang trắng đầu/cuối do
        //     các phần tử này chiếm chỗ.
        chain.forEach(el => {
            el.setAttribute('data-print-chain', 'true');

            Array.from(el.children).forEach(child => {
                if (!chain.has(child) && !pageSet.has(child)) {
                    child.setAttribute('data-print-hide', 'true');
                }
            });
        });

        // 4c. Đo kích thước từng trang và tạo named @page
        const sizeToName = new Map();
        let pageRules = '';
        let classRules = '';

        pages.forEach(page => {
            const rect = page.getBoundingClientRect();
            const width = Math.round(rect.width);
            const height = Math.round(rect.height);

            if (width <= 0 || height <= 0) {
                return;
            }

            const key = `${width}x${height}`;

            if (!sizeToName.has(key)) {
                const name = `p${sizeToName.size}`;
                sizeToName.set(key, name);

                pageRules += `
                    @page ${name} {
                        size: ${width}px ${height}px;
                        margin: 0;
                    }
                `;

                classRules += `
                    .outer_page[data-print-size="${name}"] {
                        page: ${name};
                        width: ${width}px !important;
                        height: ${height}px !important;
                    }
                `;
            }

            page.setAttribute('data-print-size', sizeToName.get(key));
        });

        pages[0].setAttribute('data-print-first', 'true');

        const old = document.getElementById('scribd-print-styles');
        if (old) {
            old.remove();
        }

        const style = document.createElement('style');
        style.id = 'scribd-print-styles';

        // @page phải nằm ở cấp cao nhất, KHÔNG đặt trong @media print
        style.textContent = `
            @page {
                margin: 0;
            }

            ${pageRules}

            @media print {

                html,
                body {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }

                .toolbar_top,
                .toolbar_bottom,
                .auto_hide_toolbar,
                [data-print-hide="true"] {
                    display: none !important;
                }

                /* Mọi phần tử bao quanh các trang: bỏ margin/padding/chiều cao
                   cố định để không đẩy trang đầu xuống hoặc tạo tờ trắng cuối */
                [data-print-chain="true"] {
                    display: block !important;
                    position: static !important;
                    margin: 0 !important;
                    padding: 0 !important;
                    border: 0 !important;
                    height: auto !important;
                    min-height: 0 !important;
                    max-height: none !important;
                    overflow: visible !important;
                    transform: none !important;
                }

                [data-print-chain="true"]::before,
                [data-print-chain="true"]::after {
                    content: none !important;
                    display: none !important;
                }

                .outer_page {
                    display: block !important;
                    position: relative !important;
                    top: auto !important;
                    left: auto !important;
                    float: none !important;
                    box-sizing: border-box !important;
                    margin: 0 !important;
                    overflow: hidden !important;
                    break-inside: avoid !important;
                    page-break-inside: avoid !important;

                    /* Ngắt trang TRƯỚC mỗi trang (trừ trang đầu) thay vì SAU
                       mỗi trang -> không bao giờ sinh tờ trắng ở cuối */
                    break-before: page !important;
                    page-break-before: always !important;
                    break-after: auto !important;
                    page-break-after: auto !important;
                }

                .outer_page[data-print-first="true"] {
                    break-before: auto !important;
                    page-break-before: auto !important;
                }

                ${classRules}
            }
        `;

        document.head.appendChild(style);
    }


    // 5. Cuộn trang liên tục để tải ảnh Lazy Loading
    let lastTotalPages = 0;
    let stableRounds = 0;

    const scrollInterval = setInterval(() => {

        window.scrollBy(0, 1200);

        const totalPages = document.querySelectorAll('.outer_page').length;

        if (totalPages > 0 && totalPages === lastTotalPages) {
            stableRounds++;
        } else {
            stableRounds = 0;
            lastTotalPages = totalPages;
        }

        // Nếu số lượng trang không đổi sau 5 lần cuộn
        if (stableRounds > 5) {

            clearInterval(scrollInterval);

            window.scrollTo(0, 0);

            alert(
                `Đã tải xong ${totalPages} trang. Bấm OK để tiến hành lưu PDF.`
            );

            // Đợi layout/ảnh ổn định, đo lại kích thước rồi mới in
            setTimeout(() => {

                applyPrintLayout();

                setTimeout(() => {
                    window.print();a
                }, 500);

            }, 1000);
        }

    }, 300);
}