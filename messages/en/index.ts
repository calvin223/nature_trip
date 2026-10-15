/* English, the source language: one JSON file per namespace (common = header, footer and shared
   UI; the rest = one per page or area). A translation copies this folder to messages/<locale>/. */
import common from './common.json';
import home from './home.json';
import about from './about.json';
import trips from './trips.json';
import tripDetail from './tripDetail.json';
import maps from './maps.json';
import species from './species.json';
import experts from './experts.json';
import whenToVisit from './whenToVisit.json';
import schools from './schools.json';
import practical from './practical.json';
import faq from './faq.json';
import contact from './contact.json';
import credits from './credits.json';
import legal from './legal.json';
import notFound from './notFound.json';

const en = { common, home, about, trips, tripDetail, maps, species, experts, whenToVisit, schools, practical, faq, contact, credits, legal, notFound };

export default en;
