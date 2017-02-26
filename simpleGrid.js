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
    
    this.SetConfig=function(json_str){
		this.config = JSON.parse(json_str);
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
			// Building Header
             athead = doc.createElement("div");
             att = document.createAttribute("class"); 
             att.value = "stayFixed";  
             athead.setAttributeNode(att); 
               if(this.config.width){
                    att = document.createAttribute("style"); 
                    var aWidth = parseInt(this.config.width);
                    aWidth = aWidth - 16;
                    att.value = "width:"+aWidth+"px;overflow-y: hidden;";
                    athead.setAttributeNode(att); 
             }
        
			aHead = doc.createElement("tr");
			for(var i=0;i<this.header.arr.length;i++){
				elem = doc.createElement("th");
                // Adding an id to each column header
                att = document.createAttribute("id");
                att.value = this.tableId+"_"+"col"+i;
                elem.setAttributeNode(att); 
                
                if(this.header.arr[i].width){
                    att = document.createAttribute("style");
                    att.value ="width:"+this.header.arr[i].width+";"; 
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
			// Building Body
        var atbody = doc.createElement("div");
             att = document.createAttribute("class"); 
             att.value = "doscroll";  
         atbody.setAttributeNode(att); 
                if(this.config.height){
                    att = document.createAttribute("style"); 
                    var anHeight = parseInt(this.config.height);
                    anHeight = anHeight - 16;
                    att.value = "height:"+anHeight+"px;max-height:"+anHeight+"px;overflow-y: scroll;";
                     atbody.setAttributeNode(att); 
                }

        var nrLines=0;    
		for(var i=0;i<this.data.arr.length;i++){
            nrLines++;
			aLine= doc.createElement("tr");
            
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