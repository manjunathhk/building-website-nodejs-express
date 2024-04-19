const express = require('express');
const router = express.Router();

const speakers = require('./speakers');
const feedback = require('./feedback');

module.exports = (params) => {
  const { speakerService } = params;

  router.get('/', async (request, response, next) => {
    try {
      const artwork = await speakerService.getAllArtwork();
      const topSpeakers = await speakerService.getList();

      return response.render('layout', {
        pageTitle: 'Welcome',
        template: 'index',
        topSpeakers,
        artwork,
      });
    } catch (error) {
      return next(error);
    }
  });

  router.use('/speakers', speakers(params));
  router.use('/feedback', feedback(params));

  return router;
};
