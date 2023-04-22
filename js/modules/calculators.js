function calculators() {
    //Калькулятор
    const result = document.querySelector('.calculating__result span');

    //Добавили дефолтные значения, дабы сразу отображался какой-то результат.

    let sex, height, weight, age, ratio;
    
    if (localStorage.getItem('sex')) {
        sex = localStorage.getItem('sex');
    } else {
        sex = 'female';
        localStorage.setItem('sex', 'female');
    }

    if (localStorage.getItem('ratio')) {
        ratio = localStorage.getItem('ratio');
    } else {
        ratio = 1.375;
        localStorage.setItem('ratio', 1.375);
    }

    function initLocalSettings(selector, activeClass) {
        const elements = document.querySelectorAll(selector);
        elements.forEach(elem => {
            elem.classList.remove(activeClass);
            if (elem.getAttribute('id') === localStorage.getItem('sex')) {
                elem.classList.add(activeClass);
            }  
            if (elem.getAttribute('data-ratio') === localStorage.getItem('ratio')) {
                elem.classList.add(activeClass);
            }
        })
    }

    initLocalSettings('#gender div', 'calculating__choose-item_active');
    initLocalSettings('.calculating__choose_big div', 'calculating__choose-item_active');

    //Функция для расчет калорий
    //calcTotal должен вызываться каждый раз, когда пользователь хоть как-то изменял данные
    function calcTotal(){
        if(!sex || !height || !weight || !age || !ratio){
            result.textContent = '_____';
            return;
        }
        
        if (sex === 'female') {
            result.textContent = Math.round((447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age)) * ratio);
        } else {
            result.textContent = Math.round((88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age)) * ratio);
        }
    }

    calcTotal();

    //Получаем информацию со статических блоков
    //parentSelector, поскольку будем применять функцию на нескольких элементах
    //activeClass, поскольку будем менять класс активности
    function getStaticInformation(selector, activeClass){
        const elements = document.querySelectorAll(selector); //получаем все div внутри этого родителя.

        elements.forEach(elem => {
            elem.addEventListener('click', (e) =>{
                //Если клиент кликнул на активность, то мы взяли и вытащили ту активность, которая стоит у него в атрибуте
                //Не используем делегирование событий, чтобы избежать багов с подложкой
                if (e.target.getAttribute('data-ratio')){
                    ratio = +e.target.getAttribute('data-ratio');

                    //Теперь, когда я кликаю на элементы у меня запоминается это значение в localStorage.
                    localStorage.setItem('ratio', e.target.getAttribute('data-ratio'));
                } else { // Если нет атрибута data-ratio, значит работаем с полом.
                    sex = e.target.getAttribute('id');
                    localStorage.setItem('sex', e.target.getAttribute('id'));
                }
    
                //Убираем класс активности у всех элементов
                elements.forEach(elem => {
                    elem.classList.remove(activeClass);
                });
                //Добавляем класс активности требуемому элементу
                e.target.classList.add(activeClass);
                calcTotal();
            });
        });

        //Если поулчаем пол, то обращаем по уникальному идентификатору
        //Если с физической активностью, то работаем с атрибутом data-ratio
    }
   
    getStaticInformation('#gender div', 'calculating__choose-item_active');

    getStaticInformation('.calculating__choose_big div', 'calculating__choose-item_active');

    //Функция, обрабатывающая каждый отдельный input()

    function getDynamicInformation(selector){
        const input = document.querySelector(selector);

        input.addEventListener('input', e =>{

            //Если в input присутствует что-то помимо чисел, то подкрашиваем границы красным цветом.
            //Для этого используем регулярные выражения.
            if(input.value.match(/\D/g)){
                input.style.border = '1px solid red';
            } else {
                input.style.border = 'none';
            }
 
            switch(input.getAttribute('id')) {
                case 'height':
                    height = +input.value;
                    break;
                case 'weight':
                    weight = +input.value;
                    break;
                case 'age':
                    age = +input.value;
                    break;
            }
            calcTotal();
        });
    }

    getDynamicInformation('#height');
    getDynamicInformation('#weight');
    getDynamicInformation('#age');
}

export default calculators;