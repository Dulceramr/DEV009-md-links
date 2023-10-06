#!/usr/bin/env node

//shebang: tells the operating system that this file should be run with Node.js. 
const { mdLinks } = require('./index.js');
const chalk = require('chalk');

const path = process.argv[2]; //obtain the path, this is the third entry in the command line. The firt entry is node, the second is the file name and the third is the argument which is supposed to be the path of the file or directory you want to process
const options = { //check what options or flags were included when the script was called from the command line
    validate: process.argv.includes('--validate'), //check if this flags are present in the command line arguments
    stats: process.argv.includes('--stats')
};

mdLinks(path, options.validate) //call mdlinks function with the path and validation option obtained
.then(links => {
    if(options.stats){
        const totalLinks = links.length;
        const uniqueLinks = new Set(links.map(link => link.href)).size; //link => link.href: create an array with URLs. Set- data structure that represent a collection of values, where each value must be unique

        console.log(chalk.magenta.bold("Total: " + totalLinks));
        console.log(chalk.blue.bold("Unique: " + uniqueLinks));

        if(options.validate){
            const brokenLinks = links.filter(link => link.ok === "Fail").length;
            console.log(chalk.magenta.bold("Broken: " + brokenLinks));
        }
    } else if(options.validate){
        links.forEach(link => {
            const truncatedText = link.text.slice(0, 50);
            console.log(
                chalk.blue.bold(link.file),
                chalk.cyan.bold(link.href),
                chalk.green.bold(link.ok), 
                chalk.white.bold(link.status),
                chalk.magenta.bold(truncatedText)
)});
    } else {
        links.forEach(link => {
            const truncatedText = link.text.slice(0, 50);
            console.log(
                chalk.blue.bold(link.file),
                chalk.cyan.bold(link.href),
                chalk.magenta.bold(truncatedText)
                )
        }); 
    }
})
.catch(error => console.log(error));


