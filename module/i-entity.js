import { SBOX } from "./config.js";
import { auxMeth } from "./auxmeth.js";

export class gItem extends Item{

    prepareData(){     
        super.prepareData();

        // Get the Actor's data object
        const itemData = this.data;
        const data = itemData.data;
        const flags = itemData.flags;

        if(!hasProperty(data.attributes,"name") && itemData.type=="cItem"){
            setProperty(data.attributes,"name",itemData.name);
        }
        if (!hasProperty(flags, "scrolls")){
            setProperty(flags,"scrolls", {});
        }

    }

    //Overrides update method
    async update(data, options={}) {

        // Get the Actor's data object
        return super.update(data, options);

    }

}