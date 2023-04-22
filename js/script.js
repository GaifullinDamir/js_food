import tabs  from './modules/tabs';
import modal  from './modules/modal';
import timers  from './modules/timers';
import cards  from './modules/cards';
import calculators  from './modules/calculators';
import forms  from './modules/forms';
import sliders  from './modules/sliders';
import {openModal} from './modules/modal';

window.addEventListener('DOMContentLoaded', () =>{

    const modalTimerId = setTimeout(() => openModal('.modal', modalTimerId), 50000);

    tabs('.tabheader__item', '.tabcontent', '.tabheader__items', 'tabheader__item_active');
    modal('[data-modal]', '.modal', modalTimerId);
    timers('.timer', '2023-04-23');
    cards();
    calculators();
    forms('form', modalTimerId);
    sliders({
        container: '.offer__slider',
        nextArrow: '.offer__slider-next',
        prevArrow: '.offer__slider-prev',
        wrapper: '.offer__slider-wrapper',
        currentCounter: '#current'

    });
});
