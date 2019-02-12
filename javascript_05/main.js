(function (){
    'use strict';
    
    let draggedElement,
        onDragStart,
        onDrag,
        onDragEnd,
        grabPointX,
        grabPointY,
        createNote,
        addNoteBtnElement;
    
    onDragStart = function(e){
        let boundingClientRect;
        if(e.target.className.indexOf('bar') === -1){       //jeśli nie posiada klasy bar to nie ruszamy
            return;
        }
    
        draggedElement = this; //przypisanie do zmiennej aktualnego obiektu
        boundingClientRect = draggedElement.getBoundingClientRect();
    
        grabPointX = boundingClientRect.left - e.clientX;
        grabPointY = boundingClientRect.top - e.clientY;
    
    };
    
    onDrag = function(e){
        if(!draggedElement){ //nic nie przeciagamy
            return;
        }
    
        let posX = e.clientX + grabPointX;
        let posY = e.clientY + grabPointY;
    
        if(posX < 0){
            posX = 0;
        }
        if(posY < 0){
            posY = 0;
        }
        draggedElement.style.transform = 
            "translateX(" + posX + "px) translateY(" + posY + "px)";           
    };

    onDragEnd = function (){
        draggedElement = null;
        grabPointX = null;
        grabPointY = null;
    };

    createNote = function(){
        let stickerElement = document.createElement('div'),
            barElement = document.createElement('div'),
            textareaElement = document.createElement('textarea');

        let transformCSSValue = "translateX(" + Math.random() * 400 + "px) translateY(" + Math.random() * 400 + "px)"; //random position of new notes

        stickerElement.style.transform = transformCSSValue;
        stickerElement.classList.add('sticker');
        barElement.classList.add('bar');

        stickerElement.append(barElement);
        stickerElement.append(textareaElement);

        stickerElement.addEventListener('mousedown', onDragStart, false);

        document.body.appendChild(stickerElement);

    };

    createNote();
    
    addNoteBtnElement = document.querySelector('.addNoteBtn');
    addNoteBtnElement.addEventListener('click' , createNote , false);
    document.addEventListener('mousemove', onDrag, false);
    document.addEventListener('mouseup', onDragEnd, false);
    
    })();