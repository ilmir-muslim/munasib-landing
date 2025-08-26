document.addEventListener("DOMContentLoaded", () => {
    // Плавная прокрутка для якорных ссылок
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute("href"));
            if (target) {
                const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Функционал для галереи
    const mainImg = document.getElementById("main-product-img");
    const thumbnails = document.querySelectorAll(".products-scroll img");
    const productsHeroSection = document.querySelector('.products-hero');
    let currentIndex = 0;

    // Функция для показа определенного изображения
    function showImage(index, isInitial = false) {
        // Обеспечиваем циклическое переключение
        if (index >= thumbnails.length) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = thumbnails.length - 1;
        } else {
            currentIndex = index;
        }

        // Обработка первой фотографии
        if (currentIndex === 0) {
            mainImg.classList.remove('smaller');
            productsHeroSection.classList.remove('smaller-active');

            if (!isInitial) {
                // Прокручиваем к секции products-hero
                productsHeroSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        } else {
            mainImg.classList.add('smaller');
            productsHeroSection.classList.add('smaller-active');
        }

        // Обновляем основное изображение
        mainImg.src = thumbnails[currentIndex].src;

        // Убираем активный класс у всех миниатюр
        thumbnails.forEach(t => t.classList.remove("active"));

        // Добавляем активный класс к выбранной миниатюре
        thumbnails[currentIndex].classList.add("active");

        // Прокручиваем полосу к активной миниатюре
        thumbnails[currentIndex].scrollIntoView({
            inline: "center",
            behavior: "smooth",
            block: "nearest"
        });
    }

    // При клике на миниатюру
    thumbnails.forEach((thumb, index) => {
        thumb.addEventListener("click", () => {
            showImage(index);
        });
    });

    // Обработка клавиатуры - стрелки влево/вправо
    document.addEventListener('keydown', function (e) {
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            showImage(currentIndex - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            showImage(currentIndex + 1);
        }
    });

    // Добавляем обработчик свайпов для главного изображения
    let touchStartX = 0;
    let touchEndX = 0;

    mainImg.addEventListener('touchstart', function (e) {
        touchStartX = e.changedTouches[0].screenX;
    }, false);

    mainImg.addEventListener('touchend', function (e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, false);

    function handleSwipe() {
        const minSwipeDistance = 50; // минимальное расстояние свайпа

        if (touchStartX - touchEndX > minSwipeDistance) {
            // Свайп влево - следующее изображение
            showImage(currentIndex + 1);
        } else if (touchEndX - touchStartX > minSwipeDistance) {
            // Свайп вправо - предыдущее изображение
            showImage(currentIndex - 1);
        }
    }

    // Активируем первую миниатюру при загрузке
    if (thumbnails.length > 0) {
        showImage(0, true);
    }
});