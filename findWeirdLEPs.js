import * as fs from 'fs';

fs.readFile('./results.json', 'utf8', (error, data) => {
     let punks = JSON.parse(data);
     let max = 8100
     let ref = [];
     for(let i=0; i < max+1; i++) {
        ref[i] = 0;
     }

    punks.forEach((p) => {
        let punkName = p.name;
        if(punkName.includes('low effort punk ')) {
            let punkNumber = punkName.substring(16);
            ref[parseInt(punkNumber)]++;
        } else {
            console.log("funny name " + punkName);
        }
    });

    fs.writeFile('./res2.json', JSON.stringify(ref), err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
      });
     for(let i=0; i < max+1; i++) {
        if (ref[i] == 0) {
            console.log("punk " + i + " not found");
        }        
        if (ref[i] > 1) {
            console.log("punk " + i + " duplicates: " + ref[i] + " found");
        }
     }
});