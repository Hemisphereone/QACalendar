// Import our custom CSS


// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

import QACalendar from './QACalendar';

// Import CSS if your build tool supports it
import '@event-calendar/core/index.css';
import '../scss/styles.scss'

const qaCalendar = new QACalendar( document.getElementById('calendarContainer') );