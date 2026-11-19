import TournamentList from './TournamentList.vue';
import TournamentDetail from './TournamentDetail.vue';
import Teams from './Teams.vue';
import TeamDetail from './TeamDetail.vue';

export const routes = [
  { path: '/torneos', component: TournamentList, meta: { label: 'Torneos' } },
  { path: '/torneos/:id', component: TournamentDetail },
  { path: '/equipos', component: Teams, meta: { label: 'Equipos' } },
  { path: '/equipos/:id', component: TeamDetail },
];
