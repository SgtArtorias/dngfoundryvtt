/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */

import { auxMeth } from "./auxmeth.js";
export class sItemSheet extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["sandbox", "sheet", "item"],
            width: 520,
            height: 500,
            tabs: [{navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description"}]
        });
    }

    /* -------------------------------------------- */

    /** @override */
    get template() {
        const path = "systems/sandbox/templates/";
        return `${path}/${this.item.data.type}.html`;
    }


    /** @override */
    async getData() {

        if(this.item.data.type=="cItem")
            await this.checkStillUnique();

        const item = this.item;
        const data = super.getData();
        data.flags = item.data.flags;

        //BEHOLD THE BEST DEBUGGER LINE ON SANDBOX!
        console.log(data);

        return data;

    }

    /* -------------------------------------------- */

    /** @override */

    activateListeners(html) {
        super.activateListeners(html);

        // Activate tabs
        let tabs = html.find('.tabs');
        let initial = this._sheetTab;
        new TabsV2(tabs, {
            initial: initial,
            callback: clicked => this._sheetTab = clicked.data("tab")
        });

        //Drag end event 
        this.form.ondrop = ev => this._onDrop(ev);

        // Checks if the attribute of the cItem is variable, or it's value stays constant on each cItem
        html.find('.check-isconstant').click(ev => {
            const li = $(ev.currentTarget);
            const value = ev.target.value;
            let obj = li.attr("name");
            let namechain = obj.split(".");
            let name = namechain[1];
            let index = namechain[0];
            const prop = this.item.data.data.properties[index];

            if(prop.isconstant){
                prop.isconstant=false;
            }
            else{
                prop.isconstant=true;
            }

            this.item.update({"data.properties":this.item.data.data.properties},{diff:false});
        });

        // Checks if a Mod is executable only one
        html.find('.check-once').click(ev => {
            const li = $(ev.currentTarget);
            const value = ev.target.value;
            let index = li.attr("index");
            const mod = this.item.data.data.mods[index];

            if(mod.once){
                mod.once=false;
            }
            else{
                mod.once=true;
            }

            this.item.update({"data.mods":this.item.data.data.mods},{diff:false});
        });

        html.find('.mod-add').click(ev => {
            this.adnewCIMod();
        });

        html.find('.mod-input').change(ev => {
            const li = $(ev.currentTarget);
            const value = ev.target.value;
            let obj = li.attr("name");
            let namechain = obj.split(".");
            let name = namechain[1];
            let index = namechain[0];

            this.editmodInput(index, name, value);
        });

        html.find('.mod-delete').click(ev => {
            const li = $(ev.currentTarget);
            const value = ev.target.value;
            let obj = li.attr("name");
            let namechain = obj.split(".");
            let index = namechain[0];
            console.log(index);
            this.deletemodInput(index);
        });

        html.find('.modcitem-edit').click(ev => {

            let citemId = ev.target.parentElement.getAttribute("citemId");
            let citem = game.items.get(citemId);
            citem.sheet.render(true);
        });

        html.find('.modcitem-delete').click(ev => {
            const mods = this.item.data.data.mods;
            let cindex = ev.target.parentElement.parentElement.getAttribute("cindex");
            let modId =  ev.target.parentElement.parentElement.getAttribute("mod");
            this.item.data.data.mods[modId].items.splice(cindex,1);
            this.scrollbarSet();
            this.item.update({"data.mods": mods}, {diff: false});
        });

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        let subitems = this.getsubItems();
        if(subitems==null){

            return;
        }

        // Edit Tab item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".property");
            const toedit = subitems[li.data("itemId")];
            const item = game.items.get(toedit.id);
            item.sheet.render(true);
        });

        // Delete tab Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".property");
            let todelete = li.data("itemId");
            let obj = subitems[todelete];
            if(this.item.data.type=="cItem"){
                let group = game.items.get(obj.id);
                if(group.data.data.isUnique){
                    this.item.data.data.isUnique=false;
                }
            }
            const prop = subitems.splice(todelete,1);
            li.slideUp(200, () => this.render(false));
            this.updateLists(subitems);
        });

        // Top Item
        html.find('.item-top').click(ev => {
            const li = $(ev.currentTarget).parents(".property");
            let itemindex = li.data("itemId");
            if(itemindex>0)
                subitems.splice(itemindex-1, 0, subitems.splice(itemindex, 1)[0]);
            this.updateLists(subitems);
        });

        // Bottom Item
        html.find('.item-bottom').click(ev => {
            const li = $(ev.currentTarget).parents(".property");
            let itemindex = li.data("itemId");
            if(itemindex<subitems.length-1)
                subitems.splice(itemindex+1, 0, subitems.splice(itemindex, 1)[0]);
            this.updateLists(subitems);
        });

    }

    async checkItemsExisting(){

        let panels = this.item.data.flags.panelarray;
        let changed = false;

        for (let i = 0; i < panels.length; i++) {
            if (!game.items.get(panels[i]._id)) {
                let index = panels.indexOf(panels[i]);
                if (index > -1) {
                    panels.splice(index, 1);
                    changed = true;
                }
            }
        }

        if(changed)
            this.updatePanels();
    }

    async _onDrop(event) {
        //Initial checks
        event.preventDefault();
        event.stopPropagation();
        let dropitem;
        let dropmod = false;
        let modId;

        //        if(event==null)
        //            return;

        if(event.toElement.classList.contains("itemdrop-area")){
            console.log("dropping on mod");
            dropmod = true;
            modId = event.toElement.getAttribute("mod");
        }

        else if(event.target.parentElement.classList.contains("itemdrop-area")){
            console.log("NOT dropping on mod");
            dropmod = true;
            modId = event.target.parentElement.getAttribute("mod");
        }

        let dropmodcitem=false;

        try {
            let dropdata = JSON.parse(event.dataTransfer.getData('text/plain'));
            dropitem = game.items.get(dropdata.id);

            let acceptableObj="";
            if(this.item.data.type=="panel" || this.item.data.type=="group"){
                acceptableObj = "property";
            }

            else if(this.item.data.type=="sheettab" || this.item.data.type=="multipanel"){
                acceptableObj = "panel";
            }

            //else if(this.item.data.type=="cItem" && !this.item.data.data.isUnique){
            else if(this.item.data.type=="cItem"){
                acceptableObj = "group";
            }

            else if(this.item.data.type=="property" && this.item.data.data.datatype=="table"){
                acceptableObj = "group";
            }

            else{
                console.log("object not allowed");
                return false; 
            }

            if (dropitem.data.type !== acceptableObj) {
                if(this.item.data.type=="sheettab" && (dropitem.data.type == "multipanel"||dropitem.data.type == "panel")){

                }

                else if(this.item.data.type=="cItem" && dropitem.data.type == "cItem" && dropmod){
                    dropmodcitem=true;
                    await this.addItemToMod(modId,dropitem.data._id);
                }
                //TODO- IF YOU THINK YOURSELF PRO, HELP ME PUT MULTIPANELS INTO MULTIPANELS XD

                else{
                    console.log("object not allowed");
                    return false;
                }

            }


        }
        catch (err) {
            console.log("ItemCollection | drop error")
            console.log(event.dataTransfer.getData('text/plain'));
            console.log(err);
            return false;
        }

        this.scrollbarSet();

        if(dropmodcitem)
            return;

        let keyCode = this.getitemKey(dropitem.data);
        let itemKey = dropitem.data.data[keyCode];
        const itemData = this.item.data.data;
        //console.log(itemKey + " " + keyCode);
        let newItem = {}
        setProperty(newItem,itemKey,{});
        newItem[itemKey].id=dropitem.data._id;
        newItem[itemKey].name=dropitem.data.name;
        newItem[itemKey].ikey=itemKey;
        if(this.item.data.type=="group" && dropitem.data.type == "property"){
            newItem[itemKey].isconstant=true;
        }
        //console.log(newItem);

        if(this.item.data.type!="property" && this.item.data.data.datatype!="table"){
            //Add element id to panel
            const subitems = this.getsubItems();

            for (let i=0;i<subitems.length;i++) {
                if (subitems[i].id == dropitem.data._id) {
                    return;
                }
            }

            await subitems.push(newItem[itemKey]);

            if(this.item.data.type=="cItem" && dropitem.data.type == "group" && dropitem.data.data.isUnique){
                itemData.isUnique=true;
                itemData.uniqueGID=dropitem.data._id;
                await this.item.update({"data": itemData}, {diff: false}); 
            }

            else{
                await this.updateLists(subitems);
            }



        }

        else{
            const myitem = this.item.data.data;
            myitem.group.id = dropitem.data._id;
            //TODO --- No sería Title?
            myitem.group.name = dropitem.data.name;
            myitem.group.ikey = itemKey;

            await this.item.update({"data.group": myitem.group}, {diff: false}); 
        }

    }

    getsubItems(){

        let subitems;

        if(this.item.data.type=="panel"|| this.item.data.type=="group"){
            subitems = this.item.data.data.properties;
        }

        else if(this.item.data.type=="sheettab" || this.item.data.type=="multipanel"){
            subitems = this.item.data.data.panels; 
        }

        else if(this.item.data.type=="cItem"){
            subitems = this.item.data.data.groups; 
        }

        return subitems;
    }

    getitemKey(itemdata){

        let objKey;
        //console.log(itemdata.type);
        if(itemdata.type=="property"){
            objKey = "attKey";
        }

        else if(itemdata.type=="panel" || itemdata.type=="multipanel"){
            objKey = "panelKey";
        }

        else if(itemdata.type=="group"){
            objKey = "groupKey";
        }

        return objKey;
    }

    async updateLists(subitems){
        if(this.item.data.type=="panel"|| this.item.data.type=="group"){
            await this.item.update({"data.properties": subitems}, {diff: false});
        }

        else if(this.item.data.type=="sheettab" || this.item.data.type=="multipanel"){
            await this.item.update({"data.panels": subitems}, {diff: false}); 
        }

        else if(this.item.data.type=="cItem"){
            await this.item.update({"data.groups": subitems}, {diff: false}); 
        }

        return subitems;
    }

    async checkStillUnique(){
        let isUnique = false;
        const groups = this.item.data.data.groups;
        for(let j=groups.length-1;j>=0;j--){
            let groupId = groups[j].id;
            let groupObj = game.items.get(groupId);

            //Checks if group still exist
            if(groupObj!=null){
                if(groupObj.data.data.isUnique){
                    isUnique = true;
                } 
            }
            else{
                groups.splice(j,1);
            }

        }
        //console.log(isUnique);
        if(isUnique){
            if(!this.item.data.data.isUnique){
                this.item.data.data.isUnique=true;
            }
        }
        else{
            if(this.item.data.data.isUnique){
                this.item.data.data.isUnique = false;
            }
        }
    }

    async refreshCIAttributes(basehtml){
        console.log("updating CItem attr");

        const html = await basehtml.find(".attribute-list")[0];
        html.innerHTML = '';

        let attrArray = [];
        let tosave = false;

        const attributes = this.item.data.data.attributes;
        const groups = this.item.data.data.groups;
        for(let j=groups.length-1;j>=0;j--){
            let groupId = groups[j].id;
            let propObj = game.items.get(groupId);

            if(propObj!=null){
                let propertyIds = propObj.data.data.properties;

                for(let i=propertyIds.length-1;i>=0;i--){
                    let propertyId = propertyIds[i].id;
                    let ppObj = game.items.get(propertyId);

                    if(ppObj!=null){
                        if(!ppObj.data.data.ishidden || game.user.isGM){
                            let property = ppObj.data.data;

                            let new_container = document.createElement("DIV");
                            new_container.className = "new-row";
                            new_container.setAttribute("id", "row-" + i);

                            let new_row = document.createElement("DIV");
                            new_row.className = "flexblock-left";
                            new_row.setAttribute("id", i);

                            if(property.datatype!="group" && property.datatype!="label"){



                                let label = document.createElement("H3");
                                label.className = "label-free";
                                label.textContent = property.tag;

                                let input;

                                if(!hasProperty(attributes,property.attKey)){
                                    setProperty(attributes,property.attKey, {});
                                    if(property.datatype==="simplenumeric"){
                                        attributes[property.attKey].value = await auxMeth.autoParser(property.defvalue,null,attributes,false); 
                                    }

                                    else{
                                        attributes[property.attKey].value = await auxMeth.autoParser(property.defvalue,null,attributes,true); 
                                    }

                                    tosave = true;
                                }

                                const attribute = attributes[property.attKey];

                                if(attribute.value=="" || attribute.value==null){
                                    if(property.datatype==="simplenumeric"){
                                        attribute.value = 0;
                                    }
                                    else{
                                        attribute.value = property.defvalue;
                                    }
                                }

                                if(property.datatype!="list"){
                                    //console.log("editando");

                                    if(property.datatype=="textarea"){
                                        input = document.createElement("TEXTAREA");
                                        input.setAttribute("name", property.attKey);
                                        input.textContent = attribute.value;

                                        if(property.inputsize=="S"){
                                            input.className = "texteditor-small";
                                        }

                                        else if(property.inputsize=="L"){
                                            input.className = "texteditor-large";
                                        }
                                        else{
                                            input.className = "texteditor-med";
                                        }
                                    }
                                    else{
                                        input = document.createElement("INPUT");
                                        input.setAttribute("name", property.attKey);



                                        if(property.datatype==="simplenumeric"){

                                            input.setAttribute("type", "number");
                                            input.className = "input-smallmed";


                                            if(property.auto!="" && property.auto!=null){
                                                let atvalue = await auxMeth.autoParser(property.auto,null,attributes,false);
                                                input.setAttribute("value", atvalue);
                                                input.setAttribute("readonly", "true"); 
                                            }
                                            else{
                                                input.setAttribute("value", attribute.value);
                                            }

                                        }
                                        else if(property.datatype==="simpletext"){
                                            input.setAttribute("type", "text");
                                            input.className = "input-med";
                                            input.setAttribute("value", attribute.value);
                                        }

                                        else if(property.datatype==="checkbox"){
                                            input.setAttribute("type", "checkbox");
                                            let setvalue = false;
                                            //console.log(attribute.value);
                                            if(attribute.value===true || attribute.value==="true"){
                                                setvalue = true;
                                            }

                                            if(attribute.value==="false")
                                                attribute.value = false;
                                            //console.log(setvalue);
                                            input.checked = setvalue;
                                        }
                                    }

                                }
                                //LIST
                                else{
                                    input = document.createElement("SELECT");
                                    input.className = "input-med";
                                    input.setAttribute("name", property.attKey);
                                    var rawlist = property.listoptions;
                                    var listobjects = rawlist.split(',');

                                    for(var n=0;n<listobjects.length;n++){
                                        let n_option = document.createElement("OPTION");
                                        n_option.setAttribute("value", listobjects[n]);
                                        n_option.textContent = listobjects[n];
                                        if(listobjects[n]==attribute.value)
                                            n_option.setAttribute("selected", 'selected');

                                        input.appendChild(n_option);
                                    }

                                }

                                input.className += " att-input";
                                input.addEventListener("change", (event) => this.updateFormInput(event.target.name,event.target.value,propertyId));

                                if(!game.user.isGM){
                                    input.setAttribute("readonly", "true");
                                }

                                await new_row.appendChild(label);
                                if(property.datatype!="label")
                                    await new_row.appendChild(input);

                                await new_container.appendChild(new_row);
                                await html.appendChild(new_container);

                            }
                        }

                    }

                    else{
                        propertyIds.splice(i,1);
                    }



                }
            }

            else{
                groups.splice(j,1);
            }

        }
        //console.log(html);
        if(tosave){
            this.item.update({"data.attributes": attributes}, {diff: false});
        }


    }

    async updateFormInput(name, value,propId){
        //console.log(value);
        let setvalue;

        let propObj = await game.items.get(propId);
        if(propObj.data.data.datatype =="checkbox"){
            setvalue = true;
            let attKey = [propObj.data.data.attKey];

            let currentvalue = this.item.data.data.attributes[attKey].value;

            if(currentvalue==true || currentvalue=="true"){
                setvalue=false; 
            }

            this.item.data.data.attributes[propObj.data.data.attKey].value = setvalue;

        }

        else{
            setvalue=value;
            this.item.data.data.attributes[propObj.data.data.attKey].value=setvalue; 

        }

        //await this.item.update({[`data.attributes.${name}.value`]:setvalue});
        await this.item.update({"data.attributes":this.item.data.data.attributes},{diff:false});
    }


    async adnewCIMod(){
        const mods = this.item.data.data.mods;

        let newindex = mods.length-1;
        if (newindex<0){
            newindex=0;
        }
        else{

            newindex = mods[mods.length-1].index+1;
        }

        let newMod = {};
        newMod.name= "New Mod";
        newMod.index = newindex;
        newMod.type= "ADD";
        newMod.attribute= "";
        newMod.selectnum= "";
        newMod.items= [];
        newMod.citem = this.item.data._id;


        await mods.push(newMod);

        await this.item.update({"data.mods": mods}, {diff: false});

        console.log(mods);
    }

    editmodInput(index,name,value){
        const mods = this.item.data.data.mods;
        const obj = mods[index];
        obj[name] = value;

        this.item.update({"data.mods": mods}, {diff: false});
    }

    async deletemodInput(index){
        const mods = this.item.data.data.mods;
        mods.splice(index,1);
        await this.scrollbarSet();

        this.item.update({"data.mods": mods}, {diff: false});
    }

    addItemToMod(modId,citemId){
        const mods = this.item.data.data.mods;
        const mod = mods[modId];
        let citem = game.items.get(citemId);
        let arrayItem ={};
        arrayItem.id = citemId;
        arrayItem.name = citem.name;

        if(!mod.items.includes(citemId))
            mod.items.push(arrayItem);
        this.item.update({"data.mods": mods}, {diff: false});
    }

    async scrollBarTest(basehtml){
        const wcontent = await this._element[0].getElementsByClassName("window-content");
        let newheight = parseInt(wcontent[0].offsetHeight) - 152;

        const html = await basehtml.find(".scrollable");
        for(let i=0;i<html.length;i++){
            let scrollNode = html[i];
            scrollNode.style.height = newheight + "px";

            if(scrollNode.classList.contains("active")){
                let thisuser = game.user._id;
                scrollNode.scrollTop = this.item.data.flags.scrolls[thisuser];
            }

        }

    }

    async scrollbarSet(){
        let scrolls = this._element[0].getElementsByClassName("scrollable");
        let scrollTop = 0;
        for(let i=0;i<scrolls.length;i++){
            if(scrolls[i].classList.contains("active")){
                scrollTop = await scrolls[i].scrollTop;
            }

        }

        setProperty(this.item.data.flags.scrolls,game.user._id,scrollTop);
    }

    /** @override */
    _updateObject(event, formData) {

        this.scrollbarSet();

        super._updateObject(event, formData);

    }
}
