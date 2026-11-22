import Calendar from './Calendar.vue';
import MatchDetail from './MatchDetail.vue';
import Schedule from './Schedule.vue';
import Ranking from './Ranking.vue';

export const routes = [
  { path: '/partidos', component: Calendar, meta: { label: 'Partidos' } },
  { path: '/partidos/nuevo', component: Schedule, meta: { auth: true, admin: true } },
  { path: '/partidos/:id', component: MatchDetail },
  { path: '/torneos/:id/ranking', name: 'ranking', component: Ranking },
];
