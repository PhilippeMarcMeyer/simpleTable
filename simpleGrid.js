// Created by Philippe MEYER 2016-2017 //

function SimpleGrid(zoneId, tableId, tableClass) {
    //"use strict";
	this.doc = document;
    this.zoneId = zoneId;
	this.zone = this.doc.getElementById(this.zoneId);
	this.tableId = tableId || 'tableId';
	this.tableClass = tableClass || 'tableClass';
	this.table;
    this.translations={};
    this.config={};
    this.header={};
    this.data={};
    this.dataKeys=[];
    this.offset=0;
    this.html5ImputDateSupport=false;
    this.allowSearch=false;
    this.dragObj=null;
    this.selectedRow;
    
     var test = document.createElement("input");
     test.setAttribute("type", "date");
     this.html5ImputDateSupport = (test.type !== "text");
       //this.html5ImputDateSupport=false;
    
    this.Save=function(){
     if(this.config.save)
            this.config.save();
    }
    
    this.getData=function(){
       return JSON.stringify(this.data);
    }
	
	//------------------
	
	this.CreateSelect=function(aList,aName,aValue){
	    var doc = this.doc;
		var anOption;
        var elem = doc.createElement("select");
        elem.setAttribute('name',aName);
        elem.setAttribute('id',aName);
        var arr = aList.split(",");
		for(var i = 0; i < arr.length;i+=2){
			anOption = doc.createElement("option");
			anOption.value = arr[i];
			anOption.text = arr[i+1];
			if(aValue===arr[i]){
				anOption.selected = true;
			}
			elem.appendChild(anOption);

		}
        
	    return elem;
	}

    
    this.CreateInput=function(aType,aName,aValue){
        var doc = this.doc;
        var html_type,html_value,html_readOnly;
        var elem = doc.createElement("input");
        
        
        html_value = aValue;
        html_type = 'text';
        html_readOnly='';
      
          if(aType==='mm-dd-yyyy' &  this.html5ImputDateSupport){ // English date
            //            aaaa-mm-jj
            html_value = aValue.substring(6,10)+"-"+aValue.substring(0,2)+"-"+aValue.substring(3,5);
            html_type = 'date';
        }
        else if(aType==='dd-mm-yyyy' &  this.html5ImputDateSupport){ // French date
             html_value = aValue.substring(6,10)+"-"+aValue.substring(3,5)+"-"+aValue.substring(0,2);
             html_type = 'date';
    
        }
        else if(aType==='dd/mm/yyyy' &  this.html5ImputDateSupport){ // French date
            html_value = aValue.substring(6,10)+"/"+aValue.substring(3,5)+"/"+aValue.substring(0,2);
            html_type = 'date';
    
        }
        else if(aType==='mm/dd/yyyy' &  this.html5ImputDateSupport){ // English date
            //            aaaa-mm-jj
            html_value = aValue.substring(6,10)+"/"+aValue.substring(0,2)+"/"+aValue.substring(3,5);
            html_type = 'date';
        }
        else if(aType==='protected'){ // English date
            //            aaaa-mm-jj
            html_readOnly = 'readonly';
        }
		

        elem.setAttribute('type',html_type);
        
        elem.setAttribute('name',aName);
                 
        elem.setAttribute('id',aName);
                
        elem.setAttribute('value',html_value);
        
        if(html_readOnly==='readonly'){
            
           elem.setAttribute('readonly',html_readOnly);
        

        }
                
        return elem;
    }
    
    this.SetTranslations=function(json_str){
        this.translations = JSON.parse(json_str);
    }
    
    this.translate=function(token){
        var itemTranslated = token
        if ( this.translations[token]){
           itemTranslated=  this.translations[token];
        }
        return itemTranslated;
    }
    

   
    this.SetConfig=function(json_str){
		this.config = JSON.parse(json_str);
        // If a modal is wished on row click then add information to the SimpleGrid object
         var self;
         var booModal = false;
         var modalPtr;
         if(this.config.modal){
            var modalId = this.config.modal;
            if(modalId.length!==0){
               modalPtr=this.doc.getElementById(modalId);
               if(modalPtr){
                   self=this;
                   this.config.booModal=true; 
                   this.config.modal=modalPtr;
                   this.config.modalTitle='Modifiying';
                   this.config.modalLeft='';
                   this.config.modalTop='';
                   booModal=true;
               }           
            } 
         }
        if(!booModal){
           this.config.booModal=false; 
           this.config.modal=null;
           this.config.modalTitle='none'; 
        }
         if(this.config.allowSearch){
           if(this.config.allowSearch==='yes'){
                this.allowSearch=true;
           } 
        }
        
    }
    
    this.SetData=function(json_str){
		this.data = JSON.parse(json_str);
    }
    this.SetHeader=function(json_str){
		this.header = JSON.parse(json_str); // Array of objets with 3 properties : name (internal), type (for sorting), title (to show)
        for(var i=0;i<this.header.arr.length;i++){
            this.header.arr[i].sortWay='up'; // Adding property sortWay to the objet
        }
        
    } 
    
          // If a modal is wished on row click then add information to the SimpleGrid object
         var booModal = false;
         var modalPtr;
         if(this.config.modal){
            var modalId = this.config.modal;
            if(modalId.length!=0){
               modalPtr=this.doc.getElementById(modalId);
               if(modalPtr){
                   this.booModal=true; 
                   this.modal=modalPtr;
               }           
            } 
         }
    
    this.showModal=function(rowId){
		var row_prefix = this.tableId+"_row";
        if (rowId.length===0) return;
        rowId = rowId.replace(row_prefix,'');
        var item = '';
        var modalTitle = this.translate('Modifying');
        var lineOffset = parseInt(rowId);
        if(lineOffset===-1)
            modalTitle = this.translate('Adding');   
        this.offset = lineOffset;
        var self = this;
        var ptr =  this.config.modal;
        var doc = this.doc;
        if(ptr){
           ptr.innerHTML = ""; 
            var aDiv = doc.createElement("div");
   
            aDiv.setAttribute('class','modal-content'); 
			aDiv.setAttribute('id','modalRect'); 
            aDiv.setAttribute('draggable','true'); 

    
            // Drag only if we are not targeting a button or a filed in the modal
            aDiv.onmousedown = function (e) {
                var doDrag = false;
                var elem = (e.target || e.srcElement);
                if(!elem) doDrag = true;
                if(!doDrag){
                    var type=elem.tagName;
                     if(!type) doDrag = true;
                }
                if(!doDrag){
                    type=type.toLowerCase();
                    if(type!=='input' && type!=='button' && type!=='select')
                        doDrag = true;
                }
                if(doDrag){
                    _drag_init(this);
                    return false;  
                }else{
					if(type==='input') elem.setSelectionRange(0, elem.value.length);
                    return true;
                }

            };
        
            // Cross to close modal
            var spanClose = doc.createElement("span");
         
            spanClose.setAttribute('class','close'); 
			
            spanClose.setAttribute('id','close_sg_modal'); 
            
            // Adding cross character
            var txt = doc.createTextNode('X'); 
            spanClose.appendChild(txt); 
            aDiv.appendChild(spanClose); 
			
            var aH3 = doc.createElement("h3");
            txt = doc.createTextNode(modalTitle); 
            aH3.appendChild(txt);
            aDiv.appendChild(aH3); 
            
            var elem,aValue,aName,aType,aTitle;
            var nrCols = this.header.arr.length;
			for(var i=0;i<nrCols;i++){
                aTitle = this.header.arr[i].title;
                if(aTitle!==''){
                    elem = doc.createElement("label");
                    txt = doc.createTextNode(aTitle); 
                    elem.appendChild(txt);
                    aDiv.appendChild(elem); 
                }
           
              if (lineOffset!=-1)
                   aValue = this.data.arr[lineOffset][this.header.arr[i].name]; 
                else
                   aValue = '';
                
            aName = this.header.arr[i].name;
            aType = this.header.arr[i].type;
			if(this.header.arr[i].list){
				elem = this.CreateSelect(this.header.arr[i].list,this.header.arr[i].name,aValue); 
			}
			else
				elem = this.CreateInput(this.header.arr[i].type,this.header.arr[i].name,aValue); 
			
                aDiv.appendChild(elem); 
                elem = doc.createElement("br");
                aDiv.appendChild(elem);
                elem = doc.createElement("br");
                aDiv.appendChild(elem);    
            }
                            
                elem = doc.createElement("button");
                elem.setAttribute('id','validate');
				
                item=this.translate('Validate');
                txt = doc.createTextNode(item); 
                elem.appendChild(txt);
				
                elem.onclick = function() {
                var ptr,lineOffset,nrCols;
                lineOffset = self.offset;
                if(lineOffset==-1){
                    self.data.arr.push({});
                    lineOffset = self.data.arr.length-1;
                }
                nrCols = self.header.arr.length;
                var val;
			         for(var i=0;i<nrCols;i++){
                         val='';
                         ptr = self.doc.getElementById(self.header.arr[i].name);
                            if(ptr){
                                 val = ptr.value;
                                aType = self.header.arr[i].type;
                                if(aType==='mm-dd-yyyy' &  self.html5ImputDateSupport){ // English date : aaaa-mm-jj
                                    val= val.substring(5,7)+"-"+val.substring(8,10)+"-"+val.substring(0,4)
                                }
                                else if(aType==='dd-mm-yyyy' &  self.html5ImputDateSupport){ // French date
                                    val= val.substring(8,10)+"-"+val.substring(5,7)+"-"+val.substring(0,4)
                                }
                                else if(aType==='mm/dd/yyyy' &  self.html5ImputDateSupport){ // French date
                                    val= val.substring(5,7)+"/"+val.substring(8,10)+"/"+val.substring(0,4)
                                }
                                else if(aType==='dd/mm/yyyy' &  self.html5ImputDateSupport){ // French date
                                    val= val.substring(8,10)+"/"+val.substring(5,7)+"/"+val.substring(0,4)
                                }
                            }
                   
                            self.data.arr[lineOffset][self.header.arr[i].name]=val; 
                         
                     }
                
                self.config.modal.style.display = "none";
                self.saveModalCoordinates();
                self.Draw();
                }
                aDiv.appendChild(elem);
            
                elem = doc.createElement("button");

                elem.setAttribute('id','cancel');
				
                item = this.translate('Cancel'); 
                txt = doc.createTextNode(item); 
                elem.appendChild(txt);
				
                elem.onclick = function() {
					self.saveModalCoordinates();
                    self.config.modal.style.display = "none";
                    self.Draw();
                }
				
                aDiv.appendChild(elem);
            
                elem = doc.createElement("button");
				
                elem.setAttribute('id','delete');
                item = this.translate('Delete'); 
                txt = doc.createTextNode(item); 
                elem.appendChild(txt);
                elem.onclick = function() {
                    var lineOffset = self.offset;
                    self.data.arr.splice(lineOffset,1);
                    self.selectedRow="";
				    self.saveModalCoordinates();
                    self.config.modal.style.display = "none";
                    self.Draw();

                }
                aDiv.appendChild(elem);

                elem = doc.createElement("br");
                aDiv.appendChild(elem);
                elem = doc.createElement("br");
                aDiv.appendChild(elem);
            
            ptr.appendChild(aDiv); 
                
            
            var close_sg_modal = document.getElementById("close_sg_modal");


            close_sg_modal.onclick = function() {
				self.saveModalCoordinates();
                self.config.modal.style.display = "none";
                self.Draw();
            }

               if(self.config.modalLeft!==''){
				   	var ptr= document.getElementById('modalRect');
					if(ptr){
						ptr.style.position='absolute'; // Only now !
						ptr.style.left = self.config.modalLeft;
						ptr.style.top = self.config.modalTop;
					}

               }
                self.config.modal.style.display = "block";
        }
    }
    
    this.saveModalCoordinates=function(){
        if(this.config.booModal===true){
			var ptr= document.getElementById('modalRect');
			if(ptr){
				this.config.modalLeft=ptr.style.left;
				this.config.modalTop=ptr.style.top;
			}
        }

    }
    this.sort=function(colId){
        var item='';
        var obj;
        var type;
        var sortWay='up';
        var offset;
        var self = this;
        this.selectedRow='';
         for(var i=0;i<this.header.arr.length;i++){
            if(this.header.arr[i].id===colId){
                obj=this.header.arr[i];
                type=obj.type;
                sortWay=obj.sortWay;
                offset = i;
                i=this.header.arr.length+1;
            }
             if(obj){
                 self=this;
                 var aKey = this.dataKeys[offset];
                 self.data.arr.sort(function(a, b){
                    var boo_Sort_Integer = false;
                    var intA,intB = 0;
                    var elA,elB = '';
                    var elA = (a[aKey]+'') || ''; // If something mistyped in json
                    var elB = (b[aKey]+'') || ''; // Coercing to string for the numbers
                     if(type==='number'){
                        boo_Sort_Integer = true;
                        elA = elA.replace(",","."); // in case is a french float with decimal separator as ','
                        elB = elB.replace(",",".");
                        intA = parseInt(elA);  
                        intB = parseInt(elB);  
                     }else if(type==='string'){
                        elA = elA.toLowerCase();
                        elB = elB.toLowerCase();  
                     }else if(type==='dd-mm-yyyy' || type==='dd/mm/yyyy'){ // French date
                        boo_Sort_Integer = true;
		            	intA = parseInt(elA.substring(3,5))*100;
						intA +=parseInt(elA.substring(0,2));
						intA +=parseInt(elA.substring(6,10))*10000; 
		            	intB = parseInt(elB.substring(3,5))*100;
						intB +=parseInt(elB.substring(0,2));
						intB +=parseInt(elB.substring(6,10))*10000; 
                     }else if(type==='mm-dd-yyyy' || type==='mm/dd/yyyy'){ // English date
                         // ex : 12/01/2016 => 20160000 + 1200 + 1 = 20161201
                        boo_Sort_Integer = true;
		            	intA = parseInt(elA.substring(3,5));//Day
						intA +=parseInt(elA.substring(0,2))*100;//Month
						intA +=parseInt(elA.substring(6,10))*10000; //Yea r
		            	intB = parseInt(elB.substring(3,5));
						intB +=parseInt(elB.substring(0,2))*100;
						intB +=parseInt(elB.substring(6,10))*10000; 
                     }
                    if(boo_Sort_Integer){ 
                        if(intA <intB){
                            if(sortWay==='up') {return -1;} else {return 1;}
                        }else if(intA > intB){
                            if(sortWay==='up')  {return 1;} else {return -1;}
                        }
                         else return 0;                    
                    }
                     else{
                        if(elA <elB){
                            if(sortWay==='up') {return -1;} else {return 1;}
                        }else if(elA > elB){
                            if(sortWay==='up')  {return 1;} else {return -1;}
                        }
                         else return 0;
                    }
                  return 0;
                 });
                  if(sortWay==='up') {obj.sortWay='down'} else {obj.sortWay='up'}
             }
         }
         this.Draw();
    }
    
    this.Draw=function(objSearch){
        var searchFor = '';
        var searchForLower = '';

        if(objSearch){
            searchFor = objSearch.value;
            searchForLower = searchFor.toLowerCase();

        }
			var athead,aHead,att,elem,item,txt,aLine,lineObj,lineObjLen;

			this.zone.innerHTML = "";
			var doc = this.doc; // For speed 
            var aTable = doc.createElement("table");
            aTable.setAttribute('class',this.tableClass); 
			// ------------- Building Header -------------------------
    
             athead = doc.createElement("div");
  
             athead.setAttribute('class','stayFixed'); 
               if(this.config.width){
                    var aWidth = parseInt(this.config.width);
                    aWidth = aWidth - 20;
                    athead.setAttribute('style','width:'+aWidth+'px;width:'+aWidth+'px;overflow-y: hidden;'); 
             }
        
			aHead = doc.createElement("tr");
      
        var nrCols = this.header.arr.length;
		
		// We need to know the number of visible columns because the width
		// of each individual column is minored by (24/nrVisibleCols) due to the scroler area
		var nrVisibleCols = 0;
		for(var i=0;i<nrCols;i++){
			 if(this.header.arr[i].width!=='0px'){
				 nrVisibleCols++;
			 }
		}
		if(nrVisibleCols===0) nrVisibleCols=1; // no zero dividing
		
			for(var i=0;i<nrCols;i++){
                if(this.header.arr[i].width!=='0px'){
				elem = doc.createElement("th");
                // Adding an id to each column header to be able to sort them
                elem.setAttribute('id',this.tableId+"_"+"col"+i); 
                
				// Computing the size of each column
                if(this.header.arr[i].width){
                    aWidth = parseInt(this.header.arr[i].width);
                    aWidth = aWidth-(24/nrVisibleCols);
                    elem.setAttribute('style','width:'+aWidth+'px;'); 
                }
                // Adding the title of each column header
				txt = doc.createTextNode(this.header.arr[i].title); 
				elem.appendChild(txt); 
                // adding the column header to the header
				aHead.appendChild(elem);
                }
			}
              athead.appendChild(aHead); // adding the header (tr) to div of class 'stayFixed' 
              aTable.appendChild(athead); // adding the div to the table
        var self = this;
			// ------------- Building Body -----------------------------
			
            // Creating a scrollable div (overflow-y) surrounding the body of the table
		
        var atbody = doc.createElement('div');
            atbody.setAttribute('class','doscroll'); 
        var aStyle = "overflow-y: scroll;";

            if(this.config.height){ // If we have defined an height 
                var anHeight = parseInt(this.config.height);
                anHeight = anHeight - 24; // lowering by 24 px to figure out approximatly the height of the header
                aStyle = aStyle+"height:"+anHeight+"px;max-height:"+anHeight+"px;";
            }
             atbody.setAttribute('style',aStyle); 

            if(this.config.booModal){ // I a modal is asked in the config
                atbody.addEventListener("click",function(e){
                    var target = (e.target) ? e.target : e.srcElement;
                    var parent = target.parentNode;
                    if (parent){
                        self.showModal(parent.id)
                        self.selectedRow=parent.id;
                    }

                }); // Adding an Event listener   

            }


        var nrLines=0;   
        var boo_show = true;
		for(var i=0;i<this.data.arr.length;i++){
            nrLines++;
            boo_show = false;
            // Getting the object from the array
            lineObj = this.data.arr[i];

           if(searchForLower.length>0){
            Object.keys(lineObj).forEach(function(key) {
                item = lineObj[key];
                item = item.toLowerCase();
                    if (item.indexOf(searchForLower)!==-1){
                        boo_show = true;
                    }
                });
            }else{
                 boo_show = true;
            }
            
            if(boo_show){
			aLine= doc.createElement("tr");
            // adding an id to tr for modals
			var anId = this.tableId+"_"+"row"+i;
            aLine.setAttribute('id',anId); 
                
			// We want the selected row to appear 'selected' (class .selectedRow)
            if(this.selectedRow===anId){
                aLine.setAttribute('class','selectedRow');                
            }
            // Looping thru properties of each data object
            var j =0;
			Object.keys(lineObj).forEach(function(key) {
                if(i===0){
                     self.dataKeys.push(key);
                }
                  if(self.header.arr[j].width!=='0px'){
                        elem = doc.createElement("td");
                        txt = doc.createTextNode(lineObj[key]); // Set the td content to the corresponding item in the data array
                        elem.appendChild(txt);

                        if(self.header.arr[j].width){ // If we were given a width
                            aStyle ="width:"+self.header.arr[j].width+";"; 
                            elem.setAttribute('style',aStyle); 
                        }
                        aLine.appendChild(elem);
                  }
                
                j++;
                
			});
            atbody.appendChild(aLine);// adding the line (tr) to the table
            }
		}
        aTable.appendChild(atbody);// adding the line (tr) to the table
        if(this.config.width)
            this.zone.style="width:"+this.config.width+";border-radius:6px;padding:6px;padding-bottom:6px;border:1px solid black;";
        this.zone.appendChild(aTable);  
        
        //Adding the number of records left of the footer
        
        txt = doc.createTextNode("# "+nrLines); 
        elem = doc.createElement("b");
        elem.appendChild(txt);
        this.zone.appendChild(elem); 
        
        if(this.allowSearch){
            elem = doc.createElement("label");
            item = this.translate('Search'); 
            txt = doc.createTextNode(' '+item+' : '); 
            elem.appendChild(txt);
			
            elem.setAttribute('style','margin-left:20px;font-style:italic;');
			
            this.zone.appendChild(elem);
            elem = this.CreateInput('string','sg_search',searchFor);
            elem.setAttribute('style','margin-left:5px;width:200px;margin-top:-10px;border-radius:4px;border : 1px solid #777;');
            
            elem.onkeyup = function() {
                self.Draw(this); // this will be the this of the input text
            }
             this.zone.appendChild(elem);
        }

        // Creating the 'New' Button right of footer
        
        elem = doc.createElement("button");
        elem.setAttribute('id','simpleGrid_add');
		
        var item = this.translate('New'); 
        txt = doc.createTextNode(item); 
        elem.appendChild(txt);
        elem.onclick = function() {
                self.showModal('-1');
            }
        elem.setAttribute('style','font-weight:bold;padding:3px;padding-left:20px;padding-right:20px;float:right;margin-top:-10px;');
        this.zone.appendChild(elem);
        
             // Creating the 'Save' Button right of footer
        
        elem = doc.createElement("button");

        elem.setAttribute('id','simpleGrid_Save');
		
        var item = this.translate('Save'); 
        txt = doc.createTextNode(item); 
        elem.appendChild(txt);
        elem.onclick = function(){
            self.Save();
        }
        elem.setAttribute('style','font-weight:bold;padding:3px;padding-left:20px;padding-right:20px;float:right;margin-top:-10px;');
        this.zone.appendChild(elem);
        
       var ptr = this.doc.getElementById('sg_search');
        if(ptr){
            var strLength = ptr.value.length;
            ptr.focus();

            if(strLength>0){
                ptr.setSelectionRange(strLength, strLength);
            }
        }
        
        var anId;
        var self = this;
        for(var i=0;i<this.header.arr.length;i++){
            
            anId = this.tableId+"_"+"col"+i
        
            this.header.arr[i].id=anId; // adding an attribute id to each colum header
            this.header.arr[i].ptr=doc.getElementById(anId); // adding an attribute ptr to each colum header
            if(this.header.arr[i].ptr){ // Only if my header is real (not 0px)
             this.header.arr[i].ptr.addEventListener("click",function(e){
               var target = (e.target) ? e.target : e.srcElement;
               self.sort(target.id);
            });} // Adding an Event listener 
        }
        
    }
    
}

// by https://jsfiddle.net/user/tovic/fiddles/ ++ Other contributions + personal adaptations
var selected = null, // Object of the element to be moved
    x_pos = 0, y_pos = 0, // Stores x & y coordinates of the mouse pointer
    x_elem = 0, y_elem = 0; // Stores top, left values (edge) of the element

// Will be called when user starts dragging an element
function _drag_init(elem) {
    // Store the object of the element which needs to be moved
    selected = elem;
    x_pos = getMouseX();
    y_pos = getMouseY();
    x_elem = x_pos - selected.offsetLeft;
    y_elem = y_pos - selected.offsetTop;

}

// Will be called when user dragging an element
function _move_elem(e) {
    x_pos = getMouseX();
    y_pos = getMouseY();
    if (selected !== null) {
        selected.style.position='absolute'; // Only now !
        selected.style.left = (x_pos - x_elem) + 'px';
        selected.style.top = (y_pos - y_elem) + 'px';
        
    }
}

// Destroy the object when we are done
function _destroy() {
    selected = null;
}



document.onmousemove = _move_elem;
document.onmouseup = _destroy;

//http://stackoverflow.com/users/1033808/paul-hiemstra

var x = 0;
var y = 0;

document.addEventListener('mousemove', onMouseMove, false)

function onMouseMove(e){
    x = e.clientX;
    y = e.clientY;
}

function getMouseX() {
    return x;
}

function getMouseY() {
    return y;
}

function getFocus(){
var focused = document.activeElement;
if (!focused || focused == document.body)
    focused = null;
else if (document.querySelector)
    focused = document.querySelector(":focus");
return focused;
}


