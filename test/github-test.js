'use strict';

require('dotenv').config();

//app modules
const {reverse} = require('../helpers/optimization');
const {pullsURLs} = require('./mock-data/comparison-data');

//npm modules
const {expect} = require('chai');
const superagent = require('superagent');

//variables
const ghURL = `https://api.github.com/orgs/${process.env.CF_COURSE_ID}`;
const githubAuthHeader = {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`};


describe('testing respones from Github API', function(){
  describe('checking res.body of repos URL', () => {

    it('should return reversed array of all pull URLs using my built-in reverse method', (done) => {
      superagent.get(`${ghURL}/repos`)
      .set(githubAuthHeader)
      .then(res => {
        this.pulls = res.body.map(repo => repo.pulls_url.split('{/number}')[0].trim());
        this.pulls = reverse(this.pulls);
        console.log(this.pulls);
        expect(res.status).to.equal(200);
        expect(Array.isArray(res.body)).to.equal(true);
        expect(this.pulls).to.deep.equal(pullsURLs);
        done();
      });
    });


  });
});
