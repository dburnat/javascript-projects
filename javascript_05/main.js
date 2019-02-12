(function (){
    'use strict';
    
    let draggedElement,
        onDragStart,
        onDrag,
        onDragEnd,
        grabPointX,
        grabPointY,
        createNote,
        addNoteBtnElement,
        init,
        testLocalStorage,
        saveNote,
        deleteNote,
        loadNotes;
    
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
            textareaElement = document.createElement('textarea'),
            saveBtnElement = document.createElement('button'),
            deleteBtnElement = document.createElement('button'),
            onSave,
            onDelete;

        onDelete = function(){
            let obj = {};
            deleteNote(obj);
        };
        onSave = function(){
            let obj = {};
            saveNote(obj);
        };

        deleteBtnElement.addEventListener('click' , onDelete);
        saveBtnElement.addEventListener('click' , onSave);
        let transformCSSValue = "translateX(" + Math.random() * 400 + "px) translateY(" + Math.random() * 400 + "px)"; //random position of new notes

        stickerElement.style.transform = transformCSSValue;
        stickerElement.classList.add('sticker');
        barElement.classList.add('bar');

        barElement.appendChild(saveBtnElement);
        barElement.appendChild(deleteBtnElement);

        stickerElement.append(barElement);
        stickerElement.append(textareaElement);

        stickerElement.addEventListener('mousedown', onDragStart, false);

        document.body.appendChild(stickerElement);

    };

    testLocalStorage = function(){//sprawdzenie czy mamy dostęp do pamięci lokalnej
        let foo = 'foo';
        try {
            localStorage.setItem(foo,foo);
            localStorage.removeItem(foo);
            return true;
        } 
        catch (error) {
            return false;
        }
    };

    init = function(){

        if(!testLocalStorage()){
            let mess = "You can't use localStorage";
        }
        else{
            saveNote = function(note){

            };
            deleteNote = function(note){

            }
            loadNotes = function(){

        };

        loadNotes();
        }
        addNoteBtnElement = document.querySelector('.addNoteBtn');
        addNoteBtnElement.addEventListener('click' , createNote , false);
        document.addEventListener('mousemove', onDrag, false);
        document.addEventListener('mouseup', onDragEnd, false);

    };


    
    init(); 

    })();