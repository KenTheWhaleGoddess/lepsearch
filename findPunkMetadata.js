import axios from "axios";
import 'dotenv/config';
import * as fs from 'fs';
import retry from "async-retry";

const first = await axios.get(
  `https://api.opensea.io/v2/collection/low-effort-punks/nfts`,
  { headers: { "X-API-KEY": process.env.OS_KEY } }
);
let punks = first.data.nfts;
let next = first.data.next;
let done = false;
while (!done) {
  let data = await retry(async bail => {
    return await axios.get(
      `https://api.opensea.io/v2/collection/low-effort-punks/nfts?next=` + next,
      { headers: { "X-API-KEY": process.env.OS_KEY } }
    );
  }, {
    retries: 5,
    minTimeout: 300
  })
    console.log(data.data);
    punks = punks.concat(data.data.nfts);
    if ('next' in data.data) {
        next  = data.data.next;
    } else {
      done = true;
    }
    await sleep(1500);
  }

let punkData = punks.map((punk) => (
  {
    "identifier": punk.identifier,
    "name": punk.name,
    "image": punk.image_url,
    "created_at": punk.created_at,
    "description": punk.description
  })
);

fs.writeFile('./results.json', JSON.stringify(punkData), err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}