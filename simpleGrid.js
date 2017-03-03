function SimpleGrid(zoneId, tableId, tableClass) {
    "use strict";
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
    
    this.CreateInput=function(aType,aName,aValue){
        var doc = this.doc;
        var html_type,html_value;
        var elem = doc.createElement("input");
        var att = doc.createAttribute("type"); 
        
        html_value = aValue;
        html_type = 'text';
        
      
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
        att.value =html_type;  
        elem.setAttributeNode(att);
        
        att = doc.createAttribute("name"); 
        att.value = aName; 
        elem.setAttributeNode(att);
                
        att = doc.createAttribute("id"); 
        att.value = aName; 
        elem.setAttributeNode(att);
                
        att = doc.createAttribute("value"); 
         att.value = html_value;
        elem.setAttributeNode(att);
                
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
        if (rowId.length===0) return;
        rowId = rowId.replace('tableId_row','');
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
            var att = doc.createAttribute("class"); 
            att.value = "modal-content";  
            aDiv.setAttributeNode(att); 
            
            att = doc.createAttribute("draggable"); 
            att.value = "true";  
            aDiv.setAttributeNode(att); 
            
            // Bind the functions...
            aDiv.onmousedown = function () {
                _drag_init(this);
                return false;
            };
        
            // Cross to close modal
            var spanClose = doc.createElement("span");
            att = doc.createAttribute("class"); 
            att.value = "close";  
            spanClose.setAttributeNode(att); 
            
            att = doc.createAttribute("id"); 
            att.value = "close_sg_modal";  
            spanClose.setAttributeNode(att); 
            
            // Adding cross character
            var txt = doc.createTextNode('X'); 
            spanClose.appendChild(txt); 
            aDiv.appendChild(spanClose); 
            var aH3 = doc.createElement("h3");
            txt = doc.createTextNode(modalTitle); 
            aH3.appendChild(txt);
            aDiv.appendChild(aH3); 
            
            var elem,aValue,aName,aType;
            var nrCols = this.header.arr.length;
			for(var i=0;i<nrCols;i++){
                elem = doc.createElement("label");
                txt = doc.createTextNode(this.header.arr[i].title); 
                elem.appendChild(txt);
                aDiv.appendChild(elem); 
             
               // if(this.html5ImputDateSupport)
                    
                      // obj=this.header.arr[i];
               // type=obj.type;
           
              if (lineOffset!=-1)
                   aValue = this.data.arr[lineOffset][this.header.arr[i].name]; 
                else
                   aValue = '';
                
            aName = this.header.arr[i].name;
            aType = this.header.arr[i].type;
                
            elem = this.CreateInput(this.header.arr[i].type,this.header.arr[i].name,aValue)
          
                aDiv.appendChild(elem); 
                elem = doc.createElement("br");
                aDiv.appendChild(elem);
                elem = doc.createElement("br");
                aDiv.appendChild(elem);
                
 
                
            }
            
                            
                elem = doc.createElement("button");
                att = doc.createAttribute("id"); 
                att.value = 'validate'; 
                elem.setAttributeNode(att);
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
                                if(aType==='mm-dd-yyyy' &  self.html5ImputDateSupport){ // English date
                                    //            aaaa-mm-jj
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
                self.Draw();
                }
                aDiv.appendChild(elem);
            
                elem = doc.createElement("button");
                att = doc.createAttribute("id"); 
                att.value = 'cancel'; 
                elem.setAttributeNode(att);
                item = this.translate('Cancel'); 
                txt = doc.createTextNode(item); 
                elem.appendChild(txt);
                elem.onclick = function() {
                    self.config.modal.style.display = "none";
                }
                aDiv.appendChild(elem);
            
                elem = doc.createElement("button");
                att = doc.createAttribute("id"); 
            
                att.value = 'delete'; 
                elem.setAttributeNode(att);
                item = this.translate('Delete'); 
                txt = doc.createTextNode(item); 
                elem.appendChild(txt);
                elem.onclick = function() {
                    var lineOffset = self.offset;
                    self.data.arr.splice(lineOffset,1);

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
                
                self.config.modal.style.display = "none";
            }

            ptr.style.display = "block";
        }
    }
    
    this.sort=function(colId){
        var item='';
        var obj;
        var type;
        var sortWay='up';
        var offset;
        var self = this;
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
           
                 this.data.arr.sort(function(a, b){
                    var elA = a[aKey]+""; // coerce to string
                    var elB = b[aKey]+"";
                     if(type==='number'){
                        elA = elA.replace(",",".");
                        elB = elB.replace(",",".");
                        elA = parseInt(elA);  
                        elB = parseInt(elB);  
                     }else if(type==='string'){
                        elA = elA.toLowerCase();
                        elB = elB.toLowerCase();  
                     }else if(type==='dd-mm-yyyy' || type==='dd/mm/yyyy'){ // French date
                        var n1  = 0;
					    var n2  = 0; 
		            	n1 = (elA.substring(3,5)*100);
						n1 +=(elA.substring(0,2)*1);
						n1 +=(elA.substring(6,10)*10000); 
		            	n2 = (elB.substring(3,5)*100);
						n2 +=(elB.substring(0,2)*1);
						n2 +=(elB.substring(6,10)*10000); 
                        elA = n1;
                        elB = n2;
                     }else if(type==='mm-dd-yyyy' || type==='mm/dd/yyyy'){ // English date
                        var n1  = 0;
					    var n2  = 0; 
		            	n1 = (elA.substring(3,5)*1);
						n1 +=(elA.substring(0,2)*100);
						n1 +=(elA.substring(6,10)*10000); 
		            	n2 = (elB.substring(3,5)*1);
						n2 +=(elB.substring(0,2)*100);
						n2 +=(elB.substring(6,10)*10000); 
                        elA = n1;
                        elB = n2;
                     }
                    if(elA <elB){
                        if(sortWay==='up') {return -1;} else {return 1;}
                    }else if(elA > elB){
                        if(sortWay==='up')  {return 1;} else {return -1;}
                    }
                  return 0;
                 });
                  if(sortWay==='up') {obj.sortWay='down'} else {obj.sortWay='up'}
             }
         }
         this.Draw();
         //console.log(colId);
    }
    
    this.Draw=function(objSearch){
        var searchFor = '';
        var searchForLower = '';

        if(objSearch){
            searchFor = objSearch.value;
            searchForLower = searchFor.toLowerCase();

        }
            var item;
			this.zone.innerHTML = "";
			var doc = this.doc; // For speed 
            var aTable = doc.createElement("table");
            var att = document.createAttribute("class");  
            var athead,aHead,att,elem,txt;
            att.value = this.tableClass;                
            aTable.setAttributeNode(att); 
			var elem,txt,aHead,aLine,lineObj,lineObjLen;
			// ------------- Building Header -------------------------
    
             athead = doc.createElement("div");
             att = document.createAttribute("class"); 
             att.value = "stayFixed";  
             athead.setAttributeNode(att); 
               if(this.config.width){
                    att = document.createAttribute("style"); 
                    var aWidth = parseInt(this.config.width);
                    aWidth = aWidth - 20;
                    att.value = "width:"+aWidth+"px;width:"+aWidth+"px;overflow-y: hidden;";
                    athead.setAttributeNode(att); 
             }
        
			aHead = doc.createElement("tr");
      
        var nrCols = this.header.arr.length;
			for(var i=0;i<nrCols;i++){
				elem = doc.createElement("th");
                // Adding an id to each column header
                att = document.createAttribute("id");
                att.value = this.tableId+"_"+"col"+i;
                elem.setAttributeNode(att); 
                
                if(this.header.arr[i].width){
                    att = document.createAttribute("style");
                    aWidth = parseInt(this.header.arr[i].width);
                    aWidth = aWidth-(24/nrCols);
                    att.value ="width:"+aWidth+"px;"; 
                    elem.setAttributeNode(att); 
                }
                // Adding the title of each column header
				txt = doc.createTextNode(this.header.arr[i].title); 
				elem.appendChild(txt); 
                // adding the column header to the header
				aHead.appendChild(elem);
			}
              athead.appendChild(aHead); 
            aTable.appendChild(athead); // adding the header (tr) to the table
     var self = this;
			// ------------- Building Body -----------------------------
        
        var atbody = doc.createElement("div");
             att = document.createAttribute("class"); 
             att.value = "doscroll";  
             atbody.setAttributeNode(att); 
                    att = document.createAttribute("style"); 
                    att.value="overflow-y: scroll;";

                    if(this.config.height){
                        var anHeight = parseInt(this.config.height);
                        anHeight = anHeight - 24;
                        att.value = att.value+"height:"+anHeight+"px;max-height:"+anHeight+"px;";
                        atbody.setAttributeNode(att); 
                    }
    
                    if(this.config.booModal){
                     
                        atbody.addEventListener("click",function(e){
                            var target = (e.target) ? e.target : e.srcElement;
                            var parent = target.parentNode;
                            if (parent){
                                self.showModal(parent.id)
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
            att = document.createAttribute("id");
            att.value = this.tableId+"_"+"row"+i;
            aLine.setAttributeNode(att); 
            // Looping thru properties of each data object
            var j =0;
			Object.keys(lineObj).forEach(function(key) {
                if(i===0){
                     self.dataKeys.push(key);
                }
				elem = doc.createElement("td");
				txt = doc.createTextNode(lineObj[key]); 
				elem.appendChild(txt);
                if(self.header.arr[j].width){
                    att = document.createAttribute("style");
                    att.value ="width:"+self.header.arr[j].width+";"; 
                    elem.setAttributeNode(att); 
                }
				aLine.appendChild(elem);
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
            att = doc.createAttribute("style");
            att.value = 'margin-left:20px;font-style:italic;';
            elem.setAttributeNode(att);
            this.zone.appendChild(elem);
            elem = this.CreateInput('string','sg_search',searchFor);
            att = doc.createAttribute("style");
            att.value = 'margin-left:5px;width:200px;margin-top:-10px;border-radius:4px;border : 1px solid #777;';
            elem.setAttributeNode(att);
            
            elem.onkeyup = function() {
                self.Draw(this); // this will be the this of the input text
            }
             this.zone.appendChild(elem);
        }

        // Creating the 'New' Button right of footer
        
        elem = doc.createElement("button");
        att = doc.createAttribute("id"); 
        att.value = 'simpleGrid_add'; 
        elem.setAttributeNode(att);
        var item = this.translate('New'); 
        txt = doc.createTextNode(item); 
        elem.appendChild(txt);
        elem.onclick = function() {
                self.showModal('-1');
            }
        att = doc.createAttribute("style");
        att.value = 'font-weight:bold;padding:3px;padding-left:20px;padding-right:20px;float:right;margin-top:-10px;';
        elem.setAttributeNode(att);
        this.zone.appendChild(elem);
        
             // Creating the 'Save' Button right of footer
        
        elem = doc.createElement("button");
        att = doc.createAttribute("id"); 
        att.value = 'simpleGrid_Save'; 
        elem.setAttributeNode(att);
        var item = this.translate('Save'); 
        txt = doc.createTextNode(item); 
        elem.appendChild(txt);
        elem.onclick = function(){
            self.Save();
        }
        att = doc.createAttribute("style");
        att.value = 'font-weight:bold;padding:3px;padding-left:20px;padding-right:20px;float:right;margin-top:-10px;';
        elem.setAttributeNode(att);
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
            this.header.arr[i].ptr.addEventListener("click",function(e){
               var target = (e.target) ? e.target : e.srcElement;
               self.sort(target.id);
            }); // Adding an Event listener 
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
