# Markdown Links

## Index

* [1. Introduction ](#1-Introduction)
* [2. Characteristics ](#2-Characterictics)
* [3. Installation](#3-Installation-and-using)

***

## 1. Introduction 

Markdown is a lightweight markup languaje that allows users to write using simple text formatting, which is then converted to HTML for display on the web, it is very popular and used on many platforms that handle plain text such as GitHub, forums, blogs. etc. And it´s very common to find several files in that format in any type of repository, one example would be the traditional README.md. 

This Markdown files usually contains links that sometimes are broken or are not valid, this problem make evident the need for a tool that can read the markdown files in order to identify the links and that allows an analysis of these data through certain statistics.

In this context, we have created this tool called "md-links", which is a library created with Node.js that allows the user to verify and report links found within Markdown format files. 

## 2. Characteristics 
* md-links has the ability to parse links in Markdown files (.md, .mkd, .mdwn, .mdown, .mdtxt, .mdtext, .markdown, .text).
* It can validate the availability of each link. 
* Supports scanning of entire directories.
* CLI (Command Line Interface) included.

## 3. Installation and using 


To install md-links you just simply need to execute the next command line: 

npm install Dulceramr/DEV009-md-links

### Using md-links 

To use md-links as a library: 

const mdLinks = require('md-links');

mdLinks('<path>', { validate: true })
    .then(links => {
        console.log(links);
    })
    .catch(error => {
        console.error(error);
    });

To use md-links in the command line: 
Run the "mdlinks" command followed by the file or directory file.

mdlinks <path>

### Options

* "--validate": Check if the link works or not.
* "--stats": Shows basic statistics about the links 

### API
mdlinks(path, validate)
Analyzes links in a file or directory.
* path: Path of the file or the directory.
* validate: Boolean that determine whether you want to validate the links.
* stats: Boolean that determine whether you want to obtains statistics about the links.


