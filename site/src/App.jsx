import Header from './components/Header.jsx'
import Sidebar from './components/Sidebar.jsx'
import Footer from './components/Footer.jsx'
import Hero from './sections/Hero.jsx'
import { Inicio, Instalacion, Colores, Tipografia } from './sections/Basics.jsx'
import Iconos from './sections/Iconos.jsx'
import { Botones, Tags, Alertas, Cards } from './sections/Components.jsx'
import { Navegacion, Colapsables, Busqueda } from './sections/Navigation.jsx'
import { Formularios, Nuevos } from './sections/Forms.jsx'
import { Componentes, FooterDoc, Accesibilidad, Migracion } from './sections/Misc.jsx'
import ChatIA from './sections/ChatIA.jsx'

export default function App() {
  return (
    <>
      <a className="skip-link" href="#contenido">Saltar al contenido</a>
      <Header />
      <Hero />
      <div className="container">
        <div className="doc-layout">
          <Sidebar />
          <main id="contenido" style={{ minHeight: 0, paddingBottom: '3rem' }}>
            <Inicio />
            <Instalacion />
            <Colores />
            <Tipografia />
            <Iconos />
            <Botones />
            <Tags />
            <Alertas />
            <Cards />
            <Navegacion />
            <Colapsables />
            <Formularios />
            <Nuevos />
            <Busqueda />
            <Componentes />
            <FooterDoc />
            <ChatIA />
            <Accesibilidad />
            <Migracion />
          </main>
        </div>
      </div>
      <Footer />
    </>
  )
}
