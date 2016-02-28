#redBus strawberry

This is a small utility library which allows to add and remove events , classes and a few other DOM related stuff.

##Install

```javascript
npm install rb-strawberry
var strawberry = require('rb-strawberry')
```

##Usage

* getElementOffset

   ```javascript
   var offset = strawberry.getElementOffset(elem);
   /* offset = {
    top : topOffset,
    left : leftOffset,
    bottom : bottomOffset,
    right : rightOffset
   }*/
   ```

* normalizeEvent

   ```javascript
   var normalizedEvent = strawberry.normalizeEvent(oldEvent);
   ```
   This produces an event object that is simliar across all browsers.

* addClass

   ```javascript
    strawberry.addClass(elem , 'classToBeAdded');
   ```
   This adds the  class to the element.

* removeClass

   ```javascript
    strawberry.removeClass(elem , 'classToBeRemoved');
   ```
   This removes the  class from the element.

* hasClass

   ```javascript
    var isClass = strawberry.hasClass(elem , 'classToBeChecked');
   ```
   returns true if the element has the class else returns false.
   

* addEvent

   ```javascript
    strawberry.addEvent(elem , type , func , useCapture);
    //elem is the element on which the event is to be bound
    //type is the type of event e.g. 'click'
    //func is the callback for the event
    //useCapture is boolean for using event capture 
   ```
  
* removeEvent

   ```javascript
    strawberry.removeEvent(elem , type , func , useCapture);
    //elem is the element on which the event is to be unbound
    //type is the type of event e.g. 'click'
    //func is the callback for the event
    //useCapture is boolean for using event capture 
   ```
   
* isChildOf

   ```javascript
    var test = strawberry.idChildOf(elem, parent);
    // returns true if elem inside of the parent element else returns false
   ```
* removeEvents

   ```javascript
    strawberry.removeEvents(elem);
    // removes all the events bound to the element
   ```
   
* debounce

   ```javascript
    strawberry.debounce(func , wait);
    //func is a function that will be called after wait number of milliseconds
    //e.g.
    strawberry.debounce(function (){console.log('called from debounce')},500);
   ```

* mouseCoords

   ```javascript
    var mousePos = strawberry.mouseCoords(event);
    /*
    mousePos = {
      x : xPositionOfMouse,
      y : yPositionOfMouse
    };
    */
   ```
   This function returns the position of the mouse including the scroll position
   
* emptyElem

   ```javascript
    strawberry.emptyElem(elem); 
   ```
   
   Removes all the children of the element
  
