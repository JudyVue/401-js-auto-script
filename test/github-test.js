'use strict';

require('dotenv').config();
const {expect} = require('chai');
const superagent = require('superagent');


const ghURL = `https://api.github.com/orgs/${process.env.CF_COURSE_ID}`;
const githubAuthHeader = {Authorization: `Bearer ${process.env.GITHUB_TOKEN}`};


describe('testing respones from Github API', function(){
  describe('checking res.body of repos URL', () => {

    it('return an array of all repos', (done) => {
      superagent.get(`${ghURL}/repos`)
      .set(githubAuthHeader)
      .then(res => {
        expect(Array.isArray(res.body)).to.equal(true);
        this.pulls = res.body.map(repo => repo.pulls_url.split('{/number}')[0].trim())
        this.pulls = this.pulls.reverse();
        console.log(this.pulls);
        done();
      })
    });


  });
});
