function SimpleGrid (zoneId,tableId,tableClass){
	this.doc = document;
    this.zoneId = zoneId;
	this.zone =  this.doc.getElementById(this.zoneId)
	this.tableId = tableId || 'tableId';
	this.tableClass=tableClass || 'tableClass';
	this.table;
    this.config={};
    this.header={};
    this.data={};
    this.SetData=function(json_str){
		this.data = JSON.parse(json_str);
    }
    this.SetHeader=function(json_str){
		this.header = JSON.parse(json_str);
    } 
    this.Draw=function(){
			this.zoneId.innerHTML = "";
			var doc = this.doc;
            var aTable = doc.createElement("table");
            var att = document.createAttribute("class");       
            att.value = this.tableClass;                
            aTable.setAttributeNode(att); 
			var elem,txt,aHead,aLine,lineObj,lineObjLen;
			// Building Header
			aHead = doc.createElement("tr");
			for(var i=0;i<this.header.arr.length;i++){
				elem = doc.createElement("th");
				txt = doc.createTextNode(this.header.arr[i].title); 
				elem.appendChild(txt);
				aHead.appendChild(elem);
			}
            aTable.appendChild(aHead);
			// Building Body
		for(var i=0;i<this.data.arr.length;i++){
			aLine= doc.createElement("tr");
			lineObj = this.data.arr[i];
			Object.keys(lineObj).forEach(function(key) {
				elem = doc.createElement("td");
				txt = doc.createTextNode(lineObj[key]); 
				elem.appendChild(txt);
				aLine.appendChild(elem);
			});
            aTable.appendChild(aLine);

		}
        
        
        document.getElementById(this.zoneId).appendChild(aTable);  
    }
    
}