# simpleGrid

Here is a simpleGrid system with typed columns, scrollable, sortable, with a modal to enter or modify data.

Work in progress !

03/28/2017 : Added return false to my onclick events in the modal 
             Make your own validation test for the modal with modalValidation() 
			 placeholder and maxlength support in the modal

03/26/2017 : Added checkbox support in the modal with header cb_list attribute

03/26/2017 : Added checkbox support in the modal with header cb_list attribute

03/25/2017 : Added drop down in the modal header list attribute

03/06/2017 : Modal position is kept throughout the session. A column can have 0px wide : invisible in table but show in modal and a type "protected" for readonly state in the modal.

03/04/2017 : Changed setAttributeNode to setAttribute to ensure IE 11 compatibility dropped "use strict" for the moment because of IE11

03/03/2017 : The modal becomes draggable

03/02/2017 : Saving function + more Commenting

03/01/2017 : Added a searching feature (optional)

02/28/2017 : Bug editing + support of input date (english and french format) + translation feature 

02/27/2017 : Columns seems to be aligned thanks to mathematics 
A modal is displayed on row click which automaticaly shows a form to modify the row content.
Delete + add new functionalities.

02/26/2017 : French and english date support for sorting

02/25/2017 : Corrected aligment between header and body. Nice looking scrollBars, number of records in a new footer

Here is a demo :

https://philippemarcmeyer.github.io/index.html#vanillajs

Philippe MEYER

Features to develop :

- Calculated fields : for instance price * quantity = to be paid


# Description

SimpleGrid was written in pure javascript with no dependency, for the exercice !

I would love to make a jQuery plugin but for that I've got to pratice a bit (you may help me)

Here is a fully commented example :

```javascript

  // Settings like width and height, the id of the modal zone.  allowSearch gives you a search field
 var aConfig ='{"width":"700px","height":"316px","modal":"myModal","allowSearch":"yes"}';
    
    // Defining the header of the grid : colums names (matching data), types , titles and width
    // Supported types are : number, string and  mm-dd-yyyy, mm/dd/yyyy, dd-mm-yyyy, dd/mm/yyyy
 var aHeader = '{"arr":[{"name":"firstname","type":"string","title":"First name","width":"200px"},{"name":"lastname","type":"string","title":"Last name","width":"200px"},{"name":"birthdate","type":"mm-dd-yyyy","title":"Birthdate","width":"150px"},{"name":"langage","type":"string","title":"Langage","width":"150px"}]}';

    // This json string should be provides by the back-end : here for demonstration purpose
    // It's an objet containing an array 'arr' of objects representing the rows of our grid
    // You provide for each cell, the name (which must match the name in the header) and the value
var aData = '{"arr":[{"firstname":"Bjarne ","lastname":"Stroustrup","birthdate":"12-30-1950","langage":"C++"},{"firstname":"Denis","lastname":"Ritchie","birthdate":"09-09-1941","langage":"C"},{"firstname":"Kenneth","lastname":"Thompson","birthdate":"02-04-1943","langage":"Go"},{"firstname":"James","lastname":"Gosling","birthdate":"05-19-1955","langage":"Java"},{"firstname":"Brendan ","lastname":"Eich","birthdate":"07-04-1961","langage":"Javascript"},{"firstname":"Guido","lastname":"Van Rossum","birtdate":"01-31-1956","langage":"Python"},{"firstname":"Yukihiro","lastname":"Matsumoto","birthdate":"04-14-1965","langage":"Ruby"},{"firstname":"Roberto","lastname":"Lerusalimschy","birthdate":"05-21-1960","langage":"Lua"},{"firstname":"Rasmus","lastname":"Lerdorf","birthdate":"11-22-1968","langage":"Php"},{"firstname":"Jean","lastname":"Ichbiah","birthdate":"03-25-1940","langage":"Ada"}]}';
    
    // Optional feature (you don't need to set it via SetTranslations)
    // By default a button New title is 'New', you change it to localize or just to provide another title like "Add" 
    // Don't change the key, change the value ex : "New":"Nuevo" (Nuevo is new in spanish)
    
var aTranslation ='{"New":"New","Modifying":"Modifying","Adding":"Adding","Delete":"Delete","Cancel":"Cancel","Validate":"Validate","Search":"Search","Save":"Save"}';
    
    // Calling SimpleGrid : param1 : grid zone id, param2 : id of the grid itself, param3 : grid class (I propose grid-table grid-table-1 but you may write your own css)
var myGrid = new SimpleGrid("zone","tableId","grid-table grid-table-1");
    
myGrid.SetConfig(aConfig); // Settting the config
    
myGrid.config.save = function(){// Declaring the saving function
    // retreaving data
    var json = myGrid.getData();
    // You got to make your own saving function to localstorage or back-end !
    alert('You got to send this Json string to your backend !\r\n'+json);
}
myGrid.SetTranslations(aTranslation); // Setting translation if needed    
myGrid.SetHeader(aHeader); // Setting the hearder with names, types and width
myGrid.SetData(aData); // Setting the data to populate the rows
myGrid.Draw(); // Drawing the grid in it's zone 


```








