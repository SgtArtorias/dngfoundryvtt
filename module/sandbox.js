/**
 * A system to create any RPG ruleset without needing to code
 * Author: Seregras
 * Software License: GNU GPLv3
 */

// Import Modules
import { gActorSheet } from "./gactorsheet.js";
import { sItemSheet } from "./sitemsheet.js";
import { gActor } from "./a-entity.js";
import { gItem } from "./i-entity.js";
import { SBOX } from "./config.js";
import { auxMeth } from "./auxmeth.js";

/* -------------------------------------------- */
/*  Hooks                 */
/* -------------------------------------------- */

Hooks.once("init", async function() {
    console.log(`Initializing Sandbox System`);

    /**
	 * Set an initiative formula for the system
	 * @type {String}
	 */

    CONFIG.debug.hooks = true;
    CONFIG.Actor.entityClass = gActor;
    CONFIG.Item.entityClass = gItem;

    auxMeth.buildSheetHML();
    auxMeth.registerIfHelper();
    auxMeth.registerIfNotHelper();
    auxMeth.registerIfGreaterHelper();
    auxMeth.registerIfLessHelper();
    auxMeth.registerIsGM();
    auxMeth.registerShowMod();
    auxMeth.registerShowSimpleRoll();

    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("dnd5e", gActorSheet, { makeDefault: true });
    Items.unregisterSheet("core", ItemSheet);
    Items.registerSheet("dnd5e", sItemSheet, {makeDefault: true});

    game.settings.register("sandbox", "showADV", {
        name: "Show Roll with Advantage option",
        hint: "If checked, 1d20,ADV,DIS options will be displayed under the Actor's name",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register("sandbox", "showSimpleRoller", {
        name: "Show d20 Roll icon option",
        hint: "If checked a d20 icon will be displayed under the Actor's name",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register("sandbox", "consistencycheck", {
        name: "Check cItem Consistency",
        hint: "If checked, when rebuilding template, every cItem will be evaluated for consistency. WARNING: May take several minutes in big systems",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register("sandbox", "showDC", {
        name: "Show DC window",
        hint: "If checked a DC box will appear at the bottom of the screen",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register("sandbox", "showLastRoll", {
        name: "Show Last Roll window",
        hint: "If checked a box displaying the results of the last Roll will appear at the bottom of the screen",
        scope: "world",
        config: true,
        default: true,
        type: Boolean,
    });

    game.settings.register("sandbox", "diff", {
        name: "GM difficulty",
        hint: "This is linked to the DC Box at the bottom of the screen",
        scope: "world",
        config: false,
        default: 0,
        type: Number,
    });

    game.settings.register("sandbox", "tokenOptions", {
        name: "Token Options",
        hint: "You can specify bar1 under token on the template Token tab",
        scope: "world",
        config: true,
        default: 0,
        type: Boolean,
    });

    game.settings.register("sandbox", "customStyle", {
        name: "CSS Style file",
        hint: "You can specify a custom styling file. If default wanted, leave blank",
        scope: "world",
        config: true,
        default: "",
        type: String,
    });

    game.settings.register("sandbox", "initKey", {
        name: "Initiative Attribute Key",
        hint: "After editing, please refresh instance",
        scope: "world",
        config: true,
        default: "",
        type: String,
    });

    let initF = await game.settings.get("sandbox", "initKey");
    let formvalue = "@attributes." + initF + ".value";
    if(initF=="")
        formvalue = "1d20";

    CONFIG.Combat.initiative = {
        formula: formvalue,
        decimals: 2
    };



});

Hooks.once('ready', async() => {
    //console.log("ready!");
    //Custom styling
    if(game.settings.get("sandbox", "customStyle")!=""){
        const link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = game.settings.get("sandbox", "customStyle");
        await document.getElementsByTagName('head')[0].appendChild(link);
    }


    //Gets current sheets
    await auxMeth.getSheets();

    //GM ROLL MENU TEMPLATE
    //Sets roll menu close to hotbar THIS IS SOMETHING FOR ME STREAMS, TO REMOVE IF YOU LIKE
    if(game.user.isGM){

        game.data.rolldc = 3;

        let hotbar = document.getElementById("hotbar");
        let backgr = document.createElement("DIV");
        backgr.className = "dc-input";

        //        let compendiumexport = document.getElementsByClassName("directory-footer");
        //        let sboxcomp = document.createElement("BUTTON");
        //        sboxcomp.className = "create-sbcompendium";
        //        sboxcomp.type = "submit";
        //        sboxcomp.addEventListener("click", async (event) => {
        //            event.preventDefault();
        //            event.stopPropagation();
        //
        //            const compdata = await fetch("worlds/" + game.data.world.name + "world.json").then(r => r.json()) // Load your JSON data
        //            const pack = game.packs.find(p => p.collection === "yoursystem.packname"); // Get the created compendium by its name
        //            await pack.createEntity(compdata);
        //
        //        });

        let header = document.createElement("DIV");
        header.className = "dc-header";
        header.textContent = "DC";

        let form = document.createElement("FORM");
        let sInput = document.createElement("INPUT");
        sInput.setAttribute("type", "text");
        sInput.setAttribute("name", "dc");
        sInput.setAttribute("value", "");

        let initvalue = 0;
        if(!hasProperty(SBOX.diff,game.data.world.name)){
            setProperty(SBOX.diff,game.data.world.name,0);
        }

        sInput.value = game.settings.get("sandbox", "diff");

        sInput.addEventListener("keydown", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            if(event.key=="Backspace" || event.key=="Delete"){
                sInput.value = "";
            }

            else if(event.key=="Enter"){
                //SBOX.diff[game.data.world.name] = sInput.value;
                await game.settings.set("sandbox", "diff", sInput.value);
            }

            else{
                if(!isNaN(event.key))
                    sInput.value += event.key;
            }

        });

        sInput.addEventListener("focusout", async (event) => {
            event.preventDefault();
            event.stopPropagation();

            //SBOX.diff[game.data.world.name] = sInput.value;
            await game.settings.set("sandbox", "diff", sInput.value);

        });

        form.appendChild(sInput);
        backgr.appendChild(header);

        backgr.appendChild(form);

        if(game.settings.get("sandbox", "showDC")){
            await hotbar.appendChild(backgr);
        }


        await auxMeth.rollToMenu();
        SBOX.showshield = false;

        if(game.settings.get("sandbox", "tokenOptions")){
            document.addEventListener("keydown", (event) => {
                if(event.key=="Control"){
                    SBOX.showshield = true;
                }

            });

            document.addEventListener("keyup", (event) => {
                SBOX.showshield = false;

            });
        }




        let macrosheet = document.getElementById("hotbar");

    }

    //    let gamecItems = game.items.filter(y=>y.data.description!="");
    //    for(let i=0;i<gamecItems.length;i++){
    //        const mycitem = gamecItems[i];
    //        await mycitem.update({"data.attributes.description":mycitem.data.data.description});
    //    }

    //    let gameActors = game.actors;
    //    //console.log(gameActors);
    //    for(let j=0;j<gameActors.entities.length;j++){
    //        const myactor = gameActors.entities[j];
    //        await myactor.update({"data.attributes.biography":myactor.data.data.biography},{diff:false});
    //    }

});

//COPIED FROM A MODULE. TO SHOW A SHIELD ON A TOKEN AND LINK THE ATTRIBUTE. TO REMOVE
Hooks.on("hoverToken", (token, hovered) => {

    if(!game.settings.get("sandbox", "tokenOptions"))
        return;

    if(token.actor==null)
        return;

    if(token.actor.data.data.tokenshield == null)
        return;

    let shieldprop = token.actor.data.data.tokenshield;
    //console.log(shieldprop);

    if(token.actor.data.data.attributes[shieldprop]==null)
        return;

    let ca = token.actor.data.data.attributes[shieldprop].value;

    let template = $(`
<div class="section">
<div class="value"><i class="fas fa-shield-alt"></i>${ca}</div>
</div>
`);

    if (hovered && SBOX.showshield) {
        let canvasToken = canvas.tokens.placeables.find((tok) => tok.id === token.data._id);
        let dmtktooltip = $(`<div class="dmtk-tooltip"></div>`);
        dmtktooltip.css('left', (canvasToken.worldTransform.tx + ((token.width) * canvas.scene._viewPosition.scale)) + 'px');
        dmtktooltip.css('top', (canvasToken.worldTransform.ty) + 'px');
        dmtktooltip.html(template);
        $('body.game').append(dmtktooltip);
    } else {
        $('.dmtk-tooltip').remove();
    }

});

Hooks.on("createToken", async (scene,token,options,userId) => {
    //let actor = game.actors.get(token.actorId);
    //console.log(token);
    //token["tokenId"] = token._id;
    //let mytoken = canvas.tokens.get(token._id);
    //await mytoken.update({"actorData.tokenId":token._id});
    //console.log(token);
});

Hooks.on("deleteToken", (scene, token) => {
    $('.dmtk-tooltip').remove();
});

Hooks.on("preUpdateToken", async (scene, token, updatedData, options, userId) => {
    //console.log("updatingTokenActor");
    //console.log(token);
    //console.log(updatedData);
    let myToken = canvas.tokens.get(token._id);
    let myactor = game.actors.get(token.actorId);

    let newdata = updatedData;
    if (updatedData["data.citems"]!=null){
        if(!hasProperty(updatedData,"actorData"))
            setProperty(updatedData,"actorData",{});
        if(!hasProperty(updatedData.actorData,"data"))
            setProperty(updatedData.actorData,"data",{});
        updatedData.actorData.data.citems = updatedData["data.citems"];
    }

});

Hooks.on("updateToken", async (scene, token, updatedData, options, userId) => {
    //console.log("updatingTokenActor");
    //console.log(token);
    //console.log(updatedData);
    let myToken = canvas.tokens.get(token._id);
    let myactor = game.actors.get(token.actorId);

    let newdata = updatedData;
    if (updatedData["data.citems"]!=null){
        if(!hasProperty(updatedData,"actorData"))
            setProperty(newdata,"actorData",{});
        if(!hasProperty(newdata.actorData,"data"))
            setProperty(newdata.actorData,"data",{});
        newdata.actorData.data.citems = updatedData["data.citems"];
    }

    if(!options.stopit && newdata.actorData){

        let myData = await myactor.actorUpdater(myToken.actor.data);

        await myToken.update(myData,{stopit:true});

        myToken.actor.sheet.render();

    }
});


Hooks.on("preUpdateActor", async (actor,updateData,options,userId) => {
    //console.log(actor);
    //console.log(updateData);
    //console.log(data.data.gtemplate);
    //console.log("preup");
    if(game.settings.get("sandbox", "tokenOptions")){

        //if(!actor.token)
        //setProperty(updateData,"token",{})
        //updateData.token=actor.data.token;
        let displayName = actor.data.data.displayName; 
        if(isNaN(displayName))
            displayName = CONST.TOKEN_DISPLAY_MODES[displayName];
        if(displayName==null)
            displayName = 0;

        if(actor.data.token!=null){
            if(actor.data.token.diplayName==null)
                if(!updateData.token){
                    setProperty(updateData,"token",{});
                }
        }

        //updateData.token.name = actor.name;
        if(updateData.token){
            if(updateData.token.displayName!=displayName)
                updateData.token.displayName = displayName;
            if(updateData.token.displayBars!=displayName)
                updateData.token.displayBars = displayName;
            if(updateData.token.dimLight==null)
                updateData.token.dimLight = 0;
            if(updateData.token.dimSight==null)
                updateData.token.dimSight = 0;
            if(updateData.token.brightLight==null)
                updateData.token.brightLight = 0;
        }

        //        updateData["token.displayName"] = displayName;
        //        updateData["token.displayBars"] = displayName;
        //        updateData["token.bar1.attribute"] = actor.data.data.tokenbar1;
        //        updateData["token.bar1.attribute"] = actor.data.data.tokenbar1;

        if(updateData.name){
            if(!updateData.token)
                setProperty(updateData,"token",{})
            //updateData["token.name"] = updateData.name;
            updateData.token.name = updateData.name;
        }


        if(updateData.img){
            if(!updateData.token)
                setProperty(updateData,"token",{})
            //updateData["token.img"] = updateData.img;
            updateData.token.img = updateData.img;
        }
        //
        //        if(actor.token.img==null){
        //            if(!updateData.token)
        //                setProperty(updateData,"token",{})
        //            updateData.token.img = actor.data.token.img;
        //        }

    }

    if(updateData["data.rollmode"]){
        if(!hasProperty(updateData,"data"))
            setProperty(updateData,"data",{});
        updateData.data.rollmode = updateData["data.rollmode"];
    }

    //console.log(updateData);

});

Hooks.on("preCreateToken", async (scene, tokenData, options, userId) =>{
    //console.log(tokenData);

    if(game.settings.get("sandbox", "tokenOptions")){
        const sameTokens = game.scenes.get(scene.id).data.tokens.filter(e => e.actorId === tokenData.actorId) || [];
        let tokennumber = 0;
        if (sameTokens.length !== 0) { 
            tokennumber = sameTokens.length + 1;
        }

        if(tokennumber!=0){
            tokenData.name += " " + tokennumber;
        }


    }


});

Hooks.on('createCombatant', (combat, combatantId, options) => {
    combatantId.initiative=1;
});

Hooks.on("preCreateActor", (createData) =>{
    if(createData.token!=null)
        createData.token.name = createData.name;

});

Hooks.on("deleteActor", (actor) =>{
    //console.log(actor);

});

Hooks.on("updateActor", async (actor, updateData,options,userId) => {
    //console.log(updateData);
    //console.log("updateHook");

    if(updateData){
        actor.data.flags.lastupdatedBy = await userId;

    }

    if(updateData.data!=null){
        if(!options.stopit && (updateData.data.attributes || updateData.data.citems || updateData.data.mod)){
            actor.data = await actor.actorUpdater(actor.data);

            await actor.update(actor.data,{stopit:true,diff:true});

        }
    }


});

Hooks.on("closegActorSheet", (entity, eventData) => {
    //console.log(entity);
    //console.log(eventData);

    let character = entity.object.data;
    if(character.flags.ischeckingauto)
        character.flags.ischeckingauto=false;

    //entity.object.update({"token":entity.object.data.token},{diff:false});


});

Hooks.on("preCreateItem", (entity, options, userId) => {
    let image="";
    if(!entity.img){
        if(entity.type=="cItem"){
            image="systems/sandbox/docs/icons/sh_citem_icon.png";
        }

        if(entity.type=="sheettab"){
            image="systems/sandbox/docs/icons/sh_tab_icon.png";
        }

        if(entity.type=="group"){
            image="systems/sandbox/docs/icons/sh_group_icon.png";
        }

        if(entity.type=="panel"){
            image="systems/sandbox/docs/icons/sh_panel_icon.png";
        }

        if(entity.type=="multipanel"){
            image="systems/sandbox/docs/icons/sh_panel_icon.png";
        }

        if(entity.type=="property"){
            image="systems/sandbox/docs/icons/sh_prop_icon.png";
        }

        if(image!="")
            entity.img = image;
    }



});

Hooks.on("createItem", (entity) => {
    let do_update=false;
    let image="";
    if(entity.type=="cItem"){
        //console.log(entity);
        for(let i=0;i<entity.data.data.mods.length;i++){
            const mymod=entity.data.data.mods[i];
            if(mymod.citem!=entity.data._id){
                mymod.citem = entity.data._id;
                do_update=true;
            }

        }

        if(do_update)
            entity.update();
    }

});

Hooks.on("updateItem", (entity) => {

    let do_update=false;
    if(entity.type=="cItem"){
        //console.log(entity);
        for(let i=0;i<entity.data.data.mods.length;i++){
            const mymod=entity.data.data.mods[i];
            if(mymod.citem!=entity.data._id){
                mymod.citem = entity.data._id;
                do_update=true;
            }

        }
        if(do_update)
            entity.update();
    }
});

Hooks.on("closesItemSheet", (entity, eventData) => {
    let item = entity.object.data;
    //console.log("closing");
    setProperty(item.flags,"rerender",true);

});

Hooks.on("rendersItemSheet", (app, html, data) => {
    //console.log(html[0].outerHTML);

    if(app.object.data.type == "cItem"){
        app.refreshCIAttributes(html);
    }

    app.scrollBarTest(html);

    html.find('.window-resizable-handle').mouseup(ev => {
        event.preventDefault();
        app.scrollBarTest(html);
    });

});

Hooks.on("rendergActorSheet", async (app, html, data) => {
    //console.log("rendering Hook");
    //console.log(app);
    //console.log(data);
    const actor = app.actor;

    if(actor.data.flags.lastupdatedBy==null){
        actor.data.flags.lastupdatedBy = game.user._id;
        actor.data.flags.haschanged = true;
    }

    if(actor.token==null)
        actor.listSheets();
    //if(!actor.data.data.istemplate && !actor.data.flags.ischeckingauto){
    if(!actor.data.data.istemplate){
        app.refreshCItems(html);
        app.handleGMinputs(html);
        app.refreshBadge(html);
        app.populateRadioInputs(html);
        app.scrollBarTest(html);
        actor.setInputColor();

        html.find('.window-resizable-handle').mouseup(ev => {
            event.preventDefault();
            app.scrollBarTest(html);
        });


    }

    app.displaceTabs();

});

Hooks.on("renderChatMessage", async (app, html, data) => {
    //console.log(app);
    //console.log(data);
    //console.log(html);
    let hide=false;
    let messageId = app.data._id;
    let msg = game.messages.get(messageId);
    let msgIndex = game.messages.entities.indexOf(msg);

    let _html = await html[0].outerHTML;
    let realuser = game.users.get(data.message.user);

    if(((data.cssClass == "whisper")||(data.message.type==1)) && game.user._id!=data.message.user && !game.user.isgM)
        hide=true;

    //console.log(hide);
    if(_html.includes("dice-roll") && !_html.includes("table-draw")){
        let rollData = {
            token:{
                img:"icons/svg/d20-black.svg",
                name:"Free Roll"
            },
            actor:realuser.data.name,
            flavor: "Roll",
            formula: app._roll.formula,
            mod: 0,
            result: app._roll.total,
            dice: app._roll.dice,
            user: realuser.data.name
        };


        await renderTemplate("systems/sandbox/templates/dice.html", rollData).then(async newhtml => {

            let container = html[0];

            let content = html.find('.dice-roll');
            content.replaceWith(newhtml);

            _html = await html[0].outerHTML;


        });

    }

    //console.log(html);

    if(!_html.includes("roll-template")){
        if(_html.includes("table-draw")){
            let mytableID = data.message.flags.core.RollTable;
            let mytable = game.tables.get(mytableID);
            //console.log(mytable.data.permission.default);
            if(mytable.data.permission.default==0)
                hide=true;
        }

        let containerDiv = document.createElement("DIV");

        let headerDiv = document.createElement("HEADER");
        let headertext = await fetch("systems/sandbox/templates/sbmessage.html").then(resp => resp.text());
        headerDiv.innerHTML = headertext;

        let msgcontent = html;
        let messageDiv = await document.createElement("DIV");
        messageDiv.innerHTML = _html;

        //containerDiv.appendChild(headerDiv);
        await containerDiv.appendChild(headerDiv);
        await containerDiv.appendChild(messageDiv);

        html = html[0].insertBefore(headerDiv,html[0].childNodes[0]);
        html = $(html);

    }



    if(!game.user.isGM && hide){
        //console.log(html);
        //console.log(_html);
        html.hide();
    }

    //ROLL INSTRUCTIONS
    let header = $(html).find(".message-header");
    header.remove();
    //console.log("tirando");
    let detail = await $(html).find(".roll-detail")[0];
    let result = $(html).find(".roll-result")[0];
    let clickdetail = $(html).find(".roll-detail-button")[0];
    let clickmain = $(html).find(".roll-main-button")[0];

    if(detail == null){

        return;

    }

    if(result==null){
        return;
    }

    if(clickdetail==null){
        return;
    }

    if(clickmain==null){

        return;
    }

    let detaildisplay = detail.style.display;
    detail.style.display = "none";

    let resultdisplay = result.style.display;


    let clickdetaildisplay = clickdetail.style.display;

    let clickmaindisplay = clickmain.style.display;
    clickmain.style.display = "none";


    $(html).find(".roll-detail-button").click(ev => {
        detail.style.display = detaildisplay;
        result.style.display = "none";
        $(html).find(".roll-detail-button").hide();
        $(html).find(".roll-main-button").show();
    });

    $(html).find(".roll-main-button").click(ev => {
        result.style.display = resultdisplay;
        detail.style.display = "none";
        $(html).find(".roll-detail-button").show();
        $(html).find(".roll-main-button").hide();
    });



    if(game.user.isGM){
        $(html).find(".roll-message-delete").click(async ev => {
            msg.delete();
        });
        auxMeth.rollToMenu();
    }

    else{
        if(game.user._id!=data.message.user)
            $(html).find(".roll-message-delete").hide();
    }


});

Hooks.on("renderDialog",(app,html,data)=>{
    const htmlDom = html[0];

    if (app.data.citemdialog){

        let checkbtns = htmlDom.getElementsByClassName("dialog-check");
        let dialogDiv = htmlDom.getElementsByClassName("item-dialog");
        let button = htmlDom.getElementsByClassName("dialog-button")[0];

        let actorId = dialogDiv[0].getAttribute("actorId");
        let selectnum = dialogDiv[0].getAttribute("selectnum");
        const actor = game.actors.get(actorId);
        setProperty(actor.data.flags,"selection",[]);
        button.disabled=true;

        for(let i=0;i<checkbtns.length;i++){
            let check = checkbtns[i];
            check.addEventListener("change", (event) => {

                let itemId = event.target.getAttribute("itemId");
                if(event.target.checked){
                    actor.data.flags.selection.push(itemId);
                }

                else{
                    actor.data.flags.selection.splice(actor.data.flags.selection.indexOf(itemId),1);
                }

                let selected = actor.data.flags.selection.length;

                if(selected!=selectnum){
                    button.disabled=true;
                }
                else{
                    button.disabled=false;
                }

            });
        }
    }

    if(app.data.citemText){

        htmlDom.addEventListener("keydown", function (event) {
            event.stopPropagation();
        }, true);

        let t_area = htmlDom.getElementsByClassName("texteditor-large");
        //console.log(t_area);
        t_area[0].addEventListener("change", (event) => {
            app.data.dialogValue = event.target.value;

        });
    }
});


