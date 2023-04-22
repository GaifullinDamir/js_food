function tabs(tabsSelector, tabsContentSelector, tabsParentSelector, activeClass) {
    // tabs
    const tabs = document.querySelectorAll(tabsSelector),
        tabsContent = document.querySelectorAll(tabsContentSelector),
        tabsParent = document.querySelector(tabsParentSelector);

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
            item.classList.remove(activeClass);
        })
    }

    function showTabContent(i = 0){
        tabsContent[i].classList.add('show', 'fade');
        tabsContent[i].classList.remove('hide');
        tabs[i].classList.add(activeClass);
    }

    hideTabContent();
    showTabContent();

    tabsParent.addEventListener('click', (event) =>{
        const target = event.target;

        //При помощи slice(1) удалили точку
        if(target && target.classList.contains(tabsSelector.slice(1))){
            tabs.forEach((item, i) =>{
                if (target == item) {
                    hideTabContent();
                    showTabContent(i);
                }
            })
        }
    })
}

export default tabs;