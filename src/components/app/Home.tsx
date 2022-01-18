import React, { FC, useEffect, useState, useMemo, useRef } from 'react';
import { Switch, Route, useHistory, Link, useLocation } from "react-router-dom";
import { store } from '../../database/firebase';
import DOMPurify from 'dompurify';
import firebase from 'firebase/app';
import loadable from '@loadable/component';
import FrecciaSu from 'bootstrap-icons/icons/arrow-up-circle.svg';
import ButtonNuovo from 'bootstrap-icons/icons/plus-circle.svg';
import ButtonNuovoFill from 'bootstrap-icons/icons/plus-circle-fill.svg';

// import Error from '../Error';
const Error = loadable(() =>  import('../Error')); 
// import Lista from './Lista';
const Lista = loadable(() =>  import('./Lista')); 
// import Scopri  from './Scopri';
const Scopri = loadable(() =>  import('./Scopri')); 
// import Ricetta from './Ricetta';  
const Ricetta = loadable(() =>  import('./Ricetta')); 
// import Nuova from './Nuova';
const Nuova = loadable(() =>  import('./Nuova')); 

interface propsInt {
  userId: string | null
  setLog: Function
}

interface ricettaType { 
  id: string | null
  titolo: string | null
  categoria: string | null
  testo: string | null
  tags: {tag: string, colore: string}[] | null
  colore: string | null
}

const Home : FC<propsInt> = (props: propsInt) => {
  let h = useHistory();
  let loc = useLocation();
  const [rerender, setRerender] = useState(false);
  const [location, setLocation] = useState('');
  const [ricette, setRicette] = useState([{id: '', titolo: '', categoria: '', testo: '', tags: [{tag: '', colore: ''}], colore: 'primary'}]);
  const [listaTags, setListaTags] = useState([{tag: '', colore: ''}]);
  const bootColors = useMemo(() => {return [
    "primary",
    "primary",
    "success", 
    "success",
    "danger",
    "danger",
    "warning",
    "warning",
    "info",
    "info",
    "dark",
  ];}, []);
  const initialRicette = useRef([{id: '', titolo: '', categoria: '', testo: '', tags: [{tag: '', colore: ''}], colore: 'primary'}]);
  const [buttonNuovo, setButtonNuovo] = useState(false);

  useEffect(() => {
    const getRicette = async () => {
      if (props.userId !== null && props.userId !== '') { 
        const firebaseRef = store.collection(props.userId);   
        firebaseRef.get().then((item: any) => { //! fixa i type any
          const items = item.docs.map((doc: any) => {return {id: doc.id, ...doc.data()};});
          initialRicette.current = items;
          setRicette(initialRicette.current);
        });
      }
    }

    if (window.innerWidth < 575) { //TODO quando l'app è a posto, implementa il popup
      console.log('sei sul cell');
    }

    getRicette(); 
    return;
  }, [props.userId, rerender]);

  useEffect(() => {
    const getTags = () => {
      if (ricette.length !== 0) {
        var tmp: {tag: string, colore: string}[] = [];
        ricette.forEach(row => {
          row.tags.forEach(tag => {
            if (!tmp.map(a => a.tag).includes(tag.tag)) {
              tmp.push(tag);
            }
          });
        });

        setListaTags(tmp);
      }
    }
    getTags();
    return;
  }, [ricette]);

  useEffect(() => {
    setButtonNuovo(false);
    if (loc.pathname === '/lista') {
      setLocation('Lista');
      return;
    }
    if (loc.pathname === '/scopri') {
      setLocation('Scopri');
      return;
    }
    if (loc.pathname === '/nuova') {
      setLocation('Nuova');
      return;
    }
    if (loc.pathname.includes('/ricetta/')) {
      return;
    }
    setLocation('Home');
    return;
  }, [loc]);

  const handleLogout = () => {
    firebase.auth().signOut();
    props.setLog({logged: false});
    h.push('/');
  }
  
  const handleSearch = (e: string) => {
    setRicette(initialRicette.current.filter(a => { 
      return a.titolo.toLowerCase().includes(e.toLowerCase()) || a.testo.toLowerCase().includes(e.toLowerCase()) || a.tags.map(a => a.tag).includes(e.toLowerCase()) || a.categoria.toLowerCase().includes(e.toLowerCase());
    }));
    return;
  }

  const mappaRicette = ricette.map((row, index) => { 
    var i: ricettaType = row;
    var ind: number = index;
    var link: string = '/ricetta/' + i.id;
    var cardColor = "card border-" + i.colore + " mb-3 ms-3 mt-3";
    var testo = i.testo?.substring(0, 90).replace(/\s+$/, '') + '... ';

    return (
      <div className={cardColor} style={{maxWidth: '18rem'}} key={ind}>
        <div className="card-body">
          <div onClick={() => {h.push(link);}}>
            <h4 className="card-title">{i.titolo}</h4>
            <p className="card-text" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(testo)}}></p>
          </div>
          {row.tags.map((a) => {
            var tagColor = "badge bg-" + a.colore + " mb-1 ms-2 mt-2";
            return <span className={tagColor} onClick={() => {handleSearch(a.tag);}} key={row.tags.indexOf(a)}>{a.tag}</span>
          })}
        </div>
      </div>
    );
  }); 

  return (
    <>
      <div className="container-fluid">
        <div className="row">

          <div className="col-sm-2"> 
            <h1 className="display-4 fst-italic titolo-navigation cursor-pointer" onClick={() => {ricette.length !== initialRicette.current.length && loc.pathname === '/' ? handleSearch('')  : h.goBack()}}>{location}</h1>
            <hr/>

            <div className="container">
              <nav className="navbar navbar-light bg-light">
                  <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                    <li className="nav-item">
                      <Link className={location==='Home'?'nav-link active':'nav-link'} to="/" onClick={() => {setRicette(initialRicette.current)}}>Home</Link>
                    </li> 
                    <li className="nav-item">
                      <Link className={location==='Lista'?'nav-link active':'nav-link'} to="/lista">Lista</Link>
                    </li> 
                    <li className="nav-item">
                      <Link className={location==='Scopri'?'nav-link active':'nav-link'} to="/scopri">Scopri</Link>
                    </li> 
                  </ul>
              </nav>
            </div>

            <button type="button" className="btn btn-light basso" onClick={handleLogout}>Logout</button>
            <img src={FrecciaSu} className="frecciaSu" width="32" height="32" alt="Su" onClick={() => {window.scrollTo(0, 0);}} />
          </div>
          
          <div className="col-sm-10">
            <Switch>
              <Route exact path="/">

                <div className="container ms-2 mt-3">
                  <div className="d-flex">
                    <input className="form-control me-2" type="search" placeholder="Cerca tra le ricette" aria-label="Cerca" onChange={(e) => handleSearch(e.target.value)} />
                    <img src={buttonNuovo === false ? ButtonNuovo : ButtonNuovoFill} className="mt-1 cursor-pointer" width="30" height="30" alt="Su" onClick={() => {h.push('/nuova');}} onMouseEnter={()=>{setButtonNuovo(!buttonNuovo)}} onMouseLeave={()=>{setButtonNuovo(!buttonNuovo)}} />
                  </div>
                </div>

                <div className="container"> 
                  <span className="badge bg-info mb-1 ms-2 mt-2 cursor-pointer" onClick={()=>{handleSearch('Antipasto');}}>Antipasto</span>
                  <span className="badge bg-primary mb-1 ms-2 mt-2 cursor-pointer" onClick={()=>{handleSearch('Primo');}}>Primo</span>
                  <span className="badge bg-warning mb-1 ms-2 mt-2 cursor-pointer" onClick={()=>{handleSearch('Secondo');}}>Secondo</span>
                  <span className="badge bg-danger mb-1 ms-2 mt-2 cursor-pointer" onClick={()=>{handleSearch('Contorno');}}>Contorno</span>
                  <span className="badge bg-dark mb-1 ms-2 mt-2 cursor-pointer" onClick={()=>{handleSearch('Dolce');}}>Dolce</span>

                  <span className="ms-2">•</span>

                  {listaTags.map((a) => {
                    var tagColor = "badge bg-" + a.colore + " mb-1 ms-2 mt-2 cursor-pointer";
                    return <span className={tagColor} onClick={() => {handleSearch(a.tag);}} key={listaTags.indexOf(a)}>{a.tag}</span>
                  })}
                </div>

                <div className="container"><div className="container"><hr/></div></div>

                <div className="d-flex flex-wrap lista-ricette justify-content-center"> 

                  {mappaRicette.length !== 0 ? mappaRicette : (initialRicette.current.length === 0 ? <h4 className="text-muted mt-3">Ancora nessuna ricetta.</h4> : <h4 className="text-muted mt-3">Nessun risultato trovato.</h4>)} 
                  
                </div>

              </Route>
              <Route exact path="/ricetta/:id"><Ricetta userId={props.userId} setRerender={setRerender} bootColors={bootColors} /></Route>
              <Route exact path="/lista"><Lista initialRicette={initialRicette} bootColors={bootColors} /></Route>
              <Route exact path="/nuova"><Nuova userId={props.userId} setRerender={setRerender} bootColors={bootColors} /></Route>
              <Route exact path="/scopri"><Scopri ricette={ricette} tags={listaTags} /></Route>
              <Route><Error /></Route>
            </Switch>
            
          </div>
        </div>
      </div>
    </>
  );  
}

export default Home;
