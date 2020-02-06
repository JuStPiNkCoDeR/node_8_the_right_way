'use strict';
const cheerio = require('cheerio');

module.exports = rdf => {
  const $ = cheerio.load(rdf);
  const book = {};
  book.id = +$('pgterms\\:ebook').attr('rdf:about').replace('ebooks/', '');
  book.title = $('dcterms\\:title').text();
  book.authors = $('pgterms\\:agent pgterms\\:name')
    .toArray().map(elem => $(elem).text());
  book.subjects = $('[rdf\\:resource$="/LCSH"]')
    .parent().find('rdf\\:value')
    .toArray().map(elem => $(elem).text());
  book.lcc = $('[rdf\\:resource$="/LCC"]')
    .parent().find('rdf\\:value').text();
  const aboutElem = $('pgterms\\:file[rdf\\:about$=".utf-8"]');
  if (aboutElem.attr('rdf:about')) {
    book.about = {};
    book.about.url = aboutElem.attr('rdf:about').replace(/(?<=\/\d+)[.A-Za-z]+utf-8/, '');
    book.about.modified = aboutElem.find('dcterms\\:modified').text();
    book.about.type = aboutElem.find('dcterms\\:format rdf\\:value').text();
    book.about.extent = +aboutElem.find('dcterms\\:extent').text();
  }
  return book;
};
