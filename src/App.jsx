import { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import axios from 'axios';
import { MD5 } from 'crypto-js';
import YouTube from 'react-youtube';
import { ProgressBar } from 'react-bootstrap';

function App() {
  const [characters, setCharacters] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [cardsPerPage] = useState(5);
const[modal,setModal] = useState(false)

const modalOpen= (e)=>{
e.preventDefault();
  setModal(!modal)
}

  const publicKey = '51c82bf5e99e28339c69dfc4322a445b';
  const privateKey = 'bc8d1c06cde5ceea931c9d8db53fb6947851e5e6';

  useEffect(() => {
    const timestamp = new Date().getTime();
    const hash = MD5(timestamp + privateKey + publicKey).toString();

    const fetchCharacters = async () => {
      try {
        const response = await axios.get(
          'https://gateway.marvel.com/v1/public/characters',
          {
            params: {
              apikey: publicKey,
              ts: timestamp,
              hash: hash,
            },
          }
        );
        setCharacters(response.data.data.results);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCharacters();
  }, []);

  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = characters.slice(indexOfFirstCard, indexOfLastCard);

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };
  // enlace youtube
  const videoId = 'u108iziVFh8';



console.log(characters)
  return (
    <div className='App'>
      {/* Navegacion */}
      <nav>
        <ul className='navegacion'>
          <img className='img-logo' src='./img/logo.png' alt='' />
          <li className='nav-principal'>HOME</li>
          <li className='nav-principal'>PERSONAJES</li>
        </ul>
      </nav>

      {/* Contenedores progreso */}
      <div className='contenedor-progreso'>

        <div className='progreso-pelicula  '>
        <p>PROCESO DE PELICULAS PRODUCIDAS</p>
            <div className='w-100'>
               
              <ProgressBar now={60} /> 
            </div>  
        </div>


        <div className='video-img '> <div className="video" > <YouTube videoId={videoId} /> </div>  </div>
        <div className='video-img img-pelicula-marvel '></div>
      </div>

      {/* Consumo de la API de Marvel */}
      <div className='padre-map'>
        {currentCards.map((marvel) => (
          <ul onClick={modalOpen} className='cards' key={marvel.id}>
            <li >
              <p className='texto-name'> {marvel.name}</p>
            </li>
            <li className='contenedor-icon-marvel' >
              <img
                className='icon-marvel'
                src={`${marvel.thumbnail.path}.${marvel.thumbnail.extension}`}
                alt=''
              />
            </li>
            <li className='hijo-cards'>Comic: {marvel.comics.available}</li>
            <li className='hijo-cards'>Peliculas: {marvel.series.available}</li>
            {/* aqui empieza modal */}
            {modal &&
            ( 
            <div className='padre-modal'>
              
                <div className='hijo-modal'>
                <img className='img-modal' src={`${marvel.thumbnail.path}.${marvel.thumbnail.extension}`} alt='' />
             
               <div className="detalles">
                    <p>DETALLES</p>

                  <div className='d-flex w-100 justify-content-center align-items-center '>
                     <span className='contenedor-comic-peliculas m-1 '> Peliculas: {marvel.series.available}</span>  
                     <span className='contenedor-comic-peliculas m-1 '> Peliculas: {marvel.series.available}</span>  
                     <span className='contenedor-comic-peliculas m-1 '> Peliculas: {marvel.series.available}</span> 
                    </div>
                    <p > {marvel.name}</p>
                   
                   <ol>
                    <li>{marvel.series.items.name}</li>
                   
                  </ol>
                     
                    

                  
               </div>


                </div>

            </div>
            
            
            )




            }
          </ul>
        ))}
      </div>

      {/* Paginacion */}
      <div className='pagination'>

        <i onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className='bx bxs-left-arrow '>

        </i>


        <i onClick={handleNextPage}
          disabled={indexOfLastCard >= characters.length} class='bx bxs-right-arrow'></i>
      </div>
    </div>
  );
}

export default App;
