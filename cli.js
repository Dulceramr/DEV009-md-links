#!/usr/bin/env node

const { mdLinks } = require('./index.js');

const path = process.argv[2];
const options = {
    validate: process.argv.includes('--validate'),
    stats: process.argv.includes('--stats')
};

mdLinks(path, options.validate)
.then(links => {
    if(options.stats){
        const totalLinks = links.length;
        const uniqueLinks = new Set(links.map(link => link.href)).size;

        console.log(`Total: ${totalLinks}`);
        console.log(`Unique: ${uniqueLinks}`);

        if(options.validate){
            const brokenLinks = links.filter(link => link.ok === "Fail").length;
            console.log(`Broken: ${brokenLinks}`);
        }
    } else if(options.validate){
        links.forEach(link => {
            const truncatedText = link.text.slice(0, 50);
            console.log(`${link.file} ${link.href} ${link.ok} ${link.status} ${truncatedText}`)
        });
    } else {
        links.forEach(link => {
            const truncatedText = link.text.slice(0, 50);
            console.log(`${link.file} ${link.href} ${truncatedText}`)
        }); 
    }
})
.catch(error => console.log(error));


