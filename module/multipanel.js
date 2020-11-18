/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class multiPanel extends ItemSheet {

    /** @override */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["sandbox", "sheet", "item"],
            width: 520,
            height: 480,
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

        const item = this.item;
        const data = super.getData();
        data.flags = item.data.flags;
        //console.log(data);

        //Recheck contents
        if (!hasProperty(data.flags, "panelarray")){
            setProperty(data.flags,"panelarray", []);
        }

        try {
            let panels = JSON.parse(item.data.data.panels);
            data.flags.panelarray = panels;

        }
        catch (err) {

        }

        this.checkItemsExisting();
        //console.log(data);
        return data;

    }

    /* -------------------------------------------- */

    /** @override */

    activateListeners(html) {
        super.activateListeners(html);

        // Activate tabs
        let tabs = html.find('.tabs');
        let initial = this._sheetTab;
        new Tabs(tabs, {
            initial: initial,
            callback: clicked => this._sheetTab = clicked.data("tab")
        });

        //Drag end event TEST
        //    let handler = ev => this._onEntityDragEnd(ev);
        //    document.addEventListener('dragend', handler);

        //Drop Event TEST
        this.form.ondrop = ev => this._onDrop(ev);

        // Everything below here is only needed if the sheet is editable
        if (!this.options.editable) return;

        let panels = this.item.data.flags.panelarray;

        // Update Inventory Item
        html.find('.item-edit').click(ev => {
            const li = $(ev.currentTarget).parents(".property");
            const panel = panels[li.data("itemId")];
            const item = game.items.get(panel._id);
            this.updatePanels();
            item.sheet.render(true);
        });

        // Delete Inventory Item
        html.find('.item-delete').click(ev => {
            const li = $(ev.currentTarget).parents(".property");
            const panel = panels.splice(li.data("itemId"),1);
            this.updatePanels();
            li.slideUp(200, () => this.render(false));
        });

        //Implementation of up/down arrows!!
        // Top Item
        html.find('.item-top').click(ev => {
            const li = $(ev.currentTarget).parents(".property");
            let itemindex = li.data("itemId");
            if(itemindex>0)
                panels.splice(itemindex-1, 0, panels.splice(itemindex, 1)[0]);
            this.updatePanels();
        });

        // Bottom Item
        html.find('.item-bottom').click(ev => {
            const li = $(ev.currentTarget).parents(".property");
            let itemindex = li.data("itemId");
            if(itemindex<panels.length-1)
                panels.splice(itemindex+1, 0, panels.splice(itemindex, 1)[0]);
            this.updatePanels();
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
        try {
            let dropdata = JSON.parse(event.dataTransfer.getData('text/plain'));
            dropitem = game.items.get(dropdata.id);

            if ( dropitem.data.type !== "panel" ) {
                console.log("You can only drop panels!");
                return false;
            }
        }
        catch (err) {
            console.log("ItemCollection | drop error")
            console.log(event.dataTransfer.getData('text/plain'));
            console.log(err);
            return false;
        }

        //Add property id to panel
        let panels = this.item.data.flags.panelarray;
        for (let i = 0; i < panels.length; i++) {
            if (panels[i]._id == dropitem.data._id) {
                return;
            }
        }

        panels.push(dropitem);
        this.updatePanels();

    }

    async updatePanels(){
        await this.item.update({"data.panels": JSON.stringify(this.item.data.flags.panelarray)});
        this.item.sheet.render(true);
    }

    /* -------------------------------------------- */

    /** @override */
    _updateObject(event, formData) {

        super._updateObject(event, formData);
    }
}
