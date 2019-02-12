(function () {
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
        loadNotes,
        getNoteObject,
        onAddNoteBtnClick;
    
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
            transformCSSValue: el.style.transform,
            textarea: {
                width: textarea.style.width,
                height: textarea.style.height
            }
        };
    };

    createNote = function(options){             //parametr options bedzie wykorzystywany do ładowania notatek z pamieci
        let stickerElement = document.createElement('div'),
            barElement = document.createElement('div'),
            textareaElement = document.createElement('textarea'),
            saveBtnElement = document.createElement('button'),
            deleteBtnElement = document.createElement('button'),
            onSave,
            onDelete,
            BOUNDARIES = 400,
            noteConfig = options || {             //domyslna konfiguracja NOWEJ notatki
                content: '',
                id: "sticker_" + new Date().getTime(),
                transformCSSValue: "translateX(" + Math.random() * BOUNDARIES + "px) translateY(" + Math.random() * BOUNDARIES + "px)"
            };

        onDelete = function(){
            deleteNote(getNoteObject(stickerElement));
        };
        onSave = function(){
            saveNote(
                getNoteObject(stickerElement)
            );
        };

        if(noteConfig.textarea){
            textareaElement.style.width = noteConfig.textarea.width;
            textareaElement.style.height = noteConfig.textarea.height;
            textareaElement.style.resize = 'none';
        }

        stickerElement.id = noteConfig.id;      //przypisanie identyfikatora
        textareaElement.value = noteConfig.content; //przypisanie wartości

        deleteBtnElement.addEventListener('click' , onDelete);
        saveBtnElement.addEventListener('click' , onSave);

        saveBtnElement.classList.add('saveButton');
        deleteBtnElement.classList.add('deleteButton');

        stickerElement.style.transform = noteConfig.transformCSSValue;
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

    onAddNoteBtnClick = function(){
        createNote();
    };

    init = function(){

        if(!testLocalStorage()){
            let mess = "You can't use localStorage";
        }
        else{
            saveNote = function(note){
                localStorage.setItem(note.id, JSON.stringify(note));
            };
            deleteNote = function(note){
                localStorage.removeItem(note.id);
            }
            loadNotes = function(){
                for(let i = 0; i < localStorage.length; i++){
                    let noteObject = JSON.parse(localStorage.getItem(localStorage.key(i)));
                createNote(noteObject);
                }
        };

        loadNotes();
        }
        addNoteBtnElement = document.querySelector('.addNoteBtn');
        addNoteBtnElement.addEventListener('click' , onAddNoteBtnClick , false);
        document.addEventListener('mousemove', onDrag, false);
        document.addEventListener('mouseup', onDragEnd, false);

    };


    
    init(); 
})();