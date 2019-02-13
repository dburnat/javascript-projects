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
        onAddNoteBtnClick,
        colorArray;
    
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
    
    colorArray = ["#E9432F", "#E9D52F", "#56E92F", "#2FE9DE" , "#2F3AE9" , "#B32FE9" ];

    

    //funkcja używana do pobrania zawartości notatki
    getNoteObject = function(el){
        let stickerzIndex = el.style.zIndex;       
        let bar = el.querySelectorAll('div')[0];
        let date = el.querySelectorAll('div')[1];
        let title = el.querySelectorAll('textarea')[0];
        let textarea = el.querySelectorAll('textarea')[1];
        return{
            title: title.value,
            content: textarea.value,
            id: el.id,
            barColor: bar.style.background,
            transformCSSValue: el.style.transform,
            textarea: {
                width: textarea.style.width,
                height: textarea.style.height
            },
            dateColor: date.style.background,
            date: date.innerHTML,
            zIndex: stickerzIndex
        };
    };

    //parametr options bedzie wykorzystywany do ładowania notatek z pamieci
    createNote = function(options){
        let m = new Date();
        let dateString =
            m.getUTCFullYear() + "/" +
            ("0" + (m.getUTCMonth()+1)).slice(-2) + "/" +
            ("0" + m.getUTCDate()).slice(-2) + " " +
            ("0" + m.getUTCHours()).slice(-2) + ":" +
            ("0" + m.getUTCMinutes()).slice(-2) + ":" +
            ("0" + m.getUTCSeconds()).slice(-2);
        
        let stickerElement = document.createElement('div'),
            barElement = document.createElement('div'),
            dateElement = document.createElement('div'),
            titleElement = document.createElement('textarea'),
            textareaElement = document.createElement('textarea'),
            saveBtnElement = document.createElement('button'),
            deleteBtnElement = document.createElement('button'),
            colorBtnElement = document.createElement('button'),
            pinBtnElement = document.createElement('button'),
            onSave,
            onDelete,
            onColorChange,
            onPin,
            BOUNDARIES = 400,
            noteConfig = options || {             //domyslna konfiguracja NOWEJ notatki
                title: '',
                content: '',
                id: "sticker_" + new Date().getTime(),
                transformCSSValue: "translateX(" + Math.random() * BOUNDARIES + "px) translateY(" + Math.random() * BOUNDARIES + "px)",
                barColor: '#169178',
                dateColor: '#169178',
                date: dateString,
                zIndex: ''
            };

        onDelete = function(){
            deleteNote(getNoteObject(stickerElement));
            document.body.removeChild(stickerElement);
        };
        onSave = function(){
            saveNote(
                getNoteObject(stickerElement)
            );
        };

        onColorChange = function(){
            let random = Math.floor((Math.random() * 5) + 0);
            barElement.style.background = colorArray[random];
            dateElement.style.background = colorArray[random];
        };

        onPin = function(){
            stickerElement.style.zIndex = 1;
        };

        //zablokowanie opcji rozszerzania notatki jeśli zawiera coś w sobie
        if(noteConfig.textarea){
            textareaElement.style.width = noteConfig.textarea.width;
            textareaElement.style.height = noteConfig.textarea.height;
            textareaElement.style.resize = 'none';
        }

        
        

        stickerElement.id = noteConfig.id;      //przypisanie identyfikatora
        barElement.style.background = noteConfig.barColor; //przypisanie koloru
        titleElement.value = noteConfig.title;      //przypisanie tytułu
        dateElement.innerHTML = noteConfig.date;    //przypisanie daty
        dateElement.style.background = noteConfig.dateColor; //przypisanie koloru diva daty
        textareaElement.value = noteConfig.content; //przypisanie wartości
        stickerElement.style.zIndex = noteConfig.zIndex; //przypisanie zindex

        deleteBtnElement.addEventListener('click' , onDelete);
        saveBtnElement.addEventListener('click' , onSave);
        colorBtnElement.addEventListener('click', onColorChange);
        pinBtnElement.addEventListener('click' , onPin);

        saveBtnElement.classList.add('saveButton');
        deleteBtnElement.classList.add('deleteButton');
        colorBtnElement.classList.add('colorButton');
        pinBtnElement.classList.add('pinButton');
        titleElement.classList.add('title');
        textareaElement.classList.add('textarea');
        dateElement.classList.add('date');

        stickerElement.style.transform = noteConfig.transformCSSValue;
        stickerElement.classList.add('sticker');
        barElement.classList.add('bar');

        barElement.appendChild(saveBtnElement);
        barElement.appendChild(pinBtnElement);
        barElement.appendChild(deleteBtnElement);
        barElement.appendChild(colorBtnElement);

        stickerElement.append(barElement);
        stickerElement.append(titleElement);
        stickerElement.append(textareaElement);
        stickerElement.append(dateElement);
        

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
            
            saveNote = function(){
                console.warn(mess);
            }
            deleteNote = function(){
                console.warn(mess);
            }
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