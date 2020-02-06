'use strict';

const fs = require('fs');
const expect = require('chai').expect;
const parseRDF = require('../lib/parse-rdf');
const rdf = fs.readFileSync(`${__dirname}/pg20.rdf`);

describe('parse RDF', () => {
  it('should be a function', () => {
    expect(parseRDF).to.be.a('function');
  });

  it('should parse RDF content', () => {
    const book = parseRDF(rdf);
    expect(book).to.be.an('object');
    expect(book).to.have.a.property('id', 20);
    expect(book).to.have.a.property('title', 'Paradise Lost');
    expect(book).to.have.a.property('authors')
      .that.is.an('array').with.lengthOf(1)
      .and.contains('Milton, John');
    expect(book).to.have.a.property('subjects')
      .that.is.an('array').with.lengthOf(4)
      .and.contains('Bible. Genesis -- History of Biblical events -- Poetry')
      .and.contains('Eve (Biblical figure) -- Poetry')
      .and.contains('Adam (Biblical figure) -- Poetry')
      .and.contains('Fall of man -- Poetry');
    expect(book).to.have.a.property('lcc')
      .that.is.an('string').with.lengthOf.at.least(1)
      .and.match(/[^IOWXYa-z]/);
    if (book.about) {
      expect(book).to.have.a.property('about')
        .that.is.an('object');
      expect(book.about).to.have.a.property('url')
        .that.is.a('string')
        .and.match(/http[s]?:\/\/.+/);
      expect(book.about).to.have.a.property('modified')
        .that.is.a('string')
        .and.match(/[0-9\-]{10}T[0-9:]{8}.\d+/);
      expect(book.about).to.have.a.property('type')
        .that.is.a('string')
        .and.match(/\w+\/\w+/);
      expect(book.about).to.have.a.property('extent')
        .that.is.a('number');
    }
  });
});

describe('RegExp', () => {
  it('should get correct URL', () => {
    const input = 'https://www.gutenberg.org/ebooks/20.kindle.noimages';
    const url = input.replace(/(?<=\/\d+)[.A-Za-z]+/, '');
    expect(url).to.be.a('string')
      .that.equal('https://www.gutenberg.org/ebooks/20');
  })
});
