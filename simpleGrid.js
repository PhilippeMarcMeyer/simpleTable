function SimpleGrid(zoneId, tableId, tableClass) {
    "use strict";
	this.doc = document;
    this.zoneId = zoneId;
	this.zone = this.doc.getElementById(this.zoneId);
	this.tableId = tableId || 'tableId';
	this.tableClass = tableClass || 'tableClass';
	this.table;
    this.config={};
    this.header={};
    this.data={};
    this.dataKeys=[];
    this.offset=0;

    this.SetConfig=function(json_str){
		this.config = JSON.parse(json_str);
        // If a modal is wished on row click then add information to the SimpleGrid object
    
         var booModal = false;
         var modalPtr;
         if(this.config.modal){
            var modalId = this.config.modal;
            if(modalId.length!=0){
               modalPtr=this.doc.getElementById(modalId);
               if(modalPtr){
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
        rowId = rowId.replace('tableId_row','');
        var modalTitle = 'Modifying';
        var lineOffset = parseInt(rowId);
        if(lineOffset===-1)
            modalTitle = 'Adding';    
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
            
            var elem;
            var nrCols = this.header.arr.length;
			for(var i=0;i<nrCols;i++){
                elem = doc.createElement("label");
                txt = doc.createTextNode(this.header.arr[i].title); 
                elem.appendChild(txt);
                aDiv.appendChild(elem); 
                
                elem = doc.createElement("input");
                
                att = doc.createAttribute("type"); 
                att.value = 'text';  
                 elem.setAttributeNode(att);
               // elem.appendChild(att);
                
                att = doc.createAttribute("name"); 
                att.value = this.header.arr[i].name; 
                elem.setAttributeNode(att);
                
                att = doc.createAttribute("id"); 
                att.value = this.header.arr[i].name; 
                elem.setAttributeNode(att);
                
                att = doc.createAttribute("value"); 
                if (lineOffset!=-1)
                    att.value = this.data.arr[lineOffset][this.header.arr[i].name]; 
                elem.setAttributeNode(att);
                
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
                txt = doc.createTextNode('Validate'); 
                elem.appendChild(txt);
                elem.onclick = function() {
                var ptr,lineOffset,nrCols;
                lineOffset = self.offset;
                if(lineOffset==-1){
                    self.data.arr.push({});
                    lineOffset = self.header.arr.length-1;
                }
                nrCols = self.header.arr.length;

			         for(var i=0;i<nrCols;i++){
                         ptr = self.doc.getElementById(self.header.arr[i].name);
                         if(ptr){
                            self.data.arr[lineOffset][self.header.arr[i].name]=ptr.value; 
                         }
                     }
                
                self.config.modal.style.display = "none";
                self.Draw();
                }
                aDiv.appendChild(elem);
            
                elem = doc.createElement("button");
                att = doc.createAttribute("id"); 
                att.value = 'cancel'; 
                elem.setAttributeNode(att);
                txt = doc.createTextNode('Cancel'); 
                elem.appendChild(txt);
                elem.onclick = function() {
                    self.config.modal.style.display = "none";
                }
                aDiv.appendChild(elem);
            
                elem = doc.createElement("button");
                att = doc.createAttribute("id"); 
                att.value = 'delete'; 
                elem.setAttributeNode(att);
                txt = doc.createTextNode('Delete'); 
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
        var obj;
        var type;
        var sortWay;
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
                     if(type==='integer'){
                        elA = elA.replace(",",".");
                        elB = elB.replace(",",".");
                        elA = parseInt(elA);  
                        elB = parseInt(elB);  
                     }else if(type==='string'){
                        elA = elA.toLowerCase();
                        elB = elB.toLowerCase();  
                     }else if(type==='dd/mm/yyyy'){ // French date
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
                     }else if(type==='mm/dd/yyyy'){ // English date
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
    
    this.Draw=function(){
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
		for(var i=0;i<this.data.arr.length;i++){
            nrLines++;
			aLine= doc.createElement("tr");
            // adding an id to tr for modals
            att = document.createAttribute("id");
            att.value = this.tableId+"_"+"row"+i;
            aLine.setAttributeNode(att); 
            // Getting the object from the array
			lineObj = this.data.arr[i];
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
        aTable.appendChild(atbody);// adding the line (tr) to the table
        if(this.config.width)
            this.zone.style="width:"+this.config.width+";border-radius:6px;padding:6px;padding-bottom:6px;border:1px solid black;";
        this.zone.appendChild(aTable);  
        txt = doc.createTextNode("# "+nrLines); 
        elem = doc.createElement("b");
        elem.appendChild(txt);
        this.zone.appendChild(elem); 
        
        elem = doc.createElement("button");
        att = doc.createAttribute("id"); 
        att.value = 'simpleGrid_add'; 
        elem.setAttributeNode(att);
        txt = doc.createTextNode('New'); 
        elem.appendChild(txt);
        elem.onclick = function() {
                self.showModal('-1');
            }
        att = doc.createAttribute("style");
        att.value = 'font-weight:bold;padding:3px;padding-left:20px;padding-right:20px;margin-bottom:-5px;float:right;margin-top:-10px;';
        elem.setAttributeNode(att);
        this.zone.appendChild(elem);
    
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