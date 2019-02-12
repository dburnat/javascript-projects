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
        loadNotes
        getNoteObject;
    
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

    getNoteObject = function(el){           //funkcja używana do pobrania zawartości notatki
        let textarea = el.querySelector('textarea');
        return{
            content: textarea.value,
            id: el.id,
            transformCSSValue: el.style.transform
        };
    }

    createNote = function(options){             //parametr options bedzie wykorzystywany do ładowania notatek z pamieci
        let stickerElement = document.createElement('div'),
            barElement = document.createElement('div'),
            textareaElement = document.createElement('textarea'),
            saveBtnElement = document.createElement('button'),
            deleteBtnElement = document.createElement('button'),
            onSave,
            onDelete,
            BOUNDARIES = 400,
            noteConfig = options ||{             //domyslna konfiguracja NOWEJ notatki
                content: '',
                id: "sticker_" + new Date().getTime(),
                transformCSSValue: "translateX(" + Math.random() * BOUNDARIES + "px) translateY(" + Math.random() * BOUNDARIES + "px)"
            };

        onDelete = function(){
            let obj = {};
            deleteNote(obj);
        };
        onSave = function(){

            saveNote(
                getNoteObject(stickerElement)
            );
        };

        deleteBtnElement.addEventListener('click' , onDelete);
        saveBtnElement.addEventListener('click' , onSave);

        saveBtnElement.classList.add('saveButton');
        deleteBtnElement.classList.add('deleteButton');
        let transformCSSValue = noteConfig.transformCSSValue;

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
                localStorage.setItem(note.id, note)
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