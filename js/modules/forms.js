//Синтаксис именовонного импорта
import {closeModal, openModal} from './modal';
import {postData} from '../services/services';
function forms(formSelector, modalTimerId) {
    // Forms

    const forms = document.querySelectorAll(formSelector);

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
        openModal('.modal', modalTimerId);

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
            closeModal('.modal');
        }, 4000)
    }
    //Подключаемся к нашему json-server
    fetch('http://localhost:3000/menu').
        then(data => data.json()).//Получаем оттуда json данные
        then(res => console.log(res));
}

export default forms;