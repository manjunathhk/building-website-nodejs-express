const express = require('express');
const router = express.Router();

const speakers = require('./speakers');
const feedback = require('./feedback');

module.exports = (params) => {
  router.get('/', (request, response) => {
    if (!request.session.visitCount) {
      request.session.visitCount = 0;
    }
    request.session.visitCount += 1;
    console.log(`Number of visits: ${request.session.visitCount}`);
    
    response.render('pages/index', { pageTitle: 'Welcome' });
  });

  router.use('/speakers', speakers(params));
  router.use('/feedback', feedback(params));

  return router;
};
