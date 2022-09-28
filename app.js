window.addEventListener("DOMContentLoaded", function() {
    [].forEach.call( document.querySelectorAll('.tel'), function(input) {
    let keyCode;
    function mask(event) {
        event.keyCode && (keyCode = event.keyCode);
        let pos = this.selectionStart;
        if (pos < 3) event.preventDefault();
        let matrix = "+7 (___) ___-__-__",
            i = 0,
            def = matrix.replace(/\D/g, ""),
            val = this.value.replace(/\D/g, ""),
            new_value = matrix.replace(/[_\d]/g, function(a) {
                return i < val.length ? val.charAt(i++) || def.charAt(i) : a
            });
        i = new_value.indexOf("_");
        if (i != -1) {
            i < 5 && (i = 3);
            new_value = new_value.slice(0, i)
        }
        let reg = matrix.substr(0, this.value.length).replace(/_+/g,
            function(a) {
                return "\\d{1," + a.length + "}"
            }).replace(/[+()]/g, "\\$&");
        reg = new RegExp("^" + reg + "$");
        if (!reg.test(this.value) || this.value.length < 5 || keyCode > 47 && keyCode < 58) this.value = new_value;
        if (event.type == "blur" && this.value.length < 5)  this.value = ""
    }

    input.addEventListener("input", mask, false);
    input.addEventListener("focus", mask, false);
    input.addEventListener("blur", mask, false);
    input.addEventListener("keydown", mask, false)

  });

const popupLinks = document.querySelectorAll(".popup-link"),
body = document.querySelector("body"),
lockPadding = document.querySelectorAll(".lockPadding");

let unlock = true;

const timeout = 500;

if (popupLinks.length>0){
    for (let index = 0; index < popupLinks.length; index++){
        const popupLink = popupLinks[index];
        popupLink.addEventListener("click", function(e){
            const popupName = popupLink.getAttribute('href').replace('#','');
            const currentPopup = document.getElementById(popupName);
            popupOpen(currentPopup);
            e.preventDefault();
        });
    }
}

const closePopup = document.querySelectorAll('.close-popup');
if (closePopup.length>0){
    for( let index = 0; index < closePopup.length; index++){
        const el = closePopup[index];
        el.addEventListener('click', function(e){
            popupClose(el.closest('.popup'));
            e.preventDefault();
        });
    }
}

function popupOpen(currentPopup){
    if (currentPopup && unlock){
        const popupActive = document.querySelector('.popup.active');
        if (popupActive){
            popupClose(popupActive, false);
        } else{
            bodyLock();
        }
        currentPopup.classList.add('active');
        currentPopup.addEventListener('click', function(e){
            if (!e.target.closest(".popup-content")){
                popupClose(e.target.closest('.popup'));
            }
        });
    }
}

function popupClose(popupActive, doUnlock = true){
    if(unlock){
        popupActive.classList.remove('active');
        if (doUnlock){
            bodyUnLock();
        }
    }
}

function bodyLock(){
    const lockPaddingValue = window.innerWidth - document.querySelector('.page').offsetWidth + 'px';

    for(let index = 0; index<lockPadding.length;index++) {
        const el = lockPadding[index];
        el.style.paddingRight = lockPaddingValue;
    }
    body.classList.add('lock');

unlock = false;
setTimeout(function(){
    unlock=true;
},timeout);
}

function bodyUnLock(){
    setTimeout(function(){
        for (let index=0; index<lockPadding.length;index++){
            const el = lockPadding[index];
            el.style.paddingRight = '0px';
        }
        body.style.paddingRight = '0px';
        body.classList.remove('lock');
    }, timeout)

}
});