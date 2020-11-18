import { SBOX } from "./config.js";

export class auxMeth {

    /** Gets Sheets */
    static async getSheets(){
        //console.log("getting sheets");

        let templates = [];


        templates.push("Default");

        let templatenames = game.actors.filter(y=>y.data.data.istemplate);

        for(let i=0;i<templatenames.length;i++){

            templates.push(templatenames[i].name);
        }

        //console.log(templates);
        return templates;

    }

    static async getTempHTML(gtemplate){

        let html="";

        //console.log(this.actor.data.data.gtemplate);
        let mytemplate = gtemplate;
        if(gtemplate!="Default"){
            let _template = await game.actors.find(y=>y.data.data.istemplate && y.data.data.gtemplate==gtemplate);
            //console.log(_template);
            if(_template!=null){
                html=_template.data.data._html;
            }

            if(html==null || html=="")
                ui.notifications.warn("Please rebuild template actor");

        }

        if(html==null || html==""){
            console.log("defaulting template");
            gtemplate="Default";
            html = await fetch(this.getHTMLPath(gtemplate)).then(resp => resp.text());

        }

        //console.log(html);
        return html;
    }

    static getHTMLPath(gtemplate){
        let path = "worlds/" + game.data.world.name ;
        //        const path = "systems/sandbox/templates/" + game.data.world + "/";
        var gtemplate = "";

        if(gtemplate==="" || gtemplate==="Default"){
            gtemplate = "character";
            path = "systems/sandbox/templates/";
        }

        let templatepath = `${path}/${gtemplate}.html`;
        //console.log(templatepath);

        return templatepath;
    }

    /* -------------------------------------------- */

    static async retrieveBTemplate(){

        var form = await fetch("systems/sandbox/templates/character.html").then(resp => resp.text());

        return form;

    }

    static async buildSheetHML(){
        console.log("building base html");
        var parser = new DOMParser();
        var htmlcode = await auxMeth.retrieveBTemplate();
        SBOX.sheethtml = parser.parseFromString(htmlcode, 'text/html');
    }

    static async registerIfHelper(){
        Handlebars.registerHelper('ifCond', function(v1, v2, options) {
            if(v1 === v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }

    static async registerIfGreaterHelper(){
        Handlebars.registerHelper('ifGreater', function(v1, v2, options) {
            if(parseInt(v1) > parseInt(v2)) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }

    static async registerIfLessHelper(){
        Handlebars.registerHelper('ifLess', function(v1, v2, options) {
            if(v1 < v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }

    static async registerIfNotHelper(){
        Handlebars.registerHelper('ifNot', function(v1, v2, options) {
            if(v1 !== v2) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }

    static async registerIsGM(){
        Handlebars.registerHelper('isGM', function(options) {
            if(game.user.isGM) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }

    static async registerShowMod(){
        Handlebars.registerHelper('advShow', function(options) {
            if(game.settings.get("sandbox", "showADV")) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }

    static async registerShowSimpleRoll(){
        Handlebars.registerHelper('showRoller', function(options) {
            if(game.settings.get("sandbox", "showSimpleRoller")) {
                return options.fn(this);
            }
            return options.inverse(this);
        });
    }

    static async regParser(expr,attributes,itemattributes){
        let regArray =[];
        let expreg = expr.match(/(?<=\$\<).*?(?=\>)/g);
        if(expreg!=null){

            //Substitute string for current value
            for (let i=0;i<expreg.length;i++){
                let attname = "$<" + expreg[i]+ ">";
                let attvalue="";

                let regblocks = expreg[i].split(";");

                let regobject = {};
                regobject.index = regblocks[0];
                regobject.expr = regblocks[1];
                regobject.result = await auxMeth.autoParser(regblocks[1],attributes,itemattributes,false,true);
                regArray.push(regobject);

                expr = expr.replace(attname,attvalue);

            }

            let exprparse = expr.match(/(?<=\$)[0-9]/g);

            for (let i=0;i<exprparse.length;i++){
                let regindex = exprparse[i];

                let attname = "$" + regindex;
                let regObj = regArray.find(y=>y.index==regindex);

                let attvalue="";
                if(regObj!=null)
                    attvalue = regObj.result;

                //console.log(attvalue);
                expr = expr.replace(attname,attvalue);
            }
        }

        return expr;
    }

    static async autoParser(expr,attributes,itemattributes,exprmode,noreg=false,number=1){
        var toreturn = expr;
        //console.log(expr);
        //console.log(itemattributes);
        //console.log(number);

        //Expression register. Recommended to avoid REgex shennanigans
        let regArray =[];
        let expreg;
        if(!noreg)
            expreg = expr.match(/(?<=\$\<).*?(?=\>)/g);
        if(expreg!=null){

            //Substitute string for current value
            for (let i=0;i<expreg.length;i++){
                let attname = "$<" + expreg[i]+ ">";
                let attvalue="";

                let regblocks = expreg[i].split(";");

                let regobject = {};
                regobject.index = regblocks[0];
                regobject.expr = regblocks[1];
                //console.log(regobject.expr);
                let internalvBle = regobject.expr.match(/(?<=\$)[0-9]/g);
                if(internalvBle!=null){
                    for (let k=0;k<internalvBle.length;k++){
                        let regindex = internalvBle[k];
                        let regObj = await regArray.find(y=>y.index==regindex);
                        let vbvalue="";
                        if(regObj!=null)
                            vbvalue = regObj.result;
                        regobject.expr = regobject.expr.replace("$"+regindex,vbvalue);
                    }

                }
                //console.log(regobject.expr);

                regobject.result = await auxMeth.autoParser(regobject.expr,attributes,itemattributes,false,true);
                await regArray.push(regobject);

                expr = expr.replace(attname,attvalue);

            }

            let exprparse = expr.match(/(?<=\$)[0-9]/g);
            if(exprparse!=null){
                for (let i=0;i<exprparse.length;i++){
                    let regindex = exprparse[i];

                    let attname = "$" + regindex;
                    let regObj = regArray.find(y=>y.index==regindex);

                    let attvalue="";
                    if(regObj!=null)
                        attvalue = regObj.result;

                    //console.log(attvalue);
                    expr = expr.replace(attname,attvalue);
                }
            }

        }

        //console.log(expr);

        //Parses last roll
        if(itemattributes!=null && expr.includes("#{roll}")){
            expr=expr.replace("#{roll}",itemattributes._lastroll);
        }

        //Parses number of citems
        if(itemattributes!=null && expr.includes("#{num}")){
            expr=expr.replace("#{num}",number);
        }

        //console.log(expr);
        expr=expr.toString();

        //PARSE ITEM ATTRIBUTES
        var itemresult = expr.match(/(?<=\#\{).*?(?=\})/g);
        if(itemresult!=null && itemattributes!=null){

            //Substitute string for current value
            for (let i=0;i<itemresult.length;i++){
                let attname = "#{" + itemresult[i]+ "}";
                let attvalue;

                if(itemattributes[itemresult[i]]!=null)
                    attvalue = itemattributes[itemresult[i]].value;
                else{
                    //ui.notifications.warn("cItem property " + itemresult[i] + " of cItem " + itemattributes.name +" does not exist");
                    attvalue=0;
                }

                if((attvalue!==false)&&(attvalue!==true)){
                    if((attvalue=="" || attvalue ==null))
                        attvalue=0;
                }

                if(attvalue == null)
                    attvalue=0;

                if(!itemresult[i].includes("#{target|"))
                    expr = expr.replace(attname,attvalue);

            }      

        }
        //console.log(expr);
        //PARSE ACTOR ATTRIBUTES

        var result = expr.match(/(?<=\@\{).*?(?=\})/g);
        if(result!=null){

            //Substitute string for current value
            for (let i=0;i<result.length;i++){
                let rawattname = result[i];
                let attProp = "value";
                if(rawattname.includes(".max")){
                    rawattname = rawattname.replace(".max","");
                    attProp = "max";
                }

                let attname = "@{" + result[i]+ "}";
                let attvalue;

                if(attributes!=null){
                    let myatt = attributes[rawattname];

                    if(myatt!=null){
                        attvalue = myatt[attProp];
                    }
                    else{
                        let fromcItem = false;
                        let mycitem="";
                        if(itemattributes!=null){
                            fromcItem = true;
                            mycitem = " from citem: " + itemattributes.name;
                        }

                        ui.notifications.warn("Property " + rawattname + mycitem + " does not exist");
                        console.log(expr);
                    }

                    if((attvalue!==false)&&(attvalue!==true)){
                        if((attvalue=="" || attvalue ==null))
                            attvalue=0;
                    }

                    if(attvalue == null)
                        attvalue=0;

                }
                else{
                    attvalue=0;
                }

                expr = expr.replace(attname,attvalue);
            }         

        }

        //PARSE ITEM ATTRIBUTE
        //console.log(expr);
        var attcresult = expr.match(/(?<=\-\-)\S*?(?=\-\-)/g);
        if(attcresult!=null){

            //Substitute string for current value
            for (let i=0;i<attcresult.length;i++){
                let attname = "--" + attcresult[i]+ "--";
                let attvalue;
                if(itemattributes[attcresult[i]]!=null)
                    attvalue = itemattributes[attcresult[i]].value;
                if(attvalue=="" || attvalue ==null)
                    attvalue=0;
                //console.log(attname + " " + attvalue);
                expr = expr.replace(attname,attvalue);
            }         

        }

        //console.log(expr);

        //PARSE ACTOR ATTRIBUTE
        var attpresult = expr.match(/(?<=\_\_)\S*?(?=\_\_)/g);
        if(attpresult!=null){

            //Substitute string for current value
            for (let i=0;i<attpresult.length;i++){
                //                let debugname = attpresult[i];
                //                console.log(debugname);
                let attname = "__" + attpresult[i]+ "__";
                let attvalue=0;
                if(attributes!=null){
                    if(attributes[attpresult[i]]!=null)
                        attvalue = attributes[attpresult[i]].value;
                }

                expr = expr.replace(attname,attvalue);
            }         

        }

        //console.log(expr);
        //PARSE SCALED AUTO VALUES
        var scaleresult = expr.match(/(?<=\%\[).*?(?=\])/g);
        if(scaleresult!=null){
            //console.log(expr);
            //Substitute string for current value
            for (let i=0;i<scaleresult.length;i++){
                let limits = scaleresult[i].split(",");
                //console.log(limits[0]);
                let value = limits[0];
                if(isNaN(value)){
                    let roll = new Roll(limits[0]).roll();
                    value = roll.total;
                }

                let valuemod=0;

                let limitArray = [];

                for(let j=1;j<limits.length;j++){
                    let splitter = limits[j].split(":");
                    let scale = splitter[0];
                    if(isNaN(scale)){
                        //if(isNaN(scale) || scale.includes('+')|| scale.includes('-')|| scale.includes('/')|| scale.includes('*')){
                        let newroll = new Roll(scale).roll();
                        //expr = expr.replace(scale,newroll.total);
                        scale = newroll.total;

                    }

                    let limitEl = {};
                    limitEl.scale = scale;
                    limitEl.value = splitter[1];
                    await limitArray.push(limitEl);
                }

                await limitArray.sort(function (x, y) {
                    return x.scale - y.scale;
                });
                //console.log(limitArray);
                //console.log(value);
                valuemod= limitArray[0].value;
                for(let k=0;k<limitArray.length;k++){
                    let checker = limitArray[k];
                    let checkscale = Number(checker.scale);
                    //console.log(checkscale);
                    if(value>=checkscale){
                        valuemod=checker.value;
                    }
                }

                let attname = "%[" + scaleresult[i]+ "]";
                expr = expr.replace(attname,valuemod);
            }
            //console.log(expr);

        }
        //console.log(expr);
        //PARSE CONDITIONAL / ONLY FOR TEXT ORIGINAL
        //        var ifresult = expr.match(/(?<=\if\[).*?(?=\])/g);
        //        if(ifresult!=null){
        //
        //            //Substitute string for current value
        //            for (let i=0;i<ifresult.length;i++){
        //                let limits = ifresult[i].split(",");
        //                let truevalue = limits[1];
        //                let falsevalue = limits[2];
        //                let finalvalue;
        //                let conditionarray = limits[0].split(":");
        //                let condition = conditionarray[0];
        //                let conditioncheck = conditionarray[1];
        //                //console.log(condition + " / " + conditioncheck);
        //                //console.log(truevalue + " " + falsevalue);
        //                if(condition==conditioncheck){
        //                    finalvalue = truevalue;
        //                }
        //
        //                else{
        //                    finalvalue = falsevalue;
        //                }
        //
        //                let attname = "if[" + ifresult[i]+ "]";
        //                expr = expr.replace(attname,finalvalue);
        //                //console.log(expr);
        //            }         
        //
        //        }

        /********************************************* H3LS1 - 09/11/2020 ************************************************** */
        /**************************** ADDED ORs, ANDs, NESTED IFs - TO BE CHECKED AND APPROVED *******************************/

        /* FORMATS OF THE IF expressions ARE:
        1. Single IF with no ANDs no ORs --> if[Field:condition,true_value, false_value]
        2. Single IF with ORs only --> if[FIELD1:COND1 OR FIELD2:COND2 OR....FIELDn:CONDn,true_value, false_value]
        3. Single IF with ANDs only --> if[FIELD1:COND1 AND FIELD2:COND2 AND....FIELDn:CONDn,true_value, false_value]
        4. Single IF with ANDs and ORs (it always execute first ANDs) --> if[FIELD1:COND1 AND FIELD2:COND2 OR....FIELDn:CONDn,true_value, false_value]
        5. Nested IFs with or without ANDs and ORs (it works with the same logic as before)
            5.1 Example without ANDs and ORs  if[F:C,true_value, ELSE if[F:C, true_value, ELSE if[F:C,true_value,false_Value]]].....
            5.2 Example with ANDs and ORs  if[F1:C1 OR F2:C2 AND F3:C3,true_value, ELSE if[F:C, true_value, ELSE if[F:C AND F4:C4,true_value,false_Value]]].....

        */ 

        //PARSE CONDITIONAL / **** IT WORKS ALSO FOR NUMBERS (comparing as equal not <,>) ****

        var searchElse = expr.search("ELSE"); 
        var countElses = (expr.match(/ELSE/g) || []).length;
        var ifresult = [];
        var ifsentence = [];

        //Check if there are any ELSEs on the expression
        if(searchElse!=-1){
            //There are ELSES
            var statement = expr.split(/ELSE/g); // Split all the nested ifs
            for (let i=0;i<=countElses;i++){
                //we modify the nested ifs to be considered as simple Ifs statements
                if (i==countElses) {
                    let toReplace="";
                    for(let x=0;x<=countElses;x++){toReplace = toReplace + "]";}
                    statement[i] = statement[i].replace(toReplace,"]"); 
                }
                else statement[i] = statement[i].replace(/,([^,]*)$/,"]");                
                ifsentence = statement[i].match(/(?<=\if\[).*?(?=\])/g); 
                ifresult[i] = ifsentence[0];
            }
        }else{
            //There are no ELSEs
            countElses = 1;
            ifresult = expr.match(/(?<=\if\[).*?(?=\])/g);
        }


        if(ifresult!=null){
            //If there are any IFs
            for (let i=0;i<ifresult.length;i++){
                /*Calculate if the IF condition is true or false for all the nested IFs (if any). It finalizes either when it finds a true condition
                returning the true statement or when it reaches the last false condition returing the false statement of the last nested IF (if any)*/
                let limits = ifresult[i].split(","); //split condition and true, false statements
                let general_cond = limits[0];
                let truevalue = limits[1];
                let falsevalue;
                let findADV;
                let findDIS;
                let cond;
                let val;
                let result;
                //console.log(general_cond);

                var findOR = general_cond.search(" OR "); 
                var findAND = general_cond.search(" AND ");
                var findSpecial = general_cond.search("<"); //This will be used in the case we implement grouping AND/ORS like if(a and(b or c)) => if[a AND <b OR c>]

                if (limits[2]!=null) falsevalue = limits[2] // in case there are no ELSEs, the false value is equal to the false statement
                else falsevalue = "else"; //in case there are ELSEs, the false value is equal to CONST = else

                /*Update formula for ADV or DIS*/
                findADV = truevalue.search("~ADV~");
                if (findADV != -1){

                    truevalue =truevalue.replace("~ADV~","");
                    truevalue =truevalue.replace("1d20","2d20kh");
                }
                findDIS = truevalue.search("~DIS~");
                if (findDIS != -1){

                    truevalue =truevalue.replace("~DIS~","");
                    truevalue =truevalue.replace("1d20","2d20kl");
                }
                findADV = falsevalue.search("~ADV~");
                if (findADV != -1){

                    falsevalue =falsevalue.replace("~ADV~","");
                    falsevalue =falsevalue.replace("1d20","2d20kh");
                }
                findDIS = falsevalue.search("~DIS~");
                if (findDIS != -1){

                    falsevalue =falsevalue.replace("~DIS~","");
                    falsevalue =falsevalue.replace("1d20","2d20kl");
                }

                if (findSpecial == -1 && findAND == -1 && findOR == -1){
                    //Single expression --> if[FIELD:VALUE,TRUE,FALSE]
                    result = false;
                    var comp = general_cond.split(":");
                    cond = $.trim(comp[0]);
                    val = $.trim(comp[1]);
                    if(cond == val) result = true; else result = false;
                }

                if (findSpecial == -1 && findAND == -1 && findOR != -1){
                    //Only ORs --> if[FIELD1:VALUE1 OR FIELD2:VALUE2......OR FIELDn:VALUEn,TRUE,FALSE]
                    var ORconditions = general_cond.split("OR");
                    if(ORconditions!=null){
                        result = false;
                        let j = 0;
                        while(result != true && j<ORconditions.length ){
                            var comp = ORconditions[j].split(":");
                            cond = $.trim(comp[0]);
                            val = $.trim(comp[1]);
                            if(cond == val) result = true;
                            j++;
                        }

                    }else{
                        //** ERROR **/
                    }       
                }

                if (findSpecial == -1 && findAND != -1 && findOR == -1){
                    //Only ANDs --> if[FIELD1:VALUE1 AND FIELD2:VALUE2......AND FIELDn:VALUEn,TRUE,FALSE]
                    var ANDconditions = general_cond.split("AND");
                    if(ANDconditions!=null){
                        result = true;
                        let j = 0;
                        while(result != false && j<ANDconditions.length ){
                            var comp = ANDconditions[j].split(":");
                            cond = $.trim(comp[0]);
                            val = $.trim(comp[1]);
                            if(cond != val) result = false;
                            j++;
                        }

                    }else{
                        //** ERROR **/
                    }
                }

                if (findSpecial == -1 && findAND != -1 && findOR != -1){
                    //ANDs && ORs without grouping - First we resolve ANDs --> if[FIELD1:VALUE1 OR FIELD2:VALUE2 AND FIELD3:VALUE3,TRUE,FALSE]
                    //First we resolve F2:V2 AND F3:V3 (if this is true, no more checking since OR condition is met)
                    var ORconditions = general_cond.split("OR");
                    if(ORconditions!=null){
                        result = false;
                        let j = 0;
                        while(result != true && j<ORconditions.length ){
                            if (findAND = ORconditions[j].search("AND") != -1){
                                var ANDconditions = ORconditions[j].split("AND");
                                if(ANDconditions!=null){
                                    result = true;
                                    let k = 0;
                                    while(result != false && k<ANDconditions.length ){
                                        var comp = ANDconditions[k].split(":");
                                        cond = $.trim(comp[0]);
                                        val = $.trim(comp[1]);
                                        if(cond != val) result = false;
                                        k++;
                                    }
                                }   
                            }else{
                                var comp = ORconditions[j].split(":");
                                cond = $.trim(comp[0]);
                                val = $.trim(comp[1]);
                                if(cond == val) result = true;
                            }           
                            j++;    
                        }
                    }
                }
                let finalvalue;
                let attname="";

                if(result == true){
                    //In case the condition is met, we quit the nested IFs (if any) and return value on the true statement
                    finalvalue = truevalue;
                    //console.log(expr);
                    if (searchElse!=-1)  {
                        for (let z=i;z<ifresult.length-1;z++){
                            attname = attname + "if[" + ifresult[z]+ ",ELSE " ;    

                        }

                        attname = attname + "if[" + ifresult[countElses];
                        for (let z=0;z<=countElses;z++){
                            attname = attname + "]" ;    

                        }


                    }
                    else attname = "if[" + ifresult[i]+ "]";

                    expr = expr.replace(attname,finalvalue);
                    if (searchElse!=-1) i=ifresult.length;


                }else{
                    //in case the condition is not met
                    console.log(expr);
                    if (falsevalue == "else"){
                        //in case the false statement is a nested IF
                        ifresult[i] = ifresult[i] + ",ELSE " ; //adapt the expression to be identifiable by the rutine
                        attname = "if[" + ifresult[i];
                        expr = expr.replace(attname,""); //"delete" the nested IF that is not met from the expression
                    }
                    else{
                        //in case the false statement is a valid value
                        finalvalue = falsevalue;
                        attname = "if[" + ifresult[i]+ "]";
                        expr = expr.replace(attname,finalvalue);
                    } 
                }

            }
        }

        /************************************************************************************************************************** */


        //PARSE MAX ROLL
        var maxresult = expr.match(/(?<=\maxdie\().*?(?=\))/g);
        if(maxresult!=null){
            for (let i=0;i<maxresult.length;i++){
                let attname = "maxdie(" + maxresult[i]+ ")";
                let newroll = new Roll(maxresult[i]).roll();

                let attvalue = 0;
                for(let j=0;j<newroll.dice.length;j++){
                    let diceexp = newroll.dice[j];
                    attvalue += parseInt(diceexp.results.length)*parseInt(diceexp.faces);
                }



                expr = expr.replace(attname,attvalue);
            }
        }

        //MAXOF
        var maxResult = expr.match(/(?<=\max\().*?(?=\))/g);
        if(maxResult!=null){
            //Substitute string for current value        
            for (let i=0;i<maxResult.length;i++){
                //                let debugname = attpresult[i];
                //                console.log(debugname);

                let blocks = maxResult[i].split(",");
                let finalvalue=0;
                let valueToMax = Array();
                let nonumber=false;
                for (let n=0;n<blocks.length;n++){
                    if(!isNaN(blocks[n])){
                        valueToMax.push(parseInt(blocks[n]));
                    }
                    else{
                        nonumber=true;
                    }
                }
                if(!nonumber){
                    finalvalue = Math.max.apply(Math, valueToMax);
                    let tochange = "max(" + maxResult[i]+ ")";
                    expr = expr.replace(tochange,parseInt(finalvalue)); 
                }

            }
        }
        //MINOF
        var minResult = expr.match(/(?<=\min\().*?(?=\))/g);
        if(minResult!=null){
            //Substitute string for current value        
            for (let i=0;i<minResult.length;i++){
                //                let debugname = attpresult[i];
                //                console.log(debugname);

                let blocks = minResult[i].split(",");
                let finalvalue;
                let valueToMin = Array();
                let nonumber=false;
                for (let n=0;n<blocks.length;n++){
                    if(!isNaN(blocks[n])){
                        valueToMin.push(parseInt(blocks[n]));
                    }
                    else{
                        nonumber=true;
                    }
                }
                if(!nonumber){
                    finalvalue = Math.min.apply(Math, valueToMin);
                    let tochange = "min(" + minResult[i]+ ")";
                    expr = expr.replace(tochange,parseInt(finalvalue)); 
                }


            }
        }
        //COUNTIF
        var countIfResult = expr.match(/(?<=\bcountE\b\().*?(?=\))/g);
        if(countIfResult!=null){
            //Substitute string for current value        
            for (let i=0;i<countIfResult.length;i++){
                //                let debugname = attpresult[i];


                let splitter = countIfResult[i].split(";");
                let comparer = splitter[1];
                let blocks = splitter[0].split(",");
                let finalvalue=0;
                let valueIf = Array();
                let nonumber=false;
                for (let n=0;n<blocks.length;n++){
                    if(!isNaN(blocks[n])){
                        valueIf.push(parseInt(blocks[n]));
                    }
                    else{
                        nonumber=true;
                    }

                }

                if(!nonumber){
                    for(let j=0;j<valueIf.length;j++){
                        if(valueIf[j]==comparer)
                            finalvalue+=1;
                    }

                    let tochange = "countE(" + countIfResult[i]+ ")";
                    expr = expr.replace(tochange,parseInt(finalvalue)); 
                }


            }
        }

        //COUNTHIGHER
        var countHighResult = expr.match(/(?<=\bcountH\b\().*?(?=\))/g);
        if(countHighResult!=null){
            //Substitute string for current value        
            for (let i=0;i<countHighResult.length;i++){
                //                let debugname = attpresult[i];


                let splitter = countHighResult[i].split(";");
                let comparer = splitter[1];
                let blocks = splitter[0].split(",");
                let finalvalue=0;
                let valueIf = Array();
                let nonumber=false;
                for (let n=0;n<blocks.length;n++){
                    if(!isNaN(blocks[n])){
                        valueIf.push(parseInt(blocks[n]));
                    }
                    else{
                        nonumber=true;
                    }
                }
                if(!nonumber){
                    for(let j=0;j<valueIf.length;j++){
                        if(valueIf[j]>comparer)
                            finalvalue+=1;
                    }

                    let tochange = "countH(" + countHighResult[i]+ ")";
                    expr = expr.replace(tochange,parseInt(finalvalue));
                }


            }
        }

        //COUNTLOWER
        var countLowResult = expr.match(/(?<=\bcountL\b\().*?(?=\))/g);
        if(countLowResult!=null){
            //Substitute string for current value        
            for (let i=0;i<countLowResult.length;i++){
                //                let debugname = attpresult[i];


                let splitter = countLowResult[i].split(";");
                let comparer = splitter[1];
                let blocks = splitter[0].split(",");
                let finalvalue=0;
                let valueIf = Array();
                let nonumber=false;
                for (let n=0;n<blocks.length;n++){
                    if(!isNaN(blocks[n])){
                        valueIf.push(parseInt(blocks[n]));
                    }
                    else{
                        nonumber=true;
                    }
                }
                if(!nonumber){
                    for(let j=0;j<valueIf.length;j++){
                        if(valueIf[j]<comparer)
                            finalvalue+=1;
                    }

                    let tochange = "countL(" + countLowResult[i]+ ")";
                    expr = expr.replace(tochange,parseInt(finalvalue));
                }


            }
        }

        //SUM
        var sumResult = expr.match(/(?<=\bsum\b\().*?(?=\))/g);
        if(sumResult!=null){
            //Substitute string for current value        
            for (let i=0;i<sumResult.length;i++){
                //                let debugname = attpresult[i];


                let splitter = sumResult[i].split(";");
                let comparer = splitter[1];
                let blocks = splitter[0].split(",");
                let finalvalue=0;
                let valueIf = Array();
                let nonumber=false;
                for (let n=0;n<blocks.length;n++){
                    if(!isNaN(blocks[n])){
                        finalvalue += parseInt(blocks[n]);
                    }
                    else{
                        nonumber=true;
                    }

                }
                if(!nonumber){
                    let tochange = "sum(" + sumResult[i]+ ")";
                    expr = expr.replace(tochange,parseInt(finalvalue));
                }


            }
        }

        //console.log(expr);

        toreturn = expr;

        //PARSE TO TEXT
        if(expr.includes("|")){
            expr = expr.replace("|","");
            exprmode=true;
        }

        if(isNaN(expr)){

            if(!exprmode){
                try{
                    let final = new Roll(expr);

                    final.roll();
                    //console.log(final);

                    if(isNaN(final.total)||final.total==null||final.total===false)
                    {
                        toreturn = expr;
                    }
                    else{
                        toreturn = final.total;
                    }

                    //console.log(toreturn);
                }
                catch(err){
                    //console.log("Following Roll expression can not parse to number. String returned");
                    //console.log(expr);
                    //ui.notifications.warn("Roll expression can not parse to number");
                    toreturn = expr;
                }

            }

            else{

                //PARSE BOOL
                if(expr == "false"){
                    expr=false;
                }

                if(expr=="true"){
                    expr=true;
                }

                toreturn = expr;
            }   
        }
        else{
            if(exprmode)
                toreturn = expr;
        }
        //console.log(toreturn);
        return toreturn;
    }

    static dynamicSort(property){
        var sortOrder = 1;
        if(property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }
        return function (a,b) {
            /* next line works with strings and numbers, 
         * and you may want to customize it to your needs
         */
            var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
            return result * sortOrder;
        }
    }

    static rollToMenu(html=null){

        if(!game.settings.get("sandbox", "showLastRoll"))
            return;

        //console.log("rolling to menu");
        let hotbar = document.getElementById("hotbar");
        hotbar.className = "flexblock-left-nopad";

        let actionbar = document.getElementById("action-bar");
        if(actionbar!=null)
            actionbar.className = "action-bar-container";

        let prevmenu = hotbar.querySelector(".roll-menu");

        if(prevmenu!=null)
            prevmenu.remove();

        let tester = document.createElement("DIV");

        if(html==null){
            let lastmessage;
            let found = false;

            for(let i=game.messages.size-1;i>=0;i--){
                let amessage = game.messages.entities[i];
                if(!found){
                    if(amessage.data.content.includes("roll-template")){
                        found=true;
                        lastmessage =amessage;
                    }

                }

            }


            if(lastmessage==null)
                return;
            let msgContent = lastmessage.data.content;

            tester.innerHTML = msgContent;
        }

        else{
            tester.innerHTML = html;
        }

        let rollextra = tester.querySelector(".roll-extra");
        rollextra.style.display="none";


        let rollMenu = document.createElement("DIV");
        rollMenu.className = "roll-menu";
        rollMenu.innerHTML = tester.innerHTML;
        //console.log("appending");
        hotbar.appendChild(rollMenu);
    }

}

