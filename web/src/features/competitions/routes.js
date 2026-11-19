import TournamentList from './TournamentList.vue';
import TournamentDetail from './TournamentDetail.vue';

export const routes = [
  { path: '/torneos', component: TournamentList, meta: { label: 'Torneos' } },
  { path: '/torneos/:id', component: TournamentDetail },
];
