function SimpleGrid (zoneId,tableId,tableClass){
    "use strict";
	this.doc = document;
    this.zoneId = zoneId;
	this.zone =  this.doc.getElementById(this.zoneId)
	this.tableId = tableId || 'tableId';
	this.tableClass=tableClass || 'tableClass';
	this.table;
    this.config={};
    this.header={};
    this.data={};
    this.dataKeys=[];
    this.SetData=function(json_str){
		this.data = JSON.parse(json_str);
    }
    this.SetHeader=function(json_str){
		this.header = JSON.parse(json_str); // Array of objets with 3 properties : name (internal), type (for sorting), title (to show)
        for(var i=0;i<this.header.arr.length;i++){
            this.header.arr[i].sortWay='up'; // Adding property sortWay to the objet
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
            att.value = this.tableClass;                
            aTable.setAttributeNode(att); 
			var elem,txt,aHead,aLine,lineObj,lineObjLen;
			// Building Header
			aHead = doc.createElement("tr");
			for(var i=0;i<this.header.arr.length;i++){
				elem = doc.createElement("th");
                // Adding an id to each column header
                att = document.createAttribute("id");
                att.value = this.tableId+"_"+"col"+i;
                elem.setAttributeNode(att); 
                // Adding the title of each column header
				txt = doc.createTextNode(this.header.arr[i].title); 
				elem.appendChild(txt); 
                // adding the column header to the header
				aHead.appendChild(elem);
			}
            aTable.appendChild(aHead); // adding the header (tr) to the table
     var self = this;
			// Building Body
		for(var i=0;i<this.data.arr.length;i++){
			aLine= doc.createElement("tr");
            
			lineObj = this.data.arr[i];
            // Looping thru properties of each date object
			Object.keys(lineObj).forEach(function(key) {
                if(i===0){
                     self.dataKeys.push(key);
                }
				elem = doc.createElement("td");
				txt = doc.createTextNode(lineObj[key]); 
				elem.appendChild(txt);
				aLine.appendChild(elem);
			});
            aTable.appendChild(aLine);// adding the line (tr) to the table
		}
        
        this.zone.appendChild(aTable);  
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