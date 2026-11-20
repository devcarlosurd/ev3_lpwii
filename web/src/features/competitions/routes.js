import TournamentList from './TournamentList.vue';
import TournamentDetail from './TournamentDetail.vue';
import TournamentForm from './TournamentForm.vue';
import Teams from './Teams.vue';
import TeamDetail from './TeamDetail.vue';

export const routes = [
  { path: '/torneos', component: TournamentList, meta: { label: 'Torneos' } },
  { path: '/torneos/nuevo', name: 'torneo-nuevo', component: TournamentForm, meta: { auth: true, admin: true } },
  { path: '/torneos/:id', component: TournamentDetail },
  { path: '/torneos/:id/editar', component: TournamentForm, meta: { auth: true, admin: true } },
  { path: '/equipos', component: Teams, meta: { label: 'Equipos' } },
  { path: '/equipos/:id', component: TeamDetail },
];
