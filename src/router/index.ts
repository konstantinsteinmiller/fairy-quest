import { createRouter, createWebHashHistory } from 'vue-router'
import MainMenu from '@/views/MainMenu'
import CardSelectionView from '@/views/CardSelectionView'
import GameField from '@/views/GameField'
import CampaignMap from '@/views/CampaignMap'

const routes = [
  { path: '/', name: 'main-menu', component: MainMenu },
  { path: '/deck', name: 'deck', component: CardSelectionView },
  { path: '/campaign', name: 'campaign', component: CampaignMap },
  { path: '/match', name: 'match', component: GameField }
]

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})

export default router