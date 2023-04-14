window.addEventListener('DOMContentLoaded', () =>{

    // tabs
    const tabs = document.querySelectorAll('.tabheader__item'),
        tabsContent = document.querySelectorAll('.tabcontent'),
        tabsParent = document.querySelector('.tabheader__items');

    //Скрываем табы
    function hideTabContent(){
        // tabsContent.forEach(item => {
        //     item.style.display = 'none';
        // });
        tabsContent.forEach(item => {
            item.classList.add('hide');
            item.classList.remove('show', 'fade');
        });
        tabs.forEach(item => {
            item.classList.remove('tabheader__item_active');
        })
    } 

    function showTabContent(i = 0){
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add('tabheader__item_active');
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) =>{
        const target = event.target;

        if(target && target.classList.contains('tabheader__item')){
            tabs.forEach((item, i) =>{
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })

    //Timer

    const deadLine = '2023-04-05';

    function getTimeRemaining(endtime){
        let days, hours, minutes, seconds;
        const t = Date.parse(endtime) - Date.parse(new Date());
        if (t <= 0) {
            days = 0;
            hours = 0;
            minutes = 0;
            seconds = 0;
        }else{
            days = Math.floor(t / (1000 * 60 * 60 * 24)),
            hours = Math.floor((t / (1000 * 60 * 60)) % 24),
            minutes = Math.floor((t / 1000 / 60) % 60),
            seconds = Math.floor((t / 1000) % 60);
        }
        return {
            'total': t,
            'days': days,
            'hours': hours,
            'minutes': minutes,
            'seconds': seconds
        };
    }

    function getZero(num){
        if (num >= 0 && num < 10){
            return `0${num}`;
        }else{
            return num;
        }
    }

    function setClock(selector, endtime) {
        const timer = document.querySelector(selector),
            days = timer.querySelector('#days'),
            hours = timer.querySelector('#hours'),
            minutes = timer.querySelector('#minutes'),
            seconds = timer.querySelector('#seconds'),
            timeInterval = setInterval(updateClock, 1000);
        updateClock(); //Сразу устанавливаем текующую дату

        function updateClock() {
            const t = getTimeRemaining(endtime);

            days.innerHTML = getZero(t.days);
            hours.innerHTML = getZero(t.hours);
            minutes.innerHTML = getZero(t.minutes);
            seconds.innerHTML = getZero(t.seconds);

            if (t.total <= 0){
                clearInterval(timeInterval);
            }
            
        }
    }

    setClock('.timer', deadLine);

    // Modal

    const modalTrigger = document.querySelectorAll('[data-modal]'),
        modal = document.querySelector('.modal');

    function openModal(){
        modal.classList.add('show');
        modal.classList.remove('hide');
        document.body.style.overflow = 'hidden';
        clearInterval(modalTimerId); // Если пользователь сам октрывал модальное окно, то мы не будем открывать его через интервал
    }
    modalTrigger.forEach(btn => {
        btn.addEventListener('click', openModal);
    });

    function closeModal(){
        modal.classList.add('hide');
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }


    modal.addEventListener('click', (e) =>{

        //Вместо получения объекта кнопки и работы с ним, мы проверяем что клик по модальному окну и
        // у него атрибут data-close
        if(e.target === modal || e.target.getAttribute('data-close') == ''){
            closeModal();
        }
    })

    document.addEventListener('keydown', (e) => {
        if (e.code === "Escape" && modal.classList.contains('show')){
            closeModal();
        }
    });

    const modalTimerId = setTimeout(openModal, 50000);

    function showModalByScroll(){
        if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1){    
            openModal();
            window.removeEventListener('scroll', showModalByScroll);
        }
    }
    window.addEventListener('scroll', showModalByScroll);

    // Используем классы для карточек
    class MenuCard{
        constructor (src, alt, title, descr, price, parentSelector, ...classes) {
            this.src = src;
            this.alt = alt;
            this.title = title;
            this.descr = descr;
            this.price = price;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
            this.transfer = 27;
            this.changeToUAH();
        }

        changeToUAH() {
            this.price = this.price * this.transfer;
        }

        render() {
            const element = document.createElement('div');

            if (this.classes.length === 0){
                this.element = 'menu__item'
                element.classList.add()
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }

            element.innerHTML = `
                <img src= ${this.src} alt= ${this.alt}>
                <h3 class="menu__item-subtitle">${this.title}</h3>
                <div class="menu__item-descr">${this.descr}</div>
                <div class="menu__item-divider"></div>
                <div class="menu__item-price">
                    <div class="menu__item-cost">Цена:</div>
                    <div class="menu__item-total"><span>${this.price}</span> грн/день</div>
                </div>
            `;
            this.parent.append(element);

        }
    }

    const getResources = async (url) => {
        //Поулчаем Promise, который возвращает fetch().
        const res = await fetch(url);

        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        //Возвраащем Promise.
        return await res.json();
    }

 

    getResources('http://localhost:3000/menu').
        then(data => {
            data.forEach(({img, altimg, title, descr, price}) => {
                new MenuCard(img, altimg, title, descr, price, '.menu__field .container', 'menu__item').render();
            })
        })
    
    // Forms

    const forms = document.querySelectorAll('form');

    const message = {
        loading: 'img/form/spinner.svg',
        success: 'Спасибо. Скоро мы с вами свяжемся',
        failure: 'Что-то пошло не так...'
    }

    forms.forEach(item => {
        bindPostData(item);
    })

    //Постинг. Синтаксис function-expression.
    //async говорит, что в функции будет асинхронный код.
    const postData = async (url, data) => {
        //Поулчаем Promise, который возвращает fetch().
        const res = await fetch(url, {
            method: "POST",
            headers: {
                'Content-type': 'application/json'
            },
            body: data
        });
        //Возвраащем Promise.
        return await res.json();
    }

    //Привязка постинга
    function bindPostData(form){
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Создаем объект изображение
            const statusMessage = document.createElement('img');
            //Указываем путь до него
            statusMessage.src =  message.loading
            //Устанавливаем inline-стили для отображения изображения по центру.
            statusMessage.style.cssText = `
                display:block;
                margin: 0 auto;
            `;
            
            form.insertAdjacentElement('afterend', statusMessage);

            //При помощи formData мы собираем все данные из нашей формы
            const formData = new FormData(form);

            //Трансформация FromData в JSON формат.
            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            //Связь с сервером
            //Отправляем данные, находящиеся в formData. Куда, каким образом и, что именно.

            postData(' http://localhost:3000/requests', json).
                then(data => {
                        console.log(data);
                        //Отображаем модальное окно с сообщениями
                        showThanksModal(message.success);
                        //Сброс данных формы
                        form.reset();
                        //Удаляем спиннер со страницы
                        statusMessage.remove();
                }).
                catch(() => {
                    showThanksModal(message.failure);
                }).
                finally(() => {
                    form.reset();
                });
        })
    }

    //Окно отображения благодарности (открывается после отправки формы модального окна).
    function showThanksModal(message) {
        //Получаем диалог модального окна
        const prevModalDialog = document.querySelector('.modal__dialog');

        //Добавляем ему класс hide, дабы спрятать его
        prevModalDialog.classList.add('hide');
        //При этом показываем сам объект modal
        openModal();

        //Создаем новое, благодарственное окно modal_dialog
        const thanksModal = document.createElement('div');
        thanksModal.classList.add('modal__dialog');
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>&times;</div>
                <div class="modal__title">${message}</div>
            </div>
        `
        //Добалвяем верстку к окну Modal
        document.querySelector('.modal').append(thanksModal);

        // По прошествии 4 секунды убираем новоиспеченное благодарственное модальное окно и  возвращаем старое
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add('show');
            prevModalDialog.classList.remove('hide');
            closeModal();
        }, 4000)
    }
    //Подключаемся к нашему json-server
    fetch('http://localhost:3000/menu').
        then(data => data.json()).//Получаем оттуда json данные
        then(res => console.log(res));

    //Slider

    

    const offerSlider = document.querySelector('.offer__slider'),
        btnNext = offerSlider.querySelector('.offer__slider-next'),
        btnPrev = offerSlider.querySelector('.offer__slider-prev'),
        offetSliderWrapper = offerSlider.querySelector('.offer__slider-wrapper'),
        idCurr = offerSlider.querySelector('#current');

    let curr = 0,
        total = 0;

    let sliders = [];

    getResources('http://localhost:3000/slides').
        then(data => {
            data.forEach(({img, alt, id}) => {
                const slide = new Slide(img, alt, id, '.offer__slider-wrapper', 'offer__slide')
                sliders.push(slide);
            })
        }).
        then(() => {
            curr = 0,
            total = sliders.length;
            showCurrentSlide(curr);
            btnNext.addEventListener('click', changeCurrent);
            btnPrev.addEventListener('click', changeCurrent);
        })

    class Slide{
        constructor(src, alt, id, parentSelector, ...classes){
            this.src = src;
            this.alt = alt;
            this.id = id;
            this.classes = classes;
            this.parent = document.querySelector(parentSelector);
        }

        render() {
            this.parent.innerHTML = '';
            const element = document.createElement('div');
            if (this.classes.length === 0){
                element.classList.add('offer_slide');
            } else {
                this.classes.forEach(className => element.classList.add(className));
            }
            element.innerHTML = `
                <img src=${this.src} alt=${this.alt}}>
            `;
            this.parent.append(element);

        }
    }

    const showCurrentSlide = function(currNumb) {
        if ( Math.trunc((currNumb + 1) / 10) === 0 ){
            idCurr.textContent = `0${currNumb + 1}`;
        } else {
            idCurr.textContent = `${currNumb + 1}`;
        }
        sliders[currNumb].render();
    };

    const changeCurrent = function(e) {
        if(e.target.classList.contains('offer__slider-next')){
            if (curr < sliders.length - 1){
                curr++;
            } else {
                curr = 0;
            }
        }
        if (e.target.classList.contains('offer__slider-prev')){
            if(curr >= 1){
                curr--;
            } else {
                curr = 3;
            }
        }
        showCurrentSlide(curr);
    };
    

   



});