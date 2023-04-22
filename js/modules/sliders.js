function sliders({container, nextArrow, prevArrow, currentCounter, wrapper}) {
    
    const offerSlider = document.querySelector(container),
        btnNext = offerSlider.querySelector(nextArrow),
        btnPrev = offerSlider.querySelector(prevArrow),
        offerSliderWrapper = offerSlider.querySelector(wrapper),
        idCurr = offerSlider.querySelector(currentCounter);

    let curr = 0,
        total = 0;

    let sliders = [];

    const getResources = async (url) => {
        //Поулчаем Promise, который возвращает fetch().
        const res = await fetch(url);

        if(!res.ok){
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }
        //Возвраащем Promise.
        return await res.json();
    }
    
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
            if(curr > 1){
                curr--;
            } else {
                curr = 3;
            }
        }
        showCurrentSlide(curr);
    };
}

export default sliders;