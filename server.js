const express = require('express');
const path = require('path');
const routes = require('./routes');
const cookieSession = require('cookie-session');
const createError = require('http-errors');
const bodyParser = require('body-parser');

const FeedbackService = require('./services/FeedbackService');
const SpeakerService = require('./services/SpeakerService');

const feedbackService = new FeedbackService('./data/feedback.json');
const speakerService = new SpeakerService('./data/speakers.json');

const app = express();
const port = 3000;

app.set('trust proxy', 1);
app.use(
  cookieSession({
    name: 'session',
    keys: ['fadsfdsafdas', 'dsfdafdasfdsfadfdasfdsafadsfasdf'],
  })
);

app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './views'));

app.locals.siteName = 'ROUX Meetups';

app.use(express.static(path.join(__dirname, 'static')));
app.use(async (request, response, next) => {
  try {
    const names = await speakerService.getNames();
    response.locals.speakerNames = names;
    console.log(response.locals);
    return next();
  } catch (error) {
    return next(error);
  }
});

app.use('/', routes({ feedbackService, speakerService }));

app.use((request, response, next) => {
  return next(createError(404, 'File not found'));
});

app.use((error, request, response, next) => {
  response.locals.message = error.message;
  console.error(error);
  const status = error.status || 500;
  response.locals.status = status;
  response.status(status);
  response.render('error');
});

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
