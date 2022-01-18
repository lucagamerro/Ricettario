import React, { useState, useEffect } from 'react';
import { useHistory } from "react-router-dom";
import DOMPurify from 'dompurify';
import ButtonNuovo from 'bootstrap-icons/icons/plus-circle.svg';
import ButtonNuovoFill from 'bootstrap-icons/icons/plus-circle-fill.svg';

interface ricettaType { 
  id: string
  titolo: string
  testo: string
  categoria: string
  tags: {tag: string, colore: string}[]
  colore: string
}

interface propsInt {
  ricette: {id: string, titolo: string, testo: string, categoria: string, tags: {tag: string, colore: string}[], colore: string}[]
  tags: {tag: string, colore: string}[]
}

const Scopri = (props: propsInt) => {
  let h = useHistory();
  const [buttonNuovo, setButtonNuovo] = useState(false);
  const [parteDelGiorno, setParteDelGiorno] = useState('');
  const [ricette, setRicette] = useState<ricettaType[]>([{id: '', titolo: '', testo: '', categoria: '', tags: [{tag: '', colore: ''}], colore: 'primary'}]);

  useEffect(() => {
    setButtonNuovo(false);

    let data: Date = new Date();
    var ora: number = data.getHours();
    if (ora>=6 && ora<=11) {setParteDelGiorno('colazione.'); setRicette(props.ricette.filter(row => row.categoria === 'Dolce'));}
    else if (ora>=12 && ora<=15) {setParteDelGiorno('pranzo.'); setRicette(props.ricette.filter(row => row.categoria === 'Secondo' || row.categoria === 'Primo'));}
    else if (ora>=16 && ora<=17) {setParteDelGiorno('merenda.'); setRicette(props.ricette.filter(row => row.categoria === 'Dolce'));}
    else if (ora>=18 && ora<=22) {setParteDelGiorno('cena.'); setRicette(props.ricette.filter(row => row.categoria === 'Secondo' || row.categoria === 'Antipasto'));}
    else {setParteDelGiorno('gustare il dolce.'); setRicette(props.ricette.filter(row => row.categoria === 'Dolce'));}
  }, [props.ricette]);

  const mappaRicette = ricette.map((row, index) => { 
    var i: ricettaType = row;
    var ind: number = index;
    var link: string = '/ricetta/' + i.id;
    var cardColor = "card border-" + i.colore + " mb-3 ms-3 mt-3";
    var testo = i.testo?.substring(0, 90).replace(/\s+$/, '') + '... ';

    var categoriaColor = "";
    if (i.categoria === 'Antipasto') {categoriaColor = "badge bg-info mb-1 ms-2 mt-2"}
    else if (i.categoria === 'Primo') {categoriaColor = "badge bg-success mb-1 ms-2 mt-2"}
    else if (i.categoria === 'Secondo') {categoriaColor = "badge bg-warning mb-1 ms-2 mt-2"}
    else if (i.categoria === 'Contorno') {categoriaColor = "badge bg-danger mb-1 ms-2 mt-2"}
    else if (i.categoria === 'Dolce') {categoriaColor = "badge bg-dark mb-1 ms-2 mt-2"} 
    else {categoriaColor = "badge bg-info mb-1 ms-2 mt-2"}


    return (
      <div className={cardColor} style={{maxWidth: '18rem'}} onClick={() => {h.push(link);}} key={ind}>
        <div className="card-body">
          <h4 className="card-title">{i.titolo}</h4>
          <p className="card-text" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(testo)}}></p>
          <span className={categoriaColor}>{i.categoria}</span>
        </div>
      </div>
    );
  });

  return (
    <>
      <div className="container-fluid ms-2 mt-3">
        
        <h1>È ora di {parteDelGiorno}</h1>

        <small className="text-muted">Ecco qualche ricetta per te!</small>     

        <div className="d-flex flex-wrap lista-ricette justify-content-center"> 
          {mappaRicette} 
        </div>
        
        <div className="button-nuovo">
          <img src={buttonNuovo === false ? ButtonNuovo : ButtonNuovoFill} className="mt-1 cursor-pointer" width="30" height="30" alt="Su" onClick={() => {h.push('/nuova');}} onMouseEnter={()=>{setButtonNuovo(!buttonNuovo)}} onMouseLeave={()=>{setButtonNuovo(!buttonNuovo)}} />
        </div>
      </div>
    </>   
  );
}

export default Scopri;
